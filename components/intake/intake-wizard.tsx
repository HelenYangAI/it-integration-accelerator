"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { dealIntakeSchema, type DealIntakeInput } from "@/lib/schemas/deal";
import { DEAL_TYPE_LABELS } from "@/lib/labels";
import { OrgChartEditor } from "@/components/intake/org-chart-editor";

const STEPS = [
  "Deal Background",
  "Companies",
  "IT Org Chart",
  "Thesis & Goals",
  "Current State",
  "Review",
] as const;

const STEP_FIELDS: Path<DealIntakeInput>[][] = [
  ["name", "dealType", "industry"],
  [
    "companies.0.name",
    "companies.1.name",
  ],
  [],
  ["dealThesis", "shortTermGoals", "longTermGoals"],
  ["currentStateDescription"],
  [],
];

export function IntakeWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<DealIntakeInput>({
    resolver: zodResolver(dealIntakeSchema),
    defaultValues: {
      name: "",
      dealType: "BOLT_ON",
      industry: "",
      dealThesis: "",
      shortTermGoals: "",
      longTermGoals: "",
      currentStateDescription: "",
      companies: [
        { role: "ACQUIRER", name: "" },
        { role: "TARGET", name: "" },
      ],
      itOrgNodes: [],
    },
  });

  const { register, handleSubmit, trigger, getValues, control } = form;

  async function goNext() {
    const fields = STEP_FIELDS[step];
    const valid = fields.length === 0 || (await trigger(fields));
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(data: DealIntakeInput) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to create deal");
      }
      toast.success("Deal created");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function onInvalid() {
    toast.error("Some fields need attention before the deal can be created.");
  }

  const values = getValues();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6 flex flex-wrap gap-2 text-xs">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={
                "rounded-full px-2.5 py-1 " +
                (i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-muted text-foreground"
                    : "bg-muted text-muted-foreground")
              }
            >
              {i + 1}. {s}
            </span>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-5">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Deal name</Label>
                <Input id="name" className="mt-1" {...register("name")} />
              </div>
              <div>
                <Label htmlFor="dealType">Acquisition type</Label>
                <select
                  id="dealType"
                  className="border-input mt-1 h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                  {...register("dealType")}
                >
                  {Object.entries(DEAL_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" className="mt-1" {...register("industry")} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {(["Acquirer", "Target"] as const).map((label, i) => (
                <div key={label} className="space-y-3">
                  <h3 className="text-sm font-medium">{label}</h3>
                  <div>
                    <Label>Company name</Label>
                    <Input className="mt-1" {...register(`companies.${i}.name` as const)} />
                  </div>
                  <div>
                    <Label>Size</Label>
                    <Input
                      className="mt-1"
                      placeholder="e.g. Mid-market"
                      {...register(`companies.${i}.size` as const)}
                    />
                  </div>
                  <div>
                    <Label>Revenue</Label>
                    <Input
                      className="mt-1"
                      placeholder="e.g. $50M ARR"
                      {...register(`companies.${i}.revenue` as const)}
                    />
                  </div>
                  <div>
                    <Label>Employee count</Label>
                    <Input
                      type="number"
                      className="mt-1"
                      {...register(`companies.${i}.employeeCount` as const)}
                    />
                  </div>
                  <div>
                    <Label>Headquarters</Label>
                    <Input className="mt-1" {...register(`companies.${i}.headquarters` as const)} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      className="mt-1"
                      rows={3}
                      {...register(`companies.${i}.description` as const)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Structured entry for each company&apos;s current IT org — the CIO/IT lead down
                through key functions. This can be extended later on the IT Org Design page.
              </p>
              <OrgChartEditor scope="ACQUIRER" label="Acquirer" control={control} register={register} />
              <OrgChartEditor scope="TARGET" label="Target" control={control} register={register} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="dealThesis">Deal thesis</Label>
                <Textarea id="dealThesis" className="mt-1" rows={4} {...register("dealThesis")} />
              </div>
              <div>
                <Label htmlFor="shortTermGoals">Short-term goals</Label>
                <Textarea
                  id="shortTermGoals"
                  className="mt-1"
                  rows={3}
                  {...register("shortTermGoals")}
                />
              </div>
              <div>
                <Label htmlFor="longTermGoals">Long-term goals</Label>
                <Textarea
                  id="longTermGoals"
                  className="mt-1"
                  rows={3}
                  {...register("longTermGoals")}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <Label htmlFor="currentStateDescription">Current-state IT description</Label>
              <Textarea
                id="currentStateDescription"
                className="mt-1"
                rows={6}
                placeholder="Systems, infrastructure, known pain points, technical debt..."
                {...register("currentStateDescription")}
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3 text-sm">
              <ReviewRow label="Deal name" value={values.name} />
              <ReviewRow label="Type" value={DEAL_TYPE_LABELS[values.dealType]} />
              <ReviewRow label="Industry" value={values.industry} />
              <ReviewRow label="Acquirer" value={values.companies?.[0]?.name} />
              <ReviewRow label="Target" value={values.companies?.[1]?.name} />
              <ReviewRow label="IT org roles" value={String(values.itOrgNodes?.length ?? 0)} />
              <ReviewRow label="Deal thesis" value={values.dealThesis} />
              <p className="text-muted-foreground">
                Submitting will create the deal and populate all 6 categories / 42 IT integration
                items in your workspace.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={goNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating deal..." : "Create deal"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-40 shrink-0 text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}
