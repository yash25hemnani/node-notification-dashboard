import { Box } from "@/components/ui/box";

export const SideRow = ({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <Box className="flex justify-between items-baseline gap-2">
    <span className="text-[12px] text-muted-foreground shrink-0">{label}</span>
    <span
      className={`text-[12px] text-foreground font-medium text-right break-all ${valueClassName}`}
    >
      {value}
    </span>
  </Box>
);