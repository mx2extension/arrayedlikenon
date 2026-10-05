import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate MIME type (Ensure image only)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Uploaded file must be an image' }, { status: 400 });
    }

    // Convert file object to ArrayBuffer for server compatibility
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Pass both buffer and file details to the utility handler
    const url = await uploadImage(buffer, file.name, file.type);

    return NextResponse.json({ url }, { status: 200 });
  } catch (err: any) {
    console.error('Upload Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}