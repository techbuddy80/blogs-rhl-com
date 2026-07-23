// Shared, hand-authored types that aren't derived from Content Collections'
// generated schema output. Content-type shapes themselves come from
// `content-collections.ts` and are consumed via the generated
// `content-collections` module — not redefined here.

export interface NavItem {
  label: string;
  href: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  organization?: string;
}
