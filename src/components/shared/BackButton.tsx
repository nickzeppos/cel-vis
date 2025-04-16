import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

export function BackButton({ onClick, children = "Back" }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "mb-4 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700",
        "transition-colors duration-200"
      )}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
}
