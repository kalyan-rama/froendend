import React, { useState, useEffect } from 'react';
import { 
  Search, Package, Truck, Home, Loader2, Calendar, MapPin, 
  User, RefreshCw, Layers, ShieldCheck, CreditCard, Sparkles, CheckCircle, ArrowRight
} from 'lucide-react';
import { getApiUrl } from '../utils/api';

interface OrderTrackerProps {
  token: string | null;
  user: any | null;
  onOpenAuth: () => void;
}

export default function OrderTracker({ token, user, onOpenAuth }: OrderTrackerProps) {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [fetchingHistory, setFetchingHistory] = useState(false);

  // Fetch client historical orders if logged-in
  const fetchUserOrders = async () => {
    if (!token) return;
    setFetchingHistory(true);
    try {
      const resp = await fetch(getApiUrl('/api/orders'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        setUserOrders(data);
      }
    } catch (err) {
      console.error('Error fetching order ledger:', err);
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [token]);

  // Handle direct order lookup by ID
  const handleLookupOrder = async (e?: React.FormEvent, lookupId?: string) => {
    if (e) e.preventDefault();
    const idToSearch = lookupId || orderIdInput.trim();
    if (!idToSearch) return;

    setLoading(true);
    setError('');
    setActiveOrder(null);

    try {
      // Fetch request
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const resp = await fetch(getApiUrl(`/api/payments/cashfree-verify`), {
        method: 'POST',
        headers,
        body: JSON.stringify({ orderId: idToSearch })
      });

      const result = await resp.json();
      if (resp.ok && result.order) {
        setActiveOrder(result.order);
      } else {
        setError(result.error || `Order with ID "${idToSearch}" not found or payment status is still pending.`);
      }
    } catch (err: any) {
      setError('Connection failed. Please ensure your Order ID is correct.');
    } finally {
      setLoading(false);
    }
  };

  // Map database status string into custom aesthetic milestone phases
  const getTimelineStages = (order: any) => {
    const isPaid = order.paymentStatus === 'Paid';
    const status = order.orderStatus; // Pending, Accepted, Shipped, Delivered

    const stages = [
      {
        title: 'Order Approved',
        description: isPaid ? 'Payment fully processed & verified' : 'Cash on Delivery approved',
        date: order.createdAt,
        completed: true,
        active: status === 'Pending'
      },
      {
        title: 'Loom Allocation',
        description: 'Assigned to master weavers & gold zari threads configured',
        completed: status !== 'Pending' && status !== 'Cancelled',
        active: status === 'Accepted'
      },
      {
        title: 'Insured Transit Cargo',
        description: 'Packed in vacuum-sealed heritage boxes and dispatched',
        completed: status === 'Shipped' || status === 'Delivered',
        active: status === 'Shipped'
      },
      {
        title: 'Delivered',
        description: 'Safely arrived at your premium threshold with certificate',
        completed: status === 'Delivered',
        active: status === 'Delivered'
      }
    ];

    if (status === 'Cancelled') {
      stages.push({
        title: 'Order Cancelled',
        description: 'Weave booking decommissioned from Master Registry',
        completed: true,
        active: true
      });
    }

    return stages;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      
      {/* Decorative Golden Top Margin Band */}
      <div className="text-center space-y-2 mb-8">
        <span className="text-[10px] uppercase tracking-widest text-amber-800 font-bold bg-amber-900/5 px-3 py-1 rounded-full border border-amber-900/10">
          Trace Loom Status Real-Time
        </span>
        <h2 className="font-serif text-3xl font-extrabold text-stone-950 uppercase tracking-tight">
          Sri Praharsha Weaving Ledger
        </h2>
        <p className="text-stone-500 text-xs max-w-lg mx-auto leading-relaxed">
          Monitor your heritage silk piece from warp threads configuration on traditional looms to insured premium threshold delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left column: Lookup Controls */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Lookup Panel */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wide">
              <Search className="w-4 h-4 text-amber-900" />
              <span>Direct Lookup</span>
            </h3>

            <form onSubmit={(e) => handleLookupOrder(e)} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Enter Order ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. order-1001"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  className="px-3 py-2 w-full bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-900 font-mono font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-900 hover:bg-amber-950 text-stone-50 font-bold text-xs py-2.5 rounded shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Track Piece Status</span>
                )}
              </button>
            </form>

            {error && (
              <p className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 p-2.5 rounded">
                ⚠️ {error}
              </p>
            )}
          </div>

          {/* Customer Vault Login Shortcut */}
          {!token && (
            <div className="bg-gradient-to-br from-amber-900/5 to-amber-900/10 border border-amber-900/15 rounded-2xl p-5 shadow-sm text-center space-y-3">
              <Sparkles className="w-6 h-6 text-amber-700 mx-auto" />
              <h4 className="font-serif text-xs font-bold text-stone-950 uppercase tracking-wider">
                Authorized Buyer Cabinet
              </h4>
              <p className="text-stone-500 text-[10px] leading-relaxed">
                Log in with your customer account to instantly view all historical order ledgers without manually searching IDs.
              </p>
              <button
                onClick={onOpenAuth}
                className="mx-auto w-full bg-white hover:bg-stone-50 border border-amber-900/20 text-stone-900 font-extrabold text-[11px] py-1.5 rounded cursor-pointer flex items-center justify-center gap-1 shadow-sm"
              >
                <span>Access Profile Console</span>
                <ArrowRight className="w-3 h-3 text-amber-800" />
              </button>
            </div>
          )}

          {/* Active Logged-in Customer History List */}
          {token && (
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="font-serif text-sm font-bold text-stone-900 flex items-center justify-between uppercase tracking-wide">
                <span>Your Order Books</span>
                {fetchingHistory && <Loader2 className="w-3 h-3 animate-spin text-amber-800" />}
              </h3>

              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-none divide-y divide-stone-100">
                {userOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => handleLookupOrder(undefined, ord.id)}
                    className={`w-full text-left py-2.5 hover:bg-stone-50 px-1 rounded transition-colors flex justify-between items-center ${
                      activeOrder?.id === ord.id ? 'bg-amber-950/5 border-l-2 border-amber-900 pl-1.5 font-bold' : ''
                    }`}
                  >
                    <div>
                      <span className="font-mono text-xs font-semibold block text-stone-900">#{ord.id}</span>
                      <span className="text-[10px] text-stone-400 block">{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xs block">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                      <span className={`text-[9px] uppercase font-bold ${
                        ord.orderStatus === 'Pending' ? 'text-amber-600' :
                        ord.orderStatus === 'Shipped' ? 'text-blue-600' :
                        ord.orderStatus === 'Delivered' ? 'text-emerald-600 font-extrabold' :
                        'text-stone-400'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </div>
                  </button>
                ))}

                {userOrders.length === 0 && !fetchingHistory && (
                  <p className="text-[11px] text-stone-400 text-center py-4 italic">
                    You haven't booked any handloom masterpieces yet.
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right column: Timeline Progression View */}
        <div className="md:col-span-2">
          {activeOrder ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6 animate-fadeIn">
              
              {/* Header card info */}
              <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-black text-amber-950">
                      Order: #{activeOrder.id}
                    </h3>
                    <span className="bg-amber-900/5 text-amber-800 border border-amber-900/15 py-0.5 px-2 rounded-full text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-amber-700" />
                      <span>{activeOrder.paymentMethod} • {activeOrder.paymentStatus}</span>
                    </span>
                  </div>

                  <p className="text-stone-400 text-[10px] uppercase font-bold tracking-wider mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Registered: {new Date(activeOrder.createdAt).toLocaleString()}</span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase text-stone-400 block font-bold">Loom Booking Total</span>
                  <span className="text-lg font-black text-stone-950 font-mono">
                    ₹{activeOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Delivery coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-xl border border-stone-150">
                <div>
                  <span className="text-[9px] uppercase text-stone-400 font-bold block">Consignee Client</span>
                  <span className="font-bold text-stone-900 block mt-0.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    <span>{activeOrder.customerName}</span>
                  </span>
                  <span className="text-stone-500 text-[11px] block pl-4.5 font-mono">{activeOrder.customerPhone || 'N/A'}</span>
                </div>

                <div>
                  <span className="text-[9px] uppercase text-stone-400 font-bold block">Insured Destination</span>
                  <span className="text-stone-600 block mt-0.5 text-[11px] font-sans leading-relaxed flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                    <span>{activeOrder.shippingAddress}</span>
                  </span>
                </div>
              </div>

              {/* Progress milestones timeline vertical layout */}
              <div className="space-y-6 relative pl-6 border-l border-stone-200 ml-4 py-2">
                {getTimelineStages(activeOrder).map((stage, sIdx) => {
                  return (
                    <div key={sIdx} className="relative">
                      {/* Left icon circle indicator */}
                      <span className={`absolute -left-[35px] top-0 w-4.5 h-4.5 rounded-full border-4 flex items-center justify-center ${
                        stage.completed 
                          ? 'bg-amber-900 border-stone-50 text-white' 
                          : stage.active 
                            ? 'bg-amber-500 border-amber-900 animate-pulse'
                            : 'bg-white border-stone-200'
                      }`}>
                        {stage.completed && (
                          <CheckCircle className="w-3 h-3 text-white fill-amber-950" />
                        )}
                      </span>

                      {/* Content block */}
                      <div className="pl-2">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-bold leading-none ${
                            stage.completed ? 'text-stone-900' : 'text-stone-400'
                          }`}>
                            {stage.title}
                          </h4>
                          {stage.active && (
                            <span className="bg-emerald-100 text-emerald-800 text-[8px] uppercase font-bold tracking-wide py-0.5 px-1.5 rounded-full inline-block">
                              Active State
                            </span>
                          )}
                        </div>
                        <p className="text-stone-500 text-[11px] mt-1 pr-6 leading-relaxed">
                          {stage.description}
                        </p>
                        {stage.date && (
                          <span className="text-[10px] text-stone-400 font-mono italic block mt-0.5">
                            {new Date(stage.date).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Silk Masterpiece specification catalog items */}
              <div className="border-t border-stone-100 pt-5 space-y-3">
                <span className="text-[9px] uppercase text-stone-400 font-bold tracking-wider block">
                  Items Details in Custom Weave Cargo:
                </span>

                <div className="space-y-3">
                  {activeOrder.items?.map((it: any, itemIdx: number) => (
                    <div key={itemIdx} className="flex gap-4 items-center justify-between text-xs bg-stone-50/40 p-3 rounded-lg border border-stone-200/50">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded border border-stone-200 overflow-hidden bg-stone-100 shrink-0">
                          <img src={it.saree?.image} alt={it.saree?.name} className="w-full h-full object-cover" />
                        </div>

                        <div>
                          <span className="font-serif font-bold text-stone-950 block">{it.saree?.name}</span>
                          <span className="text-[10px] text-stone-500 block">
                            Milestone Type: {it.saree?.type} | Count Qty: {it.quantity}
                          </span>
                          {it.customBlouseStyle && (
                            <span className="text-[10px] text-amber-800 bg-amber-500/10 border border-amber-500/20 px-1 px-1.5 py-0.5 rounded inline-block mt-0.5">
                              Custom Stitching: {it.customBlouseStyle.neckStyle} sleeve
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="font-mono font-bold text-stone-900 pr-1">
                        ₹{(it.saree?.price * it.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom certificate banner pledge */}
              <div className="p-3 bg-emerald-50/50 border border-emerald-500/10 rounded-xl flex items-center gap-2.5 text-[11px] text-[#12482F]">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <span className="font-sans leading-relaxed">
                  Includes <strong>Government Silk Mark Certificate</strong>, authenticating weavers' registration and pure gold zari wire threads grade.
                </span>
              </div>

            </div>
          ) : (
            <div className="bg-stone-50 border border-dashed border-stone-300 rounded-3xl p-16 text-center space-y-4 h-full flex flex-col justify-center items-center">
              <Package className="w-12 h-12 text-stone-400 stroke-1" />
              <div className="space-y-1">
                <h3 className="font-serif text-sm font-bold text-amber-950 uppercase tracking-widest">
                  No active tracked piece
                </h3>
                <p className="text-stone-500 text-xs max-w-xs mx-auto leading-relaxed">
                  Kindly load an order above using your personal Customer ID, or log in to pull the automatic account ledger history console.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
