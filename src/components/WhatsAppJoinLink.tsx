import { MessageCircle } from 'lucide-react';
import { org } from '../data/site';

type Props = {
  className?: string;
  icon?: boolean;
  iconOnly?: boolean;
  label?: string;
  'aria-label'?: string;
};

export function WhatsAppJoinLink({
  className,
  icon = true,
  iconOnly = false,
  label = 'Join WhatsApp group',
  'aria-label': ariaLabel,
}: Props) {
  const showIcon = iconOnly || icon;
  return (
    <a
      href={org.whatsappGroup}
      target="_blank"
      rel="noopener noreferrer"
      className={['whatsappJoin', iconOnly ? 'whatsappJoinIcon' : '', className]
        .filter(Boolean)
        .join(' ')}
      aria-label={iconOnly ? ariaLabel ?? 'Join our WhatsApp group' : ariaLabel}
    >
      {showIcon ? <MessageCircle size={iconOnly ? 20 : 16} aria-hidden="true" /> : null}
      {iconOnly ? <span className="visuallyHidden">{label}</span> : <span>{label}</span>}
    </a>
  );
}
