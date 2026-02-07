import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function Contact() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Mensaje enviado con éxito. Te contactaremos pronto.');
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[120px] -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] -ml-48 -mb-48" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                            Estamos Aquí para <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Ayudarte</span>
                        </h1>
                        <p className="text-xl text-indigo-100 max-w-2xl mx-auto font-light leading-relaxed">
                            ¿Tienes dudas sobre un producto o necesitas asistencia técnica? Nuestro equipo de expertos está listo para escucharte.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-20 -mt-12">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info Cards */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            {[
                                {
                                    icon: <Mail className="w-6 h-6" />,
                                    title: "Correo Electrónico",
                                    detail: "contacto@techshop.com",
                                    desc: "Escríbenos en cualquier momento",
                                    color: "text-blue-600 bg-blue-50"
                                },
                                {
                                    icon: <Phone className="w-6 h-6" />,
                                    title: "Teléfono",
                                    detail: "+58 (412) 123-4567",
                                    desc: "Lunes a Viernes, 9am - 6pm",
                                    color: "text-green-600 bg-green-50"
                                },
                                {
                                    icon: <MapPin className="w-6 h-6" />,
                                    title: "Ubicación",
                                    detail: "Los Chaguaramos Caracas, Venezuela",
                                    desc: "Código Postal: 1050",
                                    color: "text-red-600 bg-red-50"
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex items-start gap-6 hover:translate-y-[-5px] transition-all"
                                >
                                    <div className={`p-4 rounded-2xl ${item.color}`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h3>
                                        <p className="font-medium text-slate-700 mb-1">{item.detail}</p>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50"
                            >
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <MessageSquare className="text-indigo-600" />
                                        Envíanos un mensaje
                                    </h2>
                                    <p className="text-slate-500">Completa el formulario y te responderemos en menos de 24 horas hábiles.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Nombre Completo</label>
                                            <input
                                                type="text"
                                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
                                                placeholder="Ej. Juan Pérez"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
                                                placeholder="juan@ejemplo.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Asunto</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
                                            placeholder="¿En qué podemos ayudarte?"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Mensaje</label>
                                        <textarea
                                            className="w-full px-6 py-4 rounded-3xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all min-h-[150px]"
                                            placeholder="Escribe tu mensaje aquí..."
                                            required
                                        ></textarea>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full md:w-auto px-12 py-7 rounded-full bg-indigo-600 text-white font-black text-lg hover:bg-slate-900 hover:scale-105 transition-all shadow-xl shadow-indigo-600/20"
                                    >
                                        Enviar Mensaje
                                        <Send className="ml-3 h-5 w-5" />
                                    </Button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Estamos en el Corazón de Caracas</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto flex items-center justify-center gap-2">
                            <Clock className="w-5 h-5 text-indigo-600" />
                            Visitamos de lunes a viernes, 9:00 AM - 6:00 PM
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative h-[450px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.3670183186255!2d-66.8918451!3d10.4856012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2a5905d452d37d%3A0xc06e6761ed81e7d!2sLos%20Chaguaramos%2C%20Caracas%201041%2C%20Distrito%20Capital!5e0!3m2!1ses-419!2sve!4v1716300000000!5m2!1ses-419!2sve"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ubicación TechShop Caracas"
                        ></iframe>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
