import {
  Blender,
  ChefHat,
  Citrus,
  CookingPot,
  CupSoda,
  ExternalLink,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { withAmazonAssociatesTag } from "@/lib/affiliate";
import type { Device } from "@/lib/types";
import { cn } from "@/lib/utils";

const deviceIcons: Record<string, LucideIcon> = {
  "cold-press-juicer": Citrus,
  "high-speed-blender": Blender,
  "personal-blender": CupSoda,
  "food-processor": ChefHat,
  "electric-pressure-cooker": CookingPot,
  "spice-grinder": Sparkles,
};

export function DeviceCard({ device }: { device: Device }) {
  const Icon = deviceIcons[device.slug] ?? deviceIcons["food-processor"];

  return (
    <Card className="h-full">
      <Image
        src={device.imagePath}
        alt=""
        width={1024}
        height={1024}
        className="aspect-[4/3] w-full object-cover"
      />
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-11 items-center justify-center rounded-lg bg-mint-100 text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </div>
          <Badge variant="secondary">{device.category}</Badge>
        </div>
        <div>
          <CardTitle className="text-lg">{device.name}</CardTitle>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{device.bestFor}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5 text-sm leading-6 text-muted-foreground">
        <p>{device.whyItHelps}</p>
        <div>
          <h3 className="font-medium text-foreground">What to look for</h3>
          <ul className="mt-2 grid gap-1.5 pl-5 marker:text-primary list-disc">
            {device.lookFor.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-medium text-foreground">Useful for</h3>
          <p className="mt-1">{device.bestForRecipes.join(", ")}</p>
        </div>
        <p className="border-t pt-4 text-xs leading-5">Cleaning note: {device.careNote}</p>
      </CardContent>
      <CardFooter>
        <a
          href={withAmazonAssociatesTag(device.amazonSearchUrl)}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          data-umami-event="Outbound Device Search"
          data-umami-event-device={device.slug}
          data-umami-event-source-page="/shop/kitchen"
          className={cn(buttonVariants(), "w-full sm:w-auto")}
        >
          Find it on Amazon
          <ExternalLink data-icon="inline-end" />
        </a>
      </CardFooter>
    </Card>
  );
}
