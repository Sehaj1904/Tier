export type MembershipLevel = "free" | "silver" | "gold" | "platinum"

const membershipHierarchy: Record<MembershipLevel, MembershipLevel[]> = {
  free: ["free"],
  silver: ["free", "silver"],
  gold: ["free", "silver", "gold"],
  platinum: ["free", "silver", "gold", "platinum"],
}

export const membershipBadgeStyles: Record<MembershipLevel, string> = {
  free: "bg-gray-100 text-gray-800 border-gray-200",
  silver: "bg-slate-100 text-slate-800 border-slate-200",
  gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
  platinum: "bg-purple-100 text-purple-800 border-purple-200",
}

export const membershipGradients: Record<MembershipLevel, string> = {
  free: "from-gray-400 to-gray-600",
  silver: "from-slate-400 to-slate-600",
  gold: "from-yellow-400 to-yellow-600",
  platinum: "from-purple-400 to-purple-600",
}

export const membershipDisplayNames: Record<MembershipLevel, string> = {
  free: "Free",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
}

export const membershipBenefits: Record<MembershipLevel, string> = {
  free: "Access to community events and basic workshops",
  silver: "Advanced training sessions and networking events",
  gold: "VIP masterclasses and exclusive conferences",
  platinum: "Ultra-exclusive galas and executive roundtables",
}

export function getMembershipAccess(currentLevel: MembershipLevel): MembershipLevel[] {
  return membershipHierarchy[currentLevel] || ["free"]
}

export function canUserAccessEvent(userLevel: MembershipLevel, eventLevel: MembershipLevel): boolean {
  return getMembershipAccess(userLevel).includes(eventLevel)
}

export function getMembershipRank(level: MembershipLevel): number {
  const rankingSystem = { free: 0, silver: 1, gold: 2, platinum: 3 }
  return rankingSystem[level] || 0
}
