import { useState } from "react";

import { Moon, Sun } from "lucide-react";
import IconButton from "@mui/joy/IconButton";

import { getCurrentTheme, toggleTheme } from "@/theme/theme";

export function ThemeToggle() {
  const [mode, setMode] = useState(getCurrentTheme());

  return (
    <IconButton
      variant="plain"
      color="neutral"
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setMode(toggleTheme())}
    >
      {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  );
}
