import { teamMembers } from '../lib/content';

export default function About() {
  return (
    <div>
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">About Purpose In Pain Initiative CIC</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            A UK Community Interest Company dedicated to postpartum mental health, identity restoration, and wellness
            for mothers — serving communities in the UK, Nigeria, and the US.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-8 py-16 sm:py-20 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-display text-2xl font-bold text-navy-700">Our Mission</h2>
          <p className="mt-3 text-navy-700/80">
            "To empower individuals to rediscover their identity, uncover their purpose, and embrace their
            self-worth. Through advocacy, support, and empowerment programs, we are committed to transforming lives
            and helping people realize their full potential."
          </p>
        </div>
        <div className="card">
          <h2 className="font-display text-2xl font-bold text-navy-700">Our Vision</h2>
          <p className="mt-3 text-navy-700/80">
            "To create a world where every individual, regardless of their circumstances, confidently walks in their
            purpose, embraces their unique identity, and impacts their community positively, leading to a society of
            transformed and purpose-driven lives."
          </p>
        </div>
      </section>

      <section className="bg-sky-50/60 py-16 sm:py-20">
        <div className="container-page">
          <h2 className="section-heading">The Problem, the Gap, and Our Solution</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div>
              <h3 className="font-display text-lg font-bold text-navy-700">The Problem</h3>
              <ul className="mt-3 space-y-2 text-sm text-navy-700/80">
                <li>• Postpartum care focuses heavily on the baby, not the mother.</li>
                <li>• Many women don't recognise postpartum depression/anxiety early.</li>
                <li>• Many feel ashamed to ask for help.</li>
                <li>• Many lose their sense of self and purpose.</li>
                <li>• Many are overwhelmed by expectations.</li>
                <li>• Many lack practical tools to recover emotionally and mentally.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-navy-700">The Gap</h3>
              <ul className="mt-3 space-y-2 text-sm text-navy-700/80">
                <li>• Lack of safe, accessible, culturally sensitive postpartum mental health education.</li>
                <li>• Lack of identity-restoration conversations for mothers.</li>
                <li>• Lack of early intervention education.</li>
                <li>• Lack of practical self-care tools for everyday mothers.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-navy-700">Our Solution</h3>
              <p className="mt-3 text-sm text-navy-700/80">
                A one-day, live, expert-led (Zoom / in-person) experience that:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-navy-700/80">
                <li>• Educates</li>
                <li>• Normalizes help-seeking</li>
                <li>• Restores identity</li>
                <li>• Equips mothers with practical tools</li>
                <li>• Provides clarity on when and how to seek help</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <h2 className="section-heading">Who We Serve</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="card">
            <h3 className="font-display text-lg font-bold text-navy-700">Primary Audience</h3>
            <p className="mt-2 text-sm text-navy-700/80">
              Postpartum women with children aged 0–4, first-time mothers, and mothers struggling silently with
              emotional overwhelm, anxiety, depression, loss of identity, burnout, guilt, or feeling "stuck" and
              disconnected from themselves.
            </p>
          </div>
          <div className="card">
            <h3 className="font-display text-lg font-bold text-navy-700">Secondary Audience</h3>
            <p className="mt-2 text-sm text-navy-700/80">
              Caregivers and support systems, women's communities, NGOs and maternal health advocates who want to
              better support the mothers around them.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Our Team</h2>
          <p className="mt-3 max-w-2xl text-white/70">
            The people giving their time, expertise, and hearts to this mission.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {teamMembers.map((m) => (
              <div key={m.name} className="text-center">
                <img
                  src={m.photo}
                  alt={m.name}
                  className="mx-auto h-28 w-28 rounded-full border-4 border-white/10 object-cover shadow-soft sm:h-32 sm:w-32"
                />
                <p className="mt-3 font-display text-sm font-semibold">{m.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
