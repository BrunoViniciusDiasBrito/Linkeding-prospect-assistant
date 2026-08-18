import type { Profile } from '../../entities/profile';

export interface ReportDashboardMetrics {
  analyzedProfiles: number; approved: number; rejected: number; averageScore: number;
  byLocation: Record<string, number>; byTitle: Record<string, number>;
}
const countBy = (profiles: Profile[], key: 'location' | 'title') => profiles.reduce<Record<string, number>>((acc, profile) => {
  const value = profile[key] || 'Não informado'; acc[value] = (acc[value] ?? 0) + 1; return acc;
}, {});
export function buildReportDashboard(profiles: Profile[]): ReportDashboardMetrics {
  const scores = profiles.map((p) => p.score).filter((s): s is number => typeof s === 'number');
  return { analyzedProfiles: profiles.length, approved: profiles.filter((p) => p.reviewStatus === 'approved').length, rejected: profiles.filter((p) => p.reviewStatus === 'rejected').length, averageScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0, byLocation: countBy(profiles, 'location'), byTitle: countBy(profiles, 'title') };
}
