import { Info, Lightbulb, TriangleAlert, OctagonAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "tip" | "warning" | "danger";

const STYLES: Record<
  CalloutType,
  { icon: typeof Info; border: string; bg: string; iconColor: string }
> = {
  info: { icon: Info, border: "border-sky-500/40", bg: "bg-sky-500/10", iconColor: "text-sky-400" },
  tip: { icon: Lightbulb, border: "border-emerald-500/40", bg: "bg-emerald-500/10", iconColor: "text-emerald-400" },
  warning: { icon: TriangleAlert, border: "border-amber-500/40", bg: "bg-amber-500/10", iconColor: "text-amber-400" },
  danger: { icon: OctagonAlert, border: "border-rose-500/40", bg: "bg-rose-500/10", iconColor: "text-rose-400" },
};

export function Callout({
  type = "info",
  children,
}: {
  type?: CalloutType;
  children: ReactNode;
}) {
  const { icon: Icon, border, bg, iconColor } = STYLES[type];
  return (
    <div className={cn("my-6 flex gap-3 rounded-xl border p-4", border, bg)}>
      <Icon className={cn("mt-1 h-5 w-5 shrink-0", iconColor)} />
      <div className="callout-body min-w-0 [&>*:first-child]:mt-0 [&>*]:my-2">{children}</div>
    </div>
  );
}
