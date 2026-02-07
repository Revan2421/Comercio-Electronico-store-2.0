/// <reference types="vite/client" />
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Laptop, Smartphone, Headphones, Gamepad2 } from 'lucide-react';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface User {
  email: string;
  name: string;
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  updateProfile: (data: { name?: string; email?: string; password?: string }) => Promise<boolean>;
  fetchOrders: () => Promise<any[]>;
  fetchActivity: () => Promise<any>;
  categories: { name: string; icon: any; color: string }[];
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  console.log('API URL:', API_URL);

  useEffect(() => {
    console.log('ShopProvider mounted, fetching products...');
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products?t=${new Date().getTime()}&limit=100`);
      console.log('Fetch response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Products fetched successfully:', data.length, 'items');
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prevCart: CartItem[]) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart: CartItem[]) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart: CartItem[]) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        setUser({ email, name: email.split('@')[0] });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        setUser({ email, name });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const updateProfile = async (data: { name?: string; email?: string; password?: string }): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser({ email: updatedUser.email, name: updatedUser.name });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
    }
    return [];
  };

  const fetchActivity = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/me/activity`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Fetch activity error:', error);
    }
    return null;
  };

  const categories = [
    { name: "Laptops & Work", icon: <Laptop />, color: "bg-blue-50 text-blue-600" },
    { name: "Mobile Gear", icon: <Smartphone />, color: "bg-purple-50 text-purple-600" },
    { name: "Premium Audio", icon: <Headphones />, color: "bg-pink-50 text-pink-600" },
    { name: "Ultimate Gaming", icon: <Gamepad2 />, color: "bg-orange-50 text-orange-600" }
  ];

  const contextValue: ShopContextType = {
    products,
    cart,
    user,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    login,
    register,
    logout,
    getTotalItems,
    getTotalPrice,
    updateProfile,
    fetchOrders,
    fetchActivity,
    categories
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
