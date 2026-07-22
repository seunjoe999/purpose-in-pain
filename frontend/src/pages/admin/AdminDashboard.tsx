import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { apiGet, apiGetAuthed, apiPost, apiPut, apiDelete, apiUploadFile } from '../../lib/api';
import { getAdminToken, clearAdminToken } from '../../lib/adminAuth';
import {
  teamMembers as defaultTeam,
  programs as defaultPrograms,
  partnerBrands as defaultBrands,
  contactInfo as defaultContact,
  socialLinks as defaultSocial,
} from '../../lib/content';

type Section =
  | 'dashboard'
  | 'events'
  | 'blog'
  | 'home'
  | 'team'
  | 'programs'
  | 'brands'
  | 'shop'
  | 'nav'
  | 'contact-info'
  | 'social'
  | 'volunteers'
  | 'messages'
  | 'newsletter'
  | 'donations';

type NavItem = { key: Section; label: string; icon: string } | { group: string };

const NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '◉' },
  { group: 'Content' },
  { key: 'events', label: 'Events', icon: '📅' },
  { key: 'blog', label: 'Blog Posts', icon: '📝' },
  { key: 'home', label: 'Home Page Text', icon: '🏠' },
  { key: 'shop', label: 'Shop & Books', icon: '🛍️' },
  { key: 'team', label: 'Team Members', icon: '👥' },
  { key: 'programs', label: 'Programs', icon: '🎯' },
  { key: 'brands', label: 'Partner Logos', icon: '🤝' },
  { key: 'nav', label: 'Navigation Labels', icon: '🔗' },
  { key: 'social', label: 'Social Links', icon: '📱' },
  { key: 'contact-info', label: 'Contact Info', icon: '☎' },
  { group: 'Inbox' },
  { key: 'volunteers', label: 'Volunteers', icon: '🙋' },
  { key: 'messages', label: 'Messages', icon: '✉' },
  { key: 'newsletter', label: 'Newsletter', icon: '📬' },
  { key: 'donations', label: 'Donations', icon: '💰' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = getAdminToken();
  const [section, setSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) navigate('/admin/login');
  }, [token, navigate]);

  if (!token) return null;

  function logout() {
    clearAdminToken();
    navigate('/admin/login');
  }

  const sectionLabel = NAV.find((n) => 'key' in n && n.key === section) as { key: Section; label: string; icon: string } | undefined;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-navy-700 text-white transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-4">
          <span className="font-display text-sm font-bold text-white/90 leading-tight">Purpose In Pain<br /><span className="text-white/50 font-normal text-xs">Admin Panel</span></span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {NAV.map((item, i) => {
            if ('group' in item) {
              return (
                <p key={i} className="mt-4 mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-white/30">
                  {item.group}
                </p>
              );
            }
            const active = section === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setSection(item.key); setSidebarOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                  active
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:bg-white/8 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <span>↩</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-navy-700 hover:bg-slate-100 lg:hidden"
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <h1 className="font-display text-lg font-bold text-navy-700">
            {sectionLabel?.icon} {sectionLabel?.label ?? 'Admin'}
          </h1>
          <div className="ml-auto hidden sm:block">
            <Logo />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {section === 'dashboard' && <DashboardSection token={token} />}
          {section === 'events' && <EventsSection token={token} />}
          {section === 'blog' && <BlogSection token={token} />}
          {section === 'home' && <HomeEditor token={token} />}
          {section === 'team' && <TeamEditor token={token} />}
          {section === 'programs' && <ProgramsEditor token={token} />}
          {section === 'brands' && <BrandsEditor token={token} />}
          {section === 'contact-info' && <ContactEditor token={token} />}
          {section === 'shop' && <ShopEditor token={token} />}
          {section === 'nav' && <NavEditor token={token} />}
          {section === 'social' && <SocialEditor token={token} />}
          {section === 'volunteers' && <InboxTable endpoint="/admin/volunteers" token={token} columns={[
            { key: 'full_name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'location', label: 'Location' },
            { key: 'teams', label: 'Teams', render: (r) => (r.teams || []).join(', ') },
            { key: 'availability', label: 'Availability' },
            { key: 'reason', label: 'Why' },
            { key: 'created_at', label: 'Date', render: (r) => new Date(r.created_at).toLocaleString() },
          ]} />}
          {section === 'messages' && <InboxTable endpoint="/admin/contact-messages" token={token} columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'message', label: 'Message' },
            { key: 'created_at', label: 'Date', render: (r) => new Date(r.created_at).toLocaleString() },
          ]} />}
          {section === 'newsletter' && <NewsletterSection token={token} />}
          {section === 'donations' && <InboxTable endpoint="/admin/donations" token={token} columns={[
            { key: 'donor_name', label: 'Donor' },
            { key: 'email', label: 'Email' },
            { key: 'amount_pence', label: 'Amount', render: (r) => { const s: Record<string,string> = { GBP: '£', NGN: '₦', USD: '$' }; return `${s[r.currency] || r.currency || '£'}${(r.amount_pence / 100).toFixed(2)}`; } },
            { key: 'frequency', label: 'Frequency' },
            { key: 'status', label: 'Status' },
            { key: 'created_at', label: 'Date', render: (r) => new Date(r.created_at).toLocaleString() },
          ]} />}
        </main>
      </div>
    </div>
  );
}

// ── Dashboard overview ────────────────────────────────────────────────────────

function DashboardSection({ token }: { token: string }) {
  const [stats, setStats] = useState<{ volunteers: number; messages: number; subscribers: number; donations: number; revenue: number } | null>(null);

  useEffect(() => {
    Promise.all([
      apiGetAuthed('/admin/volunteers', token),
      apiGetAuthed('/admin/contact-messages', token),
      apiGetAuthed('/admin/newsletter-subscribers', token),
      apiGetAuthed('/admin/donations', token),
    ])
      .then(([volunteers, messages, subscribers, donations]) => {
        const successDonations = (donations as any[]).filter((d) => d.status === 'success');
        setStats({
          volunteers: (volunteers as any[]).length,
          messages: (messages as any[]).length,
          subscribers: (subscribers as any[]).length,
          donations: successDonations.length,
          revenue: successDonations.reduce((sum, d) => sum + (d.amount_pence ?? 0), 0),
        });
      })
      .catch(() => {});
  }, [token]);

  const cards = [
    { label: 'Volunteers', value: stats?.volunteers ?? '—', color: 'bg-sky-50 border-sky-200 text-sky-600' },
    { label: 'Messages', value: stats?.messages ?? '—', color: 'bg-purple-50 border-purple-200 text-purple-600' },
    { label: 'Newsletter', value: stats?.subscribers ?? '—', color: 'bg-green-50 border-green-200 text-green-600' },
    { label: 'Donations raised', value: stats ? `£${(stats.revenue / 100).toFixed(0)}` : '—', color: 'bg-amber-50 border-amber-200 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-2xl border p-5 ${c.color}`}>
            <p className={`font-display text-3xl font-bold`}>{c.value}</p>
            <p className="mt-1 text-sm font-semibold opacity-70">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="font-display text-base font-bold text-navy-700 mb-2">Welcome to the Admin Panel</h3>
        <p className="text-sm text-navy-700/70 max-w-2xl">
          Use the sidebar to manage every part of the website. Under <strong>Events</strong> you can edit event details and change the date —
          setting a date in the past will automatically move that event to the "Past Events" section. Under <strong>Blog Posts</strong> you can
          create, edit, and delete articles. Team, Programs, Brands, Social Links, and Contact Info are all editable too.
        </p>
      </div>
    </div>
  );
}

// ── Events (full CRUD with inline edit) ──────────────────────────────────────

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  event_date: string;
  image: string | null;
};

type EventForm = {
  title: string;
  description: string;
  location: string;
  event_date: string;
  image: string;
  gallery_images: string; // newline-separated URLs
};

function toLocalDatetime(iso: string) {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function EventFormFields({ form, onChange, token }: { form: EventForm; onChange: (f: EventForm) => void; token: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label>Title *</label>
        <input required value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value })} />
      </div>
      <div>
        <label>Date *</label>
        <input
          type="date"
          required
          value={form.event_date ? form.event_date.slice(0, 10) : ''}
          onChange={(e) => {
            const time = form.event_date ? form.event_date.slice(11, 16) : '00:00';
            onChange({ ...form, event_date: e.target.value + 'T' + time });
          }}
        />
      </div>
      <div>
        <label>Time *</label>
        <input
          type="time"
          required
          step="60"
          value={form.event_date ? form.event_date.slice(11, 16) : ''}
          onChange={(e) => {
            const date = form.event_date ? form.event_date.slice(0, 10) : new Date().toISOString().slice(0, 10);
            onChange({ ...form, event_date: date + 'T' + e.target.value });
          }}
        />
      </div>
      <div>
        <label>Location</label>
        <input placeholder="Zoom (Online)" value={form.location} onChange={(e) => onChange({ ...form, location: e.target.value })} />
      </div>
      <div className="sm:col-span-2">
        <label>Description</label>
        <textarea rows={3} value={form.description} onChange={(e) => onChange({ ...form, description: e.target.value })} />
      </div>
      <div className="sm:col-span-2">
        <label>Event Cover Image</label>
        <div className="flex gap-2">
          <input placeholder="https://... or upload →" value={form.image} onChange={(e) => onChange({ ...form, image: e.target.value })} />
          <UploadBtn token={token} onUrl={(url) => onChange({ ...form, image: url })} label="📸 Upload" />
        </div>
        {form.image && (
          <img src={form.image} alt="" className="mt-2 h-24 rounded-xl object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
        )}
      </div>
      <div className="sm:col-span-2">
        <label>Gallery Images (one URL per line)</label>
        <textarea
          rows={5}
          placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"}
          value={form.gallery_images}
          onChange={(e) => onChange({ ...form, gallery_images: e.target.value })}
        />
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-navy-700/50">Leave blank to use the default conference photo set.</p>
          <UploadBtn
            token={token}
            label="📸 Upload photo"
            onUrl={(url) => onChange({ ...form, gallery_images: form.gallery_images ? form.gallery_images + '\n' + url : url })}
          />
        </div>
      </div>
    </div>
  );
}

function EventsSection({ token }: { token: string }) {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [galleries, setGalleries] = useState<Record<string, string[]>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EventForm | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<EventForm>({ title: '', description: '', location: '', event_date: '', image: '', gallery_images: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvents();
    apiGet('/settings').then((d: any) => setGalleries(d.event_galleries || {})).catch(() => {});
  }, []);

  async function loadEvents() {
    const data = await apiGet('/events');
    setEvents(data);
  }

  function startEdit(ev: EventRow) {
    setEditId(ev.id);
    setEditForm({
      title: ev.title ?? '',
      description: ev.description ?? '',
      location: ev.location ?? '',
      event_date: ev.event_date ? toLocalDatetime(ev.event_date) : '',
      image: ev.image ?? '',
      gallery_images: (galleries[ev.id] ?? []).join('\n'),
    });
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm || !editId) return;
    setSaving(true);
    setError('');
    try {
      const { gallery_images, ...eventData } = editForm;
      if (eventData.event_date) eventData.event_date = new Date(eventData.event_date).toISOString();
      await apiPut(`/admin/events/${editId}`, eventData, token);
      const urls = gallery_images.split('\n').map((s) => s.trim()).filter(Boolean);
      const newGalleries = { ...galleries, [editId]: urls };
      await saveSetting(token, 'event_galleries', newGalleries);
      setGalleries(newGalleries);
      setEditId(null);
      setEditForm(null);
      await loadEvents();
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const { gallery_images, ...eventData } = createForm;
      if (eventData.event_date) eventData.event_date = new Date(eventData.event_date).toISOString();
      const created = await apiPost('/admin/events', eventData, token) as EventRow;
      if (gallery_images.trim() && created?.id) {
        const urls = gallery_images.split('\n').map((s) => s.trim()).filter(Boolean);
        const newGalleries = { ...galleries, [created.id]: urls };
        await saveSetting(token, 'event_galleries', newGalleries);
        setGalleries(newGalleries);
      }
      setCreateForm({ title: '', description: '', location: '', event_date: '', image: '', gallery_images: '' });
      setShowCreate(false);
      await loadEvents();
    } catch (err: any) {
      setError(err.message || 'Create failed');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Permanently delete this event?')) return;
    await apiDelete(`/admin/events/${id}`, token);
    await loadEvents();
  }

  const isPast = (ev: EventRow) => new Date(ev.event_date).getTime() < Date.now();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-navy-700">All Events</h2>
        <button onClick={() => setShowCreate((v) => !v)} className="btn-primary">
          {showCreate ? 'Cancel' : '+ Add New Event'}
        </button>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {/* Create form */}
      {showCreate && (
        <div className="card">
          <h3 className="mb-4 font-display text-base font-bold text-navy-700">New Event</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <EventFormFields form={createForm} onChange={setCreateForm} token={token} />
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Create Event</button>
              <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Event list */}
      <div className="space-y-2">
        {events.length === 0 && <p className="py-8 text-center text-navy-700/50">No events yet.</p>}
        {events.map((ev) => (
          <div key={ev.id} className="overflow-hidden rounded-2xl border border-navy-50 bg-white shadow-soft">
            {/* Row */}
            <div className="flex items-center gap-4 p-4">
              {ev.image && (
                <img
                  src={ev.image}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-semibold text-navy-700">{ev.title}</p>
                <p className="text-sm text-navy-700/60">
                  {new Date(ev.event_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  {ev.location ? ` · ${ev.location}` : ''}
                </p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${isPast(ev) ? 'bg-slate-100 text-slate-600' : 'bg-sky-100 text-sky-700'}`}>
                  {isPast(ev) ? 'Past' : 'Upcoming'}
                </span>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => (editId === ev.id ? setEditId(null) : startEdit(ev))}
                  className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-100"
                >
                  {editId === ev.id ? 'Close' : 'Edit'}
                </button>
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Inline edit form */}
            {editId === ev.id && editForm && (
              <div className="border-t border-slate-100 bg-slate-50 p-4">
                <form onSubmit={saveEdit} className="space-y-4">
                  <EventFormFields form={editForm} onChange={setEditForm} token={token} />
                  <p className="text-xs text-navy-700/50">
                    Tip: set the date to a past date to move this event to the "Past Events" section on the website.
                  </p>
                  <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="btn-primary">
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => setEditId(null)} className="btn-secondary">Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Blog (full CRUD with inline edit) ────────────────────────────────────────

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_image: string | null;
  author: string | null;
  published: boolean;
  created_at: string;
};

type BlogForm = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image: string;
  author: string;
};

function BlogFormFields({ form, onChange, token }: { form: BlogForm; onChange: (f: BlogForm) => void; token: string }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label>Slug *</label>
          <input required placeholder="my-post-url" value={form.slug} onChange={(e) => onChange({ ...form, slug: e.target.value })} />
        </div>
        <div>
          <label>Author</label>
          <input placeholder="Dr Shalom Mojere" value={form.author} onChange={(e) => onChange({ ...form, author: e.target.value })} />
        </div>
      </div>
      <div>
        <label>Title *</label>
        <input required value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value })} />
      </div>
      <div>
        <label>Excerpt</label>
        <input placeholder="Short summary shown on the blog listing page" value={form.excerpt} onChange={(e) => onChange({ ...form, excerpt: e.target.value })} />
      </div>
      <div>
        <label>Cover Image</label>
        <div className="flex gap-2">
          <input placeholder="https://... or upload →" value={form.cover_image} onChange={(e) => onChange({ ...form, cover_image: e.target.value })} />
          <UploadBtn token={token} onUrl={(url) => onChange({ ...form, cover_image: url })} label="📸 Upload" />
        </div>
        {form.cover_image && (
          <img src={form.cover_image} alt="" className="mt-2 h-20 rounded-xl object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
        )}
      </div>
      <div>
        <label>Body *</label>
        <textarea required rows={6} value={form.body} onChange={(e) => onChange({ ...form, body: e.target.value })} />
      </div>
    </div>
  );
}

function BlogSection({ token }: { token: string }) {
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<BlogForm | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<BlogForm>({ slug: '', title: '', excerpt: '', body: '', cover_image: '', author: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts() {
    const data = await apiGet('/blog');
    setPosts(data);
  }

  function startEdit(p: BlogRow) {
    setEditId(p.id);
    setEditForm({
      slug: p.slug ?? '',
      title: p.title ?? '',
      excerpt: p.excerpt ?? '',
      body: p.body ?? '',
      cover_image: p.cover_image ?? '',
      author: p.author ?? '',
    });
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm || !editId) return;
    setSaving(true);
    setError('');
    try {
      await apiPut(`/admin/blog-posts/${editId}`, { ...editForm, published: true }, token);
      setEditId(null);
      setEditForm(null);
      await loadPosts();
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiPost('/admin/blog-posts', { ...createForm, published: true }, token);
      setCreateForm({ slug: '', title: '', excerpt: '', body: '', cover_image: '', author: '' });
      setShowCreate(false);
      await loadPosts();
    } catch (err: any) {
      setError(err.message || 'Create failed');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Permanently delete this post?')) return;
    await apiDelete(`/admin/blog-posts/${id}`, token);
    await loadPosts();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-navy-700">Blog Posts</h2>
        <button onClick={() => setShowCreate((v) => !v)} className="btn-primary">
          {showCreate ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {/* Create form */}
      {showCreate && (
        <div className="card">
          <h3 className="mb-4 font-display text-base font-bold text-navy-700">New Post</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <BlogFormFields form={createForm} onChange={setCreateForm} token={token} />
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Publish Post</button>
              <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Post list */}
      <div className="space-y-2">
        {posts.length === 0 && <p className="py-8 text-center text-navy-700/50">No posts yet.</p>}
        {posts.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-navy-50 bg-white shadow-soft">
            <div className="flex items-center gap-4 p-4">
              {p.cover_image && (
                <img
                  src={p.cover_image}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-semibold text-navy-700">{p.title}</p>
                <p className="text-sm text-navy-700/60">/{p.slug} · {p.author || 'No author'}</p>
                <p className="text-xs text-navy-700/40">{new Date(p.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => (editId === p.id ? setEditId(null) : startEdit(p))}
                  className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-100"
                >
                  {editId === p.id ? 'Close' : 'Edit'}
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>

            {editId === p.id && editForm && (
              <div className="border-t border-slate-100 bg-slate-50 p-4">
                <form onSubmit={saveEdit} className="space-y-4">
                  <BlogFormFields form={editForm} onChange={setEditForm} token={token} />
                  <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="btn-primary">
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => setEditId(null)} className="btn-secondary">Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Settings helpers ──────────────────────────────────────────────────────────

function saveSetting(token: string, key: string, value: unknown) {
  return apiPut(`/admin/settings/${key}`, { value }, token);
}

function SavedFlash({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="text-sm font-semibold text-green-600">Saved!</span>;
}

// ── File upload button ────────────────────────────────────────────────────────

function UploadBtn({
  token,
  onUrl,
  accept = 'image/*',
  label = '📎 Upload',
}: {
  token: string;
  onUrl: (url: string) => void;
  accept?: string;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr('');
    try {
      const result = (await apiUploadFile('/admin/upload', file, token)) as { url: string };
      onUrl(result.url);
    } catch (ex: any) {
      setErr(ex.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={handleChange} />
      <button
        type="button"
        disabled={uploading}
        onClick={() => ref.current?.click()}
        className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100 disabled:opacity-50 whitespace-nowrap"
      >
        {uploading ? 'Uploading…' : label}
      </button>
      {err && <p className="text-xs text-red-500">{err}</p>}
    </div>
  );
}

// ── Home Page ─────────────────────────────────────────────────────────────────

const HOME_DEFAULTS = {
  hero_badge: 'Mental Health, Identity & Wellness: Prepartum Through Postpartum',
  hero_title: 'Turn Your Pain Into Purpose',
  hero_subtitle:
    "Purpose In Pain Initiative CIC walks alongside mothers across the UK, Nigeria and the US, from prepartum preparation through postpartum recovery, helping them recognise what they're feeling, restore their identity, and find practical tools for healing, without shame.",
  pgs_heading: 'Postpartum care often forgets the mother',
  pgs_intro:
    "Postpartum care focuses heavily on the baby, rarely the mother. Many women don't recognise postpartum depression or anxiety early. Many feel ashamed to ask for help. Many lose their sense of self, overwhelmed by expectations, without practical tools to recover emotionally and mentally.",
  pgs_problem_title: 'The Problem',
  pgs_problem_text: 'Mothers carry silent overwhelm, anxiety, and loss of identity with few safe spaces to say so out loud.',
  pgs_gap_title: 'The Gap',
  pgs_gap_text: 'A lack of safe, accessible, culturally sensitive postpartum education, identity-restoration conversations, and practical everyday self-care tools.',
  pgs_solution_title: 'Our Solution',
  pgs_solution_text: 'A live, expert-led experience that educates, normalises help-seeking, restores identity, and equips mothers with practical tools plus year-round programs and community.',
  gains_heading: 'What Mothers Gain',
  gains_subtitle: 'Every program is designed around one goal: helping mothers leave with something they can actually use.',
  gains_list: [
    'Understanding postpartum mental health',
    'Ability to recognize early warning signs',
    'Confidence to seek help without shame',
    'Tools for emotional healing',
    'Practical self-care strategies',
    'Identity restoration',
    'Journaling techniques',
    'Community & reassurance',
  ] as string[],
  pillars_heading: 'Four Ways We Walk Alongside Mothers',
  pillars_subtitle: 'Our work is built around four program pillars: Identity, Purpose, Healing, and Community, each addressing a different part of the prepartum and postpartum journey.',
  values_heading: 'What We Stand For',
  values_subtitle: 'Purpose, community, and empowerment: the values behind everything we build.',
  cta_heading: "Be part of someone's healing story",
  cta_subtitle: 'Whether through giving your time or your resources, you can help a mother breathe a little easier today.',
};

type HomeContent = typeof HOME_DEFAULTS;

function HomeEditor({ token }: { token: string }) {
  const [content, setContent] = useState<HomeContent>({ ...HOME_DEFAULTS });
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState<string | null>('hero');

  useEffect(() => {
    apiGet('/settings')
      .then((d: any) => { if (d.home) setContent({ ...HOME_DEFAULTS, ...d.home }); })
      .catch(() => {});
  }, []);

  async function save() {
    await saveSetting(token, 'home', content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function set(key: keyof HomeContent, val: string) {
    setContent((prev) => ({ ...prev, [key]: val }));
  }

  function inp(label: string, key: keyof HomeContent, rows?: number) {
    return (
      <div>
        <label>{label}</label>
        {rows ? (
          <textarea rows={rows} value={(content[key] as string) ?? ''} onChange={(e) => set(key, e.target.value)} />
        ) : (
          <input value={(content[key] as string) ?? ''} onChange={(e) => set(key, e.target.value)} />
        )}
      </div>
    );
  }

  const SECTIONS = [
    {
      key: 'hero',
      title: '🏠 Hero Banner',
      body: (
        <div className="space-y-4">
          {inp('Badge label (small text above title)', 'hero_badge')}
          {inp('Main headline', 'hero_title')}
          {inp('Description paragraph', 'hero_subtitle', 4)}
        </div>
      ),
    },
    {
      key: 'pgs',
      title: '⚠️ Problem / Gap / Solution',
      body: (
        <div className="space-y-4">
          {inp('Section heading', 'pgs_heading')}
          {inp('Intro paragraph', 'pgs_intro', 3)}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              {inp('Card 1 title', 'pgs_problem_title')}
              {inp('Card 1 text', 'pgs_problem_text', 3)}
            </div>
            <div className="space-y-2">
              {inp('Card 2 title', 'pgs_gap_title')}
              {inp('Card 2 text', 'pgs_gap_text', 3)}
            </div>
            <div className="space-y-2">
              {inp('Card 3 title', 'pgs_solution_title')}
              {inp('Card 3 text', 'pgs_solution_text', 3)}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'gains',
      title: '✓ What Mothers Gain',
      body: (
        <div className="space-y-4">
          {inp('Section heading', 'gains_heading')}
          {inp('Subtitle', 'gains_subtitle', 2)}
          <div>
            <label>Gains list items</label>
            <div className="space-y-2">
              {(content.gains_list as string[]).map((g, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="flex-1"
                    value={g}
                    onChange={(e) => {
                      const list = [...(content.gains_list as string[])];
                      list[i] = e.target.value;
                      setContent((prev) => ({ ...prev, gains_list: list }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setContent((prev) => ({ ...prev, gains_list: (prev.gains_list as string[]).filter((_, idx) => idx !== i) }))}
                    className="px-2 font-bold text-lg text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setContent((prev) => ({ ...prev, gains_list: [...(prev.gains_list as string[]), ''] }))}
              className="btn-secondary mt-2"
            >
              + Add item
            </button>
          </div>
        </div>
      ),
    },
    {
      key: 'pillars',
      title: '🎯 Program Pillars Section',
      body: (
        <div className="space-y-4">
          {inp('Section heading', 'pillars_heading')}
          {inp('Subtitle', 'pillars_subtitle', 3)}
        </div>
      ),
    },
    {
      key: 'values',
      title: '💜 Values Section',
      body: (
        <div className="space-y-4">
          {inp('Section heading', 'values_heading')}
          {inp('Subtitle', 'values_subtitle', 2)}
        </div>
      ),
    },
    {
      key: 'cta',
      title: '📣 Bottom CTA Banner',
      body: (
        <div className="space-y-4">
          {inp('Heading', 'cta_heading')}
          {inp('Subtext', 'cta_subtitle', 2)}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-navy-700">Home Page Content</h2>
        <div className="flex items-center gap-3">
          <SavedFlash show={saved} />
          <button onClick={save} className="btn-primary">Save All</button>
        </div>
      </div>
      {SECTIONS.map((s) => (
        <div key={s.key} className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft">
          <button
            type="button"
            className="flex w-full items-center justify-between px-5 py-4 text-left font-display font-semibold text-navy-700 hover:bg-slate-50"
            onClick={() => setOpen((prev) => (prev === s.key ? null : s.key))}
          >
            <span>{s.title}</span>
            <span className="text-navy-700/40">{open === s.key ? '▲' : '▼'}</span>
          </button>
          {open === s.key && (
            <div className="border-t border-navy-50 px-5 pb-6 pt-4">
              {s.body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Team ─────────────────────────────────────────────────────────────────────

function TeamEditor({ token }: { token: string }) {
  const [members, setMembers] = useState(defaultTeam.map((m) => ({ ...m })));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet('/settings')
      .then((d: any) => { if (d.team) setMembers(d.team); })
      .catch(() => {});
  }, []);

  function update(i: number, field: 'name' | 'photo', val: string) {
    setMembers((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)));
  }

  async function save() {
    await saveSetting(token, 'team', members);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="card space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <h3 className="font-display text-lg font-bold text-navy-700 flex-1">Team Members</h3>
        <SavedFlash show={saved} />
      </div>
      <p className="text-xs text-navy-700/60">Photo: paste a URL. Changes apply site-wide when saved.</p>
      <div className="space-y-3">
        {members.map((m, i) => (
          <div key={i} className="flex items-center gap-3">
            {m.photo && (
              <img src={m.photo} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
            )}
            <input className="flex-1" placeholder="Name" value={m.name} onChange={(e) => update(i, 'name', e.target.value)} />
            <input className="flex-1" placeholder="Photo URL or upload →" value={m.photo} onChange={(e) => update(i, 'photo', e.target.value)} />
            <UploadBtn token={token} onUrl={(url) => update(i, 'photo', url)} label="📸" />
            <button onClick={() => setMembers((prev) => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 font-bold text-lg leading-none px-1">×</button>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={() => setMembers((prev) => [...prev, { name: '', photo: '' }])} className="btn-secondary">+ Add Member</button>
        <button onClick={save} className="btn-primary">Save Team</button>
      </div>
    </div>
  );
}

// ── Programs ──────────────────────────────────────────────────────────────────

function ProgramsEditor({ token }: { token: string }) {
  const [progs, setProgs] = useState(defaultPrograms.map((p) => ({ slug: p.slug, name: p.name, mission: p.mission, image: p.image, summary: p.summary })));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet('/settings')
      .then((d: any) => { if (d.programs) setProgs(d.programs); })
      .catch(() => {});
  }, []);

  function update(i: number, field: string, val: string) {
    setProgs((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)));
  }

  async function save() {
    await saveSetting(token, 'programs', progs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="card space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <h3 className="font-display text-lg font-bold text-navy-700 flex-1">Programs</h3>
        <SavedFlash show={saved} />
      </div>
      {progs.map((p, i) => (
        <div key={i} className="rounded-xl border border-navy-100 p-4 space-y-3">
          <div className="flex items-center gap-3">
            {p.image && <img src={p.image} alt="" className="h-16 w-16 rounded-xl object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />}
            <div className="flex-1 space-y-2">
              <input className="font-bold" placeholder="Program name" value={p.name} onChange={(e) => update(i, 'name', e.target.value)} />
              <div className="flex gap-2">
                <input placeholder="Image URL or upload →" value={p.image} onChange={(e) => update(i, 'image', e.target.value)} />
                <UploadBtn token={token} onUrl={(url) => update(i, 'image', url)} label="📸" />
              </div>
            </div>
          </div>
          <input placeholder="Mission tagline" value={p.mission} onChange={(e) => update(i, 'mission', e.target.value)} />
          <textarea rows={2} placeholder="Summary" value={p.summary} onChange={(e) => update(i, 'summary', e.target.value)} />
        </div>
      ))}
      <button onClick={save} className="btn-primary">Save Programs</button>
    </div>
  );
}

// ── Brands ────────────────────────────────────────────────────────────────────

function BrandsEditor({ token }: { token: string }) {
  const [brands, setBrands] = useState(defaultBrands.map((b) => ({ ...b })));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet('/settings')
      .then((d: any) => { if (d.brands) setBrands(d.brands); })
      .catch(() => {});
  }, []);

  function update(i: number, field: 'name' | 'logo', val: string) {
    setBrands((prev) => prev.map((b, idx) => (idx === i ? { ...b, [field]: val } : b)));
  }

  async function save() {
    await saveSetting(token, 'brands', brands);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="card space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <h3 className="font-display text-lg font-bold text-navy-700 flex-1">Partner Brand Logos</h3>
        <SavedFlash show={saved} />
      </div>
      <p className="text-xs text-navy-700/60">Each partner gets their own logo image in the scrolling slider above the footer. Add a name and paste a logo image URL for each one.</p>
      <div className="space-y-3">
        {brands.map((b, i) => (
          <div key={i} className="flex items-center gap-3">
            {b.logo && <img src={b.logo} alt="" className="h-10 w-24 rounded object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />}
            <input className="flex-1" placeholder="Brand name" value={b.name} onChange={(e) => update(i, 'name', e.target.value)} />
            <input className="flex-1" placeholder="Logo URL or upload →" value={b.logo} onChange={(e) => update(i, 'logo', e.target.value)} />
            <UploadBtn token={token} onUrl={(url) => update(i, 'logo', url)} label="📸" />
            <button onClick={() => setBrands((prev) => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 font-bold text-lg px-1">×</button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setBrands((prev) => [...prev, { name: '', logo: '' }])} className="btn-secondary">+ Add Brand</button>
        <button onClick={() => setBrands(defaultBrands.map((b) => ({ ...b })))} className="btn-secondary">Reset to Defaults (11 logos)</button>
        <button onClick={save} className="btn-primary">Save Brands</button>
      </div>
    </div>
  );
}

// ── Contact Info ──────────────────────────────────────────────────────────────

function ContactEditor({ token }: { token: string }) {
  const [info, setInfo] = useState({ ...defaultContact });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet('/settings')
      .then((d: any) => { if (d.contact) setInfo(d.contact); })
      .catch(() => {});
  }, []);

  async function save() {
    await saveSetting(token, 'contact', info);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="card space-y-4 max-w-lg">
      <div className="flex items-center gap-3">
        <h3 className="font-display text-lg font-bold text-navy-700 flex-1">Contact Info</h3>
        <SavedFlash show={saved} />
      </div>
      {(['email', 'phone', 'whatsapp'] as const).map((f) => (
        <div key={f}>
          <label className="capitalize">{f}</label>
          <input value={(info as any)[f] ?? ''} onChange={(e) => setInfo({ ...info, [f]: e.target.value })} />
        </div>
      ))}
      <button onClick={save} className="btn-primary">Save Contact Info</button>
    </div>
  );
}

// ── Social Links ──────────────────────────────────────────────────────────────

function SocialEditor({ token }: { token: string }) {
  const [links, setLinks] = useState({ ...defaultSocial });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet('/settings')
      .then((d: any) => { if (d.social) setLinks(d.social); })
      .catch(() => {});
  }, []);

  async function save() {
    await saveSetting(token, 'social', links);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="card space-y-4 max-w-lg">
      <div className="flex items-center gap-3">
        <h3 className="font-display text-lg font-bold text-navy-700 flex-1">Social Links</h3>
        <SavedFlash show={saved} />
      </div>
      {(Object.keys(defaultSocial) as (keyof typeof defaultSocial)[]).map((f) => (
        <div key={f}>
          <label className="capitalize">{f}</label>
          <input value={(links as any)[f] ?? ''} onChange={(e) => setLinks({ ...links, [f]: e.target.value })} />
        </div>
      ))}
      <button onClick={save} className="btn-primary">Save Social Links</button>
    </div>
  );
}

// ── Shop & Books ──────────────────────────────────────────────────────────────

type ShopProduct = {
  slug: string;
  name: string;
  author: string;
  description: string;
  image: string;
  price: string;
  category: 'book' | 'merch';
  link: string;
};

const SHOP_DEFAULTS: ShopProduct[] = [
  {
    slug: 'finding-purpose',
    name: 'Finding Purpose (eBook)',
    author: 'Dr Shalom Oluwabusayo Mojere',
    description: 'A 7-day step-by-step guide to discovering purpose in pain. Practical, heartfelt, and written for every mother who has felt lost.',
    image: '/assets/images/finding-purpose-ebook.jpg',
    price: '£9.99',
    category: 'book',
    link: 'https://linktr.ee/purposeinpain1',
  },
  {
    slug: 'identity-hoodie',
    name: 'Identity Hoodie',
    author: '',
    description: 'Wear your identity with pride. Our signature PIP branded hoodie: comfortable, bold, and a reminder of who you truly are.',
    image: '/assets/images/value-identity-merch.jpg',
    price: 'Coming Soon',
    category: 'merch',
    link: '',
  },
];

function ShopEditor({ token }: { token: string }) {
  const [products, setProducts] = useState<ShopProduct[]>(SHOP_DEFAULTS.map((p) => ({ ...p })));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet('/settings')
      .then((d: any) => { if (Array.isArray(d.shop?.products)) setProducts(d.shop.products); })
      .catch(() => {});
  }, []);

  function update(i: number, field: keyof ShopProduct, val: string) {
    setProducts((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)));
  }

  async function save() {
    await saveSetting(token, 'shop', { products });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-navy-700">Shop & Books</h2>
        <div className="flex items-center gap-3">
          <SavedFlash show={saved} />
          <button onClick={save} className="btn-primary">Save All</button>
        </div>
      </div>
      <p className="text-xs text-navy-700/60">Edit books and merchandise that appear in the Shop page and on the Home page.</p>

      {products.map((p, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft">
          <div className="flex items-center gap-4 p-4 border-b border-navy-50">
            {p.image && <img src={p.image} alt="" className="h-16 w-16 rounded-xl object-cover shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />}
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-navy-700 truncate">{p.name || 'Untitled'}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.category === 'book' ? 'bg-sky-100 text-sky-700' : 'bg-purple-100 text-purple-700'}`}>
                {p.category === 'book' ? 'Book' : 'Merchandise'}
              </span>
            </div>
            <button onClick={() => setProducts((prev) => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 font-bold text-xl px-2">×</button>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            <div>
              <label>Name *</label>
              <input value={p.name} onChange={(e) => update(i, 'name', e.target.value)} />
            </div>
            <div>
              <label>Price (e.g. £9.99 or "Coming Soon")</label>
              <input placeholder="£9.99" value={p.price} onChange={(e) => update(i, 'price', e.target.value)} />
            </div>
            <div>
              <label>Author (books only)</label>
              <input placeholder="Dr Shalom Mojere" value={p.author} onChange={(e) => update(i, 'author', e.target.value)} />
            </div>
            <div>
              <label>Category</label>
              <select value={p.category} onChange={(e) => update(i, 'category', e.target.value)}>
                <option value="book">Book</option>
                <option value="merch">Merchandise</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label>Description</label>
              <textarea rows={2} value={p.description} onChange={(e) => update(i, 'description', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label>Product Image</label>
              <div className="flex gap-2">
                <input placeholder="https://... or upload →" value={p.image} onChange={(e) => update(i, 'image', e.target.value)} />
                <UploadBtn token={token} onUrl={(url) => update(i, 'image', url)} label="📸 Upload" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label>Buy / Order Link or Document</label>
              <div className="flex gap-2">
                <input placeholder="https://linktr.ee/... or upload PDF →" value={p.link} onChange={(e) => update(i, 'link', e.target.value)} />
                <UploadBtn token={token} onUrl={(url) => update(i, 'link', url)} accept="application/pdf,.doc,.docx,.epub" label="📄 Upload" />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => setProducts((prev) => [...prev, { slug: `item-${Date.now()}`, name: '', author: '', description: '', image: '', price: '', category: 'book', link: '' }])}
        className="btn-secondary"
      >
        + Add Product
      </button>
    </div>
  );
}

// ── Navigation Labels ─────────────────────────────────────────────────────────

const DEFAULT_NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/events', label: 'Events' },
  { to: '/blog', label: 'Blog' },
  { to: '/shop', label: 'Shop' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/contact', label: 'Contact' },
  { to: '/donate', label: 'Donate (button)' },
];

function NavEditor({ token }: { token: string }) {
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet('/settings')
      .then((d: any) => { if (d.nav_labels) setLabels(d.nav_labels); })
      .catch(() => {});
  }, []);

  async function save() {
    await saveSetting(token, 'nav_labels', labels);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="card space-y-4 max-w-lg">
      <div className="flex items-center gap-3">
        <h3 className="font-display text-lg font-bold text-navy-700 flex-1">Navigation Labels</h3>
        <SavedFlash show={saved} />
      </div>
      <p className="text-xs text-navy-700/60">Change the text shown in the top navigation bar. Paths stay the same — only labels change.</p>
      <div className="space-y-3">
        {DEFAULT_NAV_LINKS.map((link) => (
          <div key={link.to} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-navy-700/50">{link.to}</span>
            <input
              placeholder={link.label}
              value={labels[link.to] ?? ''}
              onChange={(e) => setLabels({ ...labels, [link.to]: e.target.value })}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={() => setLabels({})} className="btn-secondary">Reset to Defaults</button>
        <button onClick={save} className="btn-primary">Save Navigation</button>
      </div>
    </div>
  );
}

// ── Newsletter section (send + subscriber list) ───────────────────────────────

function NewsletterSection({ token }: { token: string }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [sendError, setSendError] = useState('');

  async function sendEmail(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setSendError('');
    setResult(null);
    try {
      const r = await apiPost('/admin/newsletter/send', { subject, body }, token);
      setResult(r as any);
      setSubject('');
      setBody('');
    } catch (err: any) {
      setSendError(err.message || 'Send failed');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card max-w-xl space-y-4">
        <h3 className="font-display text-lg font-bold text-navy-700">Send Email to All Subscribers</h3>
        <p className="text-xs text-navy-700/60">Write your message below and click Send. Every current subscriber will receive it.</p>
        <form onSubmit={sendEmail} className="space-y-4">
          <div>
            <label>Subject *</label>
            <input required placeholder="Monthly Update from Purpose In Pain" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <label>Message *</label>
            <textarea required rows={6} placeholder="Write your message here..." value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          {sendError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{sendError}</p>}
          {result && (
            <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              Sent to <strong>{result.sent}</strong> subscriber{result.sent !== 1 ? 's' : ''}
              {result.failed > 0 ? ` · ${result.failed} failed to deliver` : ''}.
            </p>
          )}
          <button type="submit" disabled={sending} className="btn-primary">
            {sending ? 'Sending…' : 'Send Email'}
          </button>
        </form>
      </div>

      <div>
        <h3 className="mb-3 font-display text-base font-bold text-navy-700">Subscribers</h3>
        <InboxTable endpoint="/admin/newsletter-subscribers" token={token} columns={[
          { key: 'email', label: 'Email' },
          { key: 'created_at', label: 'Subscribed', render: (r) => new Date(r.created_at).toLocaleString() },
        ]} />
      </div>
    </div>
  );
}

// ── Inbox table ───────────────────────────────────────────────────────────────

function InboxTable({
  endpoint,
  token,
  columns,
}: {
  endpoint: string;
  token: string;
  columns: { key: string; label: string; render?: (r: any) => React.ReactNode }[];
}) {
  const [rows, setRows] = useState<any[] | null>(null);

  useEffect(() => {
    apiGetAuthed(endpoint, token).then(setRows).catch(() => setRows([]));
  }, [endpoint, token]);

  if (!rows) return <p className="text-navy-700/60">Loading…</p>;
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
