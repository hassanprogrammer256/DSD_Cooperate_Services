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
import { loginSchema, type LoginFormValues } from "@/lib/validation/authSchema";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function LoginPage() {
  useDocumentTitle("Log In");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  // Phase 13's Pricing checkout flow redirects here with state: { from: "/pricing" } —
  // return there after a successful login instead of a generic landing page. Defaults
  // to /account for a direct visit to /login.
  const from = (location.state as { from?: string } | null)?.from ?? "/account";

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    try {
      await login(values.email, values.password);
      void navigate(from, { replace: true });
    } catch (err) {
      console.error("[LoginPage/onSubmit]", err);
      setFormError(
        err instanceof ApiError && err.status === 401
          ? "Incorrect email or password."
          : "Couldn't log you in right now — please try again shortly.",
      );
    }
  }

  return (
    <section className="mx-auto max-w-sm px-4 py-24 md:px-6">
      <h1 className="text-center font-display text-2xl font-bold text-text-primary">Log In</h1>

      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="mt-8 flex flex-col gap-4" noValidate>
        {formError && <p className="rounded-lg bg-error-light px-4 py-3 text-sm text-error">{formError}</p>}

        <FormControl error={!!errors.email} required>
          <FormLabel>Email Address</FormLabel>
          <Input type="email" {...register("email")} />
          {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
        </FormControl>

        <FormControl error={!!errors.password} required>
          <FormLabel>Password</FormLabel>
          <Input type="password" {...register("password")} />
          {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
        </FormControl>

        <CtaButton type="submit" loading={isSubmitting} disabled={isSubmitting} sx={{ mt: 1 }}>
          Log In
        </CtaButton>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        New here?{" "}
        <Link to="/register" state={location.state} className="font-semibold text-primary hover:opacity-80">
          Create an account
        </Link>
      </p>
    </section>
  );
}
