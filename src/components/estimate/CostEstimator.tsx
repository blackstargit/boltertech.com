"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  estimator,
  estimate,
  type EstimatorGroup,
  type Selections,
} from "@/lib/estimator";
import { useSendEnquiryMutation } from "@/store/contactApi";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { ctaClasses } from "@/components/primitives/Cta";
import { Label } from "@/components/primitives/drafting";
import type { Messages } from "@/lib/i18n";

type FieldErrors = Partial<Record<"name" | "email", string>>;

// ponytail: these three class strings and the <Field> below are lifted from
// ContactForm. Extract a shared field primitive if a third form appears.
const fieldClass =
  "rounded-sm border border-rule bg-paper px-4 py-3 text-body text-ink outline-none transition-colors focus:border-accent";
const labelClass =
  "font-data text-label font-medium uppercase tracking-[0.16em] text-ink-faint";

function chipClass(checked: boolean) {
  return `cursor-pointer rounded-sm border px-4 py-2.5 font-data text-micro font-medium transition-colors select-none has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
    checked
      ? "border-accent bg-accent-soft text-accent"
      : "border-rule text-ink-muted hover:border-ink hover:text-ink"
  }`;
}

function initialSelections(): Selections {
  return Object.fromEntries(
    estimator.groups.map((g) => [
      g.id,
      g.type === "single" && g.options[0] ? [g.options[0].id] : [],
    ]),
  );
}

/**
 * One screen per decision, not one long scroll. Grouped so each step reads
 * as a single question a visitor can answer in a glance ("what kind of work,
 * how big is it" together; "what it needs" and "data & AI" together; the
 * two small single-picks together; the one after-launch pick alone) — then
 * a final step for contact details, which is the only place the form
 * appears. Coupled to the known seven groups in data/estimator.json by id,
 * the same way `role: "projectType"` already couples estimator.ts to it.
 */
const STEP_GROUPS: readonly (readonly string[])[] = [
  ["kind", "size"],
  ["surfaces", "dataai"],
  ["design", "timeline"],
  ["support"],
];

export function CostEstimator({
  messages: m,
  email,
}: {
  messages: Messages;
  email: string;
}) {
  const [selections, setSelections] = useState<Selections>(initialSelections);
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState({ name: "", email: "", company: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [website, setWebsite] = useState(""); // honeypot
  const [sendEnquiry, { isLoading, isSuccess, isError }] =
    useSendEnquiryMutation();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const groupsById = useMemo(
    () => new Map(estimator.groups.map((g) => [g.id, g])),
    [],
  );

  const totalSteps = STEP_GROUPS.length + 1;
  const isContactStep = step === STEP_GROUPS.length;
  const result = useMemo(() => estimate(selections), [selections]);

  const fmt = (n: number) => `${estimator.symbol}${n.toLocaleString("en-US")}`;

  // Move focus to the new step's heading so screen-reader and keyboard
  // users land somewhere meaningful instead of staying on the old
  // "Continue" button, which has just been replaced.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  function pick(groupId: string, optionId: string) {
    setSelections((s) => ({ ...s, [groupId]: [optionId] }));
  }

  function toggle(groupId: string, optionId: string) {
    setSelections((s) => {
      const current = s[groupId] ?? [];
      return {
        ...s,
        [groupId]: current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
      };
    });
  }

  function set(key: keyof typeof contact, value: string) {
    setContact((c) => ({ ...c, [key]: value }));
    if (key !== "company" && errors[key]) {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
  }

  function buildMessage(): string {
    const lines: string[] = ["Project estimate request", ""];
    for (const g of estimator.groups) {
      const chosen = (selections[g.id] ?? [])
        .map((id) => g.options.find((o) => o.id === id)?.label)
        .filter((label): label is string => Boolean(label));
      if (chosen.length) lines.push(`${g.label}: ${chosen.join(", ")}`);
    }
    lines.push("");
    lines.push(
      `Indicative range: ${fmt(result.low)}–${fmt(result.high)} ${estimator.currency}`,
    );
    if (result.weeks) {
      lines.push(
        `Rough timeline: ${result.weeks.low}–${result.weeks.high} ${m.estimate.weeksSuffix}`,
      );
    }
    return lines.join("\n");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: ContactInput = {
      name: contact.name,
      email: contact.email,
      company: contact.company,
      projectType: result.projectType,
      message: buildMessage(),
      website,
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "name" || key === "email") next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }

    await sendEnquiry(payload);
  }

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      {/* No full-height PageHero here on purpose — this page's whole job
          is to put the estimator itself above the fold, not a headline. */}
      <div className="grid gap-1">
        <Label>{m.estimate.eyebrow}</Label>
        <h1 className="font-display text-h3 font-semibold tracking-[-0.02em] text-ink">
          {m.estimate.heading}
        </h1>
      </div>

      {/* Range — top of the page and live for every step, not tucked in a
          sidebar only visible once you scroll past the questions. */}
      <div className="grid gap-3 rounded-lg border border-rule bg-sheet p-6 sm:p-8">
        <Label tone="accent">{m.estimate.rangeLabel}</Label>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <b className="font-display text-figure leading-none font-semibold tracking-[-0.03em] text-ink tabular-nums">
            {fmt(result.low)}
            <span className="px-1 text-ink-faint">–</span>
            {fmt(result.high)}
          </b>
          {result.weeks ? (
            <span className="text-small text-ink-muted">
              {m.estimate.timelineLabel}: {result.weeks.low}–
              {result.weeks.high} {m.estimate.weeksSuffix}
            </span>
          ) : null}
        </div>
        <p className="text-small text-pretty text-ink-muted">
          {estimator.disclaimer}
        </p>
      </div>

      <div className="grid gap-8">
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-4">
            {/* Focused on every step change (see the effect above) so
                keyboard and screen-reader users land on the new question
                instead of staying on the "Continue" button they just
                activated. */}
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-display text-h4 font-semibold text-ink outline-none"
            >
              {m.estimate.steps[step]}
            </h2>
            <span aria-live="polite" className={`${labelClass} shrink-0`}>
              {step + 1} {m.estimate.stepOf} {totalSteps}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-rule-faint">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {!isContactStep ? (
          <div className="grid gap-8">
            {STEP_GROUPS[step].map((id) => {
              const group = groupsById.get(id);
              return group ? (
                <OptionGroup
                  key={id}
                  group={group}
                  selected={selections[id] ?? []}
                  onPick={pick}
                  onToggle={toggle}
                />
              ) : null;
            })}
          </div>
        ) : isSuccess ? (
          <div
            role="status"
            className="border border-accent bg-accent-soft p-4 text-small text-ink"
          >
            {m.estimate.success}
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-4">
            <div className="grid gap-1">
              <Label as="p" tone="ink">
                {m.estimate.formHeading}
              </Label>
              <p className="text-small text-ink-muted">
                {m.estimate.formLede}
              </p>
            </div>

            <Field
              id="est-name"
              label={m.contact.nameLabel}
              error={errors.name}
              required
            >
              <input
                id="est-name"
                name="name"
                autoComplete="name"
                className={fieldClass}
                value={contact.name}
                onChange={(e) => set("name", e.target.value)}
                aria-invalid={Boolean(errors.name)}
              />
            </Field>

            <Field
              id="est-email"
              label={m.contact.emailLabel}
              error={errors.email}
              required
            >
              <input
                id="est-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
                className={fieldClass}
                value={contact.email}
                onChange={(e) => set("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
              />
            </Field>

            <Field id="est-company" label={m.contact.companyLabel}>
              <input
                id="est-company"
                name="company"
                autoComplete="organization"
                className={fieldClass}
                value={contact.company}
                onChange={(e) => set("company", e.target.value)}
              />
            </Field>

            {/* Honeypot — hidden from people and screen readers. */}
            <div
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
            >
              <label htmlFor="est-website">Leave this empty</label>
              <input
                id="est-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`${ctaClasses("solid", "compact")} disabled:opacity-60`}
            >
              {isLoading ? `${m.contact.sending}…` : m.estimate.submit}
            </button>

            {isError ? (
              <p role="alert" className="text-small text-critical">
                {m.contact.error}{" "}
                <a
                  href={`mailto:${email}`}
                  className="underline underline-offset-2"
                >
                  {email}
                </a>
                .
              </p>
            ) : null}
          </form>
        )}

        {!(isContactStep && isSuccess) ? (
          <div className="flex items-center justify-between gap-4 border-t border-rule pt-6">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className={`${ctaClasses("outline", "compact")} disabled:pointer-events-none disabled:opacity-0`}
            >
              {m.estimate.back}
            </button>
            {!isContactStep ? (
              <button
                type="button"
                onClick={() =>
                  setStep((s) => Math.min(STEP_GROUPS.length, s + 1))
                }
                className={ctaClasses("solid", "compact")}
              >
                {m.estimate.continue}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function OptionGroup({
  group,
  selected,
  onPick,
  onToggle,
}: {
  group: EstimatorGroup;
  selected: string[];
  onPick: (groupId: string, optionId: string) => void;
  onToggle: (groupId: string, optionId: string) => void;
}) {
  const single = group.type === "single";
  return (
    <fieldset className="grid gap-3 border-0 p-0">
      <legend className={`${labelClass} mb-1`}>{group.label}</legend>
      {group.hint ? (
        <p className="-mt-1 text-small text-ink-muted">{group.hint}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {group.options.map((opt) => {
          const checked = selected.includes(opt.id);
          return (
            <label key={opt.id} className={chipClass(checked)}>
              <input
                type={single ? "radio" : "checkbox"}
                name={group.id}
                value={opt.id}
                checked={checked}
                onChange={() =>
                  single ? onPick(group.id, opt.id) : onToggle(group.id, opt.id)
                }
                className="sr-only"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </label>
      {children}
      {error ? <span className="text-small text-critical">{error}</span> : null}
    </div>
  );
}
