import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const API_SEND_CODE = "https://functions.poehali.dev/55e40474-9a2a-4db3-9880-7fdbfc00edf0";
const API_VERIFY_CODE = "https://functions.poehali.dev/49670255-1338-4a0e-a466-50ed6b41136d";

export type User = { id: number; phone: string; name: string; points: number; is_first_order_done: boolean; is_new?: boolean };

export default function AuthModal({ onClose, onAuth }: { onClose: () => void; onAuth: (user: User) => void }) {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState('');
  const [isHuman, setIsHuman] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  const sendCode = async () => {
    if (!phone.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(API_SEND_CODE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) });
      const data = await res.json();
      if (res.ok) { setStep('code'); setDevCode(data.dev_code || ''); setTimeout(() => codeRef.current?.focus(), 100); }
      else setError(data.error || 'Ошибка');
    } catch { setError('Ошибка соединения'); }
    setLoading(false);
  };

  const verifyCode = async () => {
    if (!code.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(API_VERIFY_CODE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, code }) });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onAuth(data.user);
        onClose();
      } else setError(data.error || 'Неверный код');
    } catch { setError('Ошибка соединения'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-veggie-dark border border-veggie-green/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-xl font-bold text-white">Войти</h2>
            <p className="text-white/50 text-sm mt-0.5">Накапливайте баллы с каждым заказом</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><Icon name="X" size={20} /></button>
        </div>

        {step === 'phone' ? (
          <>
            <label className="text-white/60 text-sm mb-2 block">Номер телефона</label>
            <input
              type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 900 000-00-00"
              onKeyDown={e => e.key === 'Enter' && sendCode()}
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-4 py-3 rounded-xl text-base focus:outline-none focus:border-veggie-lime/60 transition-colors mb-4"
              autoFocus
            />
            <label className="flex items-center gap-3 cursor-pointer mb-4 select-none">
              <div
                onClick={() => setIsHuman(v => !v)}
                className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0 ${isHuman ? 'bg-veggie-lime border-veggie-lime' : 'border-white/30 bg-white/5'}`}
              >
                {isHuman && <Icon name="Check" size={12} className="text-veggie-dark" />}
              </div>
              <span className="text-white/60 text-sm">Я человек</span>
            </label>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button onClick={sendCode} disabled={loading || !phone.trim() || !isHuman} className="w-full bg-veggie-lime text-veggie-dark py-3 rounded-xl font-bold text-base hover:bg-white transition-colors disabled:opacity-50">
              {loading ? 'Отправляем...' : 'Получить код'}
            </button>
          </>
        ) : (
          <>
            <p className="text-white/60 text-sm mb-2">Код отправлен на <span className="text-white font-medium">{phone}</span></p>
            {devCode && <p className="text-veggie-lime text-sm mb-2 bg-veggie-lime/10 rounded-lg px-3 py-2">Код для входа: <b>{devCode}</b></p>}
            <input
              ref={codeRef} type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Введите 6-значный код"
              onKeyDown={e => e.key === 'Enter' && verifyCode()}
              maxLength={6}
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-4 py-3 rounded-xl text-base text-center tracking-widest font-mono focus:outline-none focus:border-veggie-lime/60 transition-colors mb-4"
            />
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button onClick={verifyCode} disabled={loading || code.length < 4} className="w-full bg-veggie-lime text-veggie-dark py-3 rounded-xl font-bold text-base hover:bg-white transition-colors disabled:opacity-50">
              {loading ? 'Проверяем...' : 'Войти'}
            </button>
            <button onClick={() => { setStep('phone'); setCode(''); setError(''); }} className="w-full text-white/40 hover:text-white text-sm mt-3 transition-colors">
              Изменить номер
            </button>
          </>
        )}

        <div className="mt-6 bg-veggie-lime/10 border border-veggie-lime/20 rounded-xl p-3 flex items-center gap-3">
          <span className="text-2xl">🎁</span>
          <div>
            <p className="text-veggie-lime font-semibold text-sm">200 баллов за регистрацию</p>
            <p className="text-white/50 text-xs">1 балл = 1 ₽ скидки</p>
          </div>
        </div>
      </div>
    </div>
  );
}