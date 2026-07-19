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

export default function Blog() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/blog')
      .then(setPosts)
      .catch((e) => setError(e.message));
  }, []);

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
        {posts && posts.length === 0 && <p className="text-navy-700/60">No posts yet — check back soon.</p>}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts?.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="card flex flex-col overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-lg"
            >
              {post.cover_image && <img src={post.cover_image} alt={post.title} className="aspect-[4/3] w-full object-cover object-top" />}
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs text-navy-700/50">
                  {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  {post.author ? ` · ${post.author}` : ''}
                </p>
                <h2 className="mt-2 font-display text-lg font-bold text-navy-700">{post.title}</h2>
                {post.excerpt && <p className="mt-2 text-sm text-navy-700/70">{post.excerpt}</p>}
                <span className="mt-4 inline-block text-sm font-semibold text-sky-500">Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-sky-50/60 py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-heading">Watch Us on Instagram</h2>
            <p className="mt-4 text-navy-700/80">
              More reflections and stories, straight from our{' '}
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="font-semibold text-sky-500 hover:underline">
                Instagram page
              </a>
              .
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {instagramReels.map((reel) => (
              <a
                key={reel.url}
                href={reel.url}
                target="_blank"
                rel="noreferrer"
                className="card group flex flex-col overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative">
                  <img src={reel.thumbnail} alt={reel.topic} className="aspect-[9/16] w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-navy-700/0 transition group-hover:bg-navy-700/20">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-xl text-sky-600 shadow-soft">
                      ▶
                    </span>
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-display text-sm font-bold text-navy-700">{reel.topic}</h3>
                  <p className="text-sm text-navy-700/70">{reel.description}</p>
                  <span className="mt-auto pt-2 text-sm font-semibold text-sky-500">Watch the video →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
