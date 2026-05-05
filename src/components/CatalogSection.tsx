import { useRef } from "react";
import Icon from "@/components/ui/icon";

const POPULAR_ITEMS = [
  {
    id: "milk-fresh",
    emoji: "🐄",
    title: "Молоко свежее коровье",
    subtitle: "от 1,5 л · жирность 4,2%",
    price: "100 ₽/л",
    bg: "from-amber-50 to-yellow-50",
    border: "border-amber-200",
    accent: "text-amber-700",
    tag: "Часто покупают",
    image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/ec19e63b-3fa3-47b7-b893-c3ceac7b00fa.jpeg",
    section: "dairy" as const,
  },
  {
    id: "eggs-home",
    emoji: "🥚",
    title: "Яйцо домашнее",
    subtitle: "10 штук · от фермера",
    price: "150 ₽/упак",
    bg: "from-orange-50 to-amber-50",
    border: "border-orange-200",
    accent: "text-orange-700",
    tag: "Часто покупают",
    image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/93ea36d9-51c0-4187-a153-edd5dcabcb3a.jpg",
    section: "eggs" as const,
  },
];

type Product = {
  id: number; name: string; price: number; unit: string; season: string;
  type: string; emoji: string; badge: string | null; weight: string; weightKg: number;
  image?: string; minWeightG?: number; pricePerKg?: number;
};

type CartItem = { id: number; name: string; price: number; emoji: string; qty: number; weightKg: number };

interface CatalogSectionProps {
  search: string;
  setSearch: (v: string) => void;
  activeSection: "vegetables" | "fruits" | "berries" | "juices" | "mushrooms" | "greens" | "eggs" | "meat" | "dairy" | "sausage" | "household" | "grocery" | "readyfood";
  setActiveSection: (v: "vegetables" | "fruits" | "berries" | "juices" | "mushrooms" | "greens" | "eggs" | "meat" | "dairy" | "sausage" | "household" | "grocery" | "readyfood") => void;
  activeType: string;
  setActiveType: (v: string) => void;
  currentTypes: string[];
  filteredProducts: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQty: (id: number, delta: number) => void;
}

export default function CatalogSection({
  search, setSearch, activeSection, setActiveSection, activeType, setActiveType,
  currentTypes, filteredProducts, cart, addToCart, updateQty,
}: CatalogSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="catalog" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-heading text-5xl font-bold text-veggie-green mb-3">КАТАЛОГ</h2>
          <div className="section-divider w-24 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Выбирайте по разделу — всё самое свежее</p>
        </div>

        {/* Часто покупают */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔥</span>
            <span className="font-heading font-bold text-veggie-green text-lg uppercase tracking-wide">Часто покупают</span>
          </div>
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {POPULAR_ITEMS.map(item => (
              <div key={item.id} className={`snap-start shrink-0 w-72 rounded-2xl border ${item.border} bg-gradient-to-br ${item.bg} overflow-hidden shadow-sm flex`} style={{ minWidth: '280px' }}>
                <div className="w-28 shrink-0 relative overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                </div>
                <div className="flex flex-col justify-between p-4 flex-1">
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-veggie-lime/30 text-veggie-green px-2 py-0.5 rounded-full mb-2">{item.tag}</span>
                    <p className="font-heading font-bold text-foreground text-base leading-tight mb-1">{item.title}</p>
                    <p className="text-muted-foreground text-xs">{item.subtitle}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`font-heading font-bold text-xl ${item.accent}`}>{item.price}</span>
                    <button
                      onClick={() => { setActiveSection(item.section); setActiveType("все"); setTimeout(() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }), 50); }}
                      className="flex items-center gap-1 bg-veggie-green text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-veggie-lime hover:text-veggie-dark transition-colors"
                    >
                      <Icon name="ShoppingCart" size={12} />В каталог
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по товарам..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-veggie-lime transition-colors text-base"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap justify-center bg-muted rounded-2xl p-1 gap-1">
            {([
              { key: "vegetables", label: "🥬 Овощи" },
              { key: "fruits", label: "🍎 Фрукты" },
              { key: "berries", label: "🍓 Ягоды" },
              { key: "juices", label: "🧃 Напитки" },
              { key: "mushrooms", label: "🍄 Грибы" },
              { key: "greens", label: "🌿 Зелень" },
              { key: "eggs", label: "🥚 Яйца" },
              { key: "meat", label: "🥩 Мясо" },
              { key: "dairy", label: "🥛 Молоко" },
              { key: "sausage", label: "🌭 Колбаса" },
              { key: "household", label: "🧺 Бытовая химия" },
              { key: "grocery", label: "🌾 Бакалея" },
              { key: "readyfood", label: "🍱 Готовая еда" },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setActiveSection(key); setActiveType("все"); }}
                className={`px-4 py-2.5 rounded-xl font-heading font-semibold text-sm transition-all ${activeSection === key ? "bg-veggie-green text-white shadow" : "text-muted-foreground hover:text-veggie-green"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div>
            <div className="text-sm font-semibold text-veggie-green mb-2 uppercase tracking-wider flex items-center gap-2">
              <Icon name="Filter" size={14} />По типу
            </div>
            <div className="flex flex-wrap gap-2">
              {currentTypes.map(t => (
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
                  <div className="bg-gradient-to-br from-veggie-green/5 to-veggie-lime/10 flex items-center justify-center relative overflow-hidden" style={{ height: '160px' }}>
                    {product.image
                      ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      : <span className="text-6xl">{product.emoji}</span>
                    }
                    {product.badge && (
                      <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-semibold ${product.badge === 'Нет' || product.badge === 'Нет в наличии' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : product.badge === 'Органик' ? 'bg-veggie-lime/20 text-veggie-green border border-veggie-lime/40' : product.badge === 'Хит' ? 'bg-veggie-orange/20 text-veggie-orange border border-veggie-orange/40' : 'tag-seasonal'}`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1 leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{product.weight}</span>
                      {product.minWeightG && <span className="text-xs text-veggie-green bg-veggie-lime/10 px-2 py-0.5 rounded-full">мин. {product.minWeightG}г</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xl font-bold text-veggie-green">{product.pricePerKg ? `${product.pricePerKg} ₽/кг` : `${product.price} ₽/${product.unit}`}</span>
                      {product.badge === 'Нет в наличии' || product.badge === 'Нет' ? (
                        <span className="text-xs text-red-400 font-medium">Нет</span>
                      ) : inCart ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(product.id, -1)} className="w-7 h-7 rounded-full bg-veggie-green/10 hover:bg-veggie-green/20 text-veggie-green font-bold flex items-center justify-center transition-colors">
                            <Icon name="Minus" size={12} />
                          </button>
                          <span className="w-5 text-center font-bold text-sm">{inCart.qty}</span>
                          <button onClick={() => updateQty(product.id, 1)} className="w-7 h-7 rounded-full bg-veggie-green text-white font-bold flex items-center justify-center transition-colors">
                            <Icon name="Plus" size={12} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(product)} className="w-8 h-8 rounded-full bg-veggie-green text-white flex items-center justify-center hover:bg-veggie-lime hover:text-veggie-dark transition-colors">
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
  );
}