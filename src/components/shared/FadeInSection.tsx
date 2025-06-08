import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type FadeInSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  repeat?: boolean;
};

const FadeInSection = ({
  children,
  className,
  delay = 0,
  repeat = false,
}: FadeInSectionProps) => {
  const { ref, isVisible } = useInView({ threshold: 0.25, triggerOnce: !repeat });

  return (
    <div
      ref={ref}
      className={cn(
        "opacity-0",
        isVisible && "animate-fade-up",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards",
      }}
    >
      {children}
    </div>
  );
};

export { FadeInSection };
