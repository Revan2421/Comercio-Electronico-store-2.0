import { useState, useEffect } from 'react';
import { useShop } from '../components/ShopContext';
import { motion } from 'framer-motion';
import { User, Package, Settings, LogOut, ChevronRight, ShoppingBag, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';
// Removed date-fns imports to avoid dependency issues

export default function Dashboard() {
    const { user, logout, updateProfile, fetchOrders, fetchActivity } = useShop();
    const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'settings'>('stats');
    const [orders, setOrders] = useState<any[]>([]);
    const [activity, setActivity] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form states
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [orderData, activityData] = await Promise.all([
                fetchOrders(),
                fetchActivity()
            ]);
            setOrders(orderData);
            setActivity(activityData);
            setLoading(false);
        };
        if (user) loadData();
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        const success = await updateProfile({ name, email, password: password || undefined });
        if (success) {
            toast.success('Perfil actualizado correctamente');
            setPassword('');
        } else {
            toast.error('Error al actualizar el perfil');
        }
        setIsUpdating(false);
    };

    if (!user) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-slate-900">Debes iniciar sesión</h2>
                <p className="mt-2 text-slate-600">Inicia sesión para acceder a tu panel de control.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4">
                <div className="grid gap-8 lg:grid-cols-4">

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                            <div className="mb-8 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xl uppercase">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900 line-clamp-1">{user.name}</h2>
                                    <p className="text-sm text-slate-500 line-clamp-1">{user.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('stats')}
                                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === 'stats' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <User className="h-5 w-5" />
                                    Resumen de Actividad
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <Package className="h-5 w-5" />
                                    Historial de Pedidos
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <Settings className="h-5 w-5" />
                                    Configuración
                                </button>
                                <div className="my-4 border-t border-slate-100" />
                                <button
                                    onClick={logout}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Cerrar Sesión
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100"
                        >
                            {activeTab === 'stats' && (
                                <div>
                                    <h2 className="mb-8 text-2xl font-bold text-slate-900">Resumen de Actividad</h2>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        <div className="rounded-2xl bg-blue-50 p-6">
                                            <ShoppingBag className="mb-4 h-8 w-8 text-blue-600" />
                                            <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Total de Pedidos</p>
                                            <h3 className="text-3xl font-black text-slate-900">{activity?.total_orders || 0}</h3>
                                        </div>
                                        <div className="rounded-2xl bg-purple-50 p-6">
                                            <Clock className="mb-4 h-8 w-8 text-purple-600" />
                                            <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">Última Compra</p>
                                            <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                                {activity?.last_order_date
                                                    ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(new Date(activity.last_order_date))
                                                    : "Sin pedidos"}
                                            </h3>
                                        </div>
                                        <div className="rounded-2xl bg-emerald-50 p-6">
                                            <Calendar className="mb-4 h-8 w-8 text-emerald-600" />
                                            <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider">Miembro Desde</p>
                                            <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                                Enero 2026
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div>
                                    <h2 className="mb-8 text-2xl font-bold text-slate-900">Historial de Pedidos</h2>
                                    {loading ? (
                                        <p className="text-slate-500">Cargando pedidos...</p>
                                    ) : orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-6 hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600 font-bold">
                                                            #{order.id}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">
                                                                {new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(order.created_at))}
                                                            </p>
                                                            <p className="text-sm text-slate-500">{order.items.length} productos</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-black text-indigo-600">${order.total_price.toFixed(2)}</p>
                                                        <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {order.status === 'pending' ? 'Pendiente' : 'Completado'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center">
                                            <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                                            <p className="text-slate-500">Aún no has realizado ninguna compra.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="max-w-xl">
                                    <h2 className="mb-8 text-2xl font-bold text-slate-900">Mi Perfil</h2>
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-slate-700">Nombre Completo</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-slate-700">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-slate-700">Nueva Contraseña (dejar en blanco para mantener)</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            {isUpdating ? 'Actualizando...' : 'Guardar Cambios'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
