import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../lib/api';
import { instagramReels, socialLinks } from '../lib/content';

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  author: string | null;
  created_at: string;
};

const PAGE_SIZE = 10;

function VideoSlideshow() {
  const [idx, setIdx] = useState(0);
  const total = instagramReels.length;

  function prev() { setIdx((i) => (i - 1 + total) % total); }
  function next() { setIdx((i) => (i + 1) % total); }

  const reel = instagramReels[idx];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-3xl shadow-soft">
        <a href={reel.url} target="_blank" rel="noreferrer" className="group block">
          <div className="relative">
            <img src={reel.thumbnail} alt={reel.topic} className="aspect-video w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-navy-700/20 transition group-hover:bg-navy-700/40">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-2xl text-sky-600 shadow-soft transition group-hover:scale-110">
                ▶
              </span>
            </div>
          </div>
          <div className="bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">
              {idx + 1} / {total}
            </p>
            <h3 className="mt-1 font-display text-xl font-bold text-navy-700">{reel.topic}</h3>
            <p className="mt-2 text-sm text-navy-700/70">{reel.description}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-sky-500">Watch the video</span>
          </div>
        </a>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={prev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-100 bg-white text-navy-700 shadow-soft transition hover:border-sky-300 hover:text-sky-500"
          aria-label="Previous video"
        >
          ‹
        </button>
        <div className="flex gap-2">
          {instagramReels.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-sky-500' : 'w-2 bg-navy-100'}`}
              aria-label={`Go to video ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-100 bg-white text-navy-700 shadow-soft transition hover:border-sky-300 hover:text-sky-500"
          aria-label="Next video"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    apiGet('/blog')
      .then(setPosts)
      .catch((e) => setError(e.message));
  }, []);

  const totalPages = posts ? Math.max(1, Math.ceil(posts.length / PAGE_SIZE)) : 1;
  const pagePosts = posts?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goPage(n: number) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Blog & News</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Reflections, resources, and stories from our community.
          </p>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        {error && <p className="text-red-500">{error}</p>}
        {!posts && !error && <p className="text-navy-700/60">Loading posts…</p>}
        {posts && posts.length === 0 && <p className="text-navy-700/60">No posts yet. Check back soon.</p>}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pagePosts?.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="card flex flex-col overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-lg"
            >
              {post.cover_image && (
                <img src={post.cover_image} alt={post.title} className="aspect-[4/3] w-full object-cover object-top" />
              )}
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs text-navy-700/50">
                  {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  {post.author ? ` · ${post.author}` : ''}
                </p>
                <h2 className="mt-2 font-display text-lg font-bold text-navy-700">{post.title}</h2>
                {post.excerpt && <p className="mt-2 text-sm text-navy-700/70">{post.excerpt}</p>}
                <span className="mt-4 inline-block text-sm font-semibold text-sky-500">Read more</span>
              </div>
            </Link>
          ))}
        </div>

        {posts && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => goPage(page - 1)}
              disabled={page === 1}
              className="rounded-lg border border-navy-100 px-4 py-2 text-sm font-semibold text-navy-700 transition hover:border-sky-300 hover:text-sky-500 disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => goPage(n)}
                className={`h-10 w-10 rounded-lg text-sm font-bold transition ${
                  n === page ? 'bg-sky-500 text-white' : 'border border-navy-100 text-navy-700 hover:border-sky-300'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => goPage(page + 1)}
              disabled={page === totalPages}
              className="rounded-lg border border-navy-100 px-4 py-2 text-sm font-semibold text-navy-700 transition hover:border-sky-300 hover:text-sky-500 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>

      <section className="bg-sky-50/60 py-16 sm:py-20">
        <div className="container-page">
          <div className="mb-10 text-center">
            <h2 className="section-heading">Watch Our Videos</h2>
            <p className="mt-4 text-navy-700/80">
              Short, honest conversations about postpartum health, straight from our{' '}
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="font-semibold text-sky-500 hover:underline">
                Instagram
              </a>{' '}
              and{' '}
              <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="font-semibold text-sky-500 hover:underline">
                YouTube
              </a>
              .
            </p>
          </div>
          <VideoSlideshow />
        </div>
      </section>
    </div>
  );
}
