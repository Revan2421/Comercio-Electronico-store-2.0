import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './components/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthDialog } from './components/AuthDialog';
import { CartSheet } from './components/CartSheet';
import { Toaster } from './components/ui/sonner';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';

function MainLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onOpenCart={() => setIsCartOpen(true)} onOpenAuth={() => setIsAuthOpen(true)} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      <Footer />

      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <Router>
        <MainLayout />
      </Router>
    </ShopProvider>
  );
}
