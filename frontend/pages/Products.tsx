import { useShop } from '../components/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Products() {
    const { products, addToCart, categories } = useShop();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get('category') || '';

    const handleAddToCart = (product: any) => {
        addToCart(product);
        toast.success(`${product.name} agregado al carrito`);
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === '' || p.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, activeCategory]);

    const handleCategoryChange = (categoryName: string) => {
        if (categoryName === activeCategory) {
            searchParams.delete('category');
        } else {
            searchParams.set('category', categoryName);
        }
        setSearchParams(searchParams);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-16">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-slate-900 md:text-5xl"
                    >
                        {activeCategory || 'Nuestra Colección'}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-lg text-slate-600"
                    >
                        Explora la mayor selección de gadgets y tecnología de vanguardia.
                    </motion.p>
                </div>

                {/* Filters & Search */}
                <div className="mb-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                className="w-full rounded-full border-slate-200 bg-white py-3 pl-12 pr-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {(searchTerm || activeCategory) && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                            >
                                <X className="h-4 w-4" />
                                Limpiar filtros
                            </button>
                        )}
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === ''
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
                                }`}
                        >
                            Todos
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => handleCategoryChange(cat.name)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.name
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <ProductCard
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-slate-500">
                        <p className="text-xl">No encontramos productos en esta categoría que coincidan con tu búsqueda.</p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 text-indigo-600 font-bold hover:underline"
                        >
                            Ver todos los productos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
