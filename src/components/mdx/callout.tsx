import { InfoIcon, TriangleAlertIcon } from "lucide-react";
import { cn } from "cn";

const icons = {
  note: InfoIcon,
  warning: TriangleAlertIcon,
};

export function Callout({
  type = "note",
  children,
}: {
  type?: keyof typeof icons;
  children: React.ReactNode;
}) {
  const Icon = icons[type];

  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3",
        "[&>div>:first-child]:mt-0 [&>div>:last-child]:mb-0",
      )}
    >
      <Icon className="mt-1 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
