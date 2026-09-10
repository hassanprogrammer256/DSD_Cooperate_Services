import { useState } from "react";

import Checkbox from "@mui/joy/Checkbox";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Option from "@mui/joy/Option";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Select from "@mui/joy/Select";
import Textarea from "@mui/joy/Textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { CtaButton } from "@/components/common/CtaButton";
import { FileDropzone } from "@/components/common/FileDropzone";
import { useCreateLeadMutation } from "@/lib/api/leads";
import { MAIN_SERVICES, PREFERRED_CONTACT_METHODS, SUB_SERVICE_OPTIONS, type MainServiceValue } from "@/lib/leadOptions";
import { leadSchema, type LeadFormValues } from "@/lib/validation/leadSchema";

const PREFERRED_TIMES = ["Morning (9am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–8pm)", "Anytime"];

const labelSx = { color: "var(--color-text-primary)" };

type Props = {
  defaultMainService?: MainServiceValue;
  title?: string;
  description?: string;
};

export function LeadForm({ defaultMainService, title = "Tell Us What You Need", description }: Props) {
  const [reference, setReference] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const createLead = useCreateLeadMutation();

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { mainService: defaultMainService ?? "", preferredContactMethod: "whatsapp", consent: false },
  });

  const mainService = watch("mainService") as MainServiceValue | "";
  const subServiceOptions = mainService ? SUB_SERVICE_OPTIONS[mainService] : [];

  async function onSubmit(values: LeadFormValues) {
    try {
      const result = await createLead.mutateAsync({ ...values, attachment: file });
      setReference(result.reference);
      reset({ mainService: defaultMainService ?? "", preferredContactMethod: "whatsapp", consent: false });
      setFile(null);
    } catch (err) {
      console.error("[LeadForm/onSubmit]", err);
    }
  }

  if (reference) {
    return (
      <div className="rounded-xl border border-success bg-success-light px-6 py-10 text-center">
        <h3 className="font-display text-xl font-semibold text-text-primary">
          Thank you for contacting DSD Corporate Services.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary">
          We have received your enquiry and our team will review your requirements and contact you shortly.
        </p>
       
        <div className="mt-6">
          <CtaButton onClick={() => setReference(null)}>Send Another Enquiry</CtaButton>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      noValidate
      className="rounded-xl border border-border bg-surface p-6 shadow-sm md:p-8"
    >
      <h3 className="font-display text-xl font-bold text-text-primary">{title}</h3>
      {description && <p className="mt-2 text-sm text-text-secondary">{description}</p>}

      {createLead.isError && (
        <p className="mt-4 rounded-lg bg-error-light px-4 py-3 text-sm text-error">
          Something went wrong sending your enquiry — please try again or contact us directly.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
     

        <FormControl error={!!errors.mainService} required>
          <FormLabel sx={labelSx}>Select Service</FormLabel>
          <Controller
            name="mainService"
            control={control}
            render={({ field }) => (
              <Select
                placeholder="Choose a service"
                value={field.value || null}
                onChange={(_event, value) => field.onChange(value ?? "")}
                onBlur={field.onBlur}
              >
                {MAIN_SERVICES.map((service) => (
                  <Option key={service.value} value={service.value}>
                    {service.label}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors.mainService && <FormHelperText>{errors.mainService.message}</FormHelperText>}
        </FormControl>

        {subServiceOptions.length > 0 && (
          <FormControl>
            <FormLabel sx={labelSx}>Select Sub-Service</FormLabel>
            <Controller
              name="subService"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Choose an option"
                  value={field.value || null}
                  onChange={(_event, value) => field.onChange(value ?? "")}
                  onBlur={field.onBlur}
                >
                  {subServiceOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        )}

        <FormControl error={!!errors.name} required>
          <FormLabel sx={labelSx}>Full Name</FormLabel>
          <Input {...register("name")} />
          {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
        </FormControl>

        <FormControl error={!!errors.mobile} required>
          <FormLabel sx={labelSx}>Mobile / WhatsApp</FormLabel>
          <Input placeholder="+971 XX XXX XXXX" {...register("mobile")} />
          {errors.mobile && <FormHelperText>{errors.mobile.message}</FormHelperText>}
        </FormControl>

        <FormControl error={!!errors.email} required>
          <FormLabel sx={labelSx}>Email Address</FormLabel>
          <Input type="email" placeholder="name@company.com" {...register("email")} />
          {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
        </FormControl>

        <FormControl error={!!errors.country} required>
          <FormLabel sx={labelSx}>Country of Residence</FormLabel>
          <Input {...register("country")} />
          {errors.country && <FormHelperText>{errors.country.message}</FormHelperText>}
        </FormControl>

        <FormControl className="sm:col-span-2">
          <FormLabel sx={labelSx}>Company Name (Optional)</FormLabel>
          <Input placeholder="e.g. ABC Trading LLC" {...register("company")} />
        </FormControl>

        <FormControl error={!!errors.requirement} required className="sm:col-span-2">
          <FormLabel sx={labelSx}>Tell Us About Your Requirement</FormLabel>
          <Textarea minRows={4} placeholder="Briefly describe what you need help with..." {...register("requirement")} />
          {errors.requirement && <FormHelperText>{errors.requirement.message}</FormHelperText>}
             <div className="sm:col-span-2">
          <FileDropzone
            label="Upload Supporting Documents (Optional)"
            accept=".pdf,.jpg,.jpeg,.png"
            helperText="Accepted: PDF, JPG, PNG"
            onFileChange={setFile}
          />
        </div>
        </FormControl>

        <FormControl error={!!errors.preferredContactMethod} className="sm:col-span-2">
          <FormLabel sx={labelSx}>Preferred Contact Method</FormLabel>
          <Controller
            name="preferredContactMethod"
            control={control}
            render={({ field }) => (
              <RadioGroup orientation="horizontal" value={field.value} onChange={field.onChange}>
                {PREFERRED_CONTACT_METHODS.map((method) => (
                  <Radio
                    key={method.value}
                    value={method.value}
                    label={method.label}
                    slotProps={{ label: { sx: labelSx } }}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </FormControl>

        <FormControl className="sm:col-span-2">
          <FormLabel sx={labelSx}>Preferred Contact Time</FormLabel>
          <Controller
            name="preferredContactTime"
            control={control}
            render={({ field }) => (
              <Select
                placeholder="Select preferred time"
                value={field.value || null}
                onChange={(_event, value) => field.onChange(value ?? "")}
              >
                {PREFERRED_TIMES.map((time) => (
                  <Option key={time} value={time}>
                    {time}
                  </Option>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </div>

      <FormControl error={!!errors.consent} className="mt-4">
        <Controller
          name="consent"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              label="I agree to be contacted regarding my enquiry and understand that my information will be used to respond to my request."
              slotProps={{ label: { sx: { color: "var(--color-text-secondary)" } } }}
            />
          )}
        />
        {errors.consent && <FormHelperText>{errors.consent.message}</FormHelperText>}
      </FormControl>

      <div className="mt-6">
        <CtaButton type="submit" loading={isSubmitting} disabled={isSubmitting} size="lg">
          Submit My Request
        </CtaButton>
      </div>
    </form>
  );
}
