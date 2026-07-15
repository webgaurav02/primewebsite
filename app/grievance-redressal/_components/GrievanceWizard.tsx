"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitGrievanceAction, type SubmitState } from "../actions";
import { getTemplate, dbCategoryFor, CUSTOM_TEMPLATE_ID, type Template } from "../templates";
import type { Zone } from "../zones";
import { getZone } from "../zones";
import type { Region } from "@/lib/auth/rbac";

import ProgressRail from "./ProgressRail";
import SearchRouter from "./SearchRouter";
import TemplateGrid from "./TemplateGrid";
import ZonePicker from "./ZonePicker";
import Field from "./Field";
import CharCounter from "./CharCounter";
import ErrorSummary from "./ErrorSummary";
import ReviewStep from "./ReviewStep";
import StickyActionBar from "./StickyActionBar";
import SuccessPanel from "./SuccessPanel";
import Honeypot from "./Honeypot";
import AttachmentInput from "./AttachmentInput";
import { CONSENT_VERSION } from "@/lib/grievance/consent";

const STEP_LABELS = ["Topic & zone", "Describe the issue", "Your information", "Review"];
const TOTAL = STEP_LABELS.length;
const PLACEHOLDER = "[...]";
const ERROR_SUMMARY_ID = "grievance-error-summary";

const FIELD_STEP: Record<string, number> = {
  topic: 1,
  region: 1,
  subject: 2,
  description: 2,
  attachments: 2,
  complainantName: 3,
  complainantEmail: 3,
  complainantPhone: 3,
  businessName: 3,
  primeId: 3,
  consent: 4,
};
const FIELD_LABEL: Record<string, string> = {
  topic: "Topic",
  region: "Zone",
  subject: "Subject",
  description: "Description",
  attachments: "Attachments",
  complainantName: "Name",
  complainantEmail: "Email",
  complainantPhone: "Phone",
  businessName: "Business name",
  primeId: "PRIME ID",
  consent: "Consent",
};

const PHONE_RE = /^[+0-9 ()-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function GrievanceWizard({
  templates,
  zones,
  initialTopic,
}: {
  templates: Template[];
  zones: Zone[];
  initialTopic?: string;
}) {
  const seed = getTemplate(initialTopic);

  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [templateId, setTemplateId] = useState<string | undefined>(seed?.id);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [subject, setSubject] = useState(seed?.subjectPrefix ?? "");
  const [description, setDescription] = useState(seed?.descriptionScaffold ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [primeId, setPrimeId] = useState("");
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);
  const [ack, setAck] = useState(false);
  const [consent, setConsent] = useState(false);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  // Fields edited since the last submit — their (stale) server errors are
  // suppressed so we don't nag while the user fixes them; reset on each submit.
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());

  const [state, formAction, isPending] = useActionState<SubmitState, FormData>(
    submitGrievanceAction,
    { status: "idle" },
  );

  const stepRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  // Server validation is authoritative: on failure move focus to the error
  // summary (which renders above every step and links to each invalid field).
  // Pure DOM side-effects only — no setState — so there are no cascading renders.
  useEffect(() => {
    if (state.status !== "error") return;
    const el = document.getElementById(ERROR_SUMMARY_ID);
    el?.focus();
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state]);

  // Move focus to the step region when the step changes (not on first render).
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    stepRef.current?.focus();
  }, [step]);

  function clearError(field: string) {
    setClientErrors((e) => {
      if (!e[field]) return e;
      const next = { ...e };
      delete next[field];
      return next;
    });
    setEditedFields((prev) => {
      if (prev.has(field)) return prev;
      const next = new Set(prev);
      next.add(field);
      return next;
    });
  }

  function selectTemplate(id: string, subjectSeed?: string) {
    const t = getTemplate(id);
    if (!t) return;
    setTemplateId(id);
    setSubject(subjectSeed ?? t.subjectPrefix);
    setDescription(t.descriptionScaffold);
    clearError("topic");
  }

  function onSearchEnter() {
    const hasMatch = templates.some(
      (t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.keywords.some((k) => k.includes(query.toLowerCase())),
    );
    if (query.trim() && !hasMatch) {
      // Route an unmatched query to Custom, carrying the query as the subject.
      selectTemplate(CUSTOM_TEMPLATE_ID, query.trim());
    }
  }

  function validateStep(s: number): Record<string, string> {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!templateId) e.topic = "Choose a topic to continue.";
      if (!region) e.region = "Select the zone this grievance is about.";
    }
    if (s === 2) {
      const sub = subject.trim();
      if (sub.length < 5) e.subject = "Subject must be at least 5 characters.";
      else if (sub.length > 200) e.subject = "Subject must be 200 characters or fewer.";
      const desc = description.trim();
      if (desc.length < 20) e.description = "Description must be at least 20 characters.";
      else if (desc.length > 5000) e.description = "Description must be 5000 characters or fewer.";
      else if (description.includes(PLACEHOLDER))
        e.description = "Please replace the [...] prompts with your own details before continuing.";
    }
    if (s === 3) {
      if (name.trim().length < 2) e.complainantName = "Enter your name (at least 2 characters).";
      if (!EMAIL_RE.test(email.trim())) e.complainantEmail = "Enter a valid email address.";
      if (!PHONE_RE.test(phone.trim())) e.complainantPhone = "Enter a valid phone number.";
    }
    return e;
  }

  function goContinue() {
    const e = validateStep(step);
    if (Object.keys(e).length > 0) {
      setClientErrors((prev) => ({ ...prev, ...e }));
      return;
    }
    setStep((s) => Math.min(TOTAL, s + 1));
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  function jumpToField(fieldId: string) {
    const s = FIELD_STEP[fieldId];
    if (s) setStep(s);
    window.setTimeout(() => {
      // region/topic have no input with that id — fall back to their controls.
      const el =
        document.getElementById(fieldId) ??
        (fieldId === "region"
          ? document.querySelector<HTMLElement>('input[name="region"]')
          : fieldId === "topic"
            ? document.getElementById("grievance-search")
            : null);
      el?.focus();
    }, 0);
  }

  function resetWizard() {
    setStep(1);
    setQuery("");
    setTemplateId(undefined);
    setRegion(undefined);
    setSubject("");
    setDescription("");
    setName("");
    setEmail("");
    setPhone("");
    setBusinessName("");
    setPrimeId("");
    setAttachmentNames([]);
    setAck(false);
    setConsent(false);
    setClientErrors({});
  }

  if (state.status === "success") {
    return (
      <SuccessPanel
        ticketRef={state.ticketRef}
        region={state.region}
        onReset={resetWizard}
      />
    );
  }

  // Merge client + (authoritative) server errors for display.
  function errFor(field: string): string | undefined {
    if (clientErrors[field]) return clientErrors[field];
    if (editedFields.has(field)) return undefined; // user is fixing it
    if (state.status === "error") return state.fieldErrors[field]?.[0];
    return undefined;
  }

  const summaryErrors = Array.from(
    new Set([
      ...Object.keys(clientErrors),
      ...(state.status === "error" ? Object.keys(state.fieldErrors) : []),
    ]),
  )
    .filter((f) => errFor(f))
    .map((f) => ({ fieldId: f, message: `${FIELD_LABEL[f] ?? f}: ${errFor(f)}` }));

  const queryHasMatch = templates.some(
    (t) =>
      !query ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.keywords.some((k) => k.includes(query.toLowerCase())),
  );
  const hasPlaceholder = description.includes(PLACEHOLDER);
  const submitDisabled = !ack || !consent || hasPlaceholder;

  return (
    <form
      action={formAction}
      noValidate
      onSubmit={() => setEditedFields(new Set())}
      className="mt-8"
    >
      <ProgressRail step={step} labels={STEP_LABELS} />

      {state.status === "rate_limited" && (
        <div className="mt-6 rounded-lg border border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-700">
          You&apos;ve submitted several requests recently. Please wait about a
          minute and try again — your typed grievance is still here.
        </div>
      )}

      {summaryErrors.length > 0 && (
        <div className="mt-6">
          <ErrorSummary
            id={ERROR_SUMMARY_ID}
            errors={summaryErrors}
            onJump={jumpToField}
          />
        </div>
      )}

      <div ref={stepRef} tabIndex={-1} className="mt-6 focus-visible:outline-none">
        {/* STEP 1 — Topic & zone */}
        <fieldset hidden={step !== 1} className="space-y-6">
          <legend className="text-lg font-semibold text-zinc-900">
            What is this about?
          </legend>

          <SearchRouter
            value={query}
            onChange={setQuery}
            onEnter={onSearchEnter}
            noMatches={!queryHasMatch}
          />

          <div>
            <p className="text-sm font-medium text-zinc-900">
              Choose the closest topic{" "}
              <span className="font-normal text-zinc-500">
                — we&apos;ll set up your subject and prompts.
              </span>
            </p>
            <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <TemplateGrid
                templates={templates}
                selectedId={templateId}
                filterQuery={query}
                onSelect={(id) => selectTemplate(id)}
              />
            </div>
            {errFor("topic") && (
              <p className="mt-1.5 text-sm font-semibold text-zinc-900">
                {errFor("topic")}
              </p>
            )}
          </div>

          <div>
            <ZonePicker
              zones={zones}
              value={region}
              onChange={(r) => {
                setRegion(r);
                clearError("region");
              }}
            />
            {errFor("region") && (
              <p className="mt-1.5 text-sm font-semibold text-zinc-900">
                {errFor("region")}
              </p>
            )}
          </div>
        </fieldset>

        {/* STEP 2 — Describe */}
        <fieldset hidden={step !== 2} className="space-y-6">
          <legend className="text-lg font-semibold text-zinc-900">
            Describe the issue
          </legend>

          <Field
            id="subject"
            label="Subject"
            required
            error={errFor("subject")}
            counter={<CharCounter value={subject.trim().length} min={5} max={200} />}
          >
            {(a) => (
              <input
                {...a}
                name="subject"
                type="text"
                value={subject}
                maxLength={200}
                onChange={(e) => {
                  setSubject(e.target.value);
                  clearError("subject");
                }}
                className="h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-900 focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-[invalid]:border-2 aria-[invalid]:border-black aria-[invalid]:bg-zinc-50"
              />
            )}
          </Field>

          <Field
            id="description"
            label="Description"
            required
            helper="Replace the bracketed prompts ([...]) with your details — the more specific, the faster we can act. Do not paste Aadhaar, bank or password details."
            error={errFor("description")}
            counter={<CharCounter value={description.trim().length} min={20} max={5000} />}
          >
            {(a) => (
              <textarea
                {...a}
                name="description"
                rows={8}
                value={description}
                maxLength={5000}
                onChange={(e) => {
                  setDescription(e.target.value);
                  clearError("description");
                }}
                className="min-h-36 w-full resize-y rounded-md border border-zinc-300 bg-white p-3 text-base leading-relaxed text-zinc-900 focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-[invalid]:border-2 aria-[invalid]:border-black aria-[invalid]:bg-zinc-50"
              />
            )}
          </Field>

          {templateId && (
            <button
              type="button"
              onClick={() => {
                const t = getTemplate(templateId);
                if (t) setDescription(t.descriptionScaffold);
              }}
              className="text-sm text-zinc-600 underline underline-offset-2 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Reset to template prompts
            </button>
          )}

          <AttachmentInput
            error={errFor("attachments")}
            onFilesChange={setAttachmentNames}
          />
        </fieldset>

        {/* STEP 3 — Your information */}
        <fieldset hidden={step !== 3} className="space-y-6">
          <legend className="text-lg font-semibold text-zinc-900">
            Your information
          </legend>

          <Field id="complainantName" label="Full name" required error={errFor("complainantName")}>
            {(a) => (
              <input
                {...a}
                name="complainantName"
                type="text"
                autoComplete="name"
                value={name}
                maxLength={120}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError("complainantName");
                }}
                className="h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-900 focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-[invalid]:border-2 aria-[invalid]:border-black aria-[invalid]:bg-zinc-50"
              />
            )}
          </Field>

          <Field id="complainantEmail" label="Email" required error={errFor("complainantEmail")}>
            {(a) => (
              <input
                {...a}
                name="complainantEmail"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                maxLength={254}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("complainantEmail");
                }}
                className="h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-900 focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-[invalid]:border-2 aria-[invalid]:border-black aria-[invalid]:bg-zinc-50"
              />
            )}
          </Field>

          <Field
            id="complainantPhone"
            label="Phone"
            required
            helper="Include country code if outside India, e.g. +91 90000 00000."
            error={errFor("complainantPhone")}
          >
            {(a) => (
              <input
                {...a}
                name="complainantPhone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                maxLength={20}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearError("complainantPhone");
                }}
                className="h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-900 focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-[invalid]:border-2 aria-[invalid]:border-black aria-[invalid]:bg-zinc-50"
              />
            )}
          </Field>

          <Field
            id="businessName"
            label="Business name"
            helper="Optional — the name of your startup or business, if this grievance relates to one."
            error={errFor("businessName")}
          >
            {(a) => (
              <input
                {...a}
                name="businessName"
                type="text"
                autoComplete="organization"
                value={businessName}
                maxLength={200}
                onChange={(e) => {
                  setBusinessName(e.target.value);
                  clearError("businessName");
                }}
                className="h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-900 focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-[invalid]:border-2 aria-[invalid]:border-black aria-[invalid]:bg-zinc-50"
              />
            )}
          </Field>

          <Field
            id="primeId"
            label="PRIME ID"
            helper="Optional — if you have a PRIME ID, add it so we can link your grievance faster."
            error={errFor("primeId")}
          >
            {(a) => (
              <input
                {...a}
                name="primeId"
                type="text"
                value={primeId}
                maxLength={40}
                onChange={(e) => {
                  setPrimeId(e.target.value);
                  clearError("primeId");
                }}
                className="h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-900 focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-[invalid]:border-2 aria-[invalid]:border-black aria-[invalid]:bg-zinc-50"
              />
            )}
          </Field>

          <p className="text-sm text-zinc-500">
            We use this only to send your ticket reference and updates, handled
            under the DPDP Act.
          </p>
        </fieldset>

        {/* STEP 4 — Review */}
        <fieldset hidden={step !== 4} className="space-y-4">
          <legend className="text-lg font-semibold text-zinc-900">
            Review &amp; submit
          </legend>
          <ReviewStep
            values={{
              zoneLabel: getZone(region)?.label ?? "Not selected",
              subject,
              description,
              complainantName: name,
              complainantEmail: email,
              complainantPhone: phone,
              businessName,
              primeId,
              attachmentNames,
            }}
            onEdit={(s) => setStep(s)}
            ack={ack}
            onAckChange={setAck}
            consent={consent}
            onConsentChange={(v) => {
              setConsent(v);
              clearError("consent");
            }}
            consentError={errFor("consent")}
          />
          {hasPlaceholder && (
            <p className="text-sm font-semibold text-zinc-900">
              Your description still contains [...] prompts — edit Step 2 before
              submitting.
            </p>
          )}
        </fieldset>
      </div>

      <Honeypot />
      <input type="hidden" name="category" value={dbCategoryFor(templateId)} />
      <input type="hidden" name="consent" value={consent ? "true" : "false"} />
      <input type="hidden" name="consentVersion" value={CONSENT_VERSION} />

      <StickyActionBar
        step={step}
        isLast={step === TOTAL}
        isPending={isPending}
        submitDisabled={submitDisabled}
        onBack={goBack}
        onContinue={goContinue}
      />
    </form>
  );
}
