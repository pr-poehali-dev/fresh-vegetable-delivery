import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/d8e8eac1-b7f3-41b8-b041-69e6d80a1c03";

const STATUSES = [
  { value: "all", label: "Все", color: "text-white/60", bg: "bg-white/10" },
  { value: "new", label: "🕐 Новый", color: "text-white/60", bg: "bg-white/10" },
  { value: "processing", label: "⚙️ В обработке", color: "text-yellow-400", bg: "bg-yellow-500/20" },
  { value: "delivering", label: "🚚 Доставляется", color: "text-blue-400", bg: "bg-blue-500/20" },
  { value: "done", label: "✅ Выполнен", color: "text-veggie-lime", bg: "bg-veggie-lime/20" },
  { value: "cancelled", label: "❌ Отменён", color: "text-red-400", bg: "bg-red-500/20" },
];

type Order = {
  id: number;
  name: string;
  phone: string;
  address: string;
  comment: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total_price: number;
  status: string;
  created_at: string;
  user_id: number | null;
};

type UserProfile = {
  id: number;
  phone: string;
  name: string;
  points: number;
  is_first_order_done: boolean;
  created_at: string | null;
  last_seen_at: string | null;
  order_count: number;
};

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem("admin_key") || "");
  const [keyInput, setKeyInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [adminTab, setAdminTab] = useState<"orders" | "users">("orders");

  const login = async () => {
    setLoading(true); setError("");
    const res = await fetch(`${API}?admin=1`, { headers: { "X-Admin-Key": keyInput } });
    if (res.ok) {
      localStorage.setItem("admin_key", keyInput);
      setAdminKey(keyInput);
      const data = await res.json();
      setOrders(data.orders || []);
      setAuthed(true);
    } else {
      setError("Неверный ключ");
    }
    setLoading(false);
  };

  const loadOrders = async (key = adminKey, filter = statusFilter) => {
    setLoading(true);
    const url = filter === "all" ? `${API}?admin=1` : `${API}?admin=1&status=${filter}`;
    const res = await fetch(url, { headers: { "X-Admin-Key": key } });
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
    }
    setLoading(false);
  };

  const loadUsers = async (key = adminKey) => {
    setLoading(true);
    const res = await fetch(`${API}?admin=1&tab=users`, { headers: { "X-Admin-Key": key } });
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (adminKey) {
      setAuthed(false);
      fetch(`${API}?admin=1`, { headers: { "X-Admin-Key": adminKey } })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) { setOrders(data.orders || []); setAuthed(true); }
          else { localStorage.removeItem("admin_key"); setAdminKey(""); }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (authed) loadOrders(adminKey, statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    if (authed && adminTab === "users") loadUsers();
  }, [adminTab, authed]);

  const changeStatus = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    const res = await fetch(API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "X-Admin-Key": adminKey },
      body: JSON.stringify({ order_id: orderId, status: newStatus }),
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
    setUpdatingId(null);
  };

  const filtered = orders.filter(o => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return o.name.toLowerCase().includes(q) || o.phone.includes(q) || String(o.id).includes(q) || (o.address || "").toLowerCase().includes(q);
  });

  const statusInfo = (s: string) => STATUSES.find(st => st.value === s) || STATUSES[1];

  if (!authed) {
    return (
      <div className="min-h-screen bg-veggie-dark flex items-center justify-center p-4">
        <div className="bg-veggie-dark border border-veggie-green/40 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="font-heading text-2xl font-bold text-white">Панель управления</h1>
            <p className="text-white/50 text-sm mt-1">Введите ключ администратора</p>
          </div>
          <input
            type="password"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            placeholder="ADMIN_KEY"
            className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-veggie-lime/60 transition-colors mb-3"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <button
            onClick={login}
            disabled={loading || !keyInput.trim()}
            className="w-full bg-veggie-lime text-veggie-dark py-3 rounded-xl font-bold text-sm hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "Проверяем..." : "Войти"}
          </button>
        </div>
      </div>
    );
  }

  const countByStatus = (s: string) => orders.filter(o => o.status === s).length;

  const fmtDate = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const userSearch = search.toLowerCase();
  const filteredUsers = users.filter(u =>
    !search.trim() || u.phone.includes(userSearch) || (u.name || "").toLowerCase().includes(userSearch)
  );

  return (
    <div className="min-h-screen bg-veggie-dark text-white">
      <div className="border-b border-veggie-green/30 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🥬</span>
          <div>
            <h1 className="font-heading text-lg font-bold">ФИЛИНИ — Панель управления</h1>
            <p className="text-white/40 text-xs">{adminTab === "orders" ? `Заказов: ${orders.length}` : `Пользователей: ${users.length}`}</p>
          </div>
        </div>
        <button
          onClick={() => adminTab === "orders" ? loadOrders() : loadUsers()}
          disabled={loading}
          className="flex items-center gap-2 border border-white/20 text-white/60 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-colors"
        >
          <Icon name="RefreshCw" size={12} />
          Обновить
        </button>
      </div>

      {/* Вкладки */}
      <div className="px-4 pt-4 flex gap-2 mb-0">
        <button
          onClick={() => { setAdminTab("orders"); setSearch(""); }}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${adminTab === "orders" ? "bg-veggie-green text-white" : "bg-white/5 text-white/50 hover:text-white"}`}
        >
          📦 Заказы
        </button>
        <button
          onClick={() => { setAdminTab("users"); setSearch(""); }}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${adminTab === "users" ? "bg-veggie-green text-white" : "bg-white/5 text-white/50 hover:text-white"}`}
        >
          👤 Профили
        </button>
      </div>

      <div className="p-4">

        {/* === ВКЛАДКА ПРОФИЛИ === */}
        {adminTab === "users" && (
          <>
            <div className="relative mb-4">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск по телефону или имени..."
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-veggie-lime/40 transition-colors"
              />
            </div>
            {loading ? (
              <div className="text-center py-12 text-white/30">Загрузка...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-white/30">Нет пользователей</div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map(u => (
                  <div key={u.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-white/30 text-xs">#{u.id}</span>
                          {u.is_first_order_done && <span className="text-[11px] px-2 py-0.5 rounded-full bg-veggie-lime/20 text-veggie-lime">Покупал</span>}
                        </div>
                        <p className="text-white font-semibold text-sm">{u.name || "—"}</p>
                        <p className="text-veggie-lime text-sm">{u.phone}</p>
                        <div className="flex gap-4 mt-2 text-xs text-white/40">
                          <span>Заказов: <span className="text-white/70">{u.order_count}</span></span>
                          <span>Баллов: <span className="text-veggie-lime">{u.points}</span></span>
                        </div>
                      </div>
                      <div className="text-right text-xs text-white/30 shrink-0">
                        <p>Регистрация:</p>
                        <p className="text-white/50">{fmtDate(u.created_at)}</p>
                        <p className="mt-2">Последний визит:</p>
                        <p className={u.last_seen_at ? "text-veggie-lime" : "text-white/30"}>{fmtDate(u.last_seen_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* === ВКЛАДКА ЗАКАЗЫ === */}
        {adminTab === "orders" && <>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Новых", value: countByStatus("new"), color: "text-white" },
            { label: "В обработке", value: countByStatus("processing"), color: "text-yellow-400" },
            { label: "Доставляется", value: countByStatus("delivering"), color: "text-blue-400" },
            { label: "Выполнено", value: countByStatus("done"), color: "text-veggie-lime" },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</div>
              <div className="text-white/40 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Фильтры */}
        <div className="flex flex-wrap gap-2 mb-4">
          {STATUSES.map(s => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${statusFilter === s.value ? `${s.bg} ${s.color} border-transparent` : "border-white/15 text-white/40 hover:text-white/70"}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Поиск */}
        <div className="relative mb-4">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени, телефону, адресу..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-veggie-lime/40 transition-colors"
          />
        </div>

        {/* Список заказов */}
        {loading ? (
          <div className="text-center py-12 text-white/30">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-white/30">Заказов не найдено</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => {
              const si = statusInfo(order.status);
              const isExpanded = expandedId === order.id;
              return (
                <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div
                    className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-white/40 text-xs">#{order.id}</span>
                          <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full ${si.bg} ${si.color}`}>{si.label}</span>
                          <span className="text-white/30 text-xs">{new Date(order.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <p className="text-white font-semibold text-sm">{order.name}</p>
                        <a href={`tel:${order.phone}`} className="text-veggie-lime text-sm hover:underline" onClick={e => e.stopPropagation()}>{order.phone}</a>
                        {order.address && <p className="text-white/40 text-xs mt-1 truncate">📍 {order.address}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-veggie-lime font-bold font-heading text-lg">{order.total_price} ₽</div>
                        <div className="text-white/30 text-xs">{order.items.length} поз.</div>
                        <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} className="text-white/30 mt-1 ml-auto" />
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-white/10 p-4">
                      <div className="mb-4">
                        <p className="text-white/40 text-xs mb-2">Состав заказа:</p>
                        <div className="space-y-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-white/80">{item.name} × {item.quantity}</span>
                              <span className="text-white/50">{item.price * item.quantity} ₽</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.comment && (
                        <div className="mb-4 bg-white/5 rounded-xl p-3">
                          <p className="text-white/40 text-xs mb-1">Комментарий:</p>
                          <p className="text-white/70 text-sm">{order.comment}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-white/40 text-xs mb-2">Изменить статус:</p>
                        <div className="flex flex-wrap gap-2">
                          {STATUSES.filter(s => s.value !== "all").map(s => (
                            <button
                              key={s.value}
                              onClick={() => changeStatus(order.id, s.value)}
                              disabled={updatingId === order.id || order.status === s.value}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${order.status === s.value ? `${s.bg} ${s.color} border-transparent` : "border-white/15 text-white/40 hover:text-white/70"} disabled:opacity-50`}
                            >
                              {updatingId === order.id && order.status !== s.value ? "..." : s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        </>}

      </div>
    </div>
  );
}