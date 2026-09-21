import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { NotStaffError, useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api/client";
import { loginSchema, type LoginFormValues } from "@/lib/validation/authSchema";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values.email, values.password);
      void navigate(from, { replace: true });
    } catch (err) {
      console.error("[LoginPage/onSubmit]", err);
      if (err instanceof NotStaffError) {
        toast.error("This account doesn't have admin access.");
      } else if (err instanceof ApiError && err.status === 401) {
        toast.error("Incorrect email or password.");
      } else {
        toast.error("Couldn't log you in right now — please try again shortly.");
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-secondary px-4">
      <section className="w-full max-w-sm rounded-xl border border-border bg-surface p-8">
        <h1 className="text-center font-display text-2xl font-bold text-text-primary">DSD Admin</h1>

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="mt-8 flex flex-col gap-4" noValidate>
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

          <Button type="submit" color="primary" loading={isSubmitting} disabled={isSubmitting} sx={{ mt: 1 }}>
            Log In
          </Button>
        </form>
      </section>
    </div>
  );
}
