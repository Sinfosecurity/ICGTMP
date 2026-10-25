import type { MembershipCategory } from '../data/site';
import { councilOptions, type LgaName } from '../data/locations';
import {
  LIMITS,
  checkOptionalEmail,
  checkFullName,
  checkLength,
  checkPhone,
} from './validation';

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

export type MembershipField = keyof MembershipDraft;

export type FieldErrors = Partial<Record<MembershipField, string>>;

/** Visual order, so the first reported error is the first one on screen. */
export const MEMBERSHIP_FIELD_ORDER: MembershipField[] = [
  'fullName',
  'phone',
  'email',
  'lga',
  'lcda',
  'ward',
  'profession',
  'marketAssociation',
  'category',
  'volunteerInterest',
];

export const MEMBERSHIP_REQUIRED: MembershipField[] = [
  'fullName',
  'phone',
  'lga',
  'lcda',
  'category',
];

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

/**
 * One field's rule, so blur-time and submit-time validation can never disagree.
 * Mirrors apps-script/Code.gs, which has the final say.
 */
export function validateField(
  field: MembershipField,
  draft: MembershipDraft,
): string | undefined {
  switch (field) {
    case 'fullName':
      return checkFullName(draft.fullName);
    case 'phone':
      return checkPhone(draft.phone);
    case 'email':
      return checkOptionalEmail(draft.email);
    case 'lga':
      return draft.lga ? undefined : 'Select your LGA.';
    case 'lcda':
      if (!draft.lcda) return 'Select your LCDA or LG.';
      if (draft.lga && !councilOptions[draft.lga].includes(draft.lcda)) {
        return 'That LCDA or LG is not in the selected LGA.';
      }
      return undefined;
    case 'category':
      return draft.category ? undefined : 'Select a membership category.';
    case 'volunteerInterest':
      if (draft.category === 'Volunteer' && draft.volunteerInterest.trim().length < 4) {
        return 'Tell us how you would like to volunteer.';
      }
      return checkLength(draft.volunteerInterest, LIMITS.volunteerInterest);
    case 'ward':
      return checkLength(draft.ward, LIMITS.ward);
    case 'profession':
      return checkLength(draft.profession, LIMITS.profession);
    case 'marketAssociation':
      return checkLength(draft.marketAssociation, LIMITS.marketAssociation);
    default:
      return undefined;
  }
}

export function validateMembership(draft: MembershipDraft): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of MEMBERSHIP_FIELD_ORDER) {
    const error = validateField(field, draft);
    if (error) errors[field] = error;
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
  try {
    localStorage.setItem(MEMBERSHIP_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Private browsing and full quotas must not break typing.
  }
}

export function clearMembershipDraft(): void {
  try {
    localStorage.removeItem(MEMBERSHIP_DRAFT_KEY);
  } catch {
    // Nothing to recover from; the draft is a convenience.
  }
}
