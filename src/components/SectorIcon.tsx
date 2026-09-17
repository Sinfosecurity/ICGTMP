import { HeartHandshake, Store, Users, Wrench } from 'lucide-react';

const map = {
  store: Store,
  wrench: Wrench,
  users: Users,
  heart: HeartHandshake,
};

type Props = {
  name: keyof typeof map;
};

export function SectorIcon({ name }: Props) {
  const Icon = map[name];
  return <Icon size={22} strokeWidth={1.75} aria-hidden="true" />;
}
