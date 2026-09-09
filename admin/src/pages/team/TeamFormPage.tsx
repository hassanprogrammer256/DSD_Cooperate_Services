import { useEffect } from "react";

import Button from "@mui/joy/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { FormFileField } from "@/components/common/form/FormFileField";
import { FormTextField } from "@/components/common/form/FormTextField";
import { FormTextareaField } from "@/components/common/form/FormTextareaField";
import { ApiError } from "@/lib/api/client";
import { teamApi } from "@/lib/api/content";
import { buildContentPayload } from "@/lib/contentPayload";
import { teamMemberSchema, type TeamMemberFormValues } from "@/lib/validation/teamSchema";

export function TeamFormPage() {
  const { slug } = useParams();
  const isCreate = !slug || slug === "new";
  const navigate = useNavigate();
  const { data } = teamApi.useList();
  const existing = !isCreate ? data?.find((t) => t.slug === slug) : undefined;
  const createMutation = teamApi.useCreate();
  const updateMutation = teamApi.useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: { slug: "", name: "", role: "", bio: "", email: "", phone: "", whatsapp: "", linkedin: "" },
  });

  useEffect(() => {
    if (existing) {
      reset({
        slug: existing.slug,
        name: existing.name,
        role: existing.role,
        bio: existing.bio,
        email: existing.email,
        phone: existing.phone,
        whatsapp: existing.whatsapp,
        linkedin: existing.linkedin,
      });
    }
  }, [existing, reset]);

  async function onSubmit(values: TeamMemberFormValues) {
    try {
      const payload = buildContentPayload(values, { fileFields: ["photo"] });
      if (isCreate) {
        await createMutation.mutateAsync(payload);
        toast.success("Team member created.");
      } else if (existing) {
        await updateMutation.mutateAsync({ id: existing.slug, data: payload });
        toast.success("Team member saved.");
      }
      navigate("/team");
    } catch (err) {
      console.error("[TeamFormPage/onSubmit]", err);
      toast.error(err instanceof ApiError ? err.message : "Couldn't save this team member right now.");
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">{isCreate ? "New Team Member" : "Edit Team Member"}</h1>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4" noValidate>
        <FormFileField label="Photo" name="photo" control={control} currentUrl={existing?.photo} required={isCreate} />
        <FormTextField label="Slug" registration={register("slug")} error={errors.slug?.message} required />
        <FormTextField label="Name" registration={register("name")} error={errors.name?.message} required />
        <FormTextField label="Role" registration={register("role")} error={errors.role?.message} required />
        <FormTextareaField label="Bio" registration={register("bio")} error={errors.bio?.message} required />
        <FormTextField label="Email" registration={register("email")} error={errors.email?.message} />
        <FormTextField label="Phone" registration={register("phone")} error={errors.phone?.message} />
        <FormTextField label="WhatsApp" registration={register("whatsapp")} error={errors.whatsapp?.message} />
        <FormTextField label="LinkedIn URL" registration={register("linkedin")} error={errors.linkedin?.message} />
        <div className="mt-2 flex gap-2">
          <Button type="submit" color="primary" loading={isSubmitting}>
            Save
          </Button>
          <Button type="button" variant="plain" color="neutral" onClick={() => void navigate("/team")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
