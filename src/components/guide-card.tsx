import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGuideImage } from "@/lib/images";
import type { Guide } from "@/lib/types";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link href={`/guides/${guide.slug}`}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
        <Image
          src={getGuideImage(guide.slug)}
          alt=""
          width={900}
          height={675}
          className="aspect-[16/9] w-full object-cover"
        />
        <CardHeader>
          <CardTitle>{guide.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{guide.readingTime}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">{guide.summary}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
