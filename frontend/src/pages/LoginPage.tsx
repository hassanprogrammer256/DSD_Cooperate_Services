import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { CtaButton } from "@/components/common/CtaButton";
import { GoogleSignInButton } from "@/components/common/GoogleSignInButton";
import { PasswordInput } from "@/components/common/PasswordInput";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api/client";
import { loginSchema, type LoginFormValues } from "@/lib/validation/authSchema";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function LoginPage() {
  useDocumentTitle("Log In");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  // Pricing's checkout flow (and any ProtectedRoute) redirects here with
  // state: { from: "..." } — return there after a successful login instead of a
  // generic landing page. Defaults to /dashboard for a direct visit to /login.
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values.email, values.password);
      void navigate(from, { replace: true });
    } catch (err) {
      console.error("[LoginPage/onSubmit]", err);
      toast.error(
        err instanceof ApiError && err.status === 401
          ? "Incorrect email or password."
          : "Couldn't log you in right now, please try again shortly.",
      );
    }
  }

  return (
    <section className="mx-auto w-full max-w-sm px-4 py-10 md:px-6">
      <h1 className="text-center font-display text-2xl font-bold text-text-primary">Log In</h1>

      <div className="mt-8 rounded-xl border border-accent/30 bg-surface p-6 shadow-sm md:p-8">
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4" noValidate>
          <FormControl error={!!errors.email} required>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Email Address</FormLabel>
            <Input type="email" {...register("email")} />
            {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
          </FormControl>

          <FormControl error={!!errors.password} required>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Password</FormLabel>
            <PasswordInput {...register("password")} />
            {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
          </FormControl>

          <CtaButton type="submit" loading={isSubmitting} disabled={isSubmitting} sx={{ mt: 1 }}>
            Log In
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
        New here?{" "}
        <Link to="/register" state={location.state} className="font-semibold text-primary hover:opacity-80">
          Create an account
        </Link>
      </p>
    </section>
  );
}
