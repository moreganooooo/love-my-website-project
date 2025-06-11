import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import styles from './FadeInSection.module.css';

type FadeInSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
};

const FadeInSection = ({
  children,
  className,
  delay = 0,
  threshold = 0.15,
  rootMargin = '50px',
}: FadeInSectionProps) => {
  const { ref, isVisible } = useInView(threshold, rootMargin);

  const delayClass = styles[`fadeInDelay${delay}` as keyof typeof styles];

  return (
    <div
      ref={ref}
      className={cn(
        styles.fadeInSection,
        isVisible ? styles.fadeInSectionVisible : styles.fadeInSectionHidden,
        delayClass,
        className,
      )}
    >
      {children}
    </div>
  );
};

export { FadeInSection };
