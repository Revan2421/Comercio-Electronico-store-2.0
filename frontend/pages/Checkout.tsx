import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../components/ShopContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { CreditCard, ShieldCheck, ArrowLeft, Loader2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { SUPPORTED_BANKS, Bank } from '../config/banks';

export default function Checkout() {
    const { cart, getTotalPrice, clearCart, user } = useShop();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const total = getTotalPrice();

    if (cart.length === 0 && !isProcessing) {
        navigate('/products');
        return null;
    }

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBank) {
            toast.error('Por favor selecciona un banco');
            return;
        }

        setIsProcessing(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const payload = {
                order_id: 0, // In a real flow, create order first or handle backend-side
                amount: total,
                card_number: (document.getElementById('card-number') as HTMLInputElement).value.replace(/\s/g, ''),
                cvv: (document.getElementById('card-cvv') as HTMLInputElement).value,
                expiry: (document.getElementById('card-expiry') as HTMLInputElement).value,
                bank_id: selectedBank.id,
                description: `Purchase of ${cart.length} items`
            };

            const response = await fetch(`${API_URL}/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Error processing payment');
            }

            toast.success(`¡Pago procesado con éxito a través de ${selectedBank.name}!`);
            clearCart();
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Payment Error:', error);
            toast.error(error.message || 'Error al procesar el pago. Revisa los datos.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <Button
                variant="ghost"
                className="mb-8 gap-2 hover:bg-transparent hover:text-indigo-600 transition-colors"
                onClick={() => selectedBank ? setSelectedBank(null) : navigate(-1)}
            >
                <ArrowLeft className="h-4 w-4" />
                {selectedBank ? 'Cambiar Banco' : 'Regresar al carrito'}
            </Button>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Payment Form / Bank Selection */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                                    {selectedBank ? (
                                        <>
                                            <CreditCard className="h-6 w-6 text-indigo-600" />
                                            Pago con Tarjeta
                                        </>
                                    ) : (
                                        <>
                                            <Building2 className="h-6 w-6 text-indigo-600" />
                                            Selecciona tu Banco
                                        </>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {selectedBank
                                        ? `Ingresa los datos de tu tarjeta ${selectedBank.name}`
                                        : 'Elige el banco con el que deseas procesar tu pago seguro.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!selectedBank ? (
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {SUPPORTED_BANKS.map((bank) => (
                                            <button
                                                key={bank.id}
                                                onClick={() => setSelectedBank(bank)}
                                                className="flex flex-col items-center p-6 border-2 border-transparent bg-white rounded-xl shadow-sm hover:shadow-md hover:border-indigo-600 transition-all group w-full md:w-[calc(50%-0.5rem)]"
                                            >
                                                <div className="h-12 w-full flex items-center justify-center mb-3">
                                                    {/* Placeholder logic for images if needed, using text fallback for now */}
                                                    <div className="text-xl font-bold text-gray-700 group-hover:text-indigo-600">
                                                        {bank.name}
                                                    </div>
                                                </div>
                                                {/* Text removed */}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <form id="payment-form" onSubmit={handlePayment} className="space-y-6">
                                        <div className="p-4 bg-indigo-50/50 rounded-lg mb-6 flex items-center gap-3">
                                            <div className="font-semibold text-indigo-900">Banco seleccionado:</div>
                                            <div className="text-indigo-700">{selectedBank.name}</div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="card-name">Nombre en la tarjeta</Label>
                                            <Input id="card-name" placeholder="Ej. Juan Pérez" required disabled={isProcessing} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="card-number">Número de tarjeta</Label>
                                            <div className="relative">
                                                <Input
                                                    id="card-number"
                                                    placeholder="0000 0000 0000 0000"
                                                    maxLength={19}
                                                    required
                                                    disabled={isProcessing}
                                                    className="pr-10"
                                                />
                                                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="card-expiry">Fecha de expiración</Label>
                                                <Input id="card-expiry" placeholder="MM/YY" maxLength={5} required disabled={isProcessing} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="card-cvv">CVV</Label>
                                                <Input id="card-cvv" placeholder="123" maxLength={4} required disabled={isProcessing} />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 p-4 bg-indigo-50 rounded-xl text-indigo-700 text-sm">
                                            <ShieldCheck className="h-5 w-5 shrink-0" />
                                            Tus datos están protegidos con encriptación de grado bancario.
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                            <CardFooter>
                                {selectedBank && (
                                    <Button
                                        form="payment-form"
                                        className="w-full h-12 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Verificando con {selectedBank.name}...
                                            </>
                                        ) : (
                                            `Pagar $${total.toFixed(2)}`
                                        )}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="border-none shadow-xl">
                            <CardHeader>
                                <CardTitle>Resumen del Pedido</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="max-h-[300px] overflow-auto pr-2 space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center gap-4 text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-lg border overflow-hidden shrink-0">
                                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-medium line-clamp-1">{item.name}</p>
                                                    <p className="text-gray-500">Cant: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Costo de envío</span>
                                        <span className="text-green-600 font-medium">Gratis</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-indigo-600">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
