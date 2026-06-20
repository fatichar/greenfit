import Link from "next/link";
import type { ReactNode } from "react";

type Block =
  | { type: "heading"; level: 2 | 3; content: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "paragraph"; content: string };

type Section = {
  heading: Extract<Block, { type: "heading" }>;
  blocks: Block[];
};

function parseTableRow(line: string) {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableSeparator(line: string) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

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

    if (line.startsWith("|") && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
      const tableLines: string[] = [];

      while (index < lines.length) {
        const tableLine = lines[index].trim();
        if (!tableLine.startsWith("|")) break;
        tableLines.push(tableLine);
        index += 1;
      }

      blocks.push({
        type: "table",
        headers: parseTableRow(tableLines[0]),
        rows: tableLines.slice(2).map(parseTableRow),
      });
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
      const isInternalLink = match[3].startsWith("/");

      nodes.push(
        isInternalLink ? (
          <Link
            key={`${match.index}-${match[3]}`}
            href={match[3]}
            className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition hover:decoration-primary"
          >
            {match[2]}
          </Link>
        ) : (
          <a
            key={`${match.index}-${match[3]}`}
            href={match[3]}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition hover:decoration-primary"
            data-umami-event="Outbound Product Click"
            data-umami-event-url={match[3]}
          >
            {match[2]}
          </a>
        ),
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

function groupSections(blocks: Block[]) {
  const preamble: Block[] = [];
  const sections: Section[] = [];
  let currentSection: Section | null = null;

  for (const block of blocks) {
    if (block.type === "heading" && block.level === 2) {
      currentSection = { heading: block, blocks: [] };
      sections.push(currentSection);
      continue;
    }

    if (currentSection) {
      currentSection.blocks.push(block);
    } else {
      preamble.push(block);
    }
  }

  return { preamble, sections };
}

function renderBlock(block: Block, index: number) {
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

  if (block.type === "table") {
    return (
      <div key={`${block.type}-${index}`} className="overflow-x-auto rounded-lg border border-olive-200">
        <table className="min-w-full border-collapse text-left text-sm leading-6">
          <thead className="bg-muted/60 text-foreground">
            <tr>
              {block.headers.map((header, headerIndex) => (
                <th key={`${block.type}-${index}-header-${headerIndex}`} className="px-4 py-3 font-semibold">
                  {renderInline(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-olive-100">
            {block.rows.map((row, rowIndex) => (
              <tr key={`${block.type}-${index}-row-${rowIndex}`}>
                {block.headers.map((_, cellIndex) => (
                  <td key={`${block.type}-${index}-cell-${rowIndex}-${cellIndex}`} className="px-4 py-3 align-top">
                    {renderInline(row[cellIndex] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <p key={`${block.type}-${index}`} className="text-base leading-8 text-muted-foreground">
      {renderInline(block.content)}
    </p>
  );
}

export function MarkdownContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  const { preamble, sections } = groupSections(blocks);

  return (
    <div className="flex flex-col gap-5 text-base leading-8 text-muted-foreground">
      {preamble.map(renderBlock)}
      {sections.map((section, sectionIndex) => (
        <details
          key={`${section.heading.content}-${sectionIndex}`}
          open={sectionIndex === 0}
          className="group rounded-lg border border-olive-200 bg-card shadow-sm"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-heading text-xl font-semibold text-foreground [&::-webkit-details-marker]:hidden">
            <span>{renderInline(section.heading.content)}</span>
            <span aria-hidden="true" className="text-2xl leading-none text-primary group-open:hidden">
              +
            </span>
            <span aria-hidden="true" className="hidden text-2xl leading-none text-primary group-open:block">
              -
            </span>
          </summary>
          <div className="flex flex-col gap-5 border-t border-olive-100 px-5 py-5">
            {section.blocks.map(renderBlock)}
          </div>
        </details>
      ))}
    </div>
  );
}
