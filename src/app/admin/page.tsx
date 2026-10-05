import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  if (!supabaseAdmin) {
    return (
      <div className="p-8 border border-red-200 bg-red-50 text-red-800 text-xs font-mono">
        <p className="font-bold uppercase tracking-wider mb-1">Configuration Error</p>
        <p>SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.</p>
      </div>
    );
  }

  // Fetch counts, recent orders, and calculated total revenue concurrently
  const [
    { count: productCount },
    { count: orderCount },
    { count: collectionCount },
    { data: recentOrders },
    { data: paidOrders }
  ] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('collections').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(6),
    supabaseAdmin.from('orders').select('total_amount').eq('payment_status', 'paid')
  ]);

  const totalRevenue = paidOrders?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0;

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
    { label: 'Total Orders', value: orderCount || 0 },
    { label: 'Active Products', value: productCount || 0 },
    { label: 'Collections', value: collectionCount || 0 },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-black/10 pb-6">
        <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-50 block mb-1">
          Atelier Overview
        </span>
        <h1 className="font-serif text-4xl font-light">Dashboard</h1>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-black/10 p-6 bg-neutral-50/50 flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-[0.18em] uppercase opacity-50 block">
              {s.label}
            </span>
            <span className="font-serif text-3xl font-light mt-4 block text-black">
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Orders List */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-black/10 pb-3">
          <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-60">
            Recent Guest Orders
          </h2>
          <span className="text-[9px] font-mono uppercase tracking-widest text-black/40">
            Showing Last 6
          </span>
        </div>

        <div className="border border-black/10 divide-y divide-black/10 bg-white">
          {(!recentOrders || recentOrders.length === 0) ? (
            <div className="p-8 text-center text-xs font-mono uppercase tracking-widest opacity-40">
              No incoming orders logged in database
            </div>
          ) : (
            recentOrders.map((order: any) => (
              <div 
                key={order.id} 
                className="grid grid-cols-2 md:grid-cols-5 items-center p-4 text-xs font-mono gap-4 hover:bg-neutral-50 transition-colors"
              >
                <span className="font-bold uppercase tracking-wider">{order.tracking_code || order.tracking_id || 'ALN-GUEST'}</span>
                <span className="truncate opacity-80">{order.customer_name}</span>
                <span className="text-black/50 text-[10px]">
                  {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div>
                  <span className={`inline-block px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold border ${
                    order.order_status === 'shipped' || order.order_status === 'delivered' 
                      ? 'border-emerald-800 text-emerald-800 bg-emerald-50'
                      : 'border-amber-800 text-amber-800 bg-amber-50'
                  }`}>
                    {order.order_status || order.status || 'queued'}
                  </span>
                </div>
                <span className="text-right font-serif text-sm font-semibold">
                  ${Number(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}