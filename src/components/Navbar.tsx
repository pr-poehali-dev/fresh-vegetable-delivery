import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { User } from "@/components/AuthModal";

const NAV_LINKS = ["Каталог", "Доставка", "О сервисе", "Отзывы", "FAQ", "Контакты"];

interface NavbarProps {
  search: string;
  setSearch: (v: string) => void;
  totalItems: number;
  installPrompt: Event | null;
  installed: boolean;
  user: User | null;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  showBanner: boolean;
  onCartOpen: () => void;
  onAuthOpen: () => void;
  onProfileOpen: () => void;
  onInstall: () => void;
  onDismissBanner: () => void;
  scrollTo: (section: string) => void;
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  return ('standalone' in window.navigator) && (window.navigator as Navigator & { standalone: boolean }).standalone;
}

export default function Navbar({
  search, setSearch, totalItems, installPrompt, installed, user,
  mobileMenuOpen, setMobileMenuOpen, showBanner,
  onCartOpen, onAuthOpen, onProfileOpen, onInstall, onDismissBanner, scrollTo,
}: NavbarProps) {
  const navigate = useNavigate();
  const [iosModalOpen, setIosModalOpen] = useState(false);
  const [iosDismissed, setIosDismissed] = useState(() => localStorage.getItem('ios-banner-dismissed') === '1');

  const showIosBanner = isIOS() && !isInStandaloneMode() && !iosDismissed;
  const dismissIos = () => { setIosDismissed(true); localStorage.setItem('ios-banner-dismissed', '1'); };

  return (
    <>
      {/* iOS INSTALL MODAL */}
      {iosModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIosModalOpen(false)}>
          <div className="bg-veggie-dark border border-veggie-lime/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥬</span>
                <span className="font-heading font-bold text-white text-lg">Установить приложение</span>
              </div>
              <button onClick={() => setIosModalOpen(false)} className="text-white/40 hover:text-white">
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                <span className="text-2xl shrink-0">1️⃣</span>
                <p className="text-white/80 text-sm leading-relaxed">Нажми кнопку <strong className="text-veggie-lime">«Поделиться»</strong> внизу экрана (квадрат со стрелкой вверх)</p>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                <span className="text-2xl shrink-0">2️⃣</span>
                <p className="text-white/80 text-sm leading-relaxed">Прокрути список вниз и нажми <strong className="text-veggie-lime">«На экран "Домой"»</strong></p>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                <span className="text-2xl shrink-0">3️⃣</span>
                <p className="text-white/80 text-sm leading-relaxed">Нажми <strong className="text-veggie-lime">«Добавить»</strong> в правом верхнем углу</p>
              </div>
            </div>
            <p className="text-white/40 text-xs text-center mt-4">Приложение появится на главном экране телефона</p>
          </div>
        </div>
      )}

      {/* PWA INSTALL BANNER — Android */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
          <div className="max-w-lg mx-auto bg-veggie-dark border border-veggie-lime/40 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
            <div className="text-4xl shrink-0">🥬</div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-white text-base leading-tight">Установите приложение!</p>
              <p className="text-white/60 text-sm mt-0.5">Быстрый доступ к заказу овощей прямо с экрана телефона</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => { onInstall(); onDismissBanner(); }}
                className="bg-veggie-lime text-veggie-dark px-4 py-2 rounded-xl text-sm font-bold hover:bg-white transition-colors whitespace-nowrap">
                Установить
              </button>
              <button onClick={onDismissBanner} className="text-white/40 hover:text-white/70 text-xs text-center transition-colors">
                Не сейчас
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS INSTALL BANNER */}
      {showIosBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
          <div className="max-w-lg mx-auto bg-veggie-dark border border-veggie-lime/40 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
            <div className="text-4xl shrink-0">🥬</div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-white text-base leading-tight">Установите приложение!</p>
              <p className="text-white/60 text-sm mt-0.5">Добавьте на главный экран и заказывайте в 1 клик</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => setIosModalOpen(true)}
                className="bg-veggie-lime text-veggie-dark px-4 py-2 rounded-xl text-sm font-bold hover:bg-white transition-colors whitespace-nowrap">
                Как?
              </button>
              <button onClick={dismissIos} className="text-white/40 hover:text-white/70 text-xs text-center transition-colors">
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
            <img src="https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/fe802481-ab1d-4857-a0a0-f911323e758e.jpeg" alt="Филини" className="h-10 w-10 rounded-xl object-cover" />
            <span className="font-heading text-xl font-bold text-white tracking-wide">ФИЛИНИ<span className="text-veggie-lime hidden lg:inline"> ФЕРМЕРСКИЕ ПРОДУКТЫ</span></span>
            <button
              onClick={() => scrollTo("Контакты")}
              className="hidden md:flex ml-3 bg-veggie-lime text-veggie-dark text-xs font-bold px-4 py-1.5 rounded-full hover:bg-white transition-colors whitespace-nowrap"
            >
              Оставить заявку
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 xl:gap-6">
            {NAV_LINKS.map(link => (
              <button key={link} onClick={() => scrollTo(link)} className="text-white/75 hover:text-veggie-lime text-xs xl:text-sm font-medium transition-colors duration-200 whitespace-nowrap">
                {link}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center relative">
            <Icon name="Search" size={16} className="absolute left-3 text-white/40 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); if (e.target.value) scrollTo("Каталог"); }}
              placeholder="Поиск..."
              className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 pl-9 pr-8 py-2 rounded-full text-sm focus:outline-none focus:border-veggie-lime/60 transition-colors w-36 focus:w-48"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 text-white/40 hover:text-white transition-colors">
                <Icon name="X" size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Кнопка установки для десктопа */}
            {installPrompt && !installed && (
              <button onClick={onInstall} className="hidden md:flex items-center gap-2 border border-veggie-lime/50 text-veggie-lime px-3 py-2 rounded-full text-sm font-medium hover:bg-veggie-lime/10 transition-colors">
                <Icon name="Download" size={14} />
                Установить
              </button>
            )}
            {installed && (
              <span className="hidden md:flex items-center gap-1 text-veggie-lime/60 text-xs">
                <Icon name="CheckCircle" size={14} />Установлено
              </span>
            )}

            {/* Кнопка установки в мобильном меню */}
            {user ? (
              <button onClick={() => navigate('/profile')} className="hidden md:flex items-center gap-2 border border-veggie-lime/40 text-veggie-lime px-3 py-2 rounded-full text-sm font-medium hover:bg-veggie-lime/10 transition-colors">
                <span>⭐</span>
                <span>{user.points} баллов</span>
              </button>
            ) : (
              <button onClick={onAuthOpen} className="hidden md:flex items-center gap-2 border border-white/20 text-white/70 px-3 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                <Icon name="User" size={14} />
                Войти
              </button>
            )}
            <button onClick={onCartOpen} className="relative flex items-center gap-2 bg-veggie-lime text-veggie-dark px-4 py-2 rounded-full font-semibold text-sm hover:bg-white transition-colors">
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
            {/* Кнопка установки в мобильном меню */}
            {!installed && !isInStandaloneMode() && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (installPrompt) { onInstall(); onDismissBanner(); }
                  else if (isIOS()) setIosModalOpen(true);
                }}
                className="flex items-center gap-2 text-veggie-lime font-semibold py-2 border-b border-white/10"
              >
                <Icon name="Download" size={16} />
                Установить приложение
              </button>
            )}
            {user ? (
              <button onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-veggie-lime font-semibold py-2">
                <span>⭐</span> {user.points} баллов · Профиль
              </button>
            ) : (
              <button onClick={() => { onAuthOpen(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-white/70 py-2">
                <Icon name="User" size={16} /> Войти и получить баллы
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}