import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import styles from './FadeInSection.module.css';

type FadeInSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const FadeInSection = ({ children, className, delay = 0 }: FadeInSectionProps) => {
  const { ref, isVisible } = useInView(0.25);

  // Generate a delay class name based on the delay prop
  const delayClass = styles[`fadeInDelay${delay}`] || '';

  return (
    <div
      ref={ref}
      className={cn(
        styles.fadeInSection,
        isVisible && styles.fadeInSectionVisible,
        delayClass,
        className,
      )}
    >
      {children}
    </div>
  );
};

export { FadeInSection };
