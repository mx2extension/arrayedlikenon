import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const serverPassword = process.env.ADMIN_PASSWORD;

    if (!serverPassword) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (password === serverPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}