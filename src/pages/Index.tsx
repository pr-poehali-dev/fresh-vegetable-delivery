import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import AuthModal, { User } from "@/components/AuthModal";
import Navbar from "@/components/Navbar";
import CatalogSection from "@/components/CatalogSection";
import CartDrawer from "@/components/CartDrawer";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/58f8e18c-3a1d-4321-a0d0-d558c40958c4.jpg";

const VEGETABLES = [
  { id: 1, name: "Картофель мытый", price: 55, unit: "кг", season: "осень", type: "картофель", emoji: "🥔", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/3dbd5d4c-347d-4306-be77-864030e67c89.jpg" },
  { id: 2, name: "Картофель Галла", price: 50, unit: "кг", season: "осень", type: "картофель", emoji: "🥔", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/0b53ae19-45d1-401c-a50f-69f9baefa75d.jpg" },
  { id: 3, name: "Картофель Колумба", price: 42, unit: "кг", season: "осень", type: "картофель", emoji: "🥔", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/2dc69047-7f79-4790-aaff-6796da1b4d8b.jpg" },
  { id: 4, name: "Капуста белокочанная свежая", price: 40, unit: "кг", season: "осень", type: "капуста", emoji: "🥬", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/fb2afc14-76f3-4957-a98a-46fccffd7d06.jpg" },
  { id: 5, name: "Морковь свежая", price: 38, unit: "кг", season: "осень", type: "корнеплоды", emoji: "🥕", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/023d4885-9eee-408a-89fd-cec00d665142.jpg" },
  { id: 6, name: "Лук репчатый свежий", price: 50, unit: "кг", season: "осень", type: "лук", emoji: "🧅", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/f43c952c-d59f-43f3-ba60-b4e845e3d9ea.jpg" },
  { id: 7, name: "Лук репчатый Казахстан", price: 30, unit: "кг", season: "осень", type: "лук", emoji: "🧅", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/87a24ecf-e70e-44ff-8b75-dc77258e72f9.jpg" },
  { id: 8, name: "Свёкла Краснодар", price: 45, unit: "кг", season: "осень", type: "корнеплоды", emoji: "🫐", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/ba66fd18-f627-40c3-b265-b7ff8a5706fc.jpg" },
  { id: 9, name: "Помидор Малиновка", price: 250, unit: "кг", season: "лето", type: "томаты", emoji: "🍅", badge: "Хит", weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/eed9e168-bf2c-4e6c-aa37-e5305573727f.jpeg" },
  { id: 10, name: "Помидор на ветке", price: 150, unit: "кг", season: "лето", type: "томаты", emoji: "🍅", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/1f46a197-22de-4fac-8b33-16bab135c783.jpg" },
  { id: 12, name: "Помидор Парадайс", price: 220, unit: "кг", season: "лето", type: "томаты", emoji: "🍅", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/05cd7a84-8e00-40ff-9e35-a9a9ae50e85f.jpg" },
  { id: 11, name: "Огурец пупырчатый Чечня", price: 150, unit: "кг", season: "лето", type: "огурцы", emoji: "🥒", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/3a013d01-ce48-4918-893a-f2b121197ad6.jpg" },
];

const FRUITS = [
  { id: 101, name: "Яблоки Голден", price: 120, unit: "кг", season: "осень", type: "яблоки", emoji: "🍎", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/e46b761d-297e-44b6-8825-2132c0ceb0b8.jpg" },
  { id: 102, name: "Яблоки Антоновка", price: 90, unit: "кг", season: "осень", type: "яблоки", emoji: "🍏", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/60cc751a-7ba8-41ee-b44b-b2768970c560.jpg" },
  { id: 109, name: "Яблоки Галла", price: 240, unit: "кг", season: "осень", type: "яблоки", emoji: "🍎", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/64b62730-8841-40cd-9717-456d2318cca4.jpg" },
  { id: 110, name: "Яблоки Кехура", price: 150, unit: "кг", season: "осень", type: "яблоки", emoji: "🍏", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/8352f768-a88f-4157-8a5f-f60a08b6bf02.jpg" },
  { id: 111, name: "Яблоки Грени Смит", price: 180, unit: "кг", season: "осень", type: "яблоки", emoji: "🍏", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/49188ad8-ab1d-4578-9134-0ff9200e2a59.jpg" },
  { id: 112, name: "Яблоки Семеринка", price: 220, unit: "кг", season: "осень", type: "яблоки", emoji: "🍎", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/783479ba-7a96-4e43-8be6-1ea2f4aa6796.jpg" },
  { id: 103, name: "Груши Конференц", price: 180, unit: "кг", season: "осень", type: "груши", emoji: "🍐", badge: "Хит", weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/38b75f43-6100-41cd-8bfb-34db957bbd2b.jpg" },
  { id: 113, name: "Груша Аббат", price: 280, unit: "кг", season: "осень", type: "груши", emoji: "🍐", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/9321f6a1-b081-4cfe-94a7-02c21a918024.jpg" },
  { id: 114, name: "Груша Дюшес Аргентина", price: 220, unit: "кг", season: "осень", type: "груши", emoji: "🍐", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/3a04e590-17d0-4141-bdc9-64348e3e9ee9.jpg" },
  { id: 115, name: "Мандарин Турция", price: 220, unit: "кг", season: "зима", type: "цитрусы", emoji: "🍊", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/a9e42def-2ecd-476b-a668-8cfae87eb129.jpg" },
  { id: 106, name: "Сливы синие", price: 200, unit: "кг", season: "лето", type: "сливы", emoji: "🍑", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/0a031ca2-f15a-4f25-997c-114466e7e4bc.jpg" },
];

const VEG_TYPES = ["все", "картофель", "капуста", "корнеплоды", "лук", "томаты", "огурцы"];
const FRUIT_TYPES = ["все", "яблоки", "груши", "цитрусы", "сливы"];

const PRODUCTS = [...VEGETABLES, ...FRUITS];

const REVIEWS = [
  { id: 1, name: "Анна К.", text: "Уже третий месяц заказываю каждую неделю! Овощи всегда свежайшие, как с грядки. Брокколи и шпинат — просто объедение!", rating: 5, avatar: "👩‍🦰", location: "Уфа" },
  { id: 2, name: "Михаил Р.", text: "Отличный сервис! Фильтр по сезонности помог найти именно то, что сейчас вкуснее всего. Доставка по предзаказу — очень удобно!", rating: 5, avatar: "👨‍💼", location: "Уфа" },
  { id: 3, name: "Светлана П.", text: "Беру органические овощи для всей семьи. Дети едят с удовольствием! Цены адекватные, особенно на сезонное.", rating: 5, avatar: "👩‍👧", location: "Уфа" },
];

const FAQ_ITEMS = [
  { q: "Как работает доставка?", a: "Доставляем по предзаказу: утром (до 12:00) и вечером (с 18:00). Оформите заказ заранее — и получите свежие продукты в удобное время." },
  { q: "Откуда берутся овощи?", a: "Работаем напрямую с фермерами Подмосковья и соседних регионов. Все овощи проходят контроль качества перед отправкой." },
  { q: "Есть ли минимальная сумма заказа?", a: "Минимальный заказ — 800 рублей. При заказе от 2000 рублей доставка бесплатная." },
  { q: "Что если товар мне не понравится?", a: "Гарантируем свежесть! Если вы недовольны качеством — вернём деньги или заменим товар без лишних вопросов." },
  { q: "Как выбрать сезонные овощи?", a: "Используйте фильтр по сезонности в каталоге. Сезонные овощи вкуснее, питательнее и дешевле — они в приоритете." },
];

const NAV_LINKS = ["Каталог", "Доставка", "О сервисе", "Отзывы", "FAQ", "Контакты"];

type CartItem = { id: number; name: string; price: number; emoji: string; qty: number; weightKg: number };

export default function Index() {
  const [activeSection, setActiveSection] = useState<"vegetables" | "fruits">("vegetables");
  const [activeType, setActiveType] = useState("все");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [installed, setInstalled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [orderName, setOrderName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderFlat, setOrderFlat] = useState('');
  const [orderTime, setOrderTime] = useState<'morning' | 'evening'>('morning');
  const [orderComment, setOrderComment] = useState('');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [orderStep, setOrderStep] = useState<1 | 2>(1);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    const prompt = installPrompt as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> };
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setInstallPrompt(null);
  };

  const handleSubmit = async () => {
    if (!formName.trim() || !formPhone.trim()) return;
    setFormStatus('loading');
    try {
      const res = await fetch('https://functions.poehali.dev/a913c03c-9fc0-4a9f-baef-df33289b1a86', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, phone: formPhone, comment: formComment }),
      });
      if (res.ok) {
        setFormStatus('success');
        setFormName(''); setFormPhone(''); setFormComment('');
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  const isSearching = search.trim().length > 0;
  const currentProducts = isSearching ? PRODUCTS : (activeSection === "vegetables" ? VEGETABLES : FRUITS);
  const currentTypes = activeSection === "vegetables" ? VEG_TYPES : FRUIT_TYPES;
  const filteredProducts = currentProducts.filter(p => {
    const matchesType = isSearching || activeType === "все" || p.type === activeType;
    const matchesSearch = !isSearching || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalWeight = cart.reduce((s, i) => s + i.weightKg * i.qty, 0);
  const freeDelivery = totalWeight >= 5;

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: 1, weightKg: product.weightKg }];
    });
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const scrollTo = (section: string) => {
    const map: Record<string, string> = {
      "Каталог": "catalog", "Доставка": "delivery", "О сервисе": "about",
      "Отзывы": "reviews", "FAQ": "faq", "Контакты": "contacts"
    };
    const el = document.getElementById(map[section]);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const [bannerDismissed, setBannerDismissed] = useState(() => localStorage.getItem('pwa-banner-dismissed') === '1');
  const showBanner = !bannerDismissed && !installed && !!installPrompt;

  const dismissBanner = () => {
    setBannerDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', '1');
  };

  const logout = () => { setUser(null); localStorage.removeItem('user'); setProfileOpen(false); };

  const handleOrder = async () => {
    if (!orderName.trim() || !orderPhone.trim() || !orderAddress.trim()) return;
    setOrderStatus('loading');
    const items = cart.map(i => `• ${i.emoji} ${i.name} — ${i.qty} кг × ${i.price} ₽ = ${i.qty * i.price} ₽`).join('\n');
    const delivery = freeDelivery ? 0 : 199;
    const total = totalPrice + delivery;
    const timeLabel = orderTime === 'morning' ? 'Утро (до 12:00)' : 'Вечер (с 18:00)';
    const address = orderFlat ? `${orderAddress}, кв. ${orderFlat}` : orderAddress;
    try {
      const res = await fetch('https://functions.poehali.dev/a913c03c-9fc0-4a9f-baef-df33289b1a86', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orderName,
          phone: orderPhone,
          comment: `📦 СОСТАВ ЗАКАЗА:\n${items}\n\n🚚 Доставка: ${delivery === 0 ? 'Бесплатно' : delivery + ' ₽'}\n💰 ИТОГО: ${total} ₽\n\n📍 Адрес: ${address}\n⏰ Время: ${timeLabel}${orderComment ? `\n💬 Комментарий: ${orderComment}` : ''}${user ? `\n\n⭐ Баллов у клиента: ${user.points}` : ''}`,
        }),
      });
      if (res.ok) {
        if (user && !user.is_first_order_done) {
          try {
            const bonusRes = await fetch('https://functions.poehali.dev/d8e8eac1-b7f3-41b8-b041-69e6d80a1c03', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: user.id }),
            });
            if (bonusRes.ok) {
              const bonusData = await bonusRes.json();
              const updatedUser = { ...user, points: bonusData.points, is_first_order_done: true };
              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
          } catch (e) { console.error(e); }
        }
        setOrderStatus('success');
        setCart([]);
        setOrderName(''); setOrderPhone(''); setOrderAddress('');
        setOrderFlat(''); setOrderComment(''); setOrderStep(1);
      } else {
        setOrderStatus('error');
      }
    } catch {
      setOrderStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background font-body">
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onAuth={setUser} />}

      {profileOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setProfileOpen(false)}>
          <div className="bg-veggie-dark border border-veggie-green/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold text-white">Мой профиль</h2>
              <button onClick={() => setProfileOpen(false)} className="text-white/40 hover:text-white transition-colors"><Icon name="X" size={20} /></button>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-veggie-lime/20 flex items-center justify-center text-2xl">👤</div>
              <div>
                <p className="text-white font-semibold">{user.name}</p>
                <p className="text-white/50 text-sm">{user.phone}</p>
              </div>
            </div>
            <div className="bg-veggie-lime/10 border border-veggie-lime/30 rounded-xl p-4 mb-4 flex items-center gap-4">
              <span className="text-3xl">⭐</span>
              <div>
                <p className="text-veggie-lime text-2xl font-bold">{user.points} баллов</p>
                <p className="text-white/50 text-sm">1 балл = 1 ₽ скидки</p>
              </div>
            </div>
            {!user.is_first_order_done && (
              <div className="bg-veggie-orange/10 border border-veggie-orange/30 rounded-xl p-3 mb-4 flex items-center gap-2">
                <span>🎁</span>
                <p className="text-veggie-orange text-sm font-medium">+200 баллов за первый заказ!</p>
              </div>
            )}
            <button onClick={logout} className="w-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 py-2.5 rounded-xl text-sm transition-colors">
              Выйти
            </button>
          </div>
        </div>
      )}

      <Navbar
        search={search}
        setSearch={setSearch}
        totalItems={totalItems}
        installPrompt={installPrompt}
        installed={installed}
        user={user}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        showBanner={showBanner}
        onCartOpen={() => setCartOpen(true)}
        onAuthOpen={() => setAuthOpen(true)}
        onProfileOpen={() => setProfileOpen(true)}
        onInstall={handleInstall}
        onDismissBanner={dismissBanner}
        scrollTo={scrollTo}
      />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center hero-bg overflow-hidden noise-overlay pt-16">
        <div className="absolute inset-0 opacity-30">
          <img src={HERO_IMAGE} alt="Свежие овощи" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 hero-bg opacity-75" />

        <div className="absolute top-20 right-10 w-64 h-64 rounded-full border border-veggie-lime/20 animate-spin-slow" />
        <div className="absolute top-32 right-20 w-40 h-40 rounded-full border border-veggie-orange/20" style={{ animation: 'spin-slow 15s linear infinite reverse' }} />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-veggie-lime/5 blur-3xl" />

        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-veggie-lime/20 border border-veggie-lime/40 text-veggie-lime text-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-veggie-lime rounded-full animate-pulse" />
              Доставка по предзаказу
            </div>

            <h1 className="font-heading text-6xl md:text-8xl font-bold text-white leading-none mb-6 animate-fade-in animate-delay-100">
              СВЕЖИЕ<br />
              <span className="text-gradient">ОВОЩИ</span><br />
              НА СТОЛ
            </h1>

            <p className="text-white/70 text-lg md:text-xl mb-10 leading-relaxed animate-fade-in animate-delay-200">
              Всегда свежие отборные овощи. Бесплатная доставка по Уфе и в радиусе 20 км от города при заказе от 1500 рублей.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in animate-delay-300">
              <button onClick={() => scrollTo("Каталог")} className="btn-primary px-8 py-4 rounded-full font-heading text-lg font-semibold tracking-wide">
                Смотреть каталог →
              </button>
              <button onClick={() => scrollTo("Доставка")} className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-heading text-lg font-semibold hover:border-veggie-lime hover:text-veggie-lime transition-all">
                Условия доставки
              </button>
            </div>

            <div className="flex gap-8 mt-14 animate-fade-in animate-delay-400">
              {[["500+", "сортов"], ["утро/вечер", "доставка"], ["98%", "довольны"]].map(([val, label]) => (
                <div key={label}>
                  <div className="font-heading text-3xl font-bold text-veggie-lime">{val}</div>
                  <div className="text-white/50 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute right-20 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6">
          {["🍅", "🥦", "🥕", "🫑", "🥒"].map((emoji, i) => (
            <div key={emoji} className="text-5xl animate-float" style={{ animationDelay: `${i * 0.4}s` }}>{emoji}</div>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={32} className="text-white/40" />
        </div>
      </section>

      <CatalogSection
        search={search}
        setSearch={setSearch}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        activeType={activeType}
        setActiveType={setActiveType}
        currentTypes={currentTypes}
        filteredProducts={filteredProducts}
        cart={cart}
        addToCart={addToCart}
        updateQty={updateQty}
      />

      {/* DELIVERY */}
      <section id="delivery" className="py-20 bg-veggie-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-veggie-lime/5 rounded-full blur-3xl" />
        <div className="container relative z-10">
          <div className="text-center mb-14">
            <h2 className="font-heading text-5xl font-bold mb-3">КАК МЫ ДОСТАВЛЯЕМ</h2>
            <div className="section-divider w-24 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Бесплатно по Уфе и в радиусе 20 км при заказе от 1500 рублей</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {[
              { icon: "Clock", title: "По предзаказу", desc: "Доставка утром и вечером — оформите заказ заранее", color: "text-veggie-lime" },
              { icon: "MapPin", title: "Уфа и 20 км", desc: "Доставляем по всей Уфе и до 20 км от города", color: "text-veggie-orange" },
              { icon: "Package", title: "Эко-упаковка", desc: "Используем биоразлагаемые пакеты и холодовые контейнеры", color: "text-veggie-lime" },
            ].map((item) => (
              <div key={item.title} className="text-center p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all card-hover">
                <div className={`${item.color} mb-4 flex justify-center`}>
                  <Icon name={item.icon} size={48} />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-veggie-green/20 border border-veggie-green/40 rounded-2xl p-6">
              <div className="font-heading text-xl font-bold text-veggie-lime mb-4 flex items-center gap-2">
                <Icon name="Truck" size={20} />ТАРИФЫ ДОСТАВКИ
              </div>
              <div className="space-y-3">
                {[["Заказ от 1500 ₽", "Бесплатно"], ["Заказ до 1500 ₽", "По договорённости"], ["Утренняя доставка", "до 12:00"], ["Вечерняя доставка", "с 18:00"]].map(([label, price]) => (
                  <div key={label} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-white/70">{label}</span>
                    <span className="font-semibold text-veggie-lime">{price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-veggie-orange/20 border border-veggie-orange/40 rounded-2xl p-6">
              <div className="font-heading text-xl font-bold text-veggie-orange mb-4 flex items-center gap-2">
                <Icon name="Clock" size={20} />ЧАСЫ РАБОТЫ
              </div>
              <div className="space-y-3">
                {[["Пн–Пт", "8:00 — 22:00"], ["Суббота", "9:00 — 22:00"], ["Воскресенье", "10:00 — 20:00"]].map(([day, time]) => (
                  <div key={day} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-white/70">{day}</span>
                    <span className="font-semibold text-veggie-orange">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 bg-veggie-cream">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 tag-seasonal px-4 py-2 rounded-full text-sm mb-6">
                <Icon name="Leaf" size={14} />С 2019 года
              </div>
              <h2 className="font-heading text-5xl font-bold text-veggie-green mb-6 leading-tight">О НАС — КТО МЫ И ЗАЧЕМ</h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Филини Фермерские Продукты — это команда людей, влюблённых в настоящую еду. Мы работаем напрямую с 30+ фермерами, чтобы вы получали только самое свежее и честное.
              </p>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Никаких перекупщиков, никакой химии. Только сезонные овощи в правильное время года — именно тогда, когда они самые вкусные и питательные.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[["30+", "Фермеров"], ["12 000+", "Клиентов"], ["5 лет", "На рынке"]].map(([val, label]) => (
                  <div key={label} className="text-center bg-white rounded-2xl p-4 shadow-sm">
                    <div className="font-heading text-2xl font-bold text-veggie-green">{val}</div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "Shield", title: "Гарантия свежести", desc: "Возврат или замена без вопросов" },
                { icon: "Leaf", title: "Без химии", desc: "Только натуральные методы выращивания" },
                { icon: "Heart", title: "Забота о природе", desc: "Эко-упаковка и минимум отходов" },
                { icon: "Star", title: "Проверенные фермеры", desc: "Каждый поставщик прошёл отбор" },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-veggie-green mb-3"><Icon name={item.icon} size={28} /></div>
                  <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="font-heading text-5xl font-bold text-veggie-green mb-3">ОТЗЫВЫ ПОКУПАТЕЛЕЙ</h2>
            <div className="section-divider w-24 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Что говорят наши клиенты</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((review, i) => (
              <div key={review.id} className="bg-background rounded-2xl p-6 border border-border card-hover animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <span key={j} className="text-veggie-yellow text-lg">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 italic">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-veggie-green/10 flex items-center justify-center text-xl">{review.avatar}</div>
                  <div>
                    <div className="font-semibold text-foreground">{review.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="MapPin" size={10} />{review.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-veggie-dark">
        <div className="container max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="font-heading text-5xl font-bold text-white mb-3">ЧАСТЫЕ ВОПРОСЫ</h2>
            <div className="section-divider w-24 mx-auto mb-4" />
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border border-white/10 rounded-2xl overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors">
                  <span className="font-semibold text-white pr-4">{item.q}</span>
                  <Icon name={faqOpen === i ? "ChevronUp" : "ChevronDown"} size={20} className="text-veggie-lime shrink-0" />
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-6 text-white/60 leading-relaxed">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="font-heading text-5xl font-bold text-veggie-green mb-3">КОНТАКТЫ</h2>
            <div className="section-divider w-24 mx-auto mb-4" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="space-y-6">
              {[
                { icon: "Phone", label: "Телефон", value: "+7 (938) 468-44-44" },
                { icon: "MessageCircle", label: "WhatsApp / Telegram", value: "+7 (938) 468-44-44" },
                { icon: "Clock", label: "Время работы", value: "Пн–Пт: 8:00–22:00" },
              ].map((contact) => (
                <div key={contact.label} className="flex items-center gap-4">
                  <div className="text-veggie-green w-12 h-12 rounded-full bg-veggie-green/10 flex items-center justify-center">
                    <Icon name={contact.icon} size={22} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{contact.label}</div>
                    <div className="font-semibold text-foreground">{contact.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-veggie-green rounded-2xl p-8 text-white">
              <h3 className="font-heading text-2xl font-bold mb-2">Оставить заявку</h3>
              <p className="text-white/70 mb-6">Перезвоним в течение 15 минут</p>

              {formStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🎉</div>
                  <p className="font-heading text-xl font-bold mb-2">Заявка отправлена!</p>
                  <p className="text-white/70">Мы позвоним вам в ближайшее время</p>
                  <button onClick={() => setFormStatus('idle')} className="mt-4 text-veggie-lime underline text-sm">Отправить ещё</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <input type="text" placeholder="Ваше имя" value={formName} onChange={e => setFormName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-veggie-lime transition-colors" />
                  <input type="tel" placeholder="Номер телефона" value={formPhone} onChange={e => setFormPhone(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-veggie-lime transition-colors" />
                  <textarea placeholder="Комментарий (необязательно)" rows={3} value={formComment} onChange={e => setFormComment(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-veggie-lime transition-colors resize-none" />
                  {formStatus === 'error' && <p className="text-red-300 text-sm">Ошибка отправки. Попробуйте ещё раз.</p>}
                  <button onClick={handleSubmit} disabled={formStatus === 'loading' || !formName || !formPhone}
                    className="w-full btn-accent py-4 rounded-xl font-heading text-lg font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
                    {formStatus === 'loading' ? 'Отправляем...' : 'Отправить заявку →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-veggie-dark border-t border-veggie-green/30 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/fe802481-ab1d-4857-a0a0-f911323e758e.jpeg" alt="Филини" className="h-8 w-8 rounded-lg object-cover" />
            <span className="font-heading text-lg font-bold text-white">ФИЛИНИ<span className="text-veggie-lime"> ФЕРМЕРСКИЕ ПРОДУКТЫ</span></span>
          </div>
          <p className="text-white/40 text-sm">© 2026 Филини Фермерские Продукты. Все права защищены.</p>
          <div className="flex gap-6">
            {["Каталог", "Доставка", "Контакты"].map(link => (
              <button key={link} onClick={() => scrollTo(link)} className="text-white/40 hover:text-veggie-lime text-sm transition-colors">
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {cartOpen && (
        <CartDrawer
          cart={cart}
          totalItems={totalItems}
          totalPrice={totalPrice}
          totalWeight={totalWeight}
          freeDelivery={freeDelivery}
          user={user}
          orderName={orderName} setOrderName={setOrderName}
          orderPhone={orderPhone} setOrderPhone={setOrderPhone}
          orderAddress={orderAddress} setOrderAddress={setOrderAddress}
          orderFlat={orderFlat} setOrderFlat={setOrderFlat}
          orderTime={orderTime} setOrderTime={setOrderTime}
          orderComment={orderComment} setOrderComment={setOrderComment}
          orderStatus={orderStatus} setOrderStatus={setOrderStatus}
          orderStep={orderStep} setOrderStep={setOrderStep}
          onClose={() => setCartOpen(false)}
          onOrder={handleOrder}
          removeFromCart={removeFromCart}
          updateQty={updateQty}
          scrollTo={scrollTo}
        />
      )}
    </div>
  );
}