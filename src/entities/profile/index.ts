export type VisibleButtonType = 'connect' | 'message' | 'follow' | 'pending' | 'more' | 'unknown';
export type ProfileReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  searchId: string;
  name: string;
  title?: string | null;
  company?: string | null;
  location?: string | null;
  profileUrl: string;
  photoUrl?: string | null;
  visibleButtonType?: VisibleButtonType | null;
  score?: number | null;
  badge?: string | null;
  reviewStatus?: ProfileReviewStatus;
  favorite?: boolean;
  note?: string | null;
  createdAt: string;
}

export type VisibleProfileInfo = Pick<
  Profile,
  'name' | 'title' | 'company' | 'location' | 'profileUrl' | 'photoUrl' | 'visibleButtonType'
>;

export interface ProfileScoringCriteria {
  keywords?: string[];
  titles?: string[];
  locations?: string[];
  companies?: string[];
}
