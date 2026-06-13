import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DisclaimerBox() {
  return (
    <Alert className="border-olive-200 bg-olive-50/60">
      <AlertTitle>General information only</AlertTitle>
      <AlertDescription>
        GreenFit provides general nutrition information only. It is not medical
        advice. For medical conditions, pregnancy, children, elderly people,
        eating disorders, kidney disease, diabetes, or medication-related
        concerns, consult a qualified doctor or registered dietitian.
      </AlertDescription>
    </Alert>
  );
}
