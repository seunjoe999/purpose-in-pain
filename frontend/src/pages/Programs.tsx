import { Link } from 'react-router-dom';
import { programs } from '../lib/content';

export default function Programs() {
  return (
    <div>
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Our Programs</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Four pillars, one goal: helping mothers move from surviving to thriving. Identity, purpose, healing, and
            reproductive & mental health support.
          </p>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          {programs.map((p) => (
            <Link
              key={p.slug}
              to={`/programs/${p.slug}`}
              className="card flex flex-col overflow-hidden p-0 transition hover:shadow-lg"
            >
              <img src={p.image} alt={p.name} className="aspect-square w-full object-cover" />
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-2xl font-bold text-navy-700">{p.name}</h2>
                <p className="mt-2 text-sm font-semibold text-sky-500">{p.mission}</p>
                <p className="mt-4 text-sm text-navy-700/80">{p.summary}</p>
                <span className="mt-6 text-sm font-semibold text-sky-500">Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
