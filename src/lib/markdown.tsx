export function MarkdownContent({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="flex flex-col gap-4 text-base leading-8 text-muted-foreground">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
