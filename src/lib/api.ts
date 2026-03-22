import type { Post } from './types';

const API_BASE = '/api';

export async function fetchPosts(params?: { category?: string; search?: string }): Promise<Post[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.search) query.set('search', params.search);
  const qs = query.toString();
  const res = await fetch(`${API_BASE}/posts${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function fetchPost(id: string): Promise<Post> {
  const res = await fetch(`${API_BASE}/posts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

export async function createPost(data: Pick<Post, 'title' | 'content' | 'category'>): Promise<Post> {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

export async function updatePost(id: string, data: Pick<Post, 'title' | 'content' | 'category'>): Promise<Post> {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete post');
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload image');
  return res.json();
}
