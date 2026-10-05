import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminContactPage() {
  if (!supabaseAdmin) {
    return (
      <div className="p-8 border border-red-200 bg-red-50 text-red-800 text-xs font-mono">
        <p className="font-bold uppercase tracking-wider mb-1">Configuration Error</p>
        <p>SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.</p>
      </div>
    );
  }

  const { data: messages, error } = await supabaseAdmin
    .from('contact_inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8 border border-red-200 bg-red-50 text-red-800 text-xs font-mono">
        <p className="font-bold uppercase tracking-wider mb-1">Database Error</p>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-black/10 pb-6 flex justify-between items-end">
        <div>
          <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-50 block mb-1">
            Communication Log
          </span>
          <h1 className="font-serif text-4xl font-light">Contact Inquiries</h1>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-black/40">
          {messages?.length || 0} Total Messages
        </span>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {(!messages || messages.length === 0) ? (
          <div className="border border-black/10 bg-white p-12 text-center text-xs font-mono uppercase tracking-widest opacity-40">
            No contact inquiries logged in database
          </div>
        ) : (
          messages.map((msg: any) => (
            <div
              key={msg.id}
              className="border border-black/10 bg-white p-6 space-y-4 hover:border-black/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-3 font-mono text-xs">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold uppercase tracking-wider text-sm">
                      {msg.full_name || 'Anonymous Guest'}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold border ${
                        msg.status === 'read'
                          ? 'border-black/20 text-black/50 bg-neutral-100'
                          : 'border-amber-800 text-amber-800 bg-amber-50'
                      }`}
                    >
                      {msg.status || 'unread'}
                    </span>
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-black/60 hover:text-black underline text-[11px] block mt-1"
                  >
                    {msg.email}
                  </a>
                </div>
                <div className="text-[10px] text-black/40 uppercase tracking-widest">
                  {new Date(msg.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {msg.subject && (
                <p className="text-xs font-mono font-semibold uppercase tracking-wider text-black/70">
                  Subject: {msg.subject}
                </p>
              )}

              <p className="text-sm font-sans text-black/80 whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}