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
      'Motherhood changes almost everything: your body, your routine, your relationships, even the way people speak to you. For many women, it also quietly changes their sense of self. The Identity pillar exists because we believe that rediscovering who you are is not a luxury, it is part of recovery. Through identity mentors, small groups, and one-to-one mentoring conversations, we create space for women to ask honest questions: Who am I now? What did I lose, and what can I reclaim? What parts of me were never actually lost, just buried under exhaustion and expectation?',
      'This is not therapy, and it is not a quick fix. It is companionship. Our identity mentors walk alongside women through gentle, structured conversations designed to help them name what they are feeling, separate their worth from their productivity, and begin to see themselves clearly again. Small groups create a rare kind of honesty: the relief of realising you are not the only woman who has looked in the mirror and not recognised herself.',
      'Whether you are newly postpartum or years into motherhood and only just now catching your breath, the Identity pillar is an invitation to come home to yourself. Not the mother the world expects you to be, but the whole person you already are.',
    ],
    highlights: ['One-to-one identity mentoring', 'Small group conversations', 'Journaling and self-reflection tools'],
  },
  {
    slug: 'purpose',
    name: 'Purpose',
    image: '/assets/images/value-purpose.jpg',
    mission: 'Help people rebuild their lives.',
    summary:
      'Practical support for mothers ready to take their next step: career and business mentoring, skills acquisition, and education or scholarship support.',
    paragraphs: [
      'For many mothers, rebuilding after a difficult postpartum season means more than emotional healing. It means rebuilding a life. Careers that were paused, businesses that stalled, education that was interrupted. The Purpose pillar exists to help women take real, practical steps forward, not just feel better in the abstract.',
      'Through career and business mentoring, we connect women with people who can help them re-enter the workforce, grow a small business, or pivot into something new. Our skills acquisition support focuses on equipping women with practical, marketable abilities they can use immediately, while our education and scholarship support helps connect mothers to opportunities to finish or further their studies where those doors have been closed by circumstance.',
      'Purpose is not about pretending the last season did not happen. It is about proving it does not have the final word. Every mentoring conversation, every skill learned, every opportunity unlocked is a small act of defiance against the idea that motherhood has to mean the end of your own becoming.',
    ],
    highlights: ['Career and business mentoring', 'Skills acquisition support', 'Education and scholarship support'],
  },
  {
    slug: 'healing',
    name: 'Healing',
    image: '/assets/images/value-empowerment.jpg',
    mission: 'Emotional, spiritual, and practical support for the whole person.',
    summary:
      'Emotional support, gentle and optional spiritual care, welfare assistance, and consistent follow-up for mothers who need more than a single conversation.',
    paragraphs: [
      'Healing rarely happens in a single conversation, which is why this pillar is built around consistency. Our emotional support work, including active listening, peer support, and support groups, gives women a safe, non-judgemental place to process what they are carrying, without fear of being told to "just be grateful" or "get over it."',
      'For women who want it, we also offer gentle, optional spiritual care: prayer, encouragement, and devotionals offered without pressure, honouring the faith that many of the women we serve draw strength from, while never making it a condition of support. Alongside this sits practical welfare support: hospital visitation, food distribution, emergency response, and care packages for families going through an especially hard season.',
      'What makes the Healing pillar distinct is what comes after the first point of contact: structured follow-up check-ins with the beneficiaries we support, so that no woman who reaches out to us is left wondering if anyone remembers she exists. Healing, to us, means staying. Not just showing up once.',
    ],
    highlights: ['Emotional support and peer groups', 'Optional spiritual care', 'Welfare support and care packages', 'Ongoing follow-up check-ins'],
  },
  {
    slug: 'community',
    name: 'Community',
    image: '/assets/images/value-community.jpg',
    mission: 'Building a village where no mother walks alone.',
    summary:
      'A warm, inclusive space where mothers find belonging, connection, and a tribe that understands, from prepartum through every season of motherhood.',
    paragraphs: [
      'Community is not a programme you attend once. It is the ongoing, living network of women who carry each other through the hardest parts of motherhood. We believe the most powerful thing a mother can hear is "me too" from another woman who truly understands, and we build the spaces where those conversations happen naturally.',
      'From our online WhatsApp and social media communities to in-person gatherings, our Community pillar creates access to connection regardless of geography, background, or season of life. Whether you are navigating the fog of the early prepartum months, processing a loss, or simply looking for women who get it, there is a place here for you.',
      'We also train and support community volunteers who choose to open their homes and hearts as hosts for local support circles, because every mother deserves a village, and sometimes that village needs to be built deliberately.',
    ],
    highlights: ['Online community spaces', 'In-person support circles', 'Prepartum and postpartum peer groups', 'Community volunteer network'],
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
    name: 'Partnerships and Fundraising Team',
    description: 'Sponsors, proposals, and donor relationships that fund the mission.',
  },
  {
    name: 'Finance Team',
    description: 'Donations, budgeting, and reporting to keep us accountable and sustainable.',
  },
  {
    name: 'Research and Impact Team',
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
  { name: 'Dr Shalom Mojere', photo: '/assets/team/team-01.jpg' },
  { name: 'Abiola Daniel Mojere', photo: '/assets/team/team-07.jpg' },
  { name: 'Dr Yetunde Oladipo', photo: '/assets/team/team-03.jpg' },
  { name: 'Chimeremeze Nwokenne', photo: '/assets/team/team-04.jpg' },
  { name: 'Bolude Omolola', photo: '/assets/team/team-05.jpg' },
  { name: 'Tomiwa Dada', photo: '/assets/team/team-06.jpg' },
  { name: 'Eyitayo Ojo', photo: '/assets/team/team-02.jpg' },
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
  whatsapp: 'https://wa.me/447459837086',
};

export const contactInfo = {
  email: 'purposeinpain1@gmail.com',
  phone: '+44 7459 837086',
  whatsapp: '+44 7459 837086',
};

export const instagramReels = [
  {
    url: 'https://www.instagram.com/reel/DSSIfIqjRPI/',
    thumbnail: '/assets/images/reel-1.jpg',
    topic: 'What postpartum recovery actually asks of your body',
    description:
      'Postpartum is a season where a woman\'s body is wounded, stretched, and depleted, then asked to rebuild itself from the inside out. On organ shifting, hormonal change, sleep disruption, and why we need to normalise talking about it.',
  },
  {
    url: 'https://www.instagram.com/reel/DScbuU-jQJ4/',
    thumbnail: '/assets/images/reel-2.jpg',
    topic: 'Postpartum is not six weeks. It is a season.',
    description:
      'Challenging the six-week recovery timeline. Healing varies by individual and can take a year or longer. Continued fatigue does not mean weakness, and still healing does not mean falling behind.',
  },
  {
    url: 'https://www.instagram.com/reel/DS7OWeGjF0Q/',
    thumbnail: '/assets/images/reel-3.jpg',
    topic: 'Feelings you should never ignore during postpartum',
    description:
      'Certain postpartum feelings warrant immediate attention. Self-sufficiency should not come at the cost of your mental health. If you are experiencing any of these, please do not brush them off.',
  },
  {
    url: 'https://www.instagram.com/reel/DTQT6--DXsr/',
    thumbnail: '/assets/images/reel-4.jpg',
    topic: 'Postpartum is not deliver and disappear.',
    description:
      'Who to call and when: 999/A&E for emergencies (heavy bleeding, chest pain, breathing difficulty, fainting, severe headaches with vision changes), NHS 111 when unsure, or your maternity triage unit for urgent postnatal concerns.',
  },
  {
    url: 'https://www.instagram.com/reel/DTklG1tDaZH/',
    thumbnail: '/assets/images/reel-5.jpg',
    topic: 'Breastfeeding starts with planning, not delivery',
    description:
      'Common breastfeeding mistakes to avoid and what to prepare for before delivery. Practical insights for expectant and first-time mothers to reduce postpartum overwhelm.',
  },
];

export type Book = {
  title: string;
  author: string;
  cover: string;
  description: string;
  slug: string;
};

export const recommendedBooks: Book[] = [
  {
    slug: 'finding-purpose',
    title: 'Finding Purpose',
    author: 'Dr Shalom Oluwabusayo Mojere',
    cover: '/assets/images/finding-purpose-ebook.jpg',
    description: 'A 7-day step-by-step guide to discovering purpose in pain.',
  },
];

// Event IDs that have already been held but whose database date is still in the
// future (e.g. the date was a placeholder). Listing an ID here moves it to the
// Past Events section and removes it from the countdown bar.
export const PAST_EVENT_IDS = new Set([
  '693cd0f8-2c1a-4a33-a2f0-859ec11f8fd7', // Beyond Birth: Mental Health, Identity & Wellness for Mothers
]);

export type Brand = {
  name: string;
  logo: string;
};

export const partnerBrands: Brand[] = [
  { name: 'Our Partners and Collaborators', logo: '/assets/images/collaborators.png' },
  { name: 'The Gap We Are Bridging', logo: '/assets/images/gap-we-are-bridging.png' },
];
