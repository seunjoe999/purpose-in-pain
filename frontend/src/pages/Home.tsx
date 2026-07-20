import { Link } from 'react-router-dom';
import { programs, socialLinks, recommendedBooks, instagramReels } from '../lib/content';

const gains = [
  'Understanding postpartum mental health',
  'Ability to recognize early warning signs',
  'Confidence to seek help without shame',
  'Tools for emotional healing',
  'Practical self-care strategies',
  'Identity restoration',
  'Journaling techniques',
  'Community & reassurance',
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-700 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-accent-pink/10 blur-3xl" />
        <div className="container-page relative grid gap-10 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-block rounded-full bg-sky-500/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-sky-300">
              Mental Health, Identity & Wellness: Prepartum Through Postpartum
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              Turn Your Pain Into Purpose
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Purpose In Pain Initiative CIC walks alongside mothers across the UK, Nigeria and the US, from prepartum
              preparation through postpartum recovery, helping them recognise what they're feeling, restore their
              identity, and find practical tools for healing, without shame.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/donate" className="btn-primary">
                Donate Today
              </Link>
              <Link to="/volunteer" className="btn-secondary border-white text-white hover:bg-white hover:text-navy-700">
                Volunteer With Us
              </Link>
            </div>
            <a
              href={socialLinks.community}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center gap-3 rounded-2xl bg-white/5 p-2 pr-4 transition hover:bg-white/10"
            >
              <img
                src="/assets/images/design-1.png"
                alt="Join the Purpose In Pain Community flyer"
                className="h-16 w-16 rounded-xl object-cover"
              />
              <span className="text-sm font-semibold text-sky-300 underline decoration-sky-300/50 underline-offset-4">
                Join the Purpose In Pain Community
              </span>
            </a>
          </div>
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            <img
              src="/assets/images/mission-statement.png"
              alt="Purpose In Pain Initiative mission statement graphic"
              className="w-full rounded-3xl shadow-soft"
            />
          </div>
        </div>
      </section>

      {/* Gallery strip: Instagram reels as thumbnail grid */}
      <section className="bg-navy-900 py-6">
        <div className="container-page">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Watch Our Videos</p>
            <Link to="/contact" className="text-xs font-semibold text-sky-400 hover:text-sky-300">
              Follow us on Social Media
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-5">
            {instagramReels.map((reel) => (
              <a
                key={reel.url}
                href={reel.url}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-xl"
              >
                <img
                  src={reel.thumbnail}
                  alt={reel.topic}
                  className="aspect-square w-full object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                  <span className="scale-0 text-2xl text-white transition group-hover:scale-100">▶</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Books */}
      <section className="bg-sky-50/60 py-10 sm:py-14">
        <div className="container-page">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-500">Recommended Reading</p>
          <div className="mt-4 flex flex-wrap gap-6">
            {recommendedBooks.map((book) => (
              <Link
                key={book.slug}
                to="/shop"
                className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-3 pr-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <img src={book.cover} alt={book.title} className="h-20 w-auto rounded-md shadow-soft" />
                <div>
                  <p className="font-display text-sm font-bold text-navy-700">{book.title}</p>
                  <p className="text-xs text-navy-700/60">{book.author}</p>
                  <p className="mt-1 text-xs text-navy-700/70">{book.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Gap / Solution */}
      <section className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-heading">Postpartum care often forgets the mother</h2>
          <p className="mt-4 text-navy-700/80">
            Postpartum care focuses heavily on the baby, rarely the mother. Many women don't recognise postpartum
            depression or anxiety early. Many feel ashamed to ask for help. Many lose their sense of self, overwhelmed
            by expectations, without practical tools to recover emotionally and mentally.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="card">
            <h3 className="font-display text-lg font-bold text-navy-700">The Problem</h3>
            <p className="mt-2 text-sm text-navy-700/70">
              Mothers carry silent overwhelm, anxiety, and loss of identity with few safe spaces to say so out loud.
            </p>
          </div>
          <div className="card">
            <h3 className="font-display text-lg font-bold text-navy-700">The Gap</h3>
            <p className="mt-2 text-sm text-navy-700/70">
              A lack of safe, accessible, culturally sensitive postpartum education, identity-restoration
              conversations, and practical everyday self-care tools.
            </p>
          </div>
          <div className="card">
            <h3 className="font-display text-lg font-bold text-navy-700">Our Solution</h3>
            <p className="mt-2 text-sm text-navy-700/70">
              A live, expert-led experience that educates, normalises help-seeking, restores identity, and equips
              mothers with practical tools plus year-round programs and community.
            </p>
          </div>
        </div>
      </section>

      {/* Program pillars */}
      <section className="bg-sky-50/60 py-16 sm:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-heading">Four Ways We Walk Alongside Mothers</h2>
            <p className="mt-4 text-navy-700/80">
              Our work is built around four program pillars: Identity, Purpose, Healing, and Community, each
              addressing a different part of the prepartum and postpartum journey.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p) => (
              <Link
                key={p.slug}
                to={`/programs/${p.slug}`}
                className="card flex flex-col justify-between overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img src={p.image} alt={p.name} className="aspect-square w-full object-cover" />
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-navy-700">{p.name}</h3>
                    <p className="mt-2 text-sm text-navy-700/70">{p.mission}</p>
                  </div>
                  <span className="mt-4 text-sm font-semibold text-sky-500">Learn more</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What participants gain */}
      <section className="container-page py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="section-heading">What Mothers Gain</h2>
            <p className="mt-4 text-navy-700/80">
              Every program is designed around one goal: helping mothers leave with something they can actually use.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {gains.map((g) => (
                <div key={g} className="card flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                    ✓
                  </span>
                  <p className="text-sm font-medium text-navy-700">{g}</p>
                </div>
              ))}
            </div>
          </div>
          <img
            src="/assets/images/what-participants-gain.png"
            alt="What participants gain from Purpose In Pain programs"
            className="mx-auto aspect-square w-full max-w-lg rounded-2xl object-cover shadow-soft"
          />
        </div>
      </section>

      {/* Our values */}
      <section className="bg-sky-50/60 py-16 sm:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-heading">What We Stand For</h2>
            <p className="mt-4 text-navy-700/80">
              Purpose, community, and empowerment: the values behind everything we build.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <img
              src="/assets/images/value-community.jpg"
              alt="Community: Purpose In Pain Initiative"
              className="aspect-square w-full rounded-2xl object-cover shadow-soft"
            />
            <img
              src="/assets/images/value-empowerment.jpg"
              alt="Empowerment: Purpose In Pain Initiative"
              className="aspect-square w-full rounded-2xl object-cover shadow-soft"
            />
            <img
              src="/assets/images/value-identity-merch.jpg"
              alt="Identity: Purpose In Pain Initiative branded hoodie"
              className="aspect-square w-full rounded-2xl object-cover shadow-soft"
            />
          </div>
        </div>
      </section>

      {/* Community CTA banner */}
      <section className="container-page py-16 sm:py-24">
        <a
          href={socialLinks.community}
          target="_blank"
          rel="noreferrer"
          className="mx-auto block max-w-3xl overflow-hidden rounded-3xl shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
        >
          <img
            src="/assets/images/design-1.png"
            alt="Are you stuck in pain, battling self-doubt, or feeling lost? Join the Purpose In Pain community."
            className="w-full"
          />
        </a>
      </section>

      {/* CTA */}
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page grid gap-8 sm:grid-cols-2 sm:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Be part of someone's healing story</h2>
            <p className="mt-3 text-white/80">
              Whether through giving your time or your resources, you can help a mother breathe a little easier today.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 sm:justify-end">
            <Link to="/donate" className="btn-primary">
              Donate
            </Link>
            <Link to="/volunteer" className="btn-secondary border-white text-white hover:bg-white hover:text-navy-700">
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
