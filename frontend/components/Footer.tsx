import { Github, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t bg-white py-8 md:py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="mb-4 text-xl font-bold tracking-tight">TechShop</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Tu tienda de confianza para tecnología de última generación. Innovación y calidad en cada producto.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Compra</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="/" className="hover:text-indigo-600 transition-colors">Productos</a></li>
                            <li><a href="/" className="hover:text-indigo-600 transition-colors">Ofertas</a></li>
                            <li><a href="/" className="hover:text-indigo-600 transition-colors">Novedades</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Empresa</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="/about" className="hover:text-indigo-600 transition-colors">Sobre Nosotros</a></li>
                            <li><a href="/contact" className="hover:text-indigo-600 transition-colors">Contacto</a></li>
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">Términos</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contacto</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>contacto@techshop.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>+58 (412) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>Los Chaguaramos Caracas, CP 1050</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
                    © {new Date().getFullYear()} TechShop. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
