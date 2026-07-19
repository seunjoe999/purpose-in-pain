export type Program = {
  slug: string;
  name: string;
  mission: string;
  summary: string;
  paragraphs: string[];
  highlights: string[];
  image: string;
};

export const programs: Program[] = [
  {
    slug: 'identity',
    name: 'Identity',
    image: '/assets/images/value-identity-merch.jpg',
    mission: 'Help people rediscover who they are beyond their pain.',
    summary:
      'Guided mentoring conversations and small groups that help mothers reconnect with themselves after loss, transition, or the disorientation of new motherhood.',
    paragraphs: [
      'Motherhood changes almost everything — your body, your routine, your relationships, even the way people speak to you. For many women, it also quietly changes their sense of self. The Identity pillar exists because we believe that rediscovering who you are is not a luxury, it is part of recovery. Through identity mentors, small groups, and one-to-one mentoring conversations, we create space for women to ask honest questions: Who am I now? What did I lose, and what can I reclaim? What parts of me were never actually lost, just buried under exhaustion and expectation?',
      'This is not therapy, and it is not a quick fix — it is companionship. Our identity mentors walk alongside women through gentle, structured conversations designed to help them name what they are feeling, separate their worth from their productivity, and begin to see themselves clearly again. Small groups create a rare kind of honesty: the relief of realising you are not the only woman who has looked in the mirror and not recognised herself.',
      'Whether you are newly postpartum or years into motherhood and only just now catching your breath, the Identity pillar is an invitation to come home to yourself — not the mother the world expects you to be, but the whole person you already are.',
    ],
    highlights: ['One-to-one identity mentoring', 'Small group conversations', 'Journaling & self-reflection tools'],
  },
  {
    slug: 'purpose',
    name: 'Purpose',
    image: '/assets/images/value-purpose.jpg',
    mission: 'Help people rebuild their lives.',
    summary:
      'Practical support for mothers ready to take their next step — career and business mentoring, skills acquisition, and education or scholarship support.',
    paragraphs: [
      'For many mothers, rebuilding after a difficult postpartum season means more than emotional healing — it means rebuilding a life. Careers that were paused, businesses that stalled, education that was interrupted. The Purpose pillar exists to help women take real, practical steps forward, not just feel better in the abstract.',
      'Through career and business mentoring, we connect women with people who can help them re-enter the workforce, grow a small business, or pivot into something new. Our skills acquisition support focuses on equipping women with practical, marketable abilities they can use immediately, while our education and scholarship support helps connect mothers to opportunities to finish or further their studies where those doors have been closed by circumstance.',
      'Purpose is not about pretending the last season did not happen — it is about proving it does not have the final word. Every mentoring conversation, every skill learned, every opportunity unlocked is a small act of defiance against the idea that motherhood has to mean the end of your own becoming.',
    ],
    highlights: ['Career & business mentoring', 'Skills acquisition support', 'Education & scholarship support'],
  },
  {
    slug: 'healing',
    name: 'Healing',
    image: '/assets/images/value-community.jpg',
    mission: 'Emotional, spiritual, and practical support for the whole person.',
    summary:
      'Emotional support, gentle and optional spiritual care, welfare assistance, and consistent follow-up for mothers who need more than a single conversation.',
    paragraphs: [
      'Healing rarely happens in a single conversation, which is why this pillar is built around consistency. Our emotional support work — active listening, peer support, and support groups — gives women a safe, non-judgemental place to process what they are carrying, without fear of being told to "just be grateful" or "get over it."',
      'For women who want it, we also offer gentle, optional spiritual care — prayer, encouragement, and devotionals offered without pressure, honouring the faith that many of the women we serve draw strength from, while never making it a condition of support. Alongside this sits practical welfare support: hospital visitation, food distribution, emergency response, and care packages for families going through an especially hard season.',
      'What makes the Healing pillar distinct is what comes after the first point of contact: structured follow-up check-ins with the beneficiaries we support, so that no woman who reaches out to us is left wondering if anyone remembers she exists. Healing, to us, means staying — not just showing up once.',
    ],
    highlights: ['Emotional support & peer groups', 'Optional spiritual care', 'Welfare support & care packages', 'Ongoing follow-up check-ins'],
  },
  {
    slug: 'womens-reproductive-and-mental-health',
    name: "Women's Reproductive & Mental Health",
    image: '/assets/images/beyond-birth-flyer.png',
    mission: 'Education, maternal support, and mental health advocacy for women across every stage.',
    summary:
      'Maternal support through pregnancy, birth and postpartum recovery, alongside reproductive health education and coordinated referrals to professional mental health care.',
    paragraphs: [
      'Postpartum care so often focuses almost entirely on the baby that the mother\'s own physical and mental health is treated as an afterthought. This pillar puts the woman back at the centre. Our maternal support covers pregnancy, the transition into new motherhood, breastfeeding challenges, and recovery after a C-section — practical, judgement-free support through some of the most physically demanding seasons of a woman\'s life.',
      'Alongside this, our women\'s health education work covers reproductive health, menstrual health, fertility, birth, and postpartum recovery in plain, accessible language — because so many women tell us they were never taught these things properly in the first place, and had to learn through trial, error, and silence.',
      'Finally, our mental health support arm focuses on advocacy, wellness facilitation, support groups, and — critically — referral coordination to qualified professional help when a woman needs more than peer support can offer. We are not a substitute for clinical care; we are often the bridge that helps a woman recognise she needs it, and get there with someone beside her.',
    ],
    highlights: ['Pregnancy, birth & C-section recovery support', 'Reproductive & menstrual health education', 'Mental health advocacy & referral coordination'],
  },
];

export const volunteerTeams = [
  {
    name: 'Identity Team',
    description: 'Mentors, coaches, and small group leaders walking alongside women rediscovering who they are.',
  },
  {
    name: 'Purpose Team',
    description: 'Career and business mentors, skills and scholarship coordinators helping women rebuild.',
  },
  {
    name: 'Healing Team',
    description: 'Emotional Support, Spiritual Care, Welfare, and Follow-up units caring for the whole person.',
  },
  {
    name: "Women's Health Team",
    description: 'Maternal support, health educators, and mental health advocates.',
  },
  {
    name: 'Operations Team',
    description: 'Volunteer and project coordination, admin, and scheduling that keeps everything running.',
  },
  {
    name: 'Media Team',
    description: 'Graphic designers, photographers, videographers, editors, social media and content writers.',
  },
  {
    name: 'Outreach Team',
    description: 'Community visits, events, and beneficiary engagement on the ground.',
  },
  {
    name: 'Partnerships & Fundraising Team',
    description: 'Sponsors, proposals, and donor relationships that fund the mission.',
  },
  {
    name: 'Finance Team',
    description: 'Donations, budgeting, and reporting to keep us accountable and sustainable.',
  },
  {
    name: 'Research & Impact Team',
    description: 'Surveys, impact stories, and annual reports that show what our work is achieving.',
  },
  {
    name: 'Prayer Team',
    description: 'A dedicated department covering the organisation and its beneficiaries in prayer.',
  },
  {
    name: 'Volunteer Care Team',
    description: 'Appreciation, training, and burnout prevention for the volunteers who give their time.',
  },
];

export const teamMembers = [
  { name: 'Pharm Abiola Daniel Mojere', photo: '/assets/team/team-01.jpg' },
  { name: 'Dr Mojere Shalom', photo: '/assets/team/team-02.jpg' },
  { name: 'Tomiwa Dada', photo: '/assets/team/team-03.jpg' },
  { name: 'Chimeremeze Nwokenne', photo: '/assets/team/team-04.jpg' },
  { name: 'Bolude Omolola', photo: '/assets/team/team-05.jpg' },
  { name: 'Yetunde Ladipo', photo: '/assets/team/team-06.jpg' },
  { name: 'Eyitayo Ojo', photo: '/assets/team/team-07.jpg' },
  { name: 'Adewunmi Oluwasegun', photo: '/assets/team/team-08.jpg' },
];

export const donationThankYouNote =
  'Thank you for sowing into hope. Because of your generosity, a widow will breathe a little easier, a child will move closer to their dreams, and a woman carrying silent pain will be reminded that she is not forgotten. Thank you for choosing to be part of someone\'s healing story. May God richly bless you.';

export const socialLinks = {
  instagram: 'https://www.instagram.com/purposeinpaininitiativecic',
  tiktok: 'https://www.tiktok.com/@pipwomenshealthhub',
  youtube: 'https://www.youtube.com/@PurposeinPainInitiativeCIC',
  linktree: 'https://linktr.ee/purposeinpain1',
  community: 'https://bit.ly/JOINOURCOMMUNITYHERE',
};

export const contactInfo = {
  email: 'purposeinpain1@gmail.com',
  phone: '+44 7459 837086',
};

// Real Instagram reels shared by the team — no local copy of the video
// exists, so these link out to Instagram rather than being embedded.
export const instagramReels = [
  'https://www.instagram.com/reel/DSSIfIqjRPI/',
  'https://www.instagram.com/reel/DScbuU-jQJ4/',
  'https://www.instagram.com/reel/DS7OWeGjF0Q/',
  'https://www.instagram.com/reel/DTQT6--DXsr/',
  'https://www.instagram.com/reel/DTklG1tDaZH/',
];
