import { Link, useParams } from 'react-router-dom';
import { programs } from '../lib/content';

export default function ProgramDetail() {
  const { slug } = useParams();
  const program = programs.find((p) => p.slug === slug);

  if (!program) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="section-heading">Program not found</h1>
        <Link to="/programs" className="btn-primary mt-6 inline-flex">
          Back to Programs
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page">
          <Link to="/programs" className="text-sm font-semibold text-sky-400 hover:text-sky-300">
            ← All Programs
          </Link>
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">{program.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-sky-300">{program.mission}</p>
        </div>
      </section>

      <div className="container-page -mt-10 sm:-mt-14">
        <img
          src={program.image}
          alt={program.name}
          className="mx-auto h-56 w-full max-w-4xl rounded-2xl object-cover shadow-soft sm:h-72"
        />
      </div>

      <section className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          {program.paragraphs.map((para, i) => (
            <p key={i} className="text-navy-700/85 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
        <aside>
          <div className="card">
            <h3 className="font-display text-lg font-bold text-navy-700">This pillar includes</h3>
            <ul className="mt-4 space-y-2 text-sm text-navy-700/80">
              {program.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <span className="mt-0.5 text-sky-500">✓</span>
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/volunteer" className="btn-primary w-full">
                Volunteer
              </Link>
              <Link to="/donate" className="btn-secondary w-full">
                Support This Work
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
