type Props = {
  text: string;
  className?: string;
};

// Splits copy into one line per sentence, per site convention: each sentence
// (ending in ".") starts on its own line rather than wrapping as one dense block.
// Only breaks where a period is followed by whitespace + a capital letter (or end
// of string), so abbreviations like "No. 33" or "Federal Decree-Law No. 9" — a
// period followed by a digit, not a new sentence — are left intact.
export function SentenceText({ text, className }: Props) {
  const sentences = text
    .split(/(?<=\.)\s+(?=[A-Z])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return (
    <>
      {sentences.map((sentence, index) => (
        <span key={index} className={`block ${className ?? ""}`}>
          {sentence}
        </span>
      ))}
    </>
  );
}
