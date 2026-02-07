import { motion } from 'framer-motion';
import { Rocket, Award, Users, ShieldCheck } from 'lucide-react';

export function Objectives() {
    const objectives = [
        {
            icon: <Rocket className="h-6 w-6" />,
            title: "Innovación Constante",
            desc: "Mantenernos siempre a la vanguardia de las tendencias tecnológicas globales."
        },
        {
            icon: <Award className="h-6 w-6" />,
            title: "Calidad Garantizada",
            desc: "Asegurar que cada producto en nuestro catálogo pase por rigurosas pruebas de calidad."
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Foco en el Cliente",
            desc: "Brindar una experiencia de compra personalizada y soporte post-venta de primer nivel."
        },
        {
            icon: <ShieldCheck className="h-6 w-6" />,
            title: "Seguridad y Confianza",
            desc: "Proteger la integridad de cada transacción y los datos de nuestra comunidad."
        }
    ];

    return (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {objectives.map((obj, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        {obj.icon}
                    </div>
                    <h3 className="mb-2 font-bold text-slate-900">{obj.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{obj.desc}</p>
                </motion.div>
            ))}
        </div>
    );
}
