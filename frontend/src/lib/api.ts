const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function handle(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      data?.error?.formErrors?.[0] ||
      data?.error?.fieldErrors ||
      data?.error ||
      'Something went wrong. Please try again.';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
  return data;
}

export async function apiGet(path: string) {
  const res = await fetch(`${API_BASE}${path}`);
  return handle(res);
}

export async function apiPost(path: string, body: unknown, token?: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return handle(res);
}

export async function apiPut(path: string, body: unknown, token?: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return handle(res);
}

export async function apiDelete(path: string, token?: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || 'Something went wrong.');
  }
}

export async function apiUploadFile(path: string, file: File, token: string) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  return handle(res);
}

export async function apiGetAuthed(path: string, token: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}
