import { Palette, GitCompareArrows, Send, LayoutDashboard } from 'lucide-react';
import type { Skill } from '@/types';

export const skills: Skill[] = [
  {
    icon: GitCompareArrows,
    title: 'Lifecycle Marketing',
    description: 'Building customer journeys that convert and retain',
  },
  {
    icon: Send,
    title: 'Email Marketing',
    description: 'Messaging that resonates with every audience',
  },
  {
    icon: LayoutDashboard,
    title: 'CRM Optimization',
    description: 'Turning data into actionable insights and strategies',
  },
  {
    icon: Palette,
    title: 'Copywriting  & Design',
    description: 'Crafting compelling narratives and visuals',
  },
];
