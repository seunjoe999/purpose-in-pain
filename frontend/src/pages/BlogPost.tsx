import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiGet } from '../lib/api';

type Post = {
  id: string;
  slug: string;
  title: string;
  body: string;
  cover_image: string | null;
  author: string | null;
  created_at: string;
};

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    apiGet(`/blog/${slug}`)
      .then(setPost)
      .catch((e) => setError(e.message));
  }, [slug]);

  if (error) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="section-heading">Post not found</h1>
        <Link to="/blog" className="btn-primary mt-6 inline-flex">
          Back to Blog
        </Link>
      </div>
    );
  }

  if (!post) {
    return <div className="container-page py-24 text-center text-navy-700/60">Loading…</div>;
  }

  return (
    <article>
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page">
          <Link to="/blog" className="text-sm font-semibold text-sky-400 hover:text-sky-300">
            ← All Posts
          </Link>
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">{post.title}</h1>
          <p className="mt-3 text-sm text-white/60">
            {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            {post.author ? ` · ${post.author}` : ''}
          </p>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        {post.cover_image && (
          <img src={post.cover_image} alt={post.title} className="mb-10 max-h-96 w-full rounded-2xl object-cover" />
        )}
        <div className="mx-auto max-w-3xl space-y-5 text-navy-700/85 leading-relaxed">
          {post.body.split('\n').filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>
    </article>
  );
}
