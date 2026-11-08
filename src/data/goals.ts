export type GoalIcon = 'users' | 'id' | 'chart' | 'shield' | 'network';

export type Goal = {
  id: string;
  icon: GoalIcon;
  title: string;
  detail: string;
  figure?: string;
  source?: string;
};

export const goals: Goal[] = [
  {
    id: 'reach',
    icon: 'users',
    figure: '3M',
    title: 'Mobilization Target',
    detail: 'Stated reach goal across Lagos East — not an independently verified count',
  },
  {
    id: 'pvc',
    icon: 'id',
    title: 'PVC Engagement',
    detail: 'Registration, collection and voter education',
  },
  {
    id: 'communities',
    icon: 'chart',
    title: 'Stronger Communities',
    detail: 'Jobs, skills, welfare and economic opportunities',
  },
  {
    id: 'network',
    icon: 'shield',
    title: 'Credible Grassroots Network',
    detail: 'Well-structured and data-driven',
  },
  {
    id: 'inclusive',
    icon: 'network',
    title: 'Inclusive Participation',
    detail: 'Across all 5 LGAs in Lagos East',
  },
];
