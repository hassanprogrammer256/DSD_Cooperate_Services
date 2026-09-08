import { useState } from "react";

import IconButton from "@mui/joy/IconButton";
import { Moon, Sun } from "lucide-react";

import { getCurrentTheme, toggleTheme } from "@/theme/theme";

type Props = {
  inverse?: boolean;
};

export function ThemeToggle({ inverse = false }: Props) {
  const [mode, setMode] = useState(getCurrentTheme);

  function handleClick() {
    setMode(toggleTheme());
  }

  return (
    <IconButton
      variant="plain"
      onClick={handleClick}
      aria-label={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      sx={{
        color: inverse ? "var(--color-text-inverse)" : "var(--color-text-secondary)",
        "&:hover": {
          backgroundColor: inverse ? "rgba(255,255,255,0.12)" : "var(--color-surface-secondary)",
        },
      }}
    >
      {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  );
}
