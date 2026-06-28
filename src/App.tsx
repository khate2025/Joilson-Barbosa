import React, { useState, useEffect } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  User, 
  Clock, 
  Shield, 
  Paintbrush, 
  Check, 
  CheckCircle, 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  Database, 
  Users, 
  Sparkles, 
  ArrowUpRight, 
  Lock, 
  RefreshCw,
  Award,
  AlertCircle,
  Instagram,
  Eye,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Image paths
const heroImage = "/src/assets/images/hero_painter_1782525464778.jpg";
const aboutImage = "/src/assets/images/people_painting_1782525477574.jpg";

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  date: string;
  message: string;
  createdAt: string;
}

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  experience: string;
  portfolio: string;
  message: string;
  createdAt: string;
}

const galleryItems = [
  {
    id: 1,
    title: "Sala de Estar Minimalista",
    category: "residencial",
    categoryLabel: "Residencial",
    description: "Pintura em tons off-white com recorte impecável em sanca de gesso.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Cozinha Moderna Clean",
    category: "residencial",
    categoryLabel: "Residencial",
    description: "Acabamento fosco lavável de alta durabilidade para ambientes úmidos.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Recepção Corporativa Elegante",
    category: "comercial",
    categoryLabel: "Comercial",
    description: "Parede de destaque em tom azul petróleo fosco para identidade corporativa.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Sala de Reuniões Executiva",
    category: "comercial",
    categoryLabel: "Comercial",
    description: "Acabamento acetinado premium cinza espacial com isolamento acústico estético.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Efeito Cimento Queimado",
    category: "texturas",
    categoryLabel: "Texturas / Efeitos",
    description: "Textura rústica urbana de cimento queimado aplicada na parede principal.",
    image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Marmorato Italiano de Luxo",
    category: "texturas",
    categoryLabel: "Texturas / Efeitos",
    description: "Efeito marmorizado de alto brilho polido com cera protetora especial.",
    image: "https://images.unsplash.com/photo-1562184552-997c461abbe6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    title: "Fachada Residencial Moderna",
    category: "fachadas",
    categoryLabel: "Fachadas",
    description: "Impermeabilização e pintura externa em cores contrastantes e resistentes ao sol.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    title: "Pintura de Sobrado Contemporâneo",
    category: "fachadas",
    categoryLabel: "Fachadas",
    description: "Acabamento de alto padrão contra chuvas, umidade e raios UV.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"
  }
];

export default function App() {
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal success state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    date: "",
    message: ""
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  // Provider Registration Form State
  const [providerForm, setProviderForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    experience: "",
    portfolio: "",
    message: ""
  });
  const [providerLoading, setProviderLoading] = useState(false);

  // Admin / Database Dashboard State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<{
    appointments: Appointment[];
    providers: Provider[];
    stats: { totalAppointments: number; totalProviders: number; baseClients: number };
  } | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  // Active section for navigation highlighters
  const [activeTab, setActiveTab] = useState("all");

  // Gallery filter & lightbox states
  const [galleryFilter, setGalleryFilter] = useState("todos");
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string; category: string } | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setAdminLoading(true);
    try {
      const response = await fetch("/api/dashboard-data");
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do servidor:", error);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Form submission for booking (AJAX)
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingForm)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setModalMessage("Agradecemos seu Contato!");
        setShowModal(true);
        // Clear form
        setBookingForm({
          name: "",
          email: "",
          phone: "",
          serviceType: "",
          date: "",
          message: ""
        });
        // Refresh database dashboard
        fetchDashboardData();
      } else {
        alert(data.error || "Ocorreu um erro ao enviar.");
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Falha de conexão com o servidor.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Form submission for provider registration (AJAX)
  const handleProviderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProviderLoading(true);

    try {
      const response = await fetch("/api/providers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(providerForm)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setModalMessage("Cadastro de Prestador realizado com sucesso!");
        setShowModal(true);
        // Clear form
        setProviderForm({
          name: "",
          email: "",
          phone: "",
          specialty: "",
          experience: "",
          portfolio: "",
          message: ""
        });
        // Refresh database dashboard
        fetchDashboardData();
      } else {
        alert(data.error || "Ocorreu um erro ao enviar.");
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Falha de conexão com o servidor.");
    } finally {
      setProviderLoading(false);
    }
  };

  // Reset database for demonstration
  const handleResetDatabase = async () => {
    if (window.confirm("Deseja realmente redefinir o banco de dados para os dados padrão?")) {
      try {
        const res = await fetch("/api/reset-database", { method: "POST" });
        if (res.ok) {
          fetchDashboardData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Navigation Links definition
  const navLinks = [
    { name: "Início", href: "#" },
    { name: "Serviços", href: "#servicos" },
    { name: "Quem Somos", href: "#quem-somos" },
    { name: "Prestadores", href: "#prestadores" },
    { name: "Depoimentos", href: "#depoimentos" },
    { name: "Contatos", href: "#contatos" }
  ];

  // Testimonials list (6 clients)
  const testimonials = [
    {
      name: "Mariana Souza",
      role: "Proprietária Residencial",
      text: "Serviço espetacular! Pintaram a minha sala e cozinha com muito capricho, cobrindo tudo com fitas e lonas e deixando tudo impecável no final. Recomendo fortemente!",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      name: "Ricardo Martins",
      role: "Gerente Comercial",
      text: "Equipe extremamente profissional e pontual. O acabamento de pintura fosca que fizeram nas salas de reunião do escritório ficou perfeito. Sem sujeira e ruídos excessivos.",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      name: "Juliana Costa",
      role: "Dona de Apartamento",
      text: "Profissionais excelentes! Agendei a pintura completa do meu apartamento antes de me mudar e em apenas 3 dias entregaram tudo perfeito, com as tintas exatamente como escolhi.",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      name: "Felipe Almeida",
      role: "Síndico de Condomínio",
      text: "Excelente atendimento desde o primeiro contato. O agendamento inteligente pelo site funcionou perfeitamente e os pintores foram muito respeitosos com as regras do prédio.",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      name: "Beatriz Santos",
      role: "Lojista",
      text: "Fizemos a pintura de fachada da nossa boutique com a Akis Pintura. O resultado final trouxe um visual super moderno e elegante para nossa fachada. Custo-benefício sensacional!",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      name: "Roberto Dias",
      role: "Arquiteto Sênior",
      text: "Como arquiteto, sou muito exigente com o alinhamento de recortes e acabamento de pintura fina. A equipe da Akis Pintura é a melhor que já contratei para meus projetos de alto padrão.",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-brand-primary selection:text-white relative font-sans text-brand-secondary">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-brand-primary/10 rounded-xl group-hover:bg-brand-primary/20 transition-all duration-300">
                <Paintbrush className="h-6 w-6 text-brand-primary group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-brand-secondary">
                Akis <span className="text-brand-primary">Pintura</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-brand-secondary/80 hover:text-brand-primary transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brand-primary hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Header Actions */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="#contatos"
                className="bg-brand-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-brand-primary/20 hover:bg-brand-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Solicitar Orçamento
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-brand-secondary hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                id="btn-mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 pt-3 pb-6 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-base font-medium text-brand-secondary/90 hover:bg-brand-primary/5 hover:text-brand-primary transition-all"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-4 flex flex-col gap-3 px-3">
                  <a
                    href="#contatos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-brand-primary text-white text-center py-3 rounded-xl text-sm font-bold shadow-md shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all duration-200"
                  >
                    Solicitar Orçamento
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-12 md:py-24 bg-gradient-to-b from-brand-ice via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/15 text-brand-primary text-xs font-bold tracking-wide uppercase shadow-2xs">
                <Sparkles className="h-3.5 w-3.5" />
                Pintura Residencial & Comercial Premium
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-secondary leading-tight">
                Transformando Ambientes <br />
                <span className="text-brand-primary relative inline-block">
                  Valorizando
                  <svg className="absolute left-0 -bottom-1.5 w-full h-3 text-brand-primary/25" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0,5 C30,10 70,0 100,5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                o Seu Espaço.
              </h1>

              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Pintores qualificados, acabamento impecável e respeito ao seu imóvel. Da preparação meticulosa das superfícies à entrega limpa e perfumada. Experimente a excelência da Akis Pintura.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <a
                  href="#contatos"
                  className="inline-flex justify-center items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-brand-primary/30 hover:bg-brand-primary/90 hover:translate-y-[-2px] transition-all duration-200 group cursor-pointer"
                  id="btn-hero-cta"
                >
                  Fazer Orçamento Grátis
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#servicos"
                  className="inline-flex justify-center items-center gap-2 bg-white text-brand-secondary border border-gray-200 px-8 py-4 rounded-xl text-base font-semibold hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all duration-200"
                >
                  Nossos Serviços
                </a>
              </div>

              {/* Statistics Quick Info */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <span className="block text-2xl sm:text-3xl font-extrabold text-brand-secondary leading-none">
                    100%
                  </span>
                  <span className="text-xs font-medium text-gray-500">Satisfação</span>
                </div>
                <div className="border-l border-gray-100 pl-4">
                  <span className="block text-2xl sm:text-3xl font-extrabold text-brand-secondary leading-none">
                    5+ Anos
                  </span>
                  <span className="text-xs font-medium text-gray-500">Garantia</span>
                </div>
                <div className="border-l border-gray-100 pl-4">
                  <span className="block text-2xl sm:text-3xl font-extrabold text-brand-secondary leading-none">
                    +1k
                  </span>
                  <span className="text-xs font-medium text-gray-500">Projetos</span>
                </div>
              </div>
            </div>

            {/* Hero Right Media */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background decorative circles */}
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -z-10 animate-pulse delay-75"></div>

                {/* Primary Card Frame */}
                <div className="relative bg-white rounded-3xl p-3 shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                  <img
                    src={heroImage}
                    alt="Profissional Pintando uma Casa - Akis Pintura"
                    className="w-full h-[320px] sm:h-[400px] object-cover rounded-2xl group-hover:scale-[1.01] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating Live Indicator Badge */}
                  <div className="absolute top-6 left-6 bg-brand-secondary/90 backdrop-blur-md text-white py-1.5 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping"></span>
                    Serviço Realizado
                  </div>
                </div>

                {/* Micro floating dashboard stats inside Hero */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-50/80 flex items-center gap-3 max-w-xs animate-bounce" style={{ animationDuration: '6s' }}>
                  <div className="p-3 bg-brand-primary/10 rounded-xl">
                    <Award className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-brand-secondary">Serviço Certificado</h4>
                    <p className="text-[10px] text-gray-500 font-medium">Equipe Segura & Segurada</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FLOATING CARDS SECTION (3 Diferenciais) */}
      <section className="relative z-20 -mt-8 sm:-mt-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl border border-gray-100/80 transition-all duration-300 hover:translate-y-[-4px] flex gap-5">
              <div className="p-4 bg-brand-primary/10 rounded-2xl h-fit">
                <Clock className="h-6 w-6 text-brand-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-brand-secondary">Atendimento 08h às 18h</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Suporte personalizado de segunda a sábado. Agendamentos rápidos e retorno imediato.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl border border-gray-100/80 transition-all duration-300 hover:translate-y-[-4px] flex gap-5">
              <div className="p-4 bg-brand-primary/10 rounded-2xl h-fit">
                <Shield className="h-6 w-6 text-brand-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-brand-secondary">Equipe Especializada</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Profissionais qualificados com NR35, experientes em técnicas avançadas de acabamento.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl border border-gray-100/80 transition-all duration-300 hover:translate-y-[-4px] flex gap-5">
              <div className="p-4 bg-brand-primary/10 rounded-2xl h-fit">
                <Paintbrush className="h-6 w-6 text-brand-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-brand-secondary">Foco em Pintura Premium</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Uso de materiais de primeira linha e tecnologia airless para o melhor resultado estético.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVIÇOS SECTION */}
      <section id="servicos" className="py-20 sm:py-28 bg-brand-ice/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary">O Que Fazemos de Melhor</h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-secondary">
              Nossos Serviços Especializados
            </p>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Trabalhamos com soluções sob medida para cada tipo de superfície e exigência estética, garantindo durabilidade extrema e proteção.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Serviço 1 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 space-y-4 group">
              <div className="p-3.5 bg-brand-primary/10 text-brand-primary rounded-xl w-fit group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                <Paintbrush className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-brand-secondary">Pintura Residencial</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Salas, quartos, banheiros e cozinhas com tintas laváveis, sem cheiro e recortes milimétricos perfeitos.
              </p>
              <ul className="space-y-2 pt-2 border-t border-gray-50">
                <li className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600">
                  <Check className="h-3.5 w-3.5 text-brand-primary" /> Cobertura Total de Móveis
                </li>
                <li className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600">
                  <Check className="h-3.5 w-3.5 text-brand-primary" /> Tintas Acrílicas Premium
                </li>
              </ul>
            </div>

            {/* Serviço 2 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 space-y-4 group">
              <div className="p-3.5 bg-brand-primary/10 text-brand-primary rounded-xl w-fit group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-brand-secondary">Pintura Comercial</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Escritórios, galpões e clínicas com cronogramas flexíveis (inclusive noturnos) para não interromper seu negócio.
              </p>
              <ul className="space-y-2 pt-2 border-t border-gray-50">
                <li className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600">
                  <Check className="h-3.5 w-3.5 text-brand-primary" /> Rapidez de Execução
                </li>
                <li className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600">
                  <Check className="h-3.5 w-3.5 text-brand-primary" /> Tintas de Alta Resistência
                </li>
              </ul>
            </div>

            {/* Serviço 3 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 space-y-4 group">
              <div className="p-3.5 bg-brand-primary/10 text-brand-primary rounded-xl w-fit group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-brand-secondary">Efeitos e Texturas</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Aplicação de Cimento Queimado, Grafiato, Marmorato e texturas rústicas personalizadas para destaques modernos.
              </p>
              <ul className="space-y-2 pt-2 border-t border-gray-50">
                <li className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600">
                  <Check className="h-3.5 w-3.5 text-brand-primary" /> Efeito Cimento Queimado
                </li>
                <li className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600">
                  <Check className="h-3.5 w-3.5 text-brand-primary" /> Grafiato de Alta Durabilidade
                </li>
              </ul>
            </div>

            {/* Serviço 4 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 space-y-4 group">
              <div className="p-3.5 bg-brand-primary/10 text-brand-primary rounded-xl w-fit group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-brand-secondary">Fachadas e Alturas</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Pintura de fachadas de prédios e casas, impermeabilização de lajes e paredes com equipamentos de segurança NR35.
              </p>
              <ul className="space-y-2 pt-2 border-t border-gray-50">
                <li className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600">
                  <Check className="h-3.5 w-3.5 text-brand-primary" /> Impermeabilização Total
                </li>
                <li className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600">
                  <Check className="h-3.5 w-3.5 text-brand-primary" /> Pintores Credenciados NR35
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* GALERIA DE SERVIÇOS SECTION */}
      <section id="galeria" className="py-20 sm:py-28 bg-brand-ice/30 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3.5 py-1.5 rounded-full">
              Galeria de Serviços Premium
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-secondary">
              Nosso Portfólio de Acabamento
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Explore fotos reais de nossos projetos entregues em São Paulo. Navegue pelas subcategorias para conferir o cuidado, o alinhamento dos recortes e o brilho de nossos acabamentos finos.
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              { id: "todos", label: "Todos os Projetos" },
              { id: "residencial", label: "Residencial" },
              { id: "comercial", label: "Comercial" },
              { id: "texturas", label: "Texturas & Efeitos" },
              { id: "fachadas", label: "Fachadas & Alturas" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setGalleryFilter(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  galleryFilter === tab.id
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/25"
                    : "bg-white border border-gray-200 text-brand-secondary hover:border-brand-primary/40 hover:text-brand-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Gallery Items Grid */}
          <motion.div 
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {galleryItems
              .filter(item => galleryFilter === "todos" || item.category === galleryFilter)
              .map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  onClick={() => setSelectedImage({ url: item.image, title: item.title, category: item.categoryLabel })}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
                >
                  {/* Photo container */}
                  <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-brand-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-3 bg-white/90 rounded-full text-brand-primary transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                        <Eye className="h-5 w-5 stroke-[2.5]" />
                      </div>
                    </div>
                    {/* Category Label Pin */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[10px] font-extrabold text-brand-secondary px-2.5 py-1 rounded-full shadow-xs">
                      {item.categoryLabel}
                    </span>
                  </div>

                  {/* Card Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-sm text-brand-secondary group-hover:text-brand-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-[11px] leading-relaxed mt-1">
                        {item.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] text-brand-primary font-bold">
                      <span>Ver Detalhes</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>

        </div>
      </section>

      {/* GALLERY LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop with elegant blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-brand-secondary/90 backdrop-blur-md cursor-pointer"
            />

            {/* Lightbox Content Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-brand-secondary/80 hover:bg-brand-secondary text-white rounded-full p-2.5 transition-colors z-20 focus:outline-none"
                title="Fechar"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid md:grid-cols-12">
                {/* Image panel */}
                <div className="md:col-span-8 bg-black/5 aspect-[4/3] md:aspect-auto md:h-[60vh] flex items-center justify-center relative">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info sidebar */}
                <div className="md:col-span-4 p-8 flex flex-col justify-between bg-white h-full space-y-6">
                  <div className="space-y-4">
                    <span className="inline-block bg-brand-primary/10 text-brand-primary text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {selectedImage.category}
                    </span>
                    <h3 className="text-xl font-extrabold text-brand-secondary tracking-tight">
                      {selectedImage.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Projeto concluído com maestria pela equipe de pintores qualificados da Akis Pintura. Garantimos acabamentos milimétricos, recorte fino de rodapés e sancas, proteção total do mobiliário e entrega impecável do ambiente pronto para morar ou trabalhar.
                    </p>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    <div className="flex gap-2.5 items-center">
                      <div className="p-1.5 bg-brand-primary/10 text-brand-primary rounded-lg">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-700">100% Proteção Antisujeira</span>
                    </div>
                    <div className="flex gap-2.5 items-center">
                      <div className="p-1.5 bg-brand-primary/10 text-brand-primary rounded-lg">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-700">Recortes e Alinhamento Perfeito</span>
                    </div>
                    <div className="flex gap-2.5 items-center">
                      <div className="p-1.5 bg-brand-primary/10 text-brand-primary rounded-lg">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-700">Garantia Premium Inclusa</span>
                    </div>

                    <div className="pt-4">
                      <a
                        href="https://wa.me/5511943969417"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-brand-primary text-white py-3 rounded-xl text-xs font-bold shadow-md hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2"
                      >
                        Solicitar Orçamento Similar
                        <ArrowUpRight className="h-4 w-4 animate-pulse" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* QUEM SOMOS SECTION (Com fotos de pessoas pintando) */}
      <section id="quem-somos" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Column 1: Image Frame */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -top-8 -left-8 w-48 h-48 bg-brand-primary/5 rounded-full blur-2xl"></div>
              <div className="relative bg-white p-3 rounded-3xl shadow-xl border border-gray-100">
                <img
                  src={aboutImage}
                  alt="Pintores felizes aplicando tinta na parede"
                  className="w-full h-[400px] object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-6 -right-6 bg-brand-secondary text-white p-6 rounded-2xl shadow-xl border border-gray-800/20 space-y-1">
                  <span className="block text-3xl font-extrabold text-brand-primary">100%</span>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Comprometimento</span>
                </div>
              </div>
            </div>

            {/* Column 2: Text details */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary">Quem Somos</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-secondary">
                Compromisso com o Fino Acabamento e Confiança
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                A Akis Pintura nasceu da paixão pelo design de interiores e da necessidade de oferecer um serviço de excelência real no ramo da construção. Para nós, pintar não é apenas cobrir superfícies com cor, mas transformar a energia dos lares e valorizar o patrimônio de nossos clientes.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Buscamos a perfeição em cada recorte, utilizamos as melhores tintas do mercado e investimos no treinamento constante de nossa equipe técnica de pintores parceiros e prestadores. Garantimos pontualidade, proteção total de pisos e móveis e limpeza absoluta ao término de cada jornada.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div className="flex gap-3 items-start">
                  <div className="p-1 bg-brand-primary/10 text-brand-primary rounded-lg mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-secondary">Equipamento Moderno</h4>
                    <p className="text-gray-500 text-xs">Pintura convencional e tecnologia de pulverização airless.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-1 bg-brand-primary/10 text-brand-primary rounded-lg mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-secondary">Piso Protegido</h4>
                    <p className="text-gray-500 text-xs">Proteção profissional com papelão ondulado de alta resistência.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS SECTION (Faixa Azul Água com sombras e números animados) */}
      <section className="relative z-10 py-12 md:py-16 bg-brand-water shadow-2xl shadow-brand-water/30 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-brand-secondary">
            
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                +1.000
              </div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-80">
                Clientes Satisfeitos
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                +15.000m²
              </div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-80">
                Paredes Pintadas
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                100%
              </div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-80">
                Garantia e Limpeza
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                +15
              </div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-80">
                Pintores Parceiros
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* DEPOIMENTOS SECTION (6 Clientes satisfeitos) */}
      <section id="depoimentos" className="py-20 sm:py-28 bg-brand-ice/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary">O Que Dizem Nossos Clientes</h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-secondary">
              Histórias de Sucesso Reais
            </p>
            <p className="text-gray-500 text-sm sm:text-base">
              A maior recompensa para o nosso trabalho é ver o sorriso estampado no rosto de nossos clientes após a entrega do projeto.
            </p>
          </div>

          {/* Testimonials Grid (6 Cards) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:translate-y-[-2px]"
              >
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[...Array(test.stars)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-brand-primary text-brand-primary" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed italic">
                    "{test.text}"
                  </p>
                </div>
                
                {/* User Info */}
                <div className="flex items-center gap-4.5 pt-6 mt-6 border-t border-gray-50">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-11 h-11 rounded-full object-cover shadow-inner"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-brand-secondary group-hover:text-brand-primary transition-colors">
                      {test.name}
                    </h4>
                    <p className="text-[10px] font-semibold text-gray-400">
                      {test.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* AREA DE PRESTADOR DE SERVIÇOS SE CADASTRAR */}
      <section id="prestadores" className="py-20 sm:py-28 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Text description left */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/15 text-brand-primary text-xs font-bold tracking-wide uppercase">
                <Users className="h-3.5 w-3.5" />
                Trabalhe Conosco
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-secondary leading-tight">
                Seja um Prestador de Serviços <span className="text-brand-primary">Parceiro</span>
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed">
                Você é pintor, texturizador ou ajudante qualificado? A Akis Pintura está sempre em busca de novos talentos para expandir nossa equipe e atender à grande demanda de projetos premium em toda a região.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-brand-primary/10 text-brand-primary rounded-md mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-brand-secondary">Pagamento Garantido</h4>
                    <p className="text-gray-500 text-xs">Repasses semanais justos diretamente na sua conta após a entrega.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-brand-primary/10 text-brand-primary rounded-md mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-brand-secondary">Projetos Constantes</h4>
                    <p className="text-gray-500 text-xs">Tenha uma agenda cheia de serviços bem avaliados perto de você.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-brand-primary/10 text-brand-primary rounded-md mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-brand-secondary">Materiais de Alto Padrão</h4>
                    <p className="text-gray-500 text-xs">Trabalhe apenas com os melhores produtos químicos, lonas e ferramentas.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form right */}
            <div className="lg:col-span-7 bg-brand-ice/80 rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl"></div>
              
              <div className="space-y-2 mb-8 text-center lg:text-left">
                <h3 className="text-xl font-bold text-brand-secondary">Formulário de Cadastro</h3>
                <p className="text-gray-500 text-xs">Preencha com seus dados de profissional de pintura que entraremos em contato.</p>
              </div>

              <form onSubmit={handleProviderSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider block">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Santos"
                      value={providerForm.name}
                      onChange={(e) => setProviderForm({ ...providerForm, name: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-brand-secondary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider block">E-mail *</label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: carlos@example.com"
                      value={providerForm.email}
                      onChange={(e) => setProviderForm({ ...providerForm, email: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-brand-secondary"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider block">WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: (11) 99999-9999"
                      value={providerForm.phone}
                      onChange={(e) => setProviderForm({ ...providerForm, phone: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-brand-secondary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider block">Especialidade Principal *</label>
                    <select
                      required
                      value={providerForm.specialty}
                      onChange={(e) => setProviderForm({ ...providerForm, specialty: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-brand-secondary"
                    >
                      <option value="">Selecione...</option>
                      <option value="Pintor Geral">Pintor Geral</option>
                      <option value="Texturizador">Texturizador</option>
                      <option value="Especialista em Fachadas">Especialista em Fachadas</option>
                      <option value="Pintor Industrial">Pintor Industrial</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider block">Anos de Experiência *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="Ex: 5"
                      value={providerForm.experience}
                      onChange={(e) => setProviderForm({ ...providerForm, experience: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-brand-secondary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider block">Link do Portfólio / Instagram</label>
                    <input
                      type="text"
                      placeholder="Ex: @seunome_pintor"
                      value={providerForm.portfolio}
                      onChange={(e) => setProviderForm({ ...providerForm, portfolio: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-brand-secondary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider block">Fale um pouco sobre você e ferramentas que possui</label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Possuo máquina airless Graco, andamento próprio e lixadeira com aspirador."
                    value={providerForm.message}
                    onChange={(e) => setProviderForm({ ...providerForm, message: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-brand-secondary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={providerLoading}
                  className="w-full bg-brand-primary text-white py-3.5 rounded-xl text-xs font-bold shadow-md shadow-brand-primary/20 hover:bg-brand-primary/95 transition-all cursor-pointer flex justify-center items-center gap-2"
                >
                  {providerLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      Enviar Cadastro
                      <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* CONTATOS SECTION & FORMULÁRIO DE AGENDAMENTO INTELIGENTE (AJAX) */}
      <section id="contatos" className="py-20 sm:py-28 bg-brand-ice/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Contacts Info Left */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4 text-center lg:text-left">
                <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary">Fale Conosco</h2>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-secondary">
                  Agendamento Inteligente & Orçamentos
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Utilize nosso formulário inteligente para solicitar um orçamento detalhado de forma instantânea. Nossa equipe fará a triagem e agendará uma visita técnica sem custo.
                </p>
              </div>

              {/* Information Blocks */}
              <div className="space-y-5 max-w-sm mx-auto lg:mx-0">
                
                <div className="flex gap-4.5 items-center">
                  <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ligue ou Mande WhatsApp</h4>
                    <p className="text-sm font-bold text-brand-secondary hover:text-brand-primary transition-colors">
                      <a href="https://wa.me/5511943969417" target="_blank" rel="noopener noreferrer">
                        (11) 94396-9417
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4.5 items-center">
                  <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">E-mail de Suporte</h4>
                    <p className="text-sm font-bold text-brand-secondary hover:text-brand-primary transition-colors">
                      akis.pintura@example.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-4.5 items-center">
                  <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Área de Atendimento</h4>
                    <p className="text-sm font-bold text-brand-secondary">
                      São Paulo, Grande ABC e Região Metropolitana.
                    </p>
                  </div>
                </div>

              </div>

              {/* Work Hours Box */}
              <div className="bg-brand-secondary text-white p-6 rounded-2xl space-y-2 max-w-sm mx-auto lg:mx-0">
                <div className="flex items-center gap-2 text-brand-primary">
                  <Clock className="h-5 w-5" />
                  <h4 className="text-sm font-bold">Horário de Atendimento</h4>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Segunda a Sexta: 08:00h às 18:00h <br />
                  Sábado: 08:00h às 12:00h (Agendamentos Especiais) <br />
                  Domingo: Fechado
                </p>
              </div>
            </div>

            {/* Smart Booking Form Right */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-2xl relative">
              <div className="space-y-2 mb-8 text-center lg:text-left">
                <h3 className="text-xl font-bold text-brand-secondary">Solicitar Visita Técnica</h3>
                <p className="text-gray-500 text-xs">Agende uma medição precisa para receber seu orçamento detalhado em PDF.</p>
              </div>

              {/* Booking Form submitting to local Express endpoint via AJAX */}
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider block">Nome Completo *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Pedro Henrique"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      className="w-full bg-brand-ice/40 border border-gray-100 rounded-xl pl-11 pr-4 py-3.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-brand-secondary"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider block">E-mail *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        placeholder="Ex: pedro@example.com"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                        className="w-full bg-brand-ice/40 border border-gray-100 rounded-xl pl-11 pr-4 py-3.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-brand-secondary"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider block">WhatsApp *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        placeholder="Ex: (11) 94396-9417"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        className="w-full bg-brand-ice/40 border border-gray-100 rounded-xl pl-11 pr-4 py-3.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-brand-secondary"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider block">Tipo de Serviço *</label>
                    <div className="relative">
                      <select
                        required
                        value={bookingForm.serviceType}
                        onChange={(e) => setBookingForm({ ...bookingForm, serviceType: e.target.value })}
                        className="w-full bg-brand-ice/40 border border-gray-100 rounded-xl px-4 py-3.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-brand-secondary appearance-none"
                      >
                        <option value="">Selecione...</option>
                        <option value="Pintura Residencial">Pintura Residencial</option>
                        <option value="Pintura Comercial">Pintura Comercial</option>
                        <option value="Texturização">Efeitos e Texturas</option>
                        <option value="Fachadas">Fachadas e Alturas</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider block">Data Pretendida *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        className="w-full bg-brand-ice/40 border border-gray-100 rounded-xl pl-11 pr-4 py-3.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-brand-secondary"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider block">Mensagem / Informações da parede</label>
                  <textarea
                    rows={4}
                    placeholder="Ex: Gostaria de pintar 3 quartos e sala, incluindo tetos. Paredes em bom estado."
                    value={bookingForm.message}
                    onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                    className="w-full bg-brand-ice/40 border border-gray-100 rounded-xl px-4 py-3.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-brand-secondary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-brand-primary text-white py-4 rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/25 hover:bg-brand-primary/95 hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer flex justify-center items-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Enviando Agendamento Inteligente...
                    </>
                  ) : (
                    <>
                      Agendar Visita Técnica Agora
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="bg-brand-secondary text-white pt-16 pb-12 relative overflow-hidden">
        {/* Background visual graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-white/10">
            
            {/* Footer Left Column */}
            <div className="md:col-span-5 space-y-4 text-center md:text-left">
              <a href="#" className="flex justify-center md:justify-start items-center gap-2.5">
                <div className="p-2 bg-brand-primary/10 rounded-xl">
                  <Paintbrush className="h-6 w-6 text-brand-primary" />
                </div>
                <span className="text-xl font-bold tracking-tight block leading-none">
                  Akis <span className="text-brand-primary">Pintura</span>
                </span>
              </a>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                Excelência em serviços de pintura comercial, residencial e industrial em São Paulo. Fino acabamento com técnicos especializados.
              </p>
              <div className="pt-2 text-center md:text-left">
                <a
                  href="https://www.instagram.com/akispintura/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-10 w-10 text-white bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 hover:scale-110 active:scale-95 rounded-full transition-all duration-200 shadow-lg shadow-pink-600/20"
                  title="Siga-nos no Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Footer Center Column */}
            <div className="md:col-span-3 text-center md:text-left">
              <h4 className="text-xs font-bold tracking-widest text-brand-primary uppercase mb-4">Navegação</h4>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Right Column */}
            <div className="md:col-span-4 text-center md:text-left space-y-4">
              <h4 className="text-xs font-bold tracking-widest text-brand-primary uppercase mb-4 font-sans">Compromisso Premium</h4>
              <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
                Garantia de 2 a 5 anos contra descascamentos, recortes executados sob rigoroso controle de qualidade e devolução do ambiente 100% limpo e perfumado.
              </p>
              <button
                onClick={() => {
                  fetchDashboardData();
                  setIsAdminOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-brand-primary font-bold hover:underline cursor-pointer"
              >
                <Database className="h-3.5 w-3.5" />
                Acessar Banco de Dados do Site (Live)
              </button>
            </div>

          </div>

          {/* Copyright Row */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 gap-4 text-center">
            <p>© {new Date().getFullYear()} Akis Pintura Ltda. Todos os direitos reservados. CNPJ sob consulta.</p>
            <div className="flex gap-4">
              <span className="hover:text-gray-400 transition-colors">Termos de Uso</span>
              <span className="hover:text-gray-400 transition-colors">Política de Privacidade</span>
            </div>
          </div>

        </div>
      </footer>

      {/* WHATSAPP FLOATING BUTTON (Position: fixed com animação de pulso) */}
      <a
        href="https://wa.me/5511943969417"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 group"
        title="Fale no WhatsApp"
        id="btn-whatsapp-floating"
      >
        {/* Animated Ripple Effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 group-hover:scale-150 animate-ping opacity-70 -z-10"></span>
        <svg
          className="h-7 w-7 fill-white group-hover:rotate-6 transition-transform"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.182 1.449 4.725 1.451 5.436 0 9.86-4.37 9.863-9.743.002-2.602-1.01-5.05-2.85-6.892C16.495 2.128 14.043.924 11.432.924 6.0 1.157 1.748 5.532 1.745 10.903c-.001 1.724.47 3.411 1.36 4.915l-.982 3.582 3.682-.958zM17.51 15.65c-.328-.164-1.94-.957-2.24-1.066-.3-.11-.52-.164-.74.164-.22.328-.85 1.066-1.04 1.284-.19.219-.38.246-.71.082-.33-.164-1.39-.512-2.65-1.637-.98-.874-1.64-1.953-1.83-2.28-.19-.328-.02-.507.14-.67.15-.147.33-.383.49-.575.16-.192.21-.328.32-.547.11-.219.06-.411-.03-.575-.09-.164-.74-1.78-.101-2.11.37-.328.71-.328 1.04 0 .328.328.38.219.52.438.14.219.08.411-.03.575-.11.164-.85 1.066-1.04 1.284-.19.219-.38.246-.71.082-.33-.164-1.39-.512-2.65-1.637-.98-.874-1.64-1.953-1.83-2.28a1.23 1.23 0 0 1-.16-.364z" />
        </svg>
      </a>

      {/* FORM SUBMIT AJAX MODAL (Agradecemos seu Contato!) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-brand-secondary/70 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full text-center shadow-2xl border border-gray-100 z-10 space-y-6"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-50 transition-colors"
                title="Fechar"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Checkmark Icon Laranja Animado */}
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-brand-orange/10 text-brand-orange animate-bounce">
                <CheckCircle className="h-10 w-10 text-brand-orange stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-brand-secondary">
                  {modalMessage}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  Entraremos em contato via telefone ou WhatsApp em no máximo 15 minutos para formalizar o agendamento de sua visita técnica.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-brand-secondary text-white py-3.5 rounded-xl text-xs font-bold shadow-md hover:bg-brand-secondary/90 transition-all cursor-pointer"
              >
                Entendido, Obrigado!
              </button>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* ADMIN PORTAL / DATABASE VIEWER MODAL */}
      <AnimatePresence>
        {isAdminOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminOpen(false)}
              className="absolute inset-0 bg-brand-secondary/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl border border-gray-100 z-10 overflow-hidden"
            >
              
              {/* Header */}
              <div className="p-6 bg-brand-secondary text-white flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary/20 rounded-xl text-brand-primary">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">Banco de Dados Live (Express)</h3>
                    <p className="text-[10px] text-gray-400">Verificação em tempo real dos agendamentos e prestadores</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchDashboardData}
                    disabled={adminLoading}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
                    title="Atualizar dados"
                  >
                    <RefreshCw className={`h-4 w-4 ${adminLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setIsAdminOpen(false)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-brand-ice border-b border-gray-100">
                <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                  <div className="p-2.5 bg-brand-orange/10 text-brand-orange rounded-lg">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-brand-secondary leading-none">
                      {dashboardData?.appointments.length ?? 0}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Agendamentos</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                  <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-brand-secondary leading-none">
                      {dashboardData?.providers.length ?? 0}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Prestadores</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-100 text-cyan-600 rounded-lg">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-brand-secondary leading-none">
                      {dashboardData?.stats.baseClients ?? 1000}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Base Clientes</span>
                  </div>
                </div>
              </div>

              {/* Tabs for viewer */}
              <div className="flex border-b border-gray-100 px-6 bg-white shrink-0">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`py-4 px-4 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "all" ? "border-brand-primary text-brand-primary" : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Todos os Registros
                </button>
                <button
                  onClick={() => setActiveTab("appointments")}
                  className={`py-4 px-4 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "appointments" ? "border-brand-primary text-brand-primary" : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Agendamentos / Contatos ({dashboardData?.appointments.length ?? 0})
                </button>
                <button
                  onClick={() => setActiveTab("providers")}
                  className={`py-4 px-4 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "providers" ? "border-brand-primary text-brand-primary" : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Prestadores de Serviço ({dashboardData?.providers.length ?? 0})
                </button>
              </div>

              {/* Data Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-brand-ice/50">
                {adminLoading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-2">
                    <RefreshCw className="h-8 w-8 text-brand-primary animate-spin" />
                    <p className="text-xs text-gray-500 font-medium">Lendo arquivos JSON do servidor...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    
                    {/* Appointments view */}
                    {(activeTab === "all" || activeTab === "appointments") && (
                      <div className="space-y-3">
                        {activeTab === "all" && <h4 className="text-xs font-bold text-brand-secondary uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2"><Calendar className="h-4 w-4 text-brand-orange" /> Visitas e Orçamentos Agendados</h4>}
                        {dashboardData?.appointments.length === 0 ? (
                          <div className="bg-white p-6 rounded-xl border border-gray-100 text-center text-xs text-gray-500">
                            Nenhum agendamento pendente no momento.
                          </div>
                        ) : (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {dashboardData?.appointments.map((item) => (
                              <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-2xs space-y-3 relative group overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-orange" />
                                <div className="flex justify-between items-start pl-1.5">
                                  <div>
                                    <h5 className="font-bold text-xs sm:text-sm text-brand-secondary">{item.name}</h5>
                                    <p className="text-[10px] text-gray-400">ID: {item.id} | Criado: {new Date(item.createdAt).toLocaleString()}</p>
                                  </div>
                                  <span className="bg-brand-orange/10 text-brand-orange px-2.5 py-1 rounded-full text-[9px] font-bold">
                                    {item.serviceType}
                                  </span>
                                </div>
                                <div className="pl-1.5 space-y-1 text-xs text-gray-600">
                                  <p><strong>WhatsApp:</strong> {item.phone}</p>
                                  <p><strong>E-mail:</strong> {item.email}</p>
                                  <p><strong>Data Visita:</strong> {new Date(item.date).toLocaleDateString()}</p>
                                  {item.message && <p className="bg-gray-50 p-2 rounded-lg text-[11px] text-gray-500 leading-relaxed italic mt-1">"{item.message}"</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Providers view */}
                    {(activeTab === "all" || activeTab === "providers") && (
                      <div className="space-y-3 pt-4">
                        {activeTab === "all" && <h4 className="text-xs font-bold text-brand-secondary uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2"><Users className="h-4 w-4 text-brand-primary" /> Candidatos e Prestadores de Serviços</h4>}
                        {dashboardData?.providers.length === 0 ? (
                          <div className="bg-white p-6 rounded-xl border border-gray-100 text-center text-xs text-gray-500">
                            Nenhum profissional cadastrado no momento.
                          </div>
                        ) : (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {dashboardData?.providers.map((item) => (
                              <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-2xs space-y-3 relative group overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-primary" />
                                <div className="flex justify-between items-start pl-1.5">
                                  <div>
                                    <h5 className="font-bold text-xs sm:text-sm text-brand-secondary">{item.name}</h5>
                                    <p className="text-[10px] text-gray-400">ID: {item.id} | Cadastrado: {new Date(item.createdAt).toLocaleString()}</p>
                                  </div>
                                  <span className="bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-full text-[9px] font-bold">
                                    {item.specialty}
                                  </span>
                                </div>
                                <div className="pl-1.5 space-y-1 text-xs text-gray-600">
                                  <p><strong>WhatsApp:</strong> {item.phone}</p>
                                  <p><strong>E-mail:</strong> {item.email}</p>
                                  <p><strong>Experiência:</strong> {item.experience} anos</p>
                                  {item.portfolio && <p><strong>Portfólio / Redes:</strong> <span className="text-brand-primary font-semibold">{item.portfolio}</span></p>}
                                  {item.message && <p className="bg-gray-50 p-2 rounded-lg text-[11px] text-gray-500 leading-relaxed italic mt-1">"{item.message}"</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* Footer resetting database for demonstration and helper text */}
              <div className="p-6 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium text-center sm:text-left">
                  <AlertCircle className="h-4 w-4 text-gray-400 shrink-0" />
                  Os dados estão salvos em arquivos JSON persistentes no container do servidor Node.js.
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleResetDatabase}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Resetar Banco de Dados
                  </button>
                  <button
                    onClick={() => setIsAdminOpen(false)}
                    className="px-6 py-2 bg-brand-secondary hover:bg-brand-secondary/95 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    Fechar Painel
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
