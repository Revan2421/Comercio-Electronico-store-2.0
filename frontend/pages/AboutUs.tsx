import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';
import { Objectives } from '../components/Objectives';

export default function AboutUs() {
    const founders = [
        {
            name: "Diego Martínez",
            role: "CEO & Co-Founder",
            bio: "Visionario tecnológico con más de 15 años de experiencia en el sector retail y transformación digital.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop"
        },
        {
            name: "Javier Rodríguez",
            role: "CTO & Co-Founder",
            bio: "Arquitecto de sistemas apasionado por las nuevas tecnologías y la optimización de procesos digitales.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=crop"
        },
        {
            name: "Valentina Díaz",
            role: "COO & Co-Founder",
            bio: "Experta en operaciones y estrategia de mercado, enfocada en brindar la mejor experiencia al cliente.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&fit=crop"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-600 blur-[120px]"></div>
                    <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-purple-600 blur-[120px]"></div>
                </div>

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl"
                    >
                        Sobre Nosotros
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mx-auto max-w-2xl text-lg text-slate-300 md:text-xl"
                    >
                        Impulsando el futuro de la tecnología a través de la innovación, la calidad y una pasión inquebrantable por conectar a las personas con lo mejor del mundo digital.
                    </motion.p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 md:grid-cols-2">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="rounded-3xl border border-slate-100 bg-slate-50 p-10 shadow-sm"
                        >
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                                <Target className="h-7 w-7" />
                            </div>
                            <h2 className="mb-4 text-3xl font-bold text-slate-900">Nuestra Misión</h2>
                            <p className="leading-relaxed text-slate-600">
                                En TechShop, nuestra misión es democratizar el acceso a la tecnología de vanguardia. Nos esforzamos por ser el puente entre los últimos avances globales y nuestros clientes, ofreciendo productos seleccionados cuidadosamente que no solo cumplen con los más altos estándares de calidad, sino que también mejoran y simplifican la vida cotidiana de las personas. Creemos firmemente que la tecnología debe ser accesible, comprensible y, sobre todo, una herramienta poderosa para el progreso individual y colectivo.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="rounded-3xl border border-slate-100 bg-slate-50 p-10 shadow-sm"
                        >
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-200">
                                <Eye className="h-7 w-7" />
                            </div>
                            <h2 className="mb-4 text-3xl font-bold text-slate-900">Nuestra Visión</h2>
                            <p className="leading-relaxed text-slate-600">
                                Aspiramos a convertirnos en el referente líder de comercio electrónico tecnológico en la región, siendo reconocidos no solo por nuestro catálogo excepcional, sino por la confianza inquebrantable que generamos en nuestra comunidad. Nuestra visión para el 2030 es haber construido un ecosistema digital donde la innovación sea una constante y donde cada interacción con TechShop sea sinónimo de excelencia, seguridad y satisfacción absoluta. Visualizamos un futuro donde cada hogar y oficina cueste con la mejor tecnología impulsada por nosotros.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Objectives */}
            <section className="bg-slate-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-slate-900">Nuestros Objetivos</h2>
                        <div className="mx-auto h-1.5 w-24 rounded-full bg-blue-600"></div>
                    </div>

                    <Objectives />
                </div>
            </section>

            {/* Founders Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-slate-900">Las Mentes Detrás de TechShop</h2>
                        <p className="text-slate-600 font-medium">Liderazgo dedicado a la excelencia tecnológica</p>
                    </div>

                    <div className="grid gap-12 md:grid-cols-3">
                        {founders.map((founder, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="group relative overflow-hidden rounded-3xl bg-white shadow-xl transition-all hover:shadow-2xl"
                            >
                                <div className="aspect-square w-full overflow-hidden">
                                    <img
                                        src={founder.image}
                                        alt={founder.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-8">
                                    <h3 className="mb-1 text-2xl font-bold text-slate-900">{founder.name}</h3>
                                    <p className="mb-4 font-semibold text-blue-600 lowercase tracking-wide">{founder.role}</p>
                                    <p className="text-slate-600 leading-relaxed italic">"{founder.bio}"</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
