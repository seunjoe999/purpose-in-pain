import { useEffect, useState } from 'react';
import { apiGet } from './api';
import {
  teamMembers as defaultTeam,
  programs as defaultPrograms,
  partnerBrands as defaultBrands,
  contactInfo as defaultContact,
  socialLinks as defaultSocial,
  type Program,
  type Brand,
} from './content';

type TeamMember = { name: string; photo: string };
type ContactInfo = { email: string; phone: string; whatsapp: string };
type SocialLinks = { instagram: string; tiktok: string; youtube: string; linktree: string; community: string; whatsapp: string };

export type SiteContent = {
  team: TeamMember[];
  programs: Program[];
  brands: Brand[];
  contact: ContactInfo;
  social: SocialLinks;
};

const defaults: SiteContent = {
  team: defaultTeam,
  programs: defaultPrograms,
  brands: defaultBrands,
  contact: defaultContact,
  social: defaultSocial,
};

export function useSiteContent(): SiteContent {
  const [overrides, setOverrides] = useState<Partial<SiteContent>>({});

  useEffect(() => {
    apiGet('/settings')
      .then((data: Record<string, any>) => {
        const merged: Partial<SiteContent> = {};
        if (data.team) merged.team = data.team;
        if (data.programs) merged.programs = data.programs;
        if (data.brands) merged.brands = data.brands;
        if (data.contact) merged.contact = data.contact;
        if (data.social) merged.social = data.social;
        setOverrides(merged);
      })
      .catch(() => {});
  }, []);

  return { ...defaults, ...overrides };
}
