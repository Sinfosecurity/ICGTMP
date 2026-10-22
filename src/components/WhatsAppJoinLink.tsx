import { MessageCircle } from 'lucide-react';
import { org } from '../data/site';

type Props = {
  className?: string;
  icon?: boolean;
  label?: string;
};

export function WhatsAppJoinLink({
  className,
  icon = true,
  label = 'Join WhatsApp group',
}: Props) {
  return (
    <a
      href={org.whatsappGroup}
      target="_blank"
      rel="noopener noreferrer"
      className={['whatsappJoin', className].filter(Boolean).join(' ')}
    >
      {icon ? <MessageCircle size={16} aria-hidden="true" /> : null}
      {label === 'Join WhatsApp group' ? (
        <>
          Join WhatsApp<span className="waExtra"> group</span>
        </>
      ) : (
        label
      )}
    </a>
  );
}
