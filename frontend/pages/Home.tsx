import { useState, useEffect } from 'react';
import { useShop } from '../components/ShopContext';
import { FeaturedSlider } from '../components/FeaturedSlider';
import { Objectives } from '../components/Objectives';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Shield, PhoneCall, Laptop, Smartphone, Headphones, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    const { products, addToCart } = useShop();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "El Futuro en Tus Manos",
            subtitle: "Descubre la tecnología que está cambiando el mundo.",
            cta: "Explorar Gadgets",
            image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200",
            color: "from-blue-600 to-indigo-700"
        },
        {
            title: "Superpoderes Digitales",
            subtitle: "No solo compras tecnología, adquieres herramientas para triunfar.",
            cta: "Ver Ofertas",
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
            color: "from-purple-600 to-pink-600"
        },
        {
            title: "Innovación Sin Límites",
            subtitle: "Equípate con lo mejor y prepárate para lo que viene.",
            cta: "Nueva Colección",
            image: "https://images.unsplash.com/photo-1526733158272-60b494a79746?q=80&w=1200",
            color: "from-emerald-600 to-teal-700"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const handleAddToCart = (product: any) => {
        addToCart(product);
        toast.success(`${product.name} agregado al carrito`);
    };

    return (
        <div className="flex flex-col gap-0">

            {/* Slider Revolution Style Hero */}
            <section className="relative h-[85vh] w-full overflow-hidden bg-slate-900">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        <div className="absolute inset-0 bg-black/40 z-10" />
                        <img
                            src={slides[currentSlide].image}
                            alt={slides[currentSlide].title}
                            className="h-full w-full object-cover"
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="container relative z-20 mx-auto flex h-full items-center px-4">
                    <div className="max-w-3xl">
                        <motion.div
                            key={`text-${currentSlide}`}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <h1 className="mb-6 text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl">
                                {slides[currentSlide].title}
                            </h1>
                            <p className="mb-8 text-xl text-slate-200 md:text-2xl font-light">
                                {slides[currentSlide].subtitle}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/products"
                                    className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-slate-900 transition-all hover:bg-slate-100 hover:scale-105"
                                >
                                    {slides[currentSlide].cta}
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <div className="flex items-center gap-3 px-6 py-4 text-white font-medium">
                                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                    El futuro ya está aquí.
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Slider Controls */}
                <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 gap-3">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`h-1.5 transition-all rounded-full ${i === currentSlide ? 'w-12 bg-white' : 'w-3 bg-white/40'}`}
                        />
                    ))}
                </div>
            </section>

            {/* Featured Products Slider */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="mb-12 flex items-end justify-between">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-2">Imprescindibles de la Semana</h2>
                            <p className="text-slate-600 text-lg italic">"No solo es una compra, es una inversión en tu productividad."</p>
                        </div>
                        <Link to="/products" className="hidden md:flex items-center gap-2 text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1 hover:text-indigo-700 hover:border-indigo-700 transition-all">
                            Ver Catálogo Completo
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                    <FeaturedSlider products={products} onAddToCart={handleAddToCart} />
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Explora por Categoría</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Encuentra exactamente lo que necesitas para potenciar tu estilo de vida digital.</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "Laptops & Work", icon: <Laptop />, color: "bg-blue-50 text-blue-600" },
                            { name: "Mobile Gear", icon: <Smartphone />, color: "bg-purple-50 text-purple-600" },
                            { name: "Premium Audio", icon: <Headphones />, color: "bg-pink-50 text-pink-600" },
                            { name: "Ultimate Gaming", icon: <Gamepad2 />, color: "bg-orange-50 text-orange-600" }
                        ].map((cat, i) => (
                            <Link key={i} to={`/products?category=${encodeURIComponent(cat.name)}`}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="flex flex-col items-center p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                                >
                                    <div className={`mb-6 p-4 rounded-2xl transition-colors group-hover:bg-indigo-600 group-hover:text-white ${cat.color}`}>
                                        {cat.icon}
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg">{cat.name}</h3>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shared Objectives Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Nuestra Promesa</h2>
                        <p className="text-slate-600 italic">"Garantizamos satisfacción porque amamos lo que hacemos."</p>
                    </div>
                    <Objectives />
                </div>
            </section>

            {/* Trust & Why Us Section */}
            <section className="py-20 bg-indigo-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center">
                            <Zap className="h-12 w-12 text-yellow-400 mb-6" />
                            <h3 className="text-2xl font-bold mb-3">Envío Ultra Rápido</h3>
                            <p className="text-indigo-100">Recibe tus gadgets en tiempo récord, porque sabemos que no puedes esperar.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Shield className="h-12 w-12 text-blue-300 mb-6" />
                            <h3 className="text-2xl font-bold mb-3">Garantía de Ironcland</h3>
                            <p className="text-indigo-100">Protección total en cada compra. Tu tranquilidad es nuestra prioridad.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <PhoneCall className="h-12 w-12 text-green-400 mb-6" />
                            <h3 className="text-2xl font-bold mb-3">Soporte 24/7 Premium</h3>
                            <p className="text-indigo-100">Expertos en tecnología listos para ayudarte en cualquier momento.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Motivational Newsletter Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-r from-slate-900 to-indigo-950 p-12 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute inset-0 z-0 opacity-10">
                            <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-white blur-3xl" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                                ¿Listo para el siguiente nivel?
                            </h2>
                            <p className="text-indigo-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                                Únete a nuestra comunidad selecta y recibe ofertas exclusivas que no verás en ningún otro lugar. Elevamos tu potencial tecnológico.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Tu correo electrónico"
                                    className="flex-grow px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-8 py-4 rounded-full bg-white text-indigo-950 font-bold hover:bg-slate-100 transition-all uppercase tracking-wider"
                                >
                                    Unirse Ahora
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
