import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, ShoppingCart, Users, TrendingUp, Settings, Tag, Plus, Edit2, 
  Trash2, Loader2, AlertTriangle, Check, Truck, Ban, CreditCard, ChevronDown, Download, 
  LogOut, Search, RefreshCw, Sparkles, CheckCircle, Clock, CheckSquare, XCircle, Gift, Image as ImageIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { Saree } from '../../types';
import SareeForm from './SareeForm';
import { getApiUrl } from '../../utils/api';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onBackToStore: () => void;
}

export default function AdminDashboard({ token, onLogout, onBackToStore }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'analytics' | 'settings'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sareeToDelete, setSareeToDelete] = useState<{ id: string; name: string } | null>(null);

  // Saree data state
  const [sarees, setSarees] = useState<Saree[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  // Coupons / Banners Settings State
  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState('');

  const [banners, setBanners] = useState<any[]>([]);
  const [newBannerName, setNewBannerName] = useState('');

  // Search & Filters state
  const [productSearch, setProductSearch] = useState('');
  const [productFilterType, setProductFilterType] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState('All');

  // Modal State
  const [selectedSareeForForm, setSelectedSareeForForm] = useState<Saree | null>(null);
  const [isSareeFormOpen, setIsSareeFormOpen] = useState(false);

  // Fetch Dashboard core figures
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [sareesResp, ordersResp, summaryResp, customersResp, couponsResp] = await Promise.all([
        fetch(getApiUrl('/api/sarees')),
        fetch(getApiUrl('/api/orders'), { headers }),
        fetch(getApiUrl('/api/dashboard/summary'), { headers }),
        fetch(getApiUrl('/api/customers'), { headers }),
        fetch(getApiUrl('/api/coupons'))
      ]);

      if (!sareesResp.ok || !ordersResp.ok || !summaryResp.ok || !customersResp.ok) {
        throw new Error('Could not pull administration tables from cluster node.');
      }

      const sareesData = await sareesResp.json();
      const ordersData = await ordersResp.json();
      const summaryData = await summaryResp.json();
      const customersData = await customersResp.json();
      const couponsData = await couponsResp.json();

      setSarees(sareesData);
      setOrders(ordersData);
      setSummary(summaryData);
      setCustomers(customersData);
      setCoupons(couponsData);
    } catch (err: any) {
      setError(err.message || 'Connection error while communicating with back-end APIs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  // Product Delete Trigger - Opens Custom Premium Confirmation Modal
  const handleDeleteProduct = (id: string, name: string) => {
    setSareeToDelete({ id, name });
  };

  const confirmAndExecuteDelete = async (id: string, name: string) => {
    setDeletingId(id);
    setError('');
    setSuccess('');
    try {
      const resp = await fetch(getApiUrl(`/api/products/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || 'Delete call returned an error state');
      }
      
      setSuccess(`"${name}" was deleted successfully.`);
      setTimeout(() => setSuccess(''), 3000);
      
      // Update local state instantly so the product disappears immediately
      setSarees(prev => prev.filter(s => s.id !== id));
      
      // Refresh dashboard summary and data silently
      fetchDashboardData();
    } catch (err: any) {
      setError(err.message || 'Delete operation failed.');
      console.error("[Front-end Error] Delete product failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Order status progression controls
  const handleUpdateOrderStatus = async (orderId: string, orderStatus: string, paymentStatus?: string) => {
    try {
      const resp = await fetch(getApiUrl(`/api/orders/${orderId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus, paymentStatus })
      });
      if (!resp.ok) throw new Error('Status progression update rejected by Node API.');

      setSuccess(`Order #${orderId} marked as ${orderStatus}!`);
      setTimeout(() => setSuccess(''), 2500);
      fetchDashboardData();
    } catch (err: any) {
      setError(err.message || 'Status update failed.');
    }
  };

  // Quick Coupon creation handler
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponPercent) return;
    try {
      const resp = await fetch(getApiUrl('/api/coupons'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: newCouponCode, discountPercentage: Number(newCouponPercent) })
      });

      if (!resp.ok) throw new Error('Failed creating promo coupon code');

      setSuccess(`Promo code ${newCouponCode.toUpperCase()} configured!`);
      setNewCouponCode('');
      setNewCouponPercent('');
      setTimeout(() => setSuccess(''), 2500);
      
      // Update local listing
      const updatedCoupons = await fetch(getApiUrl('/api/coupons'));
      setCoupons(await updatedCoupons.json());
    } catch (err: any) {
      setError(err.message || 'Coupon configuration failed.');
    }
  };

  // Search & Filter Operations
  const filteredSarees = sarees.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          s.description.toLowerCase().includes(productSearch.toLowerCase()) ||
                          s.id.toLowerCase().includes(productSearch.toLowerCase());
    const matchesFilter = productFilterType === 'All' || s.type === productFilterType;
    return matchesSearch && matchesFilter;
  });

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderFilterStatus === 'All' || o.orderStatus === orderFilterStatus;
    return matchesSearch && matchesStatus;
  });

  // Recharts Data Computations fallback safely to empty arrays
  const monthlyRevenueData = summary?.revenueByMonth || [];
  
  const sareeCategoryDistribution = sarees.reduce((acc: any[], item) => {
    const existing = acc.find(x => x.name === item.type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.type, value: 1 });
    }
    return acc;
  }, []);

  const COLORS_PALETTE = ['#8C1C24', '#C5A059', '#12482F', '#123D7F', '#D5563D'];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-stone-950 text-stone-100 flex flex-col justify-between shrink-0 border-r border-stone-800">
        <div>
          {/* Logo Heading Brand Block */}
          <div className="p-6 border-b border-stone-800/80">
            <div className="flex items-center gap-2">
              <span className="bg-amber-600 text-stone-950 font-serif font-black px-2 py-1 rounded-md text-sm">SPS</span>
              <div>
                <h2 className="font-serif text-base font-extrabold tracking-wider leading-none text-stone-100">SPS SAREES</h2>
                <span className="text-[9px] uppercase tracking-[0.16em] text-stone-400 font-sans">Weaver Administration</span>
              </div>
            </div>
            
            <div className="mt-4 px-2 py-1 bg-amber-500/15 border border-amber-500/25 rounded-lg text-amber-400 text-[10px] tracking-wide inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Full-Stack Mode Connected</span>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'overview', label: 'Summary Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Saree Inventory', icon: ShoppingBag },
              { id: 'orders', label: 'Weaver Orders', icon: ShoppingCart },
              { id: 'customers', label: 'Client Logins', icon: Users },
              { id: 'analytics', label: 'Sales Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Promo Coupons', icon: Tag },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors ${
                    isActive 
                      ? 'bg-amber-700 font-extrabold text-stone-50' 
                      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'orders' && orders.filter(o => o.orderStatus === 'Pending').length > 0 && (
                    <span className="bg-amber-500 text-stone-950 font-sans text-[9px] px-1.5 py-0.5 rounded-full font-black">
                      {orders.filter(o => o.orderStatus === 'Pending').length}
                    </span>
                  )}
                  {item.id === 'products' && sarees.filter(s => s.stock <= 2).length > 0 && (
                    <span className="bg-rose-500 text-stone-50 font-sans text-[8px] px-1 py-0.5 rounded font-bold animate-pulse">
                      ALERT
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Controls Footer */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <button 
            onClick={onBackToStore}
            className="w-full text-center hover:bg-white/10 text-stone-200 border border-stone-800 hover:border-stone-700 text-xs font-bold py-2 rounded transition-colors block cursor-pointer"
          >
            ← View Frontend Store
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-rose-950 border border-stone-800 text-stone-400 hover:text-rose-100 text-xs font-bold py-2 rounded transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Session Login</span>
          </button>
        </div>
      </aside>

      {/* DASHBOARD PAGE WORKSPACE */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto w-full">
        
        {/* Header Ribbon bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 flex items-center gap-2">
              <span>Sri Praharsha Boutique Operations</span>
              <Sparkles className="w-5.5 h-5.5 text-amber-600 shrink-0" />
            </h1>
            <p className="text-stone-500 text-xs mt-1">
              Verify orders status, orchestrate catalog variables, configure promotional code matrices, and trace weaver fulfillment queues instantly.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-2 bg-stone-100 hover:bg-stone-200 rounded text-stone-600 shadow-sm border border-stone-200 flex items-center gap-1 text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Portal Tables</span>
            </button>
          </div>
        </div>

        {/* Global Notifications Status ribbon */}
        {success && (
          <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-2.5 animate-fadeIn">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-lg flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* VIEW 1: Summary Overview */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8 animate-fadeIn">
            
            {/* KPI Metrics row cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Gross Weave Receipts</span>
                  <div className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                    ₹{(summary?.totRevenue || 0).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[9px] text-emerald-600 font-bold block mt-1">↑ Direct Paid Revenue</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Total Handloom Orders</span>
                  <div className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                    {summary?.totOrders || 0}
                  </div>
                  <span className="text-[9px] text-amber-600 font-bold block mt-1">All fulfillment logs</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Registered Clients</span>
                  <div className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                    {summary?.totCustomers || 0}
                  </div>
                  <span className="text-[9px] text-amber-600 font-bold block mt-1">Authorized logins</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-stone-500 font-bold tracking-wider">Stock depletion Warnings</span>
                  <div className="text-xl sm:text-2xl font-black text-rose-800 mt-1">
                    {summary?.outOfStock || 0}
                  </div>
                  <span className="text-[9px] text-rose-500 font-bold block mt-1">Requires immediate loom slots</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Inventory depletion Alert row */}
            {summary?.inventoryAlerts?.length > 0 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                  <div>
                    <p className="font-bold text-amber-950">Loom Inventory Stock Alerts</p>
                    <p className="text-[#6C421A] text-[11px] mt-0.5">
                      The following Kanjivaram and Banarasi masterpieces have less than 2 items in immediate storage stock: 
                      <strong> {summary?.inventoryAlerts?.map((a: any) => a.name).join(', ')}</strong>.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('products')}
                  className="px-3.5 py-1.5 bg-amber-900 text-stone-100 hover:bg-stone-950 rounded font-bold transition-all text-[11px] uppercase tracking-wide cursor-pointer shrink-0"
                >
                  Manage Stock Allocation
                </button>
              </div>
            )}

            {/* Recharts progress displays */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-stone-500 mb-4">Monthly Revenue Flow Progress</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height={256} minWidth={0}>
                    <AreaChart data={monthlyRevenueData}>
                      <defs>
                        <linearGradient id="colorRevenues" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECEBE7" />
                      <XAxis dataKey="month" stroke="#78716C" fontSize={11} tickLine={false} />
                      <YAxis stroke="#78716C" fontSize={11} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#8C1C24" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenues)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-stone-500 mb-4">Fabric Category Weaves Distribution</h3>
                  <div className="h-44 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={176} minWidth={0}>
                      <PieChart>
                        <Pie
                          data={sareeCategoryDistribution}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {sareeCategoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS_PALETTE[index % COLORS_PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold text-stone-600 mt-4 border-t border-stone-100 pt-3">
                  {sareeCategoryDistribution.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS_PALETTE[index % COLORS_PALETTE.length] }} />
                      <span>{entry.name}: {entry.value} spec</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Action Tables inside Overview */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-stone-500">Recent Customer Order Bookings</h3>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="text-[11px] text-amber-800 hover:text-amber-950 font-bold hover:underline"
                >
                  View All Orders Logs
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-100 text-[10px] text-stone-400 uppercase tracking-wider">
                      <th className="py-2">Order ID</th>
                      <th className="py-2">Weave Spec</th>
                      <th className="py-2">Customer Details</th>
                      <th className="py-2">Total Paid</th>
                      <th className="py-2">Weaver Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {summary?.recentOrders?.map((ord: any) => (
                      <tr key={ord.id}>
                        <td className="py-3 font-mono font-bold text-amber-900">#{ord.id}</td>
                        <td className="py-3">
                          <span className="font-semibold block">{ord.items[0]?.saree?.name}</span>
                          <span className="text-[10px] text-stone-500">
                            {ord.items.length > 1 ? `+ ${ord.items.length - 1} more items` : 'Single custom weave'}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="font-semibold block">{ord.customerName}</span>
                          <span className="text-[10px] text-stone-400">{ord.customerEmail}</span>
                        </td>
                        <td className="py-3 font-bold">₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                            ord.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                            ord.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-stone-100 text-stone-500'
                          }`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: Saree Inventory Management */}
        {activeTab === 'products' && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {/* Product Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search saree catalog name, ID..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full bg-white border border-stone-300 rounded text-xs focus:outline-none"
                  />
                </div>

                {/* Saree Type filter */}
                <select
                  value={productFilterType}
                  onChange={(e) => setProductFilterType(e.target.value)}
                  className="bg-white border border-stone-300 rounded text-xs px-2.5 py-2 w-full sm:w-44 focus:outline-none"
                >
                  {['All', ...Array.from(new Set(sarees.map(s => s.type)))].map((cat) => (
                    <option key={cat} value={cat}>{cat === 'All' ? 'All Weaves' : cat}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setSelectedSareeForForm(null);
                  setIsSareeFormOpen(true);
                }}
                className="bg-amber-900 border border-amber-950 text-stone-50 hover:bg-amber-950 font-bold text-xs px-4 py-2.5 rounded shadow-sm flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Saree Weave</span>
              </button>

            </div>

            {/* Saree List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSarees.map((s) => (
                <div key={s.id} className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex gap-4 hover:border-amber-800/15 transition-colors">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">{s.type}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                          s.stock <= 0 ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          s.stock <= 2 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {s.stock <= 0 ? 'Out of Stock' : s.stock <= 2 ? 'Limited Edition' : 'In Stock'}
                        </span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-stone-900 mt-1 leading-snug">{s.name}</h4>
                      <p className="text-stone-400 text-[10px] mt-0.5 font-mono">ID: {s.id} | Origin: {s.origin}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-stone-100 pt-2 mt-2">
                      <div className="text-xs font-bold text-stone-800">
                        ₹{s.price.toLocaleString('en-IN')}
                        {s.originalPrice && (
                          <span className="text-[10px] font-normal text-stone-400 line-through ml-1.5">
                            ₹{s.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSareeForForm(s);
                            setIsSareeFormOpen(true);
                          }}
                          className="p-1.5 hover:bg-stone-100 rounded text-stone-600 border border-stone-200"
                          title="Edit Saree"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(s.id, s.name)}
                          disabled={deletingId !== null}
                          className={`p-1.5 rounded border transition-colors ${
                            deletingId === s.id
                              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                              : 'hover:bg-rose-50 text-rose-600 border-rose-100'
                          }`}
                          title={deletingId === s.id ? "Deleting..." : "Delete Saree"}
                        >
                          {deletingId === s.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* VIEW 3: Weaver Orders Management */}
        {activeTab === 'orders' && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter by Order ID, client email..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full bg-white border border-stone-300 rounded text-xs focus:outline-none"
                />
              </div>

              <select
                value={orderFilterStatus}
                onChange={(e) => setOrderFilterStatus(e.target.value)}
                className="bg-white border border-stone-300 rounded text-xs px-2.5 py-2 w-full sm:w-44 focus:outline-none"
              >
                <option value="All">All Order States</option>
                <option value="Pending">Pending Wefts</option>
                <option value="Accepted">Accepted Registry</option>
                <option value="Shipped">In Insured Transit</option>
                <option value="Delivered">Delivered Successfully</option>
                <option value="Cancelled">Cancelled Logs</option>
              </select>
            </div>

            {/* Orders detailed listing */}
            <div className="space-y-4">
              {filteredOrders.map((ord) => (
                <div key={ord.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
                  
                  {/* Order ID & statuses */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm font-black text-amber-950">ID: #{ord.id}</span>
                      <span className="text-[10px] text-stone-400">Placed: {new Date(ord.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                        ord.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-amber-50 text-amber-800'
                      }`}>
                        Payment: {ord.paymentStatus}
                      </span>

                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                        ord.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        ord.orderStatus === 'Accepted' ? 'bg-amber-600 text-white' :
                        ord.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-stone-100 text-stone-500'
                      }`}>
                        STATUS: {ord.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Customer coordinates and address */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 font-bold uppercase text-[9px] block">Customer Details:</span>
                      <p className="font-bold text-stone-900 mt-0.5">{ord.customerName}</p>
                      <p className="text-stone-500 text-[11px] mt-0.5">{ord.customerEmail}</p>
                      <p className="text-stone-500 text-[11px] font-mono">{ord.customerPhone}</p>
                    </div>

                    <div>
                      <span className="text-stone-400 font-bold uppercase text-[9px] block">Shipping Destination:</span>
                      <p className="text-stone-600 mt-0.5 text-[11px] leading-relaxed">{ord.shippingAddress}</p>
                    </div>

                    <div>
                      <span className="text-stone-400 font-bold uppercase text-[9px] block">Method & Summary:</span>
                      <p className="text-stone-800 mt-0.5 text-[11px]">
                        <strong>Gateway:</strong> {ord.paymentMethod} | <strong>Spent:</strong> ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </p>
                      {ord.couponCode && (
                        <p className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded inline-block mt-1">
                          Applied: {ord.couponCode} (-₹{ord.discountAmount})
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Saree items inside order */}
                  <div className="bg-stone-50/50 rounded-xl p-3 border border-stone-200/50">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">Weaved Items Details:</span>
                    <div className="space-y-2">
                      {ord.items.map((it: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-100 text-amber-950 rounded px-1 text-[10px] font-mono">QTY: {it.quantity}</span>
                            <span className="font-semibold text-stone-800">{it.saree.name}</span>
                            <span className="text-stone-400 font-bold text-[10px] uppercase">({it.saree.type})</span>
                            {it.customBlouseStyle && (
                              <span className="text-amber-700 text-[10px] italic">
                                (+ Custom Blouse Stitching requested: {it.customBlouseStyle.neckStyle}, {it.customBlouseStyle.borderType})
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-stone-800">₹{it.saree.price.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Update status actions row */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-stone-100">
                    <span className="text-[11px] text-stone-400 font-bold uppercase block mr-2">Progression Action Tools:</span>
                    
                    {ord.orderStatus === 'Pending' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'Accepted')}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-[10px] uppercase tracking-wider rounded cursor-pointer"
                      >
                        Accept & Register Loom
                      </button>
                    )}

                    {(ord.orderStatus === 'Pending' || ord.orderStatus === 'Accepted') && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'Shipped')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider rounded cursor-pointer flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Ship Insured Cargo</span>
                      </button>
                    )}

                    {ord.orderStatus === 'Shipped' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered', 'Paid')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider rounded cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Delivered</span>
                      </button>
                    )}

                    {ord.orderStatus !== 'Delivered' && ord.orderStatus !== 'Cancelled' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'Cancelled')}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[10px] uppercase tracking-wider rounded cursor-pointer flex items-center gap-1"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel Order</span>
                      </button>
                    )}

                    {ord.paymentStatus === 'Pending' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, ord.orderStatus, 'Paid')}
                        className="px-3 py-1.5 border border-stone-200 hover:bg-stone-100 text-stone-700 text-[10px] font-bold uppercase rounded cursor-pointer"
                      >
                        Mark Payment Received
                      </button>
                    )}
                  </div>

                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="p-12 text-center bg-stone-100 rounded-2xl text-stone-500 text-xs">
                  No orders logs found matching search or filters.
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW 4: Client Registered Accounts */}
        {activeTab === 'customers' && (
          <div className="mt-8 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm animate-fadeIn">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-stone-500 mb-4">Customer Base Accounts and History</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5">Customer details</th>
                    <th className="py-2.5">Contact coordinates</th>
                    <th className="py-2.5">Saved Location</th>
                    <th className="py-2.5">orders Placed</th>
                    <th className="py-2.5 text-right">Lifetime Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {customers.map((c: any) => (
                    <tr key={c.id}>
                      <td className="py-3.5">
                        <span className="font-serif font-bold text-sm text-stone-900 block">{c.name}</span>
                        <span className="text-[10px] text-stone-400 font-mono">ID: {c.id}</span>
                      </td>
                      <td className="py-3.5">
                        <p>{c.email}</p>
                        <p className="text-[10px] text-stone-400 font-mono">{c.phone || 'No phone registered'}</p>
                      </td>
                      <td className="py-3.5 text-stone-600 text-[11px]">{c.address || 'N/A'}</td>
                      <td className="py-3.5">
                        <span className="bg-stone-100 text-stone-800 text-[11.px] px-2 py-0.5 rounded font-bold">
                          {c.ordersCount} orders
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-bold text-stone-900">
                        ₹{c.totalSpent.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 5: Deep Sales Analytics */}
        {activeTab === 'analytics' && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-stone-400 mb-4">Loom Sales Projections</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height={256} minWidth={0}>
                    <BarChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEAE6" />
                      <XAxis dataKey="month" stroke="#78716C" fontSize={11} />
                      <YAxis stroke="#78716C" fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#8C1C24" radius={[4, 4, 0, 0]}>
                        {monthlyRevenueData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={index === 4 ? '#C5A059' : '#8C1C24'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-stone-400 mb-2">Category Demand Distribution</h3>
                  <div className="h-44 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={176} minWidth={0}>
                      <PieChart>
                        <Pie
                          data={sareeCategoryDistribution}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {sareeCategoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS_PALETTE[index % COLORS_PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold text-stone-500 border-t border-stone-100 pt-3">
                  {sareeCategoryDistribution.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS_PALETTE[index % COLORS_PALETTE.length] }} />
                      <span>{entry.name}: {entry.value} sarees catalogued</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Simulated insights cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Fastest Weaving Turnover</h4>
                <p className="text-sm font-bold text-stone-800 mt-2">Pochampally Ikat</p>
                <p className="text-stone-400 text-[10px] mt-1">Average production completion loop is 14 days on custom orders.</p>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Highest Margins Saree</h4>
                <p className="text-sm font-bold text-stone-800 mt-2">Swarna Mayil Kanjivaram</p>
                <p className="text-stone-400 text-[10px] mt-1">Direct pure gold and silver wire braids sourced directly from registry loops.</p>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Estimated Client Returns</h4>
                <p className="text-sm font-bold text-stone-800 mt-2">0.52% Weaver rejection</p>
                <p className="text-stone-400 text-[10px] mt-1">Zero complaints on genuine Silk Mark approved certifications.</p>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 6: Coupons Settings Matrix */}
        {activeTab === 'settings' && (
          <div className="mt-8 space-y-8 animate-fadeIn">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Promo Coupon creation block */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-amber-900 border-b border-stone-100 pb-2">Configure Web Coupon</h3>
                
                <form onSubmit={handleCreateCoupon} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Coupon Promo Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PRAHARSHA20"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      className="w-full bg-stone-50 border border-stone-300 rounded text-xs p-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Discount percentage (1% to 100%) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      placeholder="e.g. 20"
                      value={newCouponPercent}
                      onChange={(e) => setNewCouponPercent(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded text-xs p-2 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-900 hover:bg-amber-950 text-stone-50 font-bold text-xs py-2 rounded shadow transition-colors cursor-pointer"
                  >
                    Add Dynamic Coupon Regulation
                  </button>
                </form>
              </div>

              {/* Coupon Rules Registry */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-stone-400 border-b border-stone-100 pb-2 mb-3">Coupons Registry Log</h3>
                  
                  <div className="space-y-2">
                    {coupons.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-stone-50 p-2.5 rounded border border-stone-200/50">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.5 rounded text-[10px]">
                            {c.code}
                          </span>
                          <span className="text-stone-500 font-bold">-{c.discountPercentage}% OFF</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-sans font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Active Rule</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-stone-100 rounded text-[10px] text-stone-500 leading-normal">
                  Promotional coupons can be immediately tested by customers inside their cart slideover drawer. Standard rules automatically execute percentages logic.
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Saree Modal drawer trigger popup */}
      {isSareeFormOpen && (
        <SareeForm 
          saree={selectedSareeForForm}
          onClose={() => setIsSareeFormOpen(false)}
          onSave={() => {
            fetchDashboardData();
            setIsSareeFormOpen(false);
          }}
          token={token}
        />
      )}

      {/* Custom Delete Confirmation Modal */}
      {sareeToDelete && (
        <div className="fixed inset-0 z-50 bg-[#1c1917]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="bg-[#FCFAF7] rounded-3xl max-w-md w-full p-6 shadow-[0_30px_60px_-15px_rgba(28,25,23,0.3)] border border-[#ECE6DD]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-rose-50 text-rose-600 rounded-full shrink-0 border border-rose-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-lg font-bold text-stone-900 tracking-tight">Are you sure you want to delete this saree?</h4>
                <p className="text-stone-500 text-xs leading-relaxed font-sans font-light">
                  This will permanently remove <span className="font-semibold text-stone-900 font-serif">"{sareeToDelete.name}"</span> from Sri Praharsha Boutique active weaving catalogs and persistent storage. This action is irreversible.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#ECE6DD] pt-4">
              <button
                onClick={() => setSareeToDelete(null)}
                disabled={deletingId !== null}
                className="px-4 py-2 hover:bg-stone-100 rounded-xl text-stone-600 font-bold text-xs transition-colors cursor-pointer"
              >
                No, Cancel
              </button>
              <button
                onClick={async () => {
                  const { id, name } = sareeToDelete;
                  setSareeToDelete(null); // Clear first
                  await confirmAndExecuteDelete(id, name);
                }}
                disabled={deletingId !== null}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Saree</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
