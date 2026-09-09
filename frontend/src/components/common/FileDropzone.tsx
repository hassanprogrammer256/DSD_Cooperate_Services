import { useRef, useState } from "react";

import { Upload, X } from "lucide-react";

type Props = {
  label: string;
  accept?: string;
  helperText?: string;
  onFileChange: (file: File | null) => void;
};

// Drag-and-drop file picker, used wherever this project accepts a file — replaces a
// bare native <input type="file"> with something actually designed. Joy has no file-
// input primitive of its own (see ui-registry.md's FormFileField precedent), so this
// is a plain styled div wrapping a hidden native input, matching that same reasoning.
export function FileDropzone({ label, accept, helperText, onFileChange }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function selectFile(file: File | null) {
    setFileName(file?.name ?? null);
    onFileChange(file);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-primary">{label}</label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          selectFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
          dragActive ? "border-primary bg-primary-light" : "border-border bg-surface-secondary hover:border-primary/50"
        }`}
      >
        <Upload size={22} className="text-primary" />
        {fileName ? (
          <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
            {fileName}
            <button
              type="button"
              aria-label="Remove file"
              onClick={(e) => {
                e.stopPropagation();
                selectFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="text-text-muted hover:text-error"
            >
              <X size={14} />
            </button>
          </p>
        ) : (
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {helperText && <p className="mt-1 text-xs text-text-muted">{helperText}</p>}
    </div>
  );
}
