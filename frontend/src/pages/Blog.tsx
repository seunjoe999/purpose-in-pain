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
            <Link key={post.id} to={`/blog/${post.slug}`} className="card overflow-hidden p-0 transition hover:shadow-lg">
              {post.cover_image && <img src={post.cover_image} alt={post.title} className="h-44 w-full object-cover" />}
              <div className="p-6">
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
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {instagramReels.map((url, i) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="card flex flex-col items-center justify-center gap-2 py-8 text-center transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-lg text-sky-600">
                  ▶
                </span>
                <span className="text-sm font-semibold text-navy-700">Reel {i + 1}</span>
                <span className="text-xs text-navy-700/60">Watch on Instagram</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
