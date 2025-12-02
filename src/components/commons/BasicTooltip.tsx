import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface IBasicTooltipProps {
  children: React.ReactNode;
  content?: string;
}

export default function BasicTooltip({ children, content }: IBasicTooltipProps) {
  if (!content) return <>{children}</>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>

      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
