import { useState } from 'react';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useShop } from './ShopContext';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export function Header({ onOpenCart, onOpenAuth }: HeaderProps) {
  const { user, logout, getTotalItems } = useShop();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItems = getTotalItems();
  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/products' },
    { name: 'Sobre Nosotros', path: '/about' },
    { name: 'Contacto', path: '/contact' },
  ];

  if (user) {
    navLinks.push({ name: 'Mi Panel', path: '/dashboard' });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TechShop
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${location.pathname === link.path ? 'text-indigo-600' : 'text-gray-600'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Hola, {user.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-9 w-9"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenAuth}
              className="hidden sm:flex gap-2"
            >
              <User className="h-4 w-4" />
              <span>Ingresar</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            className="relative h-9 w-9"
            onClick={onOpenCart}
          >
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </Button>

          {/* Hamburger Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-semibold py-2 transition-colors ${location.pathname === link.path ? 'text-indigo-600' : 'text-gray-600'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="my-2" />
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Usuario: <span className="text-indigo-600">{user.name}</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="default"
                  className="w-full gap-2 justify-center"
                  onClick={() => {
                    onOpenAuth();
                    setIsMenuOpen(false);
                  }}
                >
                  <User className="h-4 w-4" />
                  Ingresar a mi cuenta
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
