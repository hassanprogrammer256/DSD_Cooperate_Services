type Props = {
  text: string;
  className?: string;
};

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
