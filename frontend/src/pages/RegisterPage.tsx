import { useState } from "react";

import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { CtaButton } from "@/components/common/CtaButton";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api/client";
import { registerSchema, type RegisterFormValues } from "@/lib/validation/authSchema";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function RegisterPage() {
  useDocumentTitle("Create an Account");
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const from = (location.state as { from?: string } | null)?.from ?? "/account";

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null);
    try {
      await registerUser(values);
      void navigate(from, { replace: true });
    } catch (err) {
      console.error("[RegisterPage/onSubmit]", err);
      setFormError(
        err instanceof ApiError && err.status === 400
          ? "That email is already registered — try logging in instead."
          : "Couldn't create your account right now — please try again shortly.",
      );
    }
  }

  return (
    <section className="mx-auto max-w-sm px-4 py-24 md:px-6">
      <h1 className="text-center font-display text-2xl font-bold text-text-primary">Create an Account</h1>

      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="mt-8 flex flex-col gap-4" noValidate>
        {formError && <p className="rounded-lg bg-error-light px-4 py-3 text-sm text-error">{formError}</p>}

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

        <FormControl error={!!errors.phone}>
          <FormLabel sx={{ color: "var(--color-text-primary)" }}>Phone Number</FormLabel>
          <Input type="tel" {...register("phone")} />
          {errors.phone && <FormHelperText>{errors.phone.message}</FormHelperText>}
        </FormControl>

        <FormControl error={!!errors.password} required>
          <FormLabel sx={{ color: "var(--color-text-primary)" }}>Password</FormLabel>
          <Input type="password" {...register("password")} />
          {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
        </FormControl>

        <CtaButton type="submit" loading={isSubmitting} disabled={isSubmitting} sx={{ mt: 1 }}>
          Create Account
        </CtaButton>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link to="/login" state={location.state} className="font-semibold text-primary hover:opacity-80">
          Log in
        </Link>
      </p>
    </section>
  );
}
