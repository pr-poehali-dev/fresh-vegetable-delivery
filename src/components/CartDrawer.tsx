import { useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { User } from "@/components/AuthModal";

type CartItem = { id: number; name: string; price: number; emoji: string; qty: number; weightKg: number };

interface CartDrawerProps {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalWeight: number;
  freeDelivery: boolean;
  user: User | null;
  orderName: string; setOrderName: (v: string) => void;
  orderPhone: string; setOrderPhone: (v: string) => void;
  orderAddress: string; setOrderAddress: (v: string) => void;
  orderFlat: string; setOrderFlat: (v: string) => void;
  orderTime: 'morning' | 'evening'; setOrderTime: (v: 'morning' | 'evening') => void;
  orderComment: string; setOrderComment: (v: string) => void;
  orderStatus: 'idle' | 'loading' | 'success' | 'error';
  setOrderStatus: (v: 'idle' | 'loading' | 'success' | 'error') => void;
  orderStep: 1 | 2; setOrderStep: (v: 1 | 2) => void;
  pointsToUse: number; setPointsToUse: (v: number) => void;
  onClose: () => void;
  onOrder: () => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  scrollTo: (section: string) => void;
}

export default function CartDrawer({
  cart, totalItems, totalPrice, totalWeight, freeDelivery, user,
  orderName, setOrderName, orderPhone, setOrderPhone,
  orderAddress, setOrderAddress, orderFlat, setOrderFlat,
  orderTime, setOrderTime, orderComment, setOrderComment,
  orderStatus, setOrderStatus, orderStep, setOrderStep,
  pointsToUse, setPointsToUse,
  onClose, onOrder, removeFromCart, updateQty, scrollTo,
}: CartDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [cart.length, orderStep]);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-in overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-heading text-2xl font-bold text-veggie-green flex items-center gap-2">
            <Icon name="ShoppingCart" size={24} />КОРЗИНА
            {totalItems > 0 && <span className="bg-veggie-lime text-veggie-dark text-sm px-2 py-0.5 rounded-full font-body font-semibold">{totalItems}</span>}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={24} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain p-6">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-semibold">Корзина пуста</p>
              <p className="text-sm mt-1">Добавьте овощи из каталога</p>
              <button onClick={() => { onClose(); scrollTo("Каталог"); }} className="mt-4 btn-primary px-6 py-2 rounded-full text-sm font-semibold">
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
          <div className="border-t bg-background">
            <div className="px-6 pt-4 pb-3 border-b border-border">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Вес заказа</span>
                <span>{totalWeight.toFixed(1)} кг</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Доставка</span>
                <span>{freeDelivery ? "Бесплатно 🎉" : "199 ₽"}</span>
              </div>
              {!freeDelivery && (
                <p className="text-xs text-muted-foreground/70 mb-1">До бесплатной — ещё {(5 - totalWeight).toFixed(1)} кг</p>
              )}
              {pointsToUse > 0 && (
                <div className="flex justify-between text-sm text-veggie-lime mb-1">
                  <span>⭐ Баллы</span>
                  <span>−{Math.min(pointsToUse, user?.points ?? 0, totalPrice + (freeDelivery ? 0 : 199))} ₽</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-heading font-bold mt-2">
                <span>Итого</span>
                <span className="text-veggie-green">
                  {Math.max(0, totalPrice + (freeDelivery ? 0 : 199) - Math.min(pointsToUse, user?.points ?? 0, totalPrice + (freeDelivery ? 0 : 199)))} ₽
                </span>
              </div>
            </div>

            {orderStatus === 'success' ? (
              <div className="text-center py-8 px-6">
                <div className="text-5xl mb-3">✅</div>
                <p className="font-heading font-bold text-veggie-green text-xl">Заказ принят!</p>
                <p className="text-muted-foreground text-sm mt-2">Мы свяжемся с вами в ближайшее время</p>
                {user && (
                  <div className="mt-4 bg-veggie-lime/10 border border-veggie-lime/30 rounded-xl p-3">
                    {user.is_first_order_done ? (
                      <p className="text-veggie-green font-semibold text-sm">🎉 +200 баллов за первый заказ начислены!</p>
                    ) : null}
                    <p className="text-muted-foreground text-xs mt-1">Ваш баланс: <b>{user.points} баллов</b></p>
                  </div>
                )}
                <button onClick={() => { setOrderStatus('idle'); onClose(); }} className="mt-5 w-full btn-accent py-3 rounded-xl font-semibold">
                  Отлично!
                </button>
              </div>
            ) : (
              <div className="px-6 pt-4 pb-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className={`flex items-center gap-1.5 text-sm font-semibold ${orderStep === 1 ? 'text-veggie-green' : 'text-muted-foreground'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${orderStep === 1 ? 'bg-veggie-green text-white' : 'bg-muted text-muted-foreground'}`}>1</span>
                    Доставка
                  </div>
                  <div className="flex-1 h-px bg-border" />
                  <div className={`flex items-center gap-1.5 text-sm font-semibold ${orderStep === 2 ? 'text-veggie-green' : 'text-muted-foreground'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${orderStep === 2 ? 'bg-veggie-green text-white' : 'bg-muted text-muted-foreground'}`}>2</span>
                    Контакты
                  </div>
                </div>

                {orderStep === 1 ? (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1 block">Адрес доставки</label>
                      <input
                        type="text" value={orderAddress} onChange={e => setOrderAddress(e.target.value)}
                        placeholder="Улица, дом"
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-veggie-green transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1 block">Квартира / офис</label>
                      <input
                        type="text" value={orderFlat} onChange={e => setOrderFlat(e.target.value)}
                        placeholder="Необязательно"
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-veggie-green transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-2 block">Время доставки</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setOrderTime('morning')}
                          className={`border rounded-xl p-3 text-left transition-colors ${orderTime === 'morning' ? 'border-veggie-green bg-veggie-green/5' : 'border-border hover:border-veggie-green/50'}`}
                        >
                          <div className="text-lg mb-0.5">🌅</div>
                          <div className="text-sm font-semibold">Утро</div>
                          <div className="text-xs text-muted-foreground">до 12:00</div>
                        </button>
                        <button
                          onClick={() => setOrderTime('evening')}
                          className={`border rounded-xl p-3 text-left transition-colors ${orderTime === 'evening' ? 'border-veggie-green bg-veggie-green/5' : 'border-border hover:border-veggie-green/50'}`}
                        >
                          <div className="text-lg mb-0.5">🌆</div>
                          <div className="text-sm font-semibold">Вечер</div>
                          <div className="text-xs text-muted-foreground">с 18:00</div>
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setOrderStep(2)}
                      disabled={!orderAddress.trim()}
                      className="w-full btn-accent py-3 rounded-xl font-heading font-semibold text-base mt-1 disabled:opacity-50"
                    >
                      Далее →
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="bg-muted/50 rounded-xl px-4 py-3 flex items-start gap-2 mb-1">
                      <Icon name="MapPin" size={16} className="text-veggie-green mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{orderAddress}{orderFlat ? `, кв. ${orderFlat}` : ''}</p>
                        <p className="text-xs text-muted-foreground">{orderTime === 'morning' ? '🌅 Утро — до 12:00' : '🌆 Вечер — с 18:00'}</p>
                      </div>
                      <button onClick={() => setOrderStep(1)} className="ml-auto text-xs text-veggie-green hover:underline shrink-0">Изменить</button>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1 block">Ваше имя</label>
                      <input
                        type="text" value={orderName} onChange={e => setOrderName(e.target.value)}
                        placeholder="Как вас зовут?"
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-veggie-green transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1 block">Телефон</label>
                      <input
                        type="tel" value={orderPhone} onChange={e => setOrderPhone(e.target.value)}
                        placeholder="+7 900 000-00-00"
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-veggie-green transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1 block">Комментарий к заказу</label>
                      <input
                        type="text" value={orderComment} onChange={e => setOrderComment(e.target.value)}
                        placeholder="Код домофона, пожелания..."
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-veggie-green transition-colors"
                      />
                    </div>
                    {user && user.points > 0 && (() => {
                      const total = totalPrice + (freeDelivery ? 0 : 199);
                      const maxPoints = Math.min(user.points, total);
                      return (
                        <div className="bg-veggie-lime/10 border border-veggie-lime/30 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-veggie-green">⭐ Оплатить баллами</span>
                            <span className="text-xs text-muted-foreground">Доступно: {user.points} б.</span>
                          </div>
                          <input
                            type="range" min={0} max={maxPoints} step={1}
                            value={Math.min(pointsToUse, maxPoints)}
                            onChange={e => setPointsToUse(Number(e.target.value))}
                            className="w-full accent-veggie-green mb-1"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0 ₽</span>
                            <span className="text-veggie-green font-semibold">−{Math.min(pointsToUse, maxPoints)} ₽</span>
                            <span>{maxPoints} ₽</span>
                          </div>
                        </div>
                      );
                    })()}
                    {orderStatus === 'error' && (
                      <p className="text-red-500 text-sm">Ошибка отправки. Попробуйте ещё раз.</p>
                    )}
                    <button
                      onClick={onOrder}
                      disabled={orderStatus === 'loading' || !orderName.trim() || !orderPhone.trim()}
                      className="w-full btn-accent py-3.5 rounded-xl font-heading text-base font-semibold disabled:opacity-50"
                    >
                      {orderStatus === 'loading' ? 'Отправляем...' : `Оформить заказ — ${Math.max(0, totalPrice + (freeDelivery ? 0 : 199) - Math.min(pointsToUse, user?.points ?? 0, totalPrice + (freeDelivery ? 0 : 199)))} ₽`}
                    </button>
                    <button onClick={() => setOrderStep(1)} className="text-xs text-muted-foreground hover:text-foreground text-center transition-colors">
                      ← Назад
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}