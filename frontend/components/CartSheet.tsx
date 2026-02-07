import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useNavigate } from 'react-router-dom';
import { useShop } from './ShopContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useShop();
  const navigate = useNavigate();
  const total = getTotalPrice();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }
    onOpenChange(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <div className="px-6">
            <SheetTitle>Carrito de Compras</SheetTitle>
            <SheetDescription>
              {cart.length === 0 ? 'Tu carrito está vacío' : `${cart.length} producto(s) en tu carrito`}
            </SheetDescription>
          </div>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300" />
            <p className="text-gray-500">No hay productos en tu carrito</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 px-6">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-sm">{item.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <span className="ml-auto text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t p-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Total</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>

              <Button onClick={handleCheckout} className="w-full h-12 text-lg font-bold" size="lg">
                Finalizar Compra
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
