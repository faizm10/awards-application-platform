/** Turn PostgREST / Supabase errors into a readable string (they often log as `{}`). */
export function formatSupabaseError(error: unknown): string {
  if (!error) return "Unknown error";

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object") {
    const e = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };
    const parts = [e.message, e.details, e.hint, e.code ? `(${e.code})` : ""].filter(
      Boolean
    );
    if (parts.length > 0) return parts.join(" — ");
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

/** DB only allows file | text | textarea on award_required_fields.type */
export function toDbRequirementType(
  type: string,
  fieldConfig?: { type?: string } | null
): "file" | "text" | "textarea" {
  const allowed = ["file", "text", "textarea"] as const;
  if (allowed.includes(type as (typeof allowed)[number])) {
    return type as "file" | "text" | "textarea";
  }
  if (
    fieldConfig?.type &&
    allowed.includes(fieldConfig.type as (typeof allowed)[number])
  ) {
    return fieldConfig.type as "file" | "text" | "textarea";
  }
  if (
    ["certificate", "international_intent", "community_letter", "resume"].includes(
      type
    )
  ) {
    return "file";
  }
  if (["travel_benefit", "budget"].includes(type)) {
    return "textarea";
  }
  return "text";
}
