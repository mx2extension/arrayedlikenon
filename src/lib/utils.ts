import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabaseAdmin } from './supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = process.env.NEXT_PUBLIC_CURRENCY || 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateTrackingId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `ALN-${new Date().getFullYear()}-${code}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function uploadImage(
  fileOrBuffer: File | Buffer,
  fileName?: string,
  contentType?: string
): Promise<string> {
  if (!supabaseAdmin) throw new Error('Supabase admin client is not configured.');

  let path = '';
  let mime = contentType || 'application/octet-stream';
  let payload: File | Buffer = fileOrBuffer;

  if (fileOrBuffer instanceof Buffer) {
    if (!fileName) throw new Error('File name is required when uploading from a Buffer.');
    const ext = fileName.split('.').pop() || 'png';
    path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    payload = fileOrBuffer;
  } else if ('name' in fileOrBuffer) {
    const ext = fileOrBuffer.name.split('.').pop() || 'png';
    path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    mime = fileOrBuffer.type;
    payload = fileOrBuffer;
  } else {
    throw new Error('Invalid file payload provided.');
  }

  const { error } = await supabaseAdmin.storage
    .from('aln-images')
    .upload(path, payload, { contentType: mime });

  if (error) throw error;

  const { data } = supabaseAdmin.storage.from('aln-images').getPublicUrl(path);
  return data.publicUrl;
}