import { useRef, useState } from "react";

import { Upload, X } from "lucide-react";

type Props = {
  label: string;
  accept?: string;
  required?: boolean;
  helperText?: string;
  currentUrl?: string | null;
  onFileChange: (file: File | null) => void;
};

// Drag-and-drop file picker — replaces a bare native <input type="file"> everywhere
// this app accepts one. Joy has no file-input primitive of its own, so this is a plain
// styled div wrapping a hidden native input (same reasoning as the old FormFileField).
// Always render this as the FIRST field in any form it appears in — see
// progress-tracker.md's 2026-09-09 entry for why.
export function FileDropzone({ label, accept, required, helperText, currentUrl, onFileChange }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function selectFile(file: File | null) {
    onFileChange(file);
    if (file) {
      setFileName(file.name);
      setPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    } else {
      setFileName(null);
      setPreview(currentUrl ?? null);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
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
        {preview ? (
          <img src={preview} alt="" className="max-h-28 rounded-md object-contain" />
        ) : (
          <Upload size={22} className="text-primary" />
        )}
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
              className="text-text-muted hover:text-danger"
            >
              <X size={14} />
            </button>
          </p>
        ) : (
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            {currentUrl && " — leave empty to keep the current file"}
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
