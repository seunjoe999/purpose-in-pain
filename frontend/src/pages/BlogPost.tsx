import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiGet, apiPost } from '../lib/api';

type Post = {
  id: string;
  slug: string;
  title: string;
  body: string;
  cover_image: string | null;
  author: string | null;
  created_at: string;
};

type Comment = {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
};

function CommentsSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [form, setForm] = useState({ author_name: '', body: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet(`/blog/${slug}/comments`)
      .then((data: Comment[]) => setComments(data))
      .catch(() => {});
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const newComment: Comment = await apiPost(`/blog/${slug}/comments`, form);
      setComments((prev) => [...prev, newComment]);
      setForm({ author_name: '', body: '' });
      setStatus('idle');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-3xl mt-16">
      <h2 className="font-display text-2xl font-bold text-navy-700">
        Comments {comments.length > 0 && <span className="text-navy-700/40">({comments.length})</span>}
      </h2>

      {comments.length === 0 && (
        <p className="mt-4 text-sm text-navy-700/50">No comments yet. Be the first to share your thoughts!</p>
      )}

      <div className="mt-6 space-y-5">
        {comments.map((c) => (
          <div key={c.id} className="card">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 font-display text-sm font-bold text-sky-600">
                {c.author_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-700">{c.author_name}</p>
                <p className="text-xs text-navy-700/50">
                  {new Date(c.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-navy-700/80 leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-4">
        <h3 className="font-display text-lg font-bold text-navy-700">Leave a Comment</h3>
        <div>
          <label htmlFor="comment-name">Your Name <span className="text-xs text-red-400">*</span></label>
          <input
            id="comment-name"
            required
            value={form.author_name}
            onChange={(e) => setForm({ ...form, author_name: e.target.value })}
            placeholder="e.g. Sarah Johnson"
          />
        </div>
        <div>
          <label htmlFor="comment-body">Comment <span className="text-xs text-red-400">*</span></label>
          <textarea
            id="comment-body"
            rows={4}
            required
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Share your thoughts…"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={status === 'loading'} className="btn-primary">
          {status === 'loading' ? 'Posting…' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}

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
        <div className={`flex flex-col gap-10 ${post.cover_image ? 'lg:flex-row lg:items-start' : ''}`}>
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full rounded-2xl object-cover shadow-soft lg:w-64 lg:shrink-0"
            />
          )}
          <div className="flex-1">
            <div className="space-y-5 text-navy-700/85 leading-relaxed">
              {post.body.split('\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para.replace(/[—–]/g, ' - ')}</p>
              ))}
            </div>
            <CommentsSection slug={post.slug} />
          </div>
        </div>
      </section>
    </article>
  );
}
