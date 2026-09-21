import { useState } from "react";

import Button from "@mui/joy/Button";

import { useAuth } from "@/contexts/AuthContext";

// A plain "G" mark, not the official multicolor logo asset — avoids pulling in an
// image/SVG asset just for this one button.
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.9v2.33A9 9 0 0 0 9 18z"
      />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.9A9 9 0 0 0 0 9c0 1.45.35 2.83.9 4.03z" />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .9 4.97l3.05 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}

type Props = {
  onSuccess: () => void;
  onError?: (message: string) => void;
};

export function GoogleSignInButton({ onSuccess, onError }: Props) {
  const { loginWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err) {
      console.error("[GoogleSignInButton/handleClick]", err);
      onError?.("Couldn't sign in with Google right now, please try again or use email instead.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button
      type="button"
      fullWidth
      variant="outlined"
      color="neutral"
      loading={isSubmitting}
      disabled={isSubmitting}
      onClick={() => void handleClick()}
      startDecorator={<GoogleMark />}
      sx={{
        color: "var(--color-text-primary)",
        borderColor: "var(--color-border)",
        "&:hover": { borderColor: "var(--color-primary)", backgroundColor: "transparent" },
      }}
    >
      Continue with Google
    </Button>
  );
}
