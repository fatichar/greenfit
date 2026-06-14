import type { ReactNode } from "react";

type Block =
  | { type: "heading"; level: 2 | 3; content: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; content: string };

function parseBlocks(content: string): Block[] {
  const lines = content.split(/\r?\n/);
  const blocks: Block[] = [];

  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{2,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length as 2 | 3,
        content: headingMatch[2].trim(),
      });
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];

      while (index < lines.length) {
        const listLine = lines[index].trim();
        if (!listLine.startsWith("- ")) break;
        items.push(listLine.slice(2).trim());
        index += 1;
      }

      blocks.push({ type: "list", items });
      continue;
    }

    const paragraphLines: string[] = [];

    while (index < lines.length) {
      const paragraphLine = lines[index].trim();
      if (!paragraphLine) break;
      if (/^#{2,3}\s+/.test(paragraphLine) || paragraphLine.startsWith("- ")) break;
      paragraphLines.push(paragraphLine);
      index += 1;
    }

    blocks.push({
      type: "paragraph",
      content: paragraphLines.join(" "),
    });
  }

  return blocks;
}

function renderInline(content: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(content.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      nodes.push(
        <a
          key={`${match.index}-${match[3]}`}
          href={match[3]}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition hover:decoration-primary"
        >
          {match[2]}
        </a>,
      );
    } else if (match[4]) {
      nodes.push(
        <strong key={`${match.index}-strong`} className="font-semibold text-foreground">
          {match[4]}
        </strong>,
      );
    } else if (match[5]) {
      nodes.push(
        <em key={`${match.index}-em`} className="italic text-foreground">
          {match[5]}
        </em>,
      );
    } else if (match[6]) {
      nodes.push(
        <code
          key={`${match.index}-code`}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.95em] text-foreground"
        >
          {match[6]}
        </code>,
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < content.length) {
    nodes.push(content.slice(lastIndex));
  }

  return nodes;
}

export function MarkdownContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="flex flex-col gap-5 text-base leading-8 text-muted-foreground">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const HeadingTag = block.level === 2 ? "h2" : "h3";
          const headingClassName =
            block.level === 2
              ? "mt-4 font-heading text-2xl font-semibold text-foreground"
              : "mt-3 font-heading text-xl font-semibold text-foreground";

          return (
            <HeadingTag key={`${block.type}-${index}`} className={headingClassName}>
              {renderInline(block.content)}
            </HeadingTag>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={`${block.type}-${index}`} className="ml-6 list-disc space-y-2 marker:text-primary">
              {block.items.map((item, itemIndex) => (
                <li key={`${block.type}-${index}-${itemIndex}`}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`${block.type}-${index}`} className="text-base leading-8 text-muted-foreground">
            {renderInline(block.content)}
          </p>
        );
      })}
    </div>
  );
}
