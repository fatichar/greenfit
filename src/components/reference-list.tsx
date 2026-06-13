import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReferenceList({ references }: { references: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>References</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          {references.map((reference) => (
            <li key={reference}>{reference}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
