import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { User } from "@/components/AuthModal";

const API = "https://functions.poehali.dev/d8e8eac1-b7f3-41b8-b041-69e6d80a1c03";

type Order = { id: number; address: string; items: Array<{ name: string; quantity: number; price: number }>; total_price: number; status: string; created_at: string };
type Tx = { id: number; points: number; reason: string; created_at: string };

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'orders' | 'points'>('orders');
  const [orderName, setOrderName] = useState(() => localStorage.getItem('order_name') || '');
  const [orderAddress, setOrderAddress] = useState(() => localStorage.getItem('order_address') || '');
  const [orderFlat, setOrderFlat] = useState(() => localStorage.getItem('order_flat') || '');
  const [editingOrder, setEditingOrder] = useState<{ id: number; address: string; comment: string; items: Array<{ name: string; quantity: number; price: number }> } | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const copyReferral = () => {
    const code = user?.referral_code;
    if (!code) return;
    const text = `Привет! Заказываю свежие овощи и фрукты с доставкой. Зарегистрируйся по моему коду ${code} — и получишь 200 баллов в подарок!`;
    navigator.clipboard.writeText(text).then(() => { setCodeCopied(true); setTimeout(() => setCodeCopied(false), 2000); });
  };

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    setLoading(true);
    fetch(`${API}?user_id=${user.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setOrders(data.orders || []);
        setTransactions(data.transactions || []);
        const updated = { ...user, points: data.points ?? user.points, is_first_order_done: data.is_first_order_done ?? user.is_first_order_done, referral_code: data.referral_code ?? user.referral_code };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  const saveOrder = async () => {
    if (!editingOrder || !user) return;
    setEditSaving(true);
    await fetch(API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: editingOrder.id, user_id: user.id, address: editingOrder.address, comment: editingOrder.comment, items: editingOrder.items }),
    });
    setOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...o, address: editingOrder.address, items: editingOrder.items } : o));
    setEditSaving(false);
    setEditingOrder(null);
  };

  const statusBadge = (s: string) => {
    if (s === 'new') return <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full">🕐 Новый</span>;
    if (s === 'processing') return <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">⚙️ В обработке</span>;
    if (s === 'delivering') return <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">🚚 Доставляется</span>;
    if (s === 'done') return <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">✅ Выполнен</span>;
    if (s === 'cancelled') return <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">❌ Отменён</span>;
    return null;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-veggie-dark text-white">
      {/* Шапка */}
      <div className="border-b border-veggie-green/30 px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <Icon name="ArrowLeft" size={18} />
          <span className="text-sm">На сайт</span>
        </button>
        <span className="font-heading font-bold text-lg">Мой профиль</span>
        <button onClick={logout} className="text-white/40 hover:text-red-400 text-sm transition-colors">Выйти</button>
      </div>

      <div className="max-w-lg mx-auto p-4 flex flex-col gap-4">

        {/* Аватар + имя */}
        <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-5 border border-white/10">
          <div className="w-14 h-14 rounded-full bg-veggie-lime/20 flex items-center justify-center text-3xl shrink-0">👤</div>
          <div>
            <p className="text-white font-bold text-lg">{user.name}</p>
            <p className="text-white/50 text-sm">{user.phone}</p>
          </div>
        </div>

        {/* Баллы */}
        <div className="bg-veggie-lime/10 border border-veggie-lime/30 rounded-2xl p-5 flex items-center gap-4">
          <span className="text-4xl">⭐</span>
          <div>
            <p className="text-veggie-lime text-3xl font-bold font-heading">{user.points}</p>
            <p className="text-white/50 text-sm">баллов · 1 балл = 1 ₽</p>
            {!user.is_first_order_done ? (
              <p className="text-orange-400 text-xs mt-1">🔒 Разблокируются после первого заказа</p>
            ) : (
              <p className="text-veggie-lime text-xs mt-1">🔓 Можно тратить при заказе</p>
            )}
          </div>
        </div>

        {/* Реферальный код */}
        {user.referral_code && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-white/60 text-sm font-semibold mb-1">Пригласить друга</p>
            <p className="text-white/40 text-xs mb-3">Друг вводит твой код при регистрации. После его первого заказа ты получишь <span className="text-veggie-lime font-semibold">200 баллов</span>.</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-veggie-lime font-bold text-xl font-heading tracking-widest text-center">
                {user.referral_code}
              </div>
              <button
                onClick={copyReferral}
                className="bg-veggie-green hover:bg-veggie-green/80 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shrink-0"
              >
                <Icon name={codeCopied ? "Check" : "Copy"} size={16} />
                {codeCopied ? "Скопировано!" : "Скопировать"}
              </button>
            </div>
          </div>
        )}

        {/* Данные доставки */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/60 text-sm font-semibold mb-3">Данные доставки</p>
          <div className="flex flex-col gap-2">
            <div>
              <label className="text-white/40 text-xs mb-1 block">Имя</label>
              <input value={orderName} onChange={e => { setOrderName(e.target.value); localStorage.setItem('order_name', e.target.value); }}
                placeholder="Как к вам обращаться"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-veggie-green transition-colors" />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Адрес</label>
              <input value={orderAddress} onChange={e => { setOrderAddress(e.target.value); localStorage.setItem('order_address', e.target.value); }}
                placeholder="Улица, дом"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-veggie-green transition-colors" />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Квартира / офис</label>
              <input value={orderFlat} onChange={e => { setOrderFlat(e.target.value); localStorage.setItem('order_flat', e.target.value); }}
                placeholder="Необязательно"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-veggie-green transition-colors" />
            </div>
          </div>
        </div>

        {/* Вкладки */}
        <div className="flex bg-white/5 rounded-xl p-1 gap-1">
          <button onClick={() => setTab('orders')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'orders' ? 'bg-veggie-green text-white' : 'text-white/50 hover:text-white'}`}>Заказы</button>
          <button onClick={() => setTab('points')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'points' ? 'bg-veggie-green text-white' : 'text-white/50 hover:text-white'}`}>Баллы</button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-white/30">Загрузка...</div>
        ) : tab === 'orders' ? (
          orders.length === 0 ? (
            <div className="text-center py-8 text-white/30">Заказов пока нет</div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-xs">#{order.id}</span>
                      {statusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-veggie-lime font-bold">{order.total_price} ₽</span>
                      {order.status === 'new' && (
                        <button onClick={() => setEditingOrder({ id: order.id, address: order.address || '', comment: '', items: order.items })}
                          className="text-white/30 hover:text-veggie-lime transition-colors">
                          <Icon name="Pencil" size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-white/40 text-xs mb-2">{new Date(order.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  {order.address && <p className="text-white/50 text-xs mb-2">📍 {order.address}</p>}
                  <div className="text-white/50 text-xs space-y-0.5">
                    {order.items.slice(0, 3).map((it, i) => <p key={i}>{it.name} × {it.quantity}</p>)}
                    {order.items.length > 3 && <p className="text-white/30">+ещё {order.items.length - 3}</p>}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          transactions.length === 0 ? (
            <div className="text-center py-8 text-white/30">Операций нет</div>
          ) : (
            <div className="space-y-2">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                  <span className="text-xl">{tx.points > 0 ? '⭐' : '💸'}</span>
                  <div className="flex-1">
                    <p className="text-white/80 text-sm">{tx.reason}</p>
                    <p className="text-white/40 text-xs">{new Date(tx.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className={`font-bold text-sm ${tx.points > 0 ? 'text-veggie-lime' : 'text-red-400'}`}>{tx.points > 0 ? '+' : ''}{tx.points} ⭐</span>
                </div>
              ))}
            </div>
          )
        )}

        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <p className="text-white/40 text-xs">
            Кэшбэк 1-го числа каждого месяца: до 10 000 ₽ — 1%, до 20 000 ₽ — 3%, свыше — 10%
          </p>
        </div>
      </div>

      {/* Редактирование заказа */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setEditingOrder(null)}>
          <div className="bg-veggie-dark border border-veggie-green/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-bold">Заказ #{editingOrder.id}</h2>
              <button onClick={() => setEditingOrder(null)} className="text-white/40 hover:text-white"><Icon name="X" size={20} /></button>
            </div>
            <label className="text-white/60 text-xs mb-1 block">Адрес</label>
            <input value={editingOrder.address} onChange={e => setEditingOrder({ ...editingOrder, address: e.target.value })}
              className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-xl text-sm mb-3 focus:outline-none focus:border-veggie-lime/60" />
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {editingOrder.items.map((it, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                  <span className="text-white/70 text-xs flex-1">{it.name}</span>
                  <button onClick={() => setEditingOrder({ ...editingOrder, items: editingOrder.items.map((x, j) => j === i ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x) })} className="text-white/40 hover:text-white w-5 h-5 flex items-center justify-center"><Icon name="Minus" size={10} /></button>
                  <span className="text-white text-xs w-4 text-center">{it.quantity}</span>
                  <button onClick={() => setEditingOrder({ ...editingOrder, items: editingOrder.items.map((x, j) => j === i ? { ...x, quantity: x.quantity + 1 } : x) })} className="text-white/40 hover:text-white w-5 h-5 flex items-center justify-center"><Icon name="Plus" size={10} /></button>
                  <button onClick={() => setEditingOrder({ ...editingOrder, items: editingOrder.items.filter((_, j) => j !== i) })} className="text-red-400/60 hover:text-red-400 ml-1"><Icon name="Trash2" size={10} /></button>
                </div>
              ))}
            </div>
            <button onClick={saveOrder} disabled={editSaving}
              className="w-full bg-veggie-lime text-veggie-dark py-3 rounded-xl font-bold text-sm disabled:opacity-50">
              {editSaving ? 'Сохраняем...' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}