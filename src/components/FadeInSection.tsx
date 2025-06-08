import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type FadeInSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const FadeInSection = ({ children, className, delay = 0 }: FadeInSectionProps) => {
  const { ref, isVisible } = useInView();

  return (
    <div
      ref={ref}
      className={cn(
        "opacity-0 animate-fill-forwards",
        isVisible && "animate-fade-up",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export { FadeInSection };
