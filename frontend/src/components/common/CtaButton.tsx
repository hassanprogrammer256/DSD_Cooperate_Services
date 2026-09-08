import Button, { type ButtonProps } from "@mui/joy/Button";
import { Link } from "react-router-dom";

// joyTheme.ts's palette is frozen at literal light-mode hex (Joy's extendTheme() can't
// accept a var(--...) string), so a plain Joy button's color never tracks the live
// light/dark toggle. This wraps Button with an explicit sx override that does — use
// this, never a raw Joy <Button color="danger">, for any accent/CTA button.
type CtaButtonProps = ButtonProps & {
  to?: string;
};

export function CtaButton({ to, sx, ...props }: CtaButtonProps) {
  return (
    <Button
      {...(to ? { component: Link, to } : {})}
      sx={{
        backgroundColor: "var(--color-accent)",
        color: "var(--color-text-inverse)",
        "&:hover": { backgroundColor: "var(--color-accent-dark)" },
        "&:active": { backgroundColor: "var(--color-accent-dark)" },
        ...sx,
      }}
      {...props}
    />
  );
}
