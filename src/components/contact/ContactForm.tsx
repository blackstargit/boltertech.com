"use client";

import { useState, type FormEvent } from "react";
import { useSendEnquiryMutation } from "@/store/contactApi";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { ctaClasses } from "@/components/primitives/Cta";
import type { Messages } from "@/lib/i18n";

type FieldErrors = Partial<Record<keyof ContactInput, string>>;

const EMPTY: ContactInput = {
  name: "",
  email: "",
  company: "",
  projectType: "not-sure",
  message: "",
  website: "",
};

const fieldClass =
  "rounded-sm border border-rule bg-paper px-4 py-3.5 text-body text-ink outline-none transition-colors focus:border-accent";
const labelClass =
  "font-data text-label font-medium uppercase tracking-[0.16em] text-ink-faint";

export function ContactForm({
  messages: m,
  email,
  responseTime,
}: {
  messages: Messages;
  email: string;
  responseTime: string;
}) {
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sendEnquiry, { isLoading, isSuccess, isError }] =
    useSendEnquiryMutation();

  function set<K extends keyof ContactInput>(key: K, value: ContactInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Client-side check is a courtesy to the person filling the form.
    // The route handler validates independently; that is the real gate.
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactInput;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }

    await sendEnquiry(values);
  }

  if (isSuccess) {
    return (
      <div
        role="status"
        className="border border-accent bg-accent-soft p-6 text-body text-ink"
      >
        {m.contact.success} {responseTime}.
      </div>
    );
  }

  const projectTypes = [
    { value: "ai", label: m.categories.ai },
    { value: "automation", label: m.categories.automation },
    { value: "software", label: m.categories.software },
    { value: "data", label: m.categories.data },
    { value: "not-sure", label: "Not sure yet" },
  ] as const;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label={m.contact.nameLabel}
          error={errors.name}
          required
        >
          <input
            id="name"
            name="name"
            autoComplete="name"
            className={fieldClass}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
        </Field>

        <Field
          id="email"
          label={m.contact.emailLabel}
          error={errors.email}
          required
        >
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            className={fieldClass}
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>

        <Field id="company" label={m.contact.companyLabel}>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            className={fieldClass}
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </Field>

        <Field id="projectType" label={m.contact.typeLabel}>
          <select
            id="projectType"
            name="projectType"
            className={fieldClass}
            value={values.projectType}
            onChange={(e) =>
              set("projectType", e.target.value as ContactInput["projectType"])
            }
          >
            {projectTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="message" label={m.contact.messageLabel} error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={7}
          className={`${fieldClass} resize-y`}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
        />
      </Field>

      {/* Honeypot. Hidden from people and from screen readers; bots that
          fill every input give themselves away. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">Leave this empty</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`${ctaClasses("solid")} disabled:opacity-60`}
        >
          {isLoading ? `${m.contact.sending}…` : m.contact.submit}
        </button>
        <span className="text-small text-ink-muted">
          {m.footer.replies} {responseTime}.
        </span>
      </div>

      {isError ? (
        <p role="alert" className="text-small text-critical">
          {m.contact.error}{" "}
          <a href={`mailto:${email}`} className="underline underline-offset-2">
            {email}
          </a>
          .
        </p>
      ) : null}
    </form>
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
  children: React.ReactNode;
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
