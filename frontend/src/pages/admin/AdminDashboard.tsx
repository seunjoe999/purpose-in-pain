import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { apiGetAuthed, apiPost, apiPut, apiDelete } from '../../lib/api';
import { getAdminToken, clearAdminToken } from '../../lib/adminAuth';

type Tab = 'volunteers' | 'contact' | 'newsletter' | 'donations' | 'blog' | 'events';

const TABS: { key: Tab; label: string }[] = [
  { key: 'volunteers', label: 'Volunteers' },
  { key: 'contact', label: 'Contact Messages' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'donations', label: 'Donations' },
  { key: 'blog', label: 'Blog Posts' },
  { key: 'events', label: 'Events' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = getAdminToken();
  const [tab, setTab] = useState<Tab>('volunteers');

  useEffect(() => {
    if (!token) navigate('/admin/login');
  }, [token, navigate]);

  if (!token) return null;

  function logout() {
    clearAdminToken();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-sky-50/40">
      <header className="border-b border-navy-50 bg-white">
        <div className="container-page flex items-center justify-between py-4">
          <Logo />
          <button onClick={logout} className="btn-secondary">
            Log Out
          </button>
        </div>
      </header>

      <div className="container-page py-8">
        <div className="flex flex-wrap gap-2 border-b border-navy-100 pb-3">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-display font-semibold transition ${
                tab === t.key ? 'bg-navy-700 text-white' : 'bg-white text-navy-700 hover:bg-navy-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === 'volunteers' && <VolunteersTab token={token} />}
          {tab === 'contact' && <ContactTab token={token} />}
          {tab === 'newsletter' && <NewsletterTab token={token} />}
          {tab === 'donations' && <DonationsTab token={token} />}
          {tab === 'blog' && <BlogTab token={token} />}
          {tab === 'events' && <EventsTab token={token} />}
        </div>
      </div>
    </div>
  );
}

function DataTable({ rows, columns }: { rows: any[]; columns: { key: string; label: string; render?: (r: any) => React.ReactNode }[] }) {
  if (rows.length === 0) return <p className="text-navy-700/60">No records yet.</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-navy-50 bg-white shadow-soft">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="bg-navy-50/60 text-navy-700">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-display font-semibold">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-navy-50">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 align-top text-navy-700/80">
                  {c.render ? c.render(r) : String(r[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VolunteersTab({ token }: { token: string }) {
  const [rows, setRows] = useState<any[] | null>(null);
  useEffect(() => {
    apiGetAuthed('/admin/volunteers', token).then(setRows);
  }, [token]);
  if (!rows) return <p>Loading…</p>;
  return (
    <DataTable
      rows={rows}
      columns={[
        { key: 'full_name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'location', label: 'Location' },
        { key: 'teams', label: 'Teams', render: (r) => (r.teams || []).join(', ') },
        { key: 'availability', label: 'Availability' },
        { key: 'reason', label: 'Why' },
        { key: 'created_at', label: 'Submitted', render: (r) => new Date(r.created_at).toLocaleString() },
      ]}
    />
  );
}

function ContactTab({ token }: { token: string }) {
  const [rows, setRows] = useState<any[] | null>(null);
  useEffect(() => {
    apiGetAuthed('/admin/contact-messages', token).then(setRows);
  }, [token]);
  if (!rows) return <p>Loading…</p>;
  return (
    <DataTable
      rows={rows}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'message', label: 'Message' },
        { key: 'created_at', label: 'Submitted', render: (r) => new Date(r.created_at).toLocaleString() },
      ]}
    />
  );
}

function NewsletterTab({ token }: { token: string }) {
  const [rows, setRows] = useState<any[] | null>(null);
  useEffect(() => {
    apiGetAuthed('/admin/newsletter-subscribers', token).then(setRows);
  }, [token]);
  if (!rows) return <p>Loading…</p>;
  return (
    <DataTable
      rows={rows}
      columns={[
        { key: 'email', label: 'Email' },
        { key: 'created_at', label: 'Subscribed', render: (r) => new Date(r.created_at).toLocaleString() },
      ]}
    />
  );
}

function DonationsTab({ token }: { token: string }) {
  const [rows, setRows] = useState<any[] | null>(null);
  useEffect(() => {
    apiGetAuthed('/admin/donations', token).then(setRows);
  }, [token]);
  if (!rows) return <p>Loading…</p>;
  return (
    <DataTable
      rows={rows}
      columns={[
        { key: 'donor_name', label: 'Donor' },
        { key: 'email', label: 'Email' },
        { key: 'amount_pence', label: 'Amount', render: (r) => `£${(r.amount_pence / 100).toFixed(2)}` },
        { key: 'frequency', label: 'Frequency' },
        { key: 'status', label: 'Status' },
        { key: 'reference', label: 'Reference' },
        { key: 'created_at', label: 'Date', render: (r) => new Date(r.created_at).toLocaleString() },
      ]}
    />
  );
}

function BlogTab({ token }: { token: string }) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [form, setForm] = useState({ slug: '', title: '', excerpt: '', body: '', cover_image: '', author: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    refresh();
  }, [token]);

  async function refresh() {
    const res = await fetch('/api/blog');
    setRows(await res.json());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiPost('/admin/blog-posts', { ...form, published: true }, token);
      setForm({ slug: '', title: '', excerpt: '', body: '', cover_image: '', author: '' });
      refresh();
    } catch (err: any) {
      setError(err.message || 'Could not create post.');
    }
  }

  async function handleDelete(id: string) {
    await apiDelete(`/admin/blog-posts/${id}`, token);
    refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h3 className="mb-3 font-display text-lg font-bold text-navy-700">New Post</h3>
        <form onSubmit={handleCreate} className="card space-y-3">
          <div>
            <label>Slug</label>
            <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <label>Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label>Excerpt</label>
            <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </div>
          <div>
            <label>Body</label>
            <textarea rows={5} required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </div>
          <div>
            <label>Cover image URL</label>
            <input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} />
          </div>
          <div>
            <label>Author</label>
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="btn-primary w-full" type="submit">
            Publish Post
          </button>
        </form>
      </div>
      <div>
        <h3 className="mb-3 font-display text-lg font-bold text-navy-700">Published Posts</h3>
        <div className="space-y-3">
          {rows?.map((p) => (
            <div key={p.id} className="card flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-navy-700">{p.title}</p>
                <p className="text-xs text-navy-700/50">/{p.slug}</p>
              </div>
              <button onClick={() => handleDelete(p.id)} className="text-sm font-semibold text-red-500 hover:underline">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventsTab({ token }: { token: string }) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [form, setForm] = useState({ title: '', description: '', location: '', event_date: '', image: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    refresh();
  }, [token]);

  async function refresh() {
    const res = await fetch('/api/events');
    setRows(await res.json());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiPost('/admin/events', form, token);
      setForm({ title: '', description: '', location: '', event_date: '', image: '' });
      refresh();
    } catch (err: any) {
      setError(err.message || 'Could not create event.');
    }
  }

  async function handleDelete(id: string) {
    await apiDelete(`/admin/events/${id}`, token);
    refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h3 className="mb-3 font-display text-lg font-bold text-navy-700">New Event</h3>
        <form onSubmit={handleCreate} className="card space-y-3">
          <div>
            <label>Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label>Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label>Date & time</label>
            <input
              type="datetime-local"
              required
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
            />
          </div>
          <div>
            <label>Image URL</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="btn-primary w-full" type="submit">
            Create Event
          </button>
        </form>
      </div>
      <div>
        <h3 className="mb-3 font-display text-lg font-bold text-navy-700">Upcoming Events</h3>
        <div className="space-y-3">
          {rows?.map((ev) => (
            <div key={ev.id} className="card flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-navy-700">{ev.title}</p>
                <p className="text-xs text-navy-700/50">{new Date(ev.event_date).toLocaleString()}</p>
              </div>
              <button onClick={() => handleDelete(ev.id)} className="text-sm font-semibold text-red-500 hover:underline">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
