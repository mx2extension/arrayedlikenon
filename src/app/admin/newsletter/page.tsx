import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminNewsletterPage() {
  if (!supabaseAdmin) {
    return (
      <div className="p-8 border border-red-200 bg-red-50 text-red-800 text-xs font-mono">
        <p className="font-bold uppercase tracking-wider mb-1">Configuration Error</p>
        <p>SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.</p>
      </div>
    );
  }

  const { data: subscribers, error } = await supabaseAdmin
    .from('newsletter_subscribers')
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
      {/* Header */}
      <div className="border-b border-black/10 pb-6 flex justify-between items-end">
        <div>
          <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-50 block mb-1">
            Audience Distribution
          </span>
          <h1 className="font-serif text-4xl font-light">Newsletter Subscribers</h1>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-black/40">
          {subscribers?.length || 0} Total Subscribers
        </span>
      </div>

      {/* Table */}
      <div className="border border-black/10 bg-white">
        {(!subscribers || subscribers.length === 0) ? (
          <div className="p-12 text-center text-xs font-mono uppercase tracking-widest opacity-40">
            No subscribers logged in database
          </div>
        ) : (
          <div className="divide-y divide-black/10">
            {/* Table Header */}
            <div className="grid grid-cols-12 p-4 font-mono text-[9px] uppercase tracking-widest opacity-50 bg-neutral-50">
              <span className="col-span-6 sm:col-span-7">Email Address</span>
              <span className="col-span-3 sm:col-span-2 text-center">Status</span>
              <span className="col-span-3 text-right">Subscribed Date</span>
            </div>

            {/* Subscriber Rows */}
            {subscribers.map((sub: any) => (
              <div
                key={sub.id}
                className="grid grid-cols-12 items-center p-4 text-xs font-mono hover:bg-neutral-50 transition-colors"
              >
                <a
                  href={`mailto:${sub.email}`}
                  className="col-span-6 sm:col-span-7 font-medium truncate text-black hover:underline"
                >
                  {sub.email}
                </a>
                <div className="col-span-3 sm:col-span-2 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold border ${
                      sub.is_active
                        ? 'border-emerald-800/30 text-emerald-800 bg-emerald-50'
                        : 'border-red-800/30 text-red-800 bg-red-50'
                    }`}
                  >
                    {sub.is_active ? 'Active' : 'Unsubscribed'}
                  </span>
                </div>
                <span className="col-span-3 text-right text-black/50 text-[10px]">
                  {new Date(sub.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}