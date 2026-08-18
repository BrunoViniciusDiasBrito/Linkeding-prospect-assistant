import type { Profile, ProfileReviewStatus, ProfileScoringCriteria, VisibleButtonType, VisibleProfileInfo } from '../../entities/profile';

const REVIEW_KEY = 'linkedin-prospect-assistant:review-queue';
const BUTTON_LABELS: Record<VisibleButtonType, string[]> = {
  connect: ['conectar', 'connect'],
  message: ['mensagem', 'message'],
  follow: ['seguir', 'follow'],
  pending: ['pendente', 'pending'],
  more: ['mais', 'more'],
  unknown: [],
};

const normalize = (value?: string | null) => value?.toLocaleLowerCase().trim() ?? '';
const includesAny = (value: string, terms: string[] = []) => terms.some((term) => value.includes(normalize(term)));

export function extractVisibleProfileInfo(root: ParentNode = document): VisibleProfileInfo {
  const text = (selector: string) => root.querySelector<HTMLElement>(selector)?.innerText.trim() || null;
  const profileUrl = root.querySelector<HTMLAnchorElement>('a[href*="/in/"]')?.href ?? location.href;
  const buttonText = Array.from(root.querySelectorAll<HTMLButtonElement>('button')).map((button) => normalize(button.innerText));
  const visibleButtonType = (Object.entries(BUTTON_LABELS).find(([, labels]) => labels.some((label) => buttonText.includes(label)))?.[0] ?? 'unknown') as VisibleButtonType;

  return {
    name: text('[data-profile-name], h1') ?? '',
    title: text('[data-profile-title], .text-body-medium'),
    company: text('[data-profile-company], [aria-label*="empresa"], [aria-label*="company"]'),
    location: text('[data-profile-location], .text-body-small.inline'),
    profileUrl,
    photoUrl: root.querySelector<HTMLImageElement>('img[data-profile-photo], img.pv-top-card-profile-picture__image')?.src ?? null,
    visibleButtonType,
  };
}

export function scoreProfile(profile: VisibleProfileInfo | Profile, criteria: ProfileScoringCriteria): number {
  let score = 0;
  const haystack = normalize([profile.name, profile.title, profile.company, profile.location].filter(Boolean).join(' '));
  const add = (condition: boolean, points: number) => { if (condition) score += points; };
  add(includesAny(haystack, criteria.keywords), 25);
  add(includesAny(normalize(profile.title), criteria.titles), 30);
  add(includesAny(normalize(profile.location), criteria.locations), 20);
  add(includesAny(normalize(profile.company), criteria.companies), 25);
  return Math.max(0, Math.min(100, score));
}

export interface ReviewAction { type: 'approve' | 'reject' | 'favorite' | 'note'; note?: string }
export type ReviewableProfile = Profile & { reviewStatus: ProfileReviewStatus; favorite: boolean; note?: string | null };

const readQueue = (): ReviewableProfile[] => JSON.parse(localStorage.getItem(REVIEW_KEY) ?? '[]') as ReviewableProfile[];
const writeQueue = (queue: ReviewableProfile[]) => localStorage.setItem(REVIEW_KEY, JSON.stringify(queue));

export function enqueueForReview(profile: Profile): ReviewableProfile {
  const reviewable: ReviewableProfile = { ...profile, reviewStatus: profile.reviewStatus ?? 'pending', favorite: profile.favorite ?? false, note: profile.note ?? null };
  writeQueue([reviewable, ...readQueue().filter((item) => item.id !== profile.id)]);
  return reviewable;
}

export function listReviewQueue(status?: ProfileReviewStatus): ReviewableProfile[] {
  const queue = readQueue();
  return status ? queue.filter((profile) => profile.reviewStatus === status) : queue;
}

export function applyReviewAction(profileId: string, action: ReviewAction): ReviewableProfile {
  const queue = readQueue();
  const profile = queue.find((item) => item.id === profileId);
  if (!profile) throw new Error('Perfil não encontrado na fila de revisão.');
  const updated: ReviewableProfile = {
    ...profile,
    reviewStatus: action.type === 'approve' ? 'approved' : action.type === 'reject' ? 'rejected' : profile.reviewStatus,
    favorite: action.type === 'favorite' ? !profile.favorite : profile.favorite,
    note: action.type === 'note' ? action.note ?? '' : profile.note,
  };
  writeQueue(queue.map((item) => (item.id === profileId ? updated : item)));
  return updated;
}
