import { redirect } from "next/navigation";
import { getActiveDeal } from "@/lib/deal";
import { IntakeWizard } from "@/components/intake/intake-wizard";

export default async function IntakePage() {
  const deal = await getActiveDeal();
  if (deal) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">New Deal Setup</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Set up the deal and IT context once — every deliverable in the workspace is generated
        from what you enter here.
      </p>
      <div className="mt-8">
        <IntakeWizard />
      </div>
    </div>
  );
}
