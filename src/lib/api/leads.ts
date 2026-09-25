import { useMutation } from "@tanstack/react-query";

import { MAIN_SERVICES, PREFERRED_CONTACT_METHODS } from "@/lib/leadOptions";
import type { LeadFormValues } from "@/lib/validation/leadSchema";

type CreateLeadResponse = {
  reference: string;
};

// STATIC BUILD: there is no leads API. The enquiry is composed into a message and
// handed to WhatsApp (default) or the visitor's email app, depending on their
// preferred contact method — same fields the backend Lead model captured.
const WHATSAPP_NUMBER = "971585889033";
const ENQUIRY_EMAIL = "info@dsdgrp.com";

function labelFor(options: readonly { value: string; label: string }[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function composeMessage(values: LeadFormValues & { attachment?: File | null }): string {
  const service = labelFor(MAIN_SERVICES, values.mainService);
  const lines = [
    `New enquiry: ${service}${values.subService ? ` / ${values.subService}` : ""}`,
    "",
    values.requirement.trim(),
    "",
    `Name: ${values.name}`,
    `Mobile: ${values.mobile}`,
    `Email: ${values.email}`,
    `Country: ${values.country}`,
  ];
  if (values.company) lines.push(`Company: ${values.company}`);
  lines.push(`Preferred contact: ${labelFor(PREFERRED_CONTACT_METHODS, values.preferredContactMethod)}`);
  if (values.preferredContactTime) lines.push(`Preferred time: ${values.preferredContactTime}`);
  if (values.attachment) lines.push("", `I have a document to share: ${values.attachment.name}`);
  return lines.join("\n");
}

function openExternal(url: string): void {
  const opened = window.open(url, "_blank", "noopener");
  if (!opened) window.location.href = url; // popup blocked — navigate instead
}

export function useCreateLeadMutation() {
  return useMutation({
    mutationFn: async (values: LeadFormValues & { attachment?: File | null }): Promise<CreateLeadResponse> => {
      const text = composeMessage(values);
      if (values.preferredContactMethod === "email") {
        const subject = `Website enquiry: ${labelFor(MAIN_SERVICES, values.mainService)}`;
        window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      } else {
        openExternal(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`);
      }
      return { reference: `DSD-${Date.now().toString(36).toUpperCase()}` };
    },
  });
}
