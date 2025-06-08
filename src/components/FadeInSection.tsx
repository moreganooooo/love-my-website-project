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
        "transition-all duration-700 ease-out transform",
        !isVisible && "opacity-0 translate-y-10",
        isVisible && "opacity-100 translate-y-0",
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export { FadeInSection };
