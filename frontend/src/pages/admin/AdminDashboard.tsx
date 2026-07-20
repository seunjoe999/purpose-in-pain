import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { apiGetAuthed, apiPost, apiPut, apiDelete } from '../../lib/api';
import { getAdminToken, clearAdminToken } from '../../lib/adminAuth';
import {
  teamMembers as defaultTeam,
  programs as defaultPrograms,
  partnerBrands as defaultBrands,
  contactInfo as defaultContact,
  socialLinks as defaultSocial,
} from '../../lib/content';

type Tab = 'content' | 'volunteers' | 'contact' | 'newsletter' | 'donations' | 'blog' | 'events';

const TABS: { key: Tab; label: string }[] = [
  { key: 'content', label: 'Website Content' },
  { key: 'blog', label: 'Blog Posts' },
  { key: 'events', label: 'Events' },
  { key: 'volunteers', label: 'Volunteers' },
  { key: 'contact', label: 'Contact Messages' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'donations', label: 'Donations' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = getAdminToken();
  const [tab, setTab] = useState<Tab>('content');

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
          <button onClick={logout} className="btn-secondary">Log Out</button>
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
          {tab === 'content' && <ContentTab token={token} />}
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

// ── Website Content Editor ──────────────────────────────────────────────────

function saveSetting(token: string, key: string, value: any) {
  return fetch(`/api/admin/settings/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ value }),
  });
}

function ContentTab({ token }: { token: string }) {
  const [section, setSection] = useState<'team' | 'programs' | 'brands' | 'contact' | 'social'>('team');
  const [saved, setSaved] = useState(false);

  function flash() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {(['team', 'programs', 'brands', 'contact', 'social'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-semibold capitalize transition ${
              section === s ? 'border-sky-500 bg-sky-50 text-sky-600' : 'border-navy-100 bg-white text-navy-700 hover:border-sky-300'
            }`}
          >
            {s === 'brands' ? 'Partner Logos' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        {saved && <span className="ml-3 self-center text-sm font-semibold text-green-600">Saved!</span>}
      </div>

      {section === 'team' && <TeamEditor token={token} onSave={flash} />}
      {section === 'programs' && <ProgramsEditor token={token} onSave={flash} />}
      {section === 'brands' && <BrandsEditor token={token} onSave={flash} />}
      {section === 'contact' && <ContactEditor token={token} onSave={flash} />}
      {section === 'social' && <SocialEditor token={token} onSave={flash} />}
    </div>
  );
}

function TeamEditor({ token, onSave }: { token: string; onSave: () => void }) {
  const [members, setMembers] = useState(defaultTeam.map((m) => ({ ...m })));

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { if (d.team) setMembers(d.team); })
      .catch(() => {});
  }, []);

  function update(i: number, field: 'name' | 'photo', val: string) {
    setMembers((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)));
  }

  function add() { setMembers((prev) => [...prev, { name: '', photo: '' }]); }
  function remove(i: number) { setMembers((prev) => prev.filter((_, idx) => idx !== i)); }

  async function save() {
    await saveSetting(token, 'team', members);
    onSave();
  }

  return (
    <div className="card space-y-4">
      <h3 className="font-display text-lg font-bold text-navy-700">Team Members</h3>
      <p className="text-xs text-navy-700/60">Photo: paste a URL (e.g. https://... or /assets/team/team-01.jpg). Changes apply site-wide when saved.</p>
      <div className="space-y-3">
        {members.map((m, i) => (
          <div key={i} className="flex items-center gap-3">
            {m.photo && (
              <img src={m.photo} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
            )}
            <input
              className="flex-1 rounded-lg border border-navy-100 px-3 py-2 text-sm"
              placeholder="Name"
              value={m.name}
              onChange={(e) => update(i, 'name', e.target.value)}
            />
            <input
              className="flex-1 rounded-lg border border-navy-100 px-3 py-2 text-sm"
              placeholder="Photo URL"
              value={m.photo}
              onChange={(e) => update(i, 'photo', e.target.value)}
            />
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 font-bold text-lg leading-none">×</button>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={add} className="btn-secondary">+ Add Member</button>
        <button onClick={save} className="btn-primary">Save Team</button>
      </div>
    </div>
  );
}

function ProgramsEditor({ token, onSave }: { token: string; onSave: () => void }) {
  const [progs, setProgs] = useState(defaultPrograms.map((p) => ({ slug: p.slug, name: p.name, mission: p.mission, image: p.image, summary: p.summary })));

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { if (d.programs) setProgs(d.programs); })
      .catch(() => {});
  }, []);

  function update(i: number, field: string, val: string) {
    setProgs((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)));
  }

  async function save() {
    await saveSetting(token, 'programs', progs);
    onSave();
  }

  return (
    <div className="card space-y-6">
      <h3 className="font-display text-lg font-bold text-navy-700">Programs</h3>
      {progs.map((p, i) => (
        <div key={i} className="rounded-xl border border-navy-100 p-4 space-y-3">
          <div className="flex items-center gap-3">
            {p.image && <img src={p.image} alt="" className="h-16 w-16 rounded-xl object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />}
            <div className="flex-1 space-y-2">
              <input className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm font-bold" placeholder="Program name" value={p.name} onChange={(e) => update(i, 'name', e.target.value)} />
              <input className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm" placeholder="Image URL" value={p.image} onChange={(e) => update(i, 'image', e.target.value)} />
            </div>
          </div>
          <input className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm" placeholder="Mission tagline" value={p.mission} onChange={(e) => update(i, 'mission', e.target.value)} />
          <textarea className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm" rows={2} placeholder="Summary" value={p.summary} onChange={(e) => update(i, 'summary', e.target.value)} />
        </div>
      ))}
      <button onClick={save} className="btn-primary">Save Programs</button>
    </div>
  );
}

function BrandsEditor({ token, onSave }: { token: string; onSave: () => void }) {
  const [brands, setBrands] = useState(defaultBrands.map((b) => ({ ...b })));

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { if (d.brands) setBrands(d.brands); })
      .catch(() => {});
  }, []);

  function update(i: number, field: 'name' | 'logo', val: string) {
    setBrands((prev) => prev.map((b, idx) => (idx === i ? { ...b, [field]: val } : b)));
  }

  function add() { setBrands((prev) => [...prev, { name: '', logo: '' }]); }
  function remove(i: number) { setBrands((prev) => prev.filter((_, idx) => idx !== i)); }

  async function save() {
    await saveSetting(token, 'brands', brands);
    onSave();
  }

  return (
    <div className="card space-y-4">
      <h3 className="font-display text-lg font-bold text-navy-700">Partner Brand Logos</h3>
      <p className="text-xs text-navy-700/60">These appear in the scrolling slider above the footer. Paste full image URLs or hosted paths.</p>
      <div className="space-y-3">
        {brands.map((b, i) => (
          <div key={i} className="flex items-center gap-3">
            {b.logo && <img src={b.logo} alt="" className="h-10 w-24 rounded object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />}
            <input className="flex-1 rounded-lg border border-navy-100 px-3 py-2 text-sm" placeholder="Brand name" value={b.name} onChange={(e) => update(i, 'name', e.target.value)} />
            <input className="flex-1 rounded-lg border border-navy-100 px-3 py-2 text-sm" placeholder="Logo URL" value={b.logo} onChange={(e) => update(i, 'logo', e.target.value)} />
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 font-bold text-lg">×</button>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={add} className="btn-secondary">+ Add Brand</button>
        <button onClick={save} className="btn-primary">Save Brands</button>
      </div>
    </div>
  );
}

function ContactEditor({ token, onSave }: { token: string; onSave: () => void }) {
  const [info, setInfo] = useState({ ...defaultContact });

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { if (d.contact) setInfo(d.contact); })
      .catch(() => {});
  }, []);

  async function save() {
    await saveSetting(token, 'contact', info);
    onSave();
  }

  return (
    <div className="card space-y-4 max-w-lg">
      <h3 className="font-display text-lg font-bold text-navy-700">Contact Info</h3>
      {(['email', 'phone', 'whatsapp'] as const).map((f) => (
        <div key={f}>
          <label className="block text-xs font-semibold uppercase tracking-wide text-navy-700/60 mb-1">{f}</label>
          <input className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm" value={(info as any)[f]} onChange={(e) => setInfo({ ...info, [f]: e.target.value })} />
        </div>
      ))}
      <button onClick={save} className="btn-primary">Save Contact Info</button>
    </div>
  );
}

function SocialEditor({ token, onSave }: { token: string; onSave: () => void }) {
  const [links, setLinks] = useState({ ...defaultSocial });

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { if (d.social) setLinks(d.social); })
      .catch(() => {});
  }, []);

  async function save() {
    await saveSetting(token, 'social', links);
    onSave();
  }

  return (
    <div className="card space-y-4 max-w-lg">
      <h3 className="font-display text-lg font-bold text-navy-700">Social Links</h3>
      {(Object.keys(defaultSocial) as (keyof typeof defaultSocial)[]).map((f) => (
        <div key={f}>
          <label className="block text-xs font-semibold uppercase tracking-wide text-navy-700/60 mb-1">{f}</label>
          <input className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm" value={(links as any)[f]} onChange={(e) => setLinks({ ...links, [f]: e.target.value })} />
        </div>
      ))}
      <button onClick={save} className="btn-primary">Save Social Links</button>
    </div>
  );
}

// ── Data table helper ────────────────────────────────────────────────────────

function DataTable({ rows, columns }: { rows: any[]; columns: { key: string; label: string; render?: (r: any) => React.ReactNode }[] }) {
  if (rows.length === 0) return <p className="text-navy-700/60">No records yet.</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-navy-50 bg-white shadow-soft">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="bg-navy-50/60 text-navy-700">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-display font-semibold">{c.label}</th>
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
  useEffect(() => { apiGetAuthed('/admin/volunteers', token).then(setRows); }, [token]);
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
  useEffect(() => { apiGetAuthed('/admin/contact-messages', token).then(setRows); }, [token]);
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
  useEffect(() => { apiGetAuthed('/admin/newsletter-subscribers', token).then(setRows); }, [token]);
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
  useEffect(() => { apiGetAuthed('/admin/donations', token).then(setRows); }, [token]);
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

  useEffect(() => { refresh(); }, [token]);

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
          <div><label>Slug</label><input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
          <div><label>Title</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label>Excerpt</label><input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
          <div><label>Body</label><textarea rows={5} required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
          <div><label>Cover image URL</label><input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} /></div>
          <div><label>Author</label><input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="btn-primary w-full" type="submit">Publish Post</button>
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
              <button onClick={() => handleDelete(p.id)} className="text-sm font-semibold text-red-500 hover:underline">Delete</button>
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

  useEffect(() => { refresh(); }, [token]);

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
          <div><label>Title</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label>Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><label>Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          <div>
            <label>Date and time</label>
            <input type="datetime-local" required value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
          </div>
          <div><label>Image URL</label><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="btn-primary w-full" type="submit">Create Event</button>
        </form>
      </div>
      <div>
        <h3 className="mb-3 font-display text-lg font-bold text-navy-700">All Events</h3>
        <div className="space-y-3">
          {rows?.map((ev) => (
            <div key={ev.id} className="card flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-navy-700">{ev.title}</p>
                <p className="text-xs text-navy-700/50">{new Date(ev.event_date).toLocaleString()}</p>
              </div>
              <button onClick={() => handleDelete(ev.id)} className="text-sm font-semibold text-red-500 hover:underline">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
