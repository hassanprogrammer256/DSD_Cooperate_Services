import { useState } from "react";

import IconButton from "@mui/joy/IconButton";
import Input, { type InputProps } from "@mui/joy/Input";
import { Eye, EyeOff } from "lucide-react";

// A plain Joy Input with a show/hide toggle — used by both auth forms' password
// fields. No dedicated Joy primitive for this, same reasoning as FileDropzone's
// "Joy has no file-input primitive of its own."
export function PasswordInput(props: InputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      endDecorator={
        <IconButton
          variant="plain"
          size="sm"
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </IconButton>
      }
    />
  );
}
