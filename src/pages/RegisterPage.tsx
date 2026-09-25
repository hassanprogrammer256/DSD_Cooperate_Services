import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { CountrySelect } from "@/components/common/CountrySelect";
import { CtaButton } from "@/components/common/CtaButton";
import { GoogleSignInButton } from "@/components/common/GoogleSignInButton";
import { PasswordInput } from "@/components/common/PasswordInput";
import { PhoneNumberField } from "@/components/common/PhoneNumberField";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api/client";
import { registerSchema, type RegisterFormValues } from "@/lib/validation/authSchema";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function RegisterPage() {
  useDocumentTitle("Create an Account");
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { phoneCountryCode: "+971" },
  });

  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        company: values.company,
        country: values.country,
        phone: `${values.phoneCountryCode} ${values.phoneNumber}`,
      });
      void navigate(from, { replace: true });
    } catch (err) {
      console.error("[RegisterPage/onSubmit]", err);
      toast.error(
        err instanceof ApiError && err.status === 503
          ? err.message
          : err instanceof ApiError && err.status === 400
            ? "That email is already registered, try logging in instead."
            : "Couldn't create your account right now, please try again shortly.",
      );
    }
  }

  return (
    <section className="mx-auto w-full max-w-md px-4 py-10 md:px-6">
      <h1 className="text-center font-display text-2xl font-bold text-text-primary">Create an Account</h1>

      <div className="mt-8 rounded-xl border border-accent/30 bg-surface p-6 shadow-sm md:p-8">
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4" noValidate>
          <FormControl error={!!errors.name} required>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Full Name</FormLabel>
            <Input {...register("name")} />
            {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
          </FormControl>

          <FormControl error={!!errors.email} required>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Email Address</FormLabel>
            <Input type="email" {...register("email")} />
            {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
          </FormControl>

          <FormControl error={!!errors.company} required>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Company Name</FormLabel>
            <Input {...register("company")} />
            {errors.company && <FormHelperText>{errors.company.message}</FormHelperText>}
          </FormControl>

          <FormControl error={!!errors.country} required>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Country</FormLabel>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <CountrySelect
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={!!errors.country}
                />
              )}
            />
            {errors.country && <FormHelperText>{errors.country.message}</FormHelperText>}
          </FormControl>

          <FormControl error={!!errors.phoneNumber} required>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Phone Number</FormLabel>
            <PhoneNumberField control={control} countryCodeName="phoneCountryCode" numberName="phoneNumber" />
            {(errors.phoneCountryCode || errors.phoneNumber) && (
              <FormHelperText>{errors.phoneCountryCode?.message ?? errors.phoneNumber?.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl error={!!errors.password} required>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Password</FormLabel>
            <PasswordInput {...register("password")} />
            {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
          </FormControl>

          <FormControl error={!!errors.confirmPassword} required>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Confirm Password</FormLabel>
            <PasswordInput {...register("confirmPassword")} />
            {errors.confirmPassword && <FormHelperText>{errors.confirmPassword.message}</FormHelperText>}
          </FormControl>

          <CtaButton type="submit" loading={isSubmitting} disabled={isSubmitting} sx={{ mt: 1 }}>
            Create Account
          </CtaButton>
        </form>

        <div className="mt-4 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-text-muted">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="mt-4">
          <GoogleSignInButton
            onSuccess={() => void navigate(from, { replace: true })}
            onError={(message) => toast.error(message)}
          />
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link to="/login" state={location.state} className="font-semibold text-primary hover:opacity-80">
          Log in
        </Link>
      </p>
    </section>
  );
}
