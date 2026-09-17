import type { MembershipCategory } from '../data/content';
import type { LgaName } from '../data/locations';
import type { FormResult } from './form';
import { submitMembership } from './formTransport';

export const MEMBERSHIP_DRAFT_KEY = 'icgtmp.membershipDraft';

export type MembershipDraft = {
  fullName: string;
  phone: string;
  email: string;
  lga: LgaName | '';
  lcda: string;
  ward: string;
  profession: string;
  marketAssociation: string;
  category: MembershipCategory | '';
  volunteerInterest: string;
};

export const emptyMembershipDraft = (): MembershipDraft => ({
  fullName: '',
  phone: '',
  email: '',
  lga: '',
  lcda: '',
  ward: '',
  profession: '',
  marketAssociation: '',
  category: '',
  volunteerInterest: '',
});

export type FieldErrors = Partial<Record<keyof MembershipDraft, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^(\+?234|0)[0-9]{10}$/;

export function validateMembership(draft: MembershipDraft): FieldErrors {
  const errors: FieldErrors = {};

  if (!draft.fullName.trim() || draft.fullName.trim().length < 3) {
    errors.fullName = 'Enter your full name.';
  }
  const phone = draft.phone.replace(/[\s-]/g, '');
  if (!phonePattern.test(phone)) {
    errors.phone = 'Enter a valid Nigerian phone number.';
  }
  if (!emailPattern.test(draft.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!draft.lga) errors.lga = 'Select your LGA.';
  if (!draft.lcda) errors.lcda = 'Select your LCDA.';
  if (!draft.category) errors.category = 'Select a membership category.';
  if (draft.category === 'Volunteer' && draft.volunteerInterest.trim().length < 4) {
    errors.volunteerInterest = 'Tell us how you would like to volunteer.';
  }

  return errors;
}

export function loadMembershipDraft(): MembershipDraft {
  try {
    const raw = localStorage.getItem(MEMBERSHIP_DRAFT_KEY);
    if (!raw) return emptyMembershipDraft();
    const parsed = JSON.parse(raw) as Partial<MembershipDraft>;
    return {
      ...emptyMembershipDraft(),
      fullName: parsed.fullName ?? '',
      phone: parsed.phone ?? '',
      email: parsed.email ?? '',
      lga: parsed.lga ?? '',
      lcda: parsed.lcda ?? '',
      ward: parsed.ward ?? '',
      profession: parsed.profession ?? '',
      marketAssociation: parsed.marketAssociation ?? '',
      category: parsed.category ?? '',
      volunteerInterest: parsed.volunteerInterest ?? '',
    };
  } catch {
    return emptyMembershipDraft();
  }
}

export function saveMembershipDraft(draft: MembershipDraft): void {
  localStorage.setItem(MEMBERSHIP_DRAFT_KEY, JSON.stringify(draft));
}

export function clearMembershipDraft(): void {
  localStorage.removeItem(MEMBERSHIP_DRAFT_KEY);
}

export async function submitMembershipDraft(
  draft: MembershipDraft,
  honeypot = '',
): Promise<FormResult> {
  const result = await submitMembership({
    fullName: draft.fullName,
    phone: draft.phone,
    email: draft.email,
    lga: draft.lga,
    lcda: draft.lcda,
    ward: draft.ward,
    profession: draft.profession,
    marketAssociation: draft.marketAssociation,
    category: draft.category,
    volunteerInterest: draft.volunteerInterest,
    website: honeypot,
    source: 'website',
  });

  if (result.ok) return { status: 'sent' };
  if (result.emailPendingConfirm) return { status: 'pending-confirm' };
  return { status: 'failed', message: result.error ?? 'The form service could not accept this submission.' };
}
