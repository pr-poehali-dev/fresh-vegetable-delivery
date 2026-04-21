import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/58f8e18c-3a1d-4321-a0d0-d558c40958c4.jpg";

const PRODUCTS = [
  { id: 1, name: "Томаты черри", price: 320, unit: "кг", season: "лето", type: "томаты", emoji: "🍅", badge: "Хит", weight: "500г", weightKg: 0.5 },
  { id: 2, name: "Огурцы свежие", price: 180, unit: "кг", season: "лето", type: "огурцы", emoji: "🥒", badge: "Органик", weight: "1кг", weightKg: 1 },
  { id: 3, name: "Болгарский перец", price: 260, unit: "кг", season: "лето", type: "перец", emoji: "🫑", badge: null, weight: "1кг", weightKg: 1 },
  { id: 4, name: "Морковь", price: 90, unit: "кг", season: "осень", type: "корнеплоды", emoji: "🥕", badge: "Сезон", weight: "1кг", weightKg: 1 },
  { id: 5, name: "Кабачок", price: 140, unit: "кг", season: "лето", type: "кабачки", emoji: "🥬", badge: null, weight: "1кг", weightKg: 1 },
  { id: 6, name: "Брокколи", price: 340, unit: "кг", season: "весна", type: "капуста", emoji: "🥦", badge: "Органик", weight: "500г", weightKg: 0.5 },
  { id: 7, name: "Свёкла", price: 80, unit: "кг", season: "осень", type: "корнеплоды", emoji: "🫐", badge: null, weight: "1кг", weightKg: 1 },
  { id: 8, name: "Картофель", price: 40, unit: "кг", season: "осень", type: "корнеплоды", emoji: "🥔", badge: "Предзаказ", weight: "1кг", weightKg: 1 },
  { id: 9, name: "Тыква", price: 120, unit: "кг", season: "осень", type: "тыква", emoji: "🎃", badge: "Сезон", weight: "1кг", weightKg: 1 },
  { id: 10, name: "Шпинат", price: 290, unit: "пучок", season: "весна", type: "зелень", emoji: "🌿", badge: "Органик", weight: "200г", weightKg: 0.2 },
  { id: 11, name: "Редис", price: 110, unit: "пучок", season: "весна", type: "корнеплоды", emoji: "🌸", badge: null, weight: "300г", weightKg: 0.3 },
  { id: 12, name: "Баклажан", price: 210, unit: "кг", season: "лето", type: "баклажаны", emoji: "🍆", badge: null, weight: "1кг", weightKg: 1 },
];

const TYPES = ["все", "томаты", "огурцы", "перец", "корнеплоды", "капуста", "зелень", "кабачки", "тыква", "баклажаны"];

const REVIEWS = [
  { id: 1, name: "Анна К.", text: "Уже третий месяц заказываю каждую неделю! Овощи всегда свежайшие, как с грядки. Брокколи и шпинат — просто объедение!", rating: 5, avatar: "👩‍🦰", location: "Москва" },
  { id: 2, name: "Михаил Р.", text: "Отличный сервис! Доставка за 2 часа — это реально круто. Фильтр по сезонности помог найти именно то, что сейчас вкуснее всего.", rating: 5, avatar: "👨‍💼", location: "Санкт-Петербург" },
  { id: 3, name: "Светлана П.", text: "Беру органические овощи для всей семьи. Дети едят с удовольствием! Цены адекватные, особенно на сезонное.", rating: 5, avatar: "👩‍👧", location: "Казань" },
];

const FAQ_ITEMS = [
  { q: "Как быстро доставляют овощи?", a: "Доставляем в течение 2-4 часов после оформления заказа. Для заказов до 12:00 возможна доставка в тот же день." },
  { q: "Откуда берутся овощи?", a: "Работаем напрямую с фермерами Подмосковья и соседних регионов. Все овощи проходят контроль качества перед отправкой." },
  { q: "Есть ли минимальная сумма заказа?", a: "Минимальный заказ — 800 рублей. При заказе от 2000 рублей доставка бесплатная." },
  { q: "Что если товар мне не понравится?", a: "Гарантируем свежесть! Если вы недовольны качеством — вернём деньги или заменим товар без лишних вопросов." },
  { q: "Как выбрать сезонные овощи?", a: "Используйте фильтр по сезонности в каталоге. Сезонные овощи вкуснее, питательнее и дешевле — они в приоритете." },
];

const NAV_LINKS = ["Каталог", "Доставка", "О сервисе", "Отзывы", "FAQ", "Контакты"];

type CartItem = { id: number; name: string; price: number; emoji: string; qty: number; weightKg: number };

export default function Index() {
  const [activeType, setActiveType] = useState("все");
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

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
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

  const filteredProducts = PRODUCTS.filter(p => activeType === "все" || p.type === activeType);

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

  return (
    <div className="min-h-screen bg-background font-body">
      {/* PWA INSTALL BANNER */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
          <div className="max-w-lg mx-auto bg-veggie-dark border border-veggie-lime/40 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
            <div className="text-4xl shrink-0">🥬</div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-white text-base leading-tight">Установите приложение!</p>
              <p className="text-white/60 text-sm mt-0.5">Быстрый доступ к заказу овощей прямо с экрана телефона</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => { handleInstall(); dismissBanner(); }}
                className="bg-veggie-lime text-veggie-dark px-4 py-2 rounded-xl text-sm font-bold hover:bg-white transition-colors whitespace-nowrap">
                Установить
              </button>
              <button onClick={dismissBanner} className="text-white/40 hover:text-white/70 text-xs text-center transition-colors">
                Не сейчас
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-veggie-dark/95 backdrop-blur-md border-b border-veggie-green/30">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥬</span>
            <span className="font-heading text-xl font-bold text-white tracking-wide">ОВОЩИ<span className="text-veggie-lime">МАРКЕТ</span></span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <button key={link} onClick={() => scrollTo(link)} className="text-white/75 hover:text-veggie-lime text-sm font-medium transition-colors duration-200">
                {link}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {installPrompt && !installed && (
              <button onClick={handleInstall} className="hidden md:flex items-center gap-2 border border-veggie-lime/50 text-veggie-lime px-3 py-2 rounded-full text-sm font-medium hover:bg-veggie-lime/10 transition-colors">
                <Icon name="Download" size={14} />
                Установить
              </button>
            )}
            {installed && (
              <span className="hidden md:flex items-center gap-1 text-veggie-lime/60 text-xs">
                <Icon name="CheckCircle" size={14} />Установлено
              </span>
            )}
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 bg-veggie-lime text-veggie-dark px-4 py-2 rounded-full font-semibold text-sm hover:bg-white transition-colors">
              <Icon name="ShoppingCart" size={16} />
              <span>Корзина</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-veggie-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-veggie-dark border-t border-veggie-green/30 px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map(link => (
              <button key={link} onClick={() => scrollTo(link)} className="text-white/80 hover:text-veggie-lime text-left py-2 border-b border-white/10 last:border-0">
                {link}
              </button>
            ))}
          </div>
        )}
      </nav>

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
              Доставка за 2 часа
            </div>

            <h1 className="font-heading text-6xl md:text-8xl font-bold text-white leading-none mb-6 animate-fade-in animate-delay-100">
              СВЕЖИЕ<br />
              <span className="text-gradient">ОВОЩИ</span><br />
              НА СТОЛ
            </h1>

            <p className="text-white/70 text-lg md:text-xl mb-10 leading-relaxed animate-fade-in animate-delay-200">
              Органические овощи прямо с фермы — отборные, сезонные, вкусные. Выбирайте по типу и времени года.
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
              {[["500+", "сортов"], ["2ч", "доставка"], ["98%", "довольны"]].map(([val, label]) => (
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

      {/* CATALOG */}
      <section id="catalog" className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-5xl font-bold text-veggie-green mb-3">КАТАЛОГ ОВОЩЕЙ</h2>
            <div className="section-divider w-24 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Выбирайте по типу — всё самое свежее</p>
          </div>

          <div className="mb-8">
            <div>
              <div className="text-sm font-semibold text-veggie-green mb-2 uppercase tracking-wider flex items-center gap-2">
                <Icon name="Filter" size={14} />По типу
              </div>
              <div className="flex flex-wrap gap-2">
                {TYPES.map(t => (
                  <button key={t} onClick={() => setActiveType(t)}
                    className={`px-3 py-1.5 rounded-full text-sm capitalize transition-all border ${activeType === t ? 'bg-veggie-lime text-veggie-dark font-semibold border-veggie-lime' : 'bg-white text-muted-foreground border-border hover:border-veggie-lime/50'}`}>
                    {t === "все" ? "Все типы" : t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-lg">Нет овощей по выбранным фильтрам</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, i) => {
                const inCart = cart.find(c => c.id === product.id);
                return (
                  <div key={product.id} className="card-hover bg-white rounded-2xl overflow-hidden border border-border shadow-sm animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="bg-gradient-to-br from-veggie-green/5 to-veggie-lime/10 p-8 flex items-center justify-center relative">
                      <span className="text-6xl">{product.emoji}</span>
                      {product.badge && (
                        <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-semibold ${product.badge === 'Органик' ? 'bg-veggie-lime/20 text-veggie-green border border-veggie-lime/40' : product.badge === 'Хит' ? 'bg-veggie-orange/20 text-veggie-orange border border-veggie-orange/40' : 'tag-seasonal'}`}>
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1 leading-tight">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{product.weight}</span>

                      </div>
                      <div className="flex items-center justify-between">
                        {product.id === 8 ? <span className="font-heading text-xl font-bold text-veggie-green">{product.price} ₽</span> : <span className="text-sm text-muted-foreground italic">Уточнить цену</span>}
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(product.id, -1)} className="w-7 h-7 rounded-full bg-veggie-green/10 hover:bg-veggie-green/20 text-veggie-green font-bold flex items-center justify-center transition-colors">
                              <Icon name="Minus" size={12} />
                            </button>
                            <span className="font-semibold text-sm w-4 text-center">{inCart.qty}</span>
                            <button onClick={() => addToCart(product)} className="w-7 h-7 rounded-full bg-veggie-green text-white hover:bg-veggie-green-light flex items-center justify-center transition-colors">
                              <Icon name="Plus" size={12} />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(product)} className="btn-primary w-9 h-9 rounded-full flex items-center justify-center">
                            <Icon name="Plus" size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* DELIVERY */}
      <section id="delivery" className="py-20 bg-veggie-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-veggie-lime/5 rounded-full blur-3xl" />
        <div className="container relative z-10">
          <div className="text-center mb-14">
            <h2 className="font-heading text-5xl font-bold mb-3">КАК МЫ ДОСТАВЛЯЕМ</h2>
            <div className="section-divider w-24 mx-auto mb-4" />
            <p className="text-white/60 text-lg">По всей Уфе — быстро, свежо, надёжно</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {[
              { icon: "Clock", title: "2–4 часа", desc: "Среднее время доставки от момента оформления заказа", color: "text-veggie-lime" },
              { icon: "MapPin", title: "По всей Уфе", desc: "Доставляем в любой район города без ограничений", color: "text-veggie-orange" },
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
                {[["Заказ до 5 кг", "199 ₽"], ["Заказ от 5 кг", "Бесплатно"], ["Экспресс (1 час)", "+299 ₽"]].map(([label, price]) => (
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
                ОвощиМаркет — это команда людей, влюблённых в настоящую еду. Мы работаем напрямую с 30+ фермерами, чтобы вы получали только самое свежее и честное.
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
                  <div className="px-6 pb-6 text-white/60 leading-relaxed border-t border-white/10 pt-4">
                    {item.a}
                  </div>
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
            <span className="text-xl">🥬</span>
            <span className="font-heading text-lg font-bold text-white">ОВОЩИ<span className="text-veggie-lime">МАРКЕТ</span></span>
          </div>
          <p className="text-white/40 text-sm">© 2026 ОвощиМаркет. Все права защищены.</p>
          <div className="flex gap-6">
            {["Каталог", "Доставка", "Контакты"].map(link => (
              <button key={link} onClick={() => scrollTo(link)} className="text-white/40 hover:text-veggie-lime text-sm transition-colors">
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-heading text-2xl font-bold text-veggie-green flex items-center gap-2">
                <Icon name="ShoppingCart" size={24} />КОРЗИНА
                {totalItems > 0 && <span className="bg-veggie-lime text-veggie-dark text-sm px-2 py-0.5 rounded-full font-body font-semibold">{totalItems}</span>}
              </h2>
              <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="X" size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="font-semibold">Корзина пуста</p>
                  <p className="text-sm mt-1">Добавьте овощи из каталога</p>
                  <button onClick={() => { setCartOpen(false); scrollTo("Каталог"); }} className="mt-4 btn-primary px-6 py-2 rounded-full text-sm font-semibold">
                    Перейти в каталог
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 bg-background rounded-xl p-4">
                      <span className="text-3xl">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground truncate">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.price} ₽ / шт</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full bg-veggie-green/10 text-veggie-green flex items-center justify-center hover:bg-veggie-green/20 transition-colors">
                          <Icon name="Minus" size={12} />
                        </button>
                        <span className="w-6 text-center font-semibold">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full bg-veggie-green text-white flex items-center justify-center transition-colors">
                          <Icon name="Plus" size={12} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-veggie-green">{item.price * item.qty} ₽</div>
                        <button onClick={() => removeFromCart(item.id)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">удалить</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-background">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-muted-foreground">Вес заказа:</span>
                  <span className="font-semibold">{totalWeight.toFixed(1)} кг</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Доставка:</span>
                  <span className="font-semibold">{freeDelivery ? "Бесплатно 🎉" : "199 ₽"}</span>
                </div>
                {!freeDelivery && (
                  <p className="text-xs text-muted-foreground mb-3">До бесплатной доставки не хватает {(5 - totalWeight).toFixed(1)} кг</p>
                )}
                <div className="flex justify-between items-center text-xl font-heading font-bold mb-4">
                  <span>Итого:</span>
                  <span className="text-veggie-green">{totalPrice + (freeDelivery ? 0 : 199)} ₽</span>
                </div>
                <button className="w-full btn-accent py-4 rounded-xl font-heading text-lg font-semibold tracking-wide">
                  Оформить заказ →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}