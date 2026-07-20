import { teamMembers } from '../lib/content';

export default function About() {
  return (
    <div>
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">About Purpose In Pain Initiative CIC</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            A UK Community Interest Company dedicated to postpartum mental health, identity restoration, and wellness
            for mothers, serving communities in the UK, Nigeria, and the US.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card flex flex-col">
            <h2 className="font-display text-2xl font-bold text-navy-700">Our Mission</h2>
            <p className="mt-3 text-navy-700/80">
              "To empower individuals to rediscover their identity, uncover their purpose, and embrace their
              self-worth. Through advocacy, support, and empowerment programs, we are committed to transforming lives
              and helping people realize their full potential."
            </p>
          </div>
          <div className="card flex flex-col">
            <h2 className="font-display text-2xl font-bold text-navy-700">Our Vision</h2>
            <p className="mt-3 text-navy-700/80">
              "To create a world where every individual, regardless of their circumstances, confidently walks in their
              purpose, embraces their unique identity, and impacts their community positively, leading to a society of
              transformed and purpose-driven lives."
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <img
            src="/assets/images/mission-statement.png"
            alt="Purpose In Pain Initiative mission statement graphic"
            className="aspect-square w-full rounded-2xl object-cover shadow-soft"
          />
          <img
            src="/assets/images/vision-statement.png"
            alt="Purpose In Pain Initiative vision statement graphic"
            className="aspect-square w-full rounded-2xl object-cover shadow-soft"
          />
        </div>
      </section>

      {/* Problem, Gap, Solution */}
      <section className="bg-sky-50/60 py-16 sm:py-20">
        <div className="container-page">
          <h2 className="section-heading">The Problem, the Gap, and Our Solution</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div>
              <h3 className="font-display text-lg font-bold text-navy-700">The Problem</h3>
              <ul className="mt-3 space-y-2 text-sm text-navy-700/80">
                <li>Postpartum care focuses heavily on the baby, not the mother.</li>
                <li>Many women don't recognise postpartum depression/anxiety early.</li>
                <li>Many feel ashamed to ask for help.</li>
                <li>Many lose their sense of self and purpose.</li>
                <li>Many are overwhelmed by expectations.</li>
                <li>Many lack practical tools to recover emotionally and mentally.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-navy-700">The Gap</h3>
              <ul className="mt-3 space-y-2 text-sm text-navy-700/80">
                <li>Lack of safe, accessible, culturally sensitive postpartum mental health education.</li>
                <li>Lack of identity-restoration conversations for mothers.</li>
                <li>Lack of early intervention education.</li>
                <li>Lack of practical self-care tools for everyday mothers.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-navy-700">Our Solution</h3>
              <p className="mt-3 text-sm text-navy-700/80">
                A one-day, live, expert-led (Zoom / in-person) experience that:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-navy-700/80">
                <li>Educates</li>
                <li>Normalizes help-seeking</li>
                <li>Restores identity</li>
                <li>Equips mothers with practical tools</li>
                <li>Provides clarity on when and how to seek help</li>
              </ul>
            </div>
          </div>
          <div className="mt-10">
            <img
              src="/assets/images/problem-gap-solution.png"
              alt="Purpose In Pain Initiative: the problem, the gap, and our solution"
              className="w-full rounded-2xl object-contain shadow-soft"
            />
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="container-page py-16 sm:py-20">
        <h2 className="section-heading">Who We Serve</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="card flex flex-col">
            <h3 className="font-display text-lg font-bold text-navy-700">Primary Audience</h3>
            <p className="mt-2 text-sm text-navy-700/80">
              Postpartum women with children aged 0–4, first-time mothers, and mothers struggling silently with
              emotional overwhelm, anxiety, depression, loss of identity, burnout, guilt, or feeling "stuck" and
              disconnected from themselves.
            </p>
            <img
              src="/assets/images/target-audience-primary.png"
              alt="Purpose In Pain Initiative primary audience"
              className="mt-4 aspect-[4/3] w-full rounded-xl object-cover shadow-soft"
            />
          </div>
          <div className="card flex flex-col">
            <h3 className="font-display text-lg font-bold text-navy-700">Secondary Audience</h3>
            <p className="mt-2 text-sm text-navy-700/80">
              Caregivers and support systems, women's communities, NGOs and maternal health advocates who want to
              better support the mothers around them.
            </p>
            <img
              src="/assets/images/target-audience-secondary.png"
              alt="Purpose In Pain Initiative secondary audience"
              className="mt-4 aspect-[4/3] w-full rounded-xl object-cover shadow-soft"
            />
          </div>
        </div>
      </section>

      {/* Global Impact: picture left, text right */}
      <section className="bg-sky-50/60 py-16 sm:py-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <img
            src="/assets/images/sdg-alignment.jpg"
            alt="Purpose In Pain Initiative alignment with UN Sustainable Development Goals"
            className="mx-auto max-h-[520px] w-auto rounded-2xl shadow-soft"
          />
          <div>
            <h2 className="section-heading">Our Global Impact Alignment</h2>
            <p className="mt-4 text-navy-700/80">
              Our work connects directly to several United Nations Sustainable Development Goals: good health and
              wellbeing, quality education, gender equality, decent work, reduced inequalities, and strong,
              supportive communities.
            </p>
            <div className="mt-6 rounded-2xl border border-navy-700/10 bg-white p-5 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-500">Recommended reading</p>
              <div className="mt-3 flex items-center gap-4">
                <img
                  src="/assets/images/finding-purpose-ebook.jpg"
                  alt="Finding Purpose: a 7-day guide to discovering purpose in pain, by Dr Shalom Oluwabusayo Mojere"
                  className="h-28 w-auto rounded-md shadow-soft"
                />
                <p className="text-sm text-navy-700/80">
                  <span className="font-display font-bold text-navy-700">Finding Purpose</span>: a 7-day
                  step-by-step guide to discovering purpose in pain, by Dr Shalom Oluwabusayo Mojere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaborators */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-heading">Our Collaborators</h2>
            <p className="mt-4 text-navy-700/80">
              We're grateful to partner with a growing network of organisations, businesses, and community groups
              who support our work in education, prevention, women's wellbeing, mental health advocacy, and
              community impact.
            </p>
          </div>
          <img
            src="/assets/images/collaborators.png"
            alt="Purpose In Pain Initiative collaborators and supporting organisations"
            className="aspect-square w-full rounded-2xl object-cover shadow-soft"
          />
        </div>
      </section>

      {/* Team */}
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Our Team</h2>
          <p className="mt-3 max-w-2xl text-white/70">
            The people giving their time, expertise, and hearts to this mission.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {teamMembers.map((m) => (
              <div key={m.name} className="text-center">
                <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white/10 shadow-soft">
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <p className="mt-3 font-display text-sm font-semibold">{m.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
