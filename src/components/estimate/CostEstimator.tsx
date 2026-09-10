"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";

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

export function CostEstimator({
  messages: m,
  email,
}: {
  messages: Messages;
  email: string;
}) {
  const [selections, setSelections] = useState<Selections>(initialSelections);
  const [contact, setContact] = useState({ name: "", email: "", company: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [website, setWebsite] = useState(""); // honeypot
  const [sendEnquiry, { isLoading, isSuccess, isError }] =
    useSendEnquiryMutation();

  const result = useMemo(() => estimate(selections), [selections]);

  const fmt = (n: number) => `${estimator.symbol}${n.toLocaleString("en-US")}`;

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
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <div className="grid gap-8">
        {estimator.groups.map((group) => (
          <OptionGroup
            key={group.id}
            group={group}
            selected={selections[group.id] ?? []}
            onPick={pick}
            onToggle={toggle}
          />
        ))}
      </div>

      <aside className="grid gap-6 rounded-lg border border-rule bg-sheet p-6 lg:sticky lg:top-24">
        <div className="grid gap-2">
          <Label tone="accent">{m.estimate.rangeLabel}</Label>
          <b className="font-display text-figure leading-none font-semibold tracking-[-0.03em] text-ink tabular-nums">
            {fmt(result.low)}
            <span className="px-1 text-ink-faint">–</span>
            {fmt(result.high)}
          </b>
          {result.weeks ? (
            <span className="text-small text-ink-muted">
              {m.estimate.timelineLabel}: {result.weeks.low}–{result.weeks.high}{" "}
              {m.estimate.weeksSuffix}
            </span>
          ) : null}
        </div>

        <p className="text-small text-pretty text-ink-muted">
          {estimator.disclaimer}
        </p>

        <div className="border-t border-rule pt-6">
          {isSuccess ? (
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
        </div>
      </aside>
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
