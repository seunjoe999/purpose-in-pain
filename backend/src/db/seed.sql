-- Illustrative seed data for Purpose In Pain Initiative CIC
-- NOTE: The events below are PLACEHOLDER/illustrative only — replace with real
-- dates and details via the admin dashboard before going live.

INSERT INTO events (title, description, location, event_date, image)
VALUES
  (
    'Beyond Birth: Mental Health, Identity & Wellness for Mothers',
    'Our flagship live session, hosted by Dr Shalom Mojere (Founder) with guest experts in maternal medicine and postpartum wellness, walking mothers through recognising early warning signs, identity restoration, and practical self-care tools. Times are shared in GMT / WAT / EST for our UK, Nigeria and US community. (Date below is an illustrative placeholder for the next live run — confirm via our social channels.)',
    'Zoom (Online)',
    now() + interval '30 days',
    '/assets/images/beyond-birth-flyer.png'
  ),
  (
    'Identity Circle — Small Group Conversation',
    'A gentle, guided small-group conversation for mothers rediscovering who they are beyond the pain of the postpartum season. Illustrative placeholder — confirm date with the Identity Team.',
    'Zoom (Online)',
    now() + interval '45 days',
    '/assets/images/value-identity-merch.jpg'
  ),
  (
    'Purpose Workshop: Rebuilding After Motherhood',
    'A practical workshop on career and business mentoring, skills acquisition, and next steps for mothers ready to rebuild. Illustrative placeholder date, to be confirmed.',
    'Zoom (Online)',
    now() + interval '60 days',
    '/assets/images/value-purpose.jpg'
  )
ON CONFLICT DO NOTHING;

INSERT INTO blog_posts (slug, title, excerpt, body, cover_image, author, published)
VALUES
  (
    'welcome-to-purpose-in-pain',
    'Welcome to Purpose In Pain Initiative CIC',
    'Turning pain into purpose, one mother at a time — an introduction to who we are and why we exist.',
    E'Postpartum care so often focuses on the baby, and rightly so — but the mother behind that baby matters too.\n\nMany women don''t recognise postpartum depression or anxiety early. Many feel ashamed to ask for help. Many lose their sense of self in the fog of new motherhood, overwhelmed by expectations they never signed up for.\n\nPurpose In Pain Initiative CIC exists to close that gap — through safe, accessible, culturally sensitive education; honest conversations about identity; early-intervention awareness; and practical, everyday tools for emotional recovery.\n\nThis blog is where we will share reflections, resources, and stories from our community across the UK, Nigeria and the US. Thank you for being here with us as we turn pain into purpose, together.',
    '/assets/images/mission-statement.png',
    'Purpose In Pain Initiative CIC',
    true
  ),
  (
    'you-are-not-alone-in-the-fourth-trimester',
    'You Are Not Alone in the Fourth Trimester',
    'A gentle reminder for every mother who feels stuck, disconnected, or unseen after birth.',
    E'If you are reading this in the middle of the night, feeding a baby who will not settle, wondering where the version of you that used to feel like "you" has gone — we see you.\n\nThe fourth trimester is rarely talked about honestly. Somewhere between the birth announcements and the "just enjoy every moment" comments, the real, complicated feelings of new motherhood get pushed aside.\n\nOur Identity and Healing programs exist for exactly this moment — to help you name what you are feeling, understand that it is common (not a personal failure), and take small, practical steps back toward yourself. You do not have to carry this silently. Reach out — we would love to walk alongside you.',
    '/assets/images/why-important.png',
    'Purpose In Pain Initiative CIC',
    true
  )
ON CONFLICT (slug) DO NOTHING;
