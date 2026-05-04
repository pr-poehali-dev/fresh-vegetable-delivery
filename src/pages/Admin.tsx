import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/d8e8eac1-b7f3-41b8-b041-69e6d80a1c03";
const UPLOAD_API = "https://functions.poehali.dev/a913c03c-9fc0-4a9f-baef-df33289b1a86";

const STATUSES = [
  { value: "all", label: "Все", color: "text-white/60", bg: "bg-white/10" },
  { value: "new", label: "🕐 Новый", color: "text-white/60", bg: "bg-white/10" },
  { value: "processing", label: "⚙️ В обработке", color: "text-yellow-400", bg: "bg-yellow-500/20" },
  { value: "delivering", label: "🚚 Доставляется", color: "text-blue-400", bg: "bg-blue-500/20" },
  { value: "done", label: "✅ Выполнен", color: "text-veggie-lime", bg: "bg-veggie-lime/20" },
  { value: "cancelled", label: "❌ Отменён", color: "text-red-400", bg: "bg-red-500/20" },
];

// Все товары каталога (локально для редактирования)
type Product = { id: number; name: string; price: number; unit: string; season: string; type: string; emoji: string; badge: string | null; weight: string; weightKg: number; image: string };

const ALL_PRODUCTS: Product[] = [
  { id: 1, name: "Картофель мытый", price: 55, unit: "кг", season: "осень", type: "картофель", emoji: "🥔", badge: "Премиум", weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/3dbd5d4c-347d-4306-be77-864030e67c89.jpg" },
  { id: 2, name: "Картофель Галла", price: 50, unit: "кг", season: "осень", type: "картофель", emoji: "🥔", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/0b53ae19-45d1-401c-a50f-69f9baefa75d.jpg" },
  { id: 3, name: "Картофель Колумба", price: 55, unit: "кг", season: "осень", type: "картофель", emoji: "🥔", badge: "Премиум", weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/2dc69047-7f79-4790-aaff-6796da1b4d8b.jpg" },
  { id: 4, name: "Капуста белокочанная свежая", price: 40, unit: "кг", season: "осень", type: "капуста", emoji: "🥬", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/fb2afc14-76f3-4957-a98a-46fccffd7d06.jpg" },
  { id: 5, name: "Морковь свежая", price: 38, unit: "кг", season: "осень", type: "корнеплоды", emoji: "🥕", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/023d4885-9eee-408a-89fd-cec00d665142.jpg" },
  { id: 6, name: "Лук репчатый свежий", price: 50, unit: "кг", season: "осень", type: "лук", emoji: "🧅", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/f43c952c-d59f-43f3-ba60-b4e845e3d9ea.jpg" },
  { id: 7, name: "Лук репчатый Казахстан", price: 30, unit: "кг", season: "осень", type: "лук", emoji: "🧅", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/87a24ecf-e70e-44ff-8b75-dc77258e72f9.jpg" },
  { id: 8, name: "Свёкла Краснодар", price: 45, unit: "кг", season: "осень", type: "корнеплоды", emoji: "🫐", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/ba66fd18-f627-40c3-b265-b7ff8a5706fc.jpg" },
  { id: 9, name: "Помидор Малиновка", price: 250, unit: "кг", season: "лето", type: "томаты", emoji: "🍅", badge: "Хит", weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/eed9e168-bf2c-4e6c-aa37-e5305573727f.jpeg" },
  { id: 10, name: "Помидор на ветке", price: 150, unit: "кг", season: "лето", type: "томаты", emoji: "🍅", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/1f46a197-22de-4fac-8b33-16bab135c783.jpg" },
  { id: 12, name: "Помидор Парадайс", price: 220, unit: "кг", season: "лето", type: "томаты", emoji: "🍅", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/05cd7a84-8e00-40ff-9e35-a9a9ae50e85f.jpg" },
  { id: 11, name: "Огурец пупырчатый Чечня", price: 150, unit: "кг", season: "лето", type: "огурцы", emoji: "🥒", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/3a013d01-ce48-4918-893a-f2b121197ad6.jpg" },
  { id: 14, name: "Огурец пупырчатый высший сорт", price: 180, unit: "кг", season: "лето", type: "огурцы", emoji: "🥒", badge: "Хит", weight: "1кг", weightKg: 1, image: "" },
  { id: 15, name: "Огурец пупырчатый Кубань", price: 110, unit: "кг", season: "лето", type: "огурцы", emoji: "🥒", badge: null, weight: "1кг", weightKg: 1, image: "" },
  { id: 13, name: "Огурец гладкий", price: 170, unit: "кг", season: "лето", type: "огурцы", emoji: "🥒", badge: null, weight: "1кг", weightKg: 1, image: "" },
  { id: 101, name: "Яблоки Голден", price: 200, unit: "кг", season: "осень", type: "яблоки", emoji: "🍎", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/e46b761d-297e-44b6-8825-2132c0ceb0b8.jpg" },
  { id: 102, name: "Яблоки Антоновка", price: 90, unit: "кг", season: "осень", type: "яблоки", emoji: "🍏", badge: "Нет в наличии", weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/60cc751a-7ba8-41ee-b44b-b2768970c560.jpg" },
  { id: 109, name: "Яблоки Галла", price: 240, unit: "кг", season: "осень", type: "яблоки", emoji: "🍎", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/64b62730-8841-40cd-9717-456d2318cca4.jpg" },
  { id: 110, name: "Яблоки Кехура", price: 150, unit: "кг", season: "осень", type: "яблоки", emoji: "🍏", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/8352f768-a88f-4157-8a5f-f60a08b6bf02.jpg" },
  { id: 111, name: "Яблоки Грени Смит", price: 180, unit: "кг", season: "осень", type: "яблоки", emoji: "🍏", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/49188ad8-ab1d-4578-9134-0ff9200e2a59.jpg" },
  { id: 112, name: "Яблоки Семеринка", price: 220, unit: "кг", season: "осень", type: "яблоки", emoji: "🍎", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/783479ba-7a96-4e43-8be6-1ea2f4aa6796.jpg" },
  { id: 103, name: "Груша Конференц", price: 370, unit: "кг", season: "осень", type: "груши", emoji: "🍐", badge: "Хит", weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/38b75f43-6100-41cd-8bfb-34db957bbd2b.jpg" },
  { id: 113, name: "Груша Аббат", price: 280, unit: "кг", season: "осень", type: "груши", emoji: "🍐", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/9321f6a1-b081-4cfe-94a7-02c21a918024.jpg" },
  { id: 114, name: "Груша Дюшес Аргентина", price: 220, unit: "кг", season: "осень", type: "груши", emoji: "🍐", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/3a04e590-17d0-4141-bdc9-64348e3e9ee9.jpg" },
  { id: 115, name: "Мандарин Турция", price: 220, unit: "кг", season: "зима", type: "цитрусы", emoji: "🍊", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/a9e42def-2ecd-476b-a668-8cfae87eb129.jpg" },
  { id: 106, name: "Сливы синие", price: 200, unit: "кг", season: "лето", type: "сливы", emoji: "🍑", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/0a031ca2-f15a-4f25-997c-114466e7e4bc.jpg" },
  { id: 120, name: "Виноград зелёный", price: 400, unit: "кг", season: "лето", type: "виноград", emoji: "🍇", badge: null, weight: "1кг", weightKg: 1, image: "" },
  { id: 121, name: "Виноград Кишмиш", price: 500, unit: "кг", season: "лето", type: "виноград", emoji: "🍇", badge: "Хит", weight: "1кг", weightKg: 1, image: "" },
  { id: 122, name: "Киви", price: 240, unit: "кг", season: "зима", type: "экзотика", emoji: "🥝", badge: null, weight: "1кг", weightKg: 1, image: "" },
  { id: 123, name: "Бананы", price: 200, unit: "кг", season: "всесезонно", type: "экзотика", emoji: "🍌", badge: null, weight: "1кг", weightKg: 1, image: "" },
  { id: 124, name: "Ананас", price: 700, unit: "шт", season: "всесезонно", type: "экзотика", emoji: "🍍", badge: null, weight: "1шт", weightKg: 1, image: "" },
  { id: 125, name: "Лимон", price: 350, unit: "кг", season: "всесезонно", type: "цитрусы", emoji: "🍋", badge: null, weight: "100г", weightKg: 0.1, image: "" },
  { id: 126, name: "Чеснок", price: 280, unit: "кг", season: "осень", type: "чеснок", emoji: "🧄", badge: null, weight: "100г", weightKg: 0.1, image: "" },
  { id: 127, name: "Имбирь", price: 500, unit: "кг", season: "всесезонно", type: "специи", emoji: "🫚", badge: null, weight: "100г", weightKg: 0.1, image: "" },
  { id: 201, name: "Клубника", price: 380, unit: "кг", season: "лето", type: "ягоды", emoji: "🍓", badge: null, weight: "1кг", weightKg: 1, image: "" },
  { id: 202, name: "Арбуз", price: 100, unit: "кг", season: "лето", type: "ягоды", emoji: "🍉", badge: null, weight: "1кг", weightKg: 1, image: "" },
  { id: 301, name: "Гранатовый сок", price: 150, unit: "л", season: "всесезонно", type: "соки", emoji: "🧃", badge: null, weight: "1л", weightKg: 1, image: "" },
  { id: 401, name: "Шампиньоны", price: 200, unit: "500г", season: "всесезонно", type: "грибы", emoji: "🍄", badge: null, weight: "500г", weightKg: 0.5, image: "" },
  { id: 501, name: "Лук зелёный", price: 100, unit: "150г", season: "всесезонно", type: "зелень", emoji: "🌿", badge: null, weight: "150г", weightKg: 0.15, image: "" },
  { id: 502, name: "Укроп", price: 100, unit: "150г", season: "всесезонно", type: "зелень", emoji: "🌿", badge: null, weight: "150г", weightKg: 0.15, image: "" },
  { id: 503, name: "Петрушка", price: 100, unit: "150г", season: "всесезонно", type: "зелень", emoji: "🌿", badge: null, weight: "150г", weightKg: 0.15, image: "" },
  { id: 504, name: "Редиска", price: 200, unit: "кг", season: "лето", type: "зелень", emoji: "🌰", badge: null, weight: "1кг", weightKg: 1, image: "" },
  { id: 601, name: "Яйцо домашнее", price: 150, unit: "упак", season: "всесезонно", type: "яйца", emoji: "🥚", badge: null, weight: "10шт", weightKg: 0.6, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/93ea36d9-51c0-4187-a153-edd5dcabcb3a.jpg" },
  { id: 602, name: "Яйцо инкубаторское 2 категория", price: 227, unit: "упак", season: "всесезонно", type: "яйца", emoji: "🥚", badge: null, weight: "30шт", weightKg: 1.8, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/70ebee28-7c7b-4c90-86c2-d59abdb0ad04.jpg" },
  { id: 710, name: "Свинина на кости свежая", price: 300, unit: "кг", season: "всесезонно", type: "свинина", emoji: "🥩", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/533fc478-d5a4-4852-baa3-f8f30d550eb0.jpg" },
  { id: 801, name: "Молоко Вкус Облако 3.2%", price: 82, unit: "л", season: "всесезонно", type: "молоко", emoji: "🥛", badge: null, weight: "1 л", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/fc30e904-a250-4e7a-803f-d096683b1402.jpg" },
  { id: 802, name: "Сметана Сочные Луга", price: 88, unit: "уп", season: "всесезонно", type: "кисломолочное", emoji: "🥛", badge: null, weight: "300 г", weightKg: 0.3, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/0b55606c-fb21-4d72-9ce9-c4819b1bea5a.jpg" },
  { id: 803, name: "Творог домашний", price: 0, unit: "500г", season: "всесезонно", type: "творог", emoji: "🧀", badge: null, weight: "500г", weightKg: 0.5, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/bcdf791f-7baf-4e6b-b7c6-e105d69380c3.jpg" },
  { id: 804, name: "Кефир домашний", price: 0, unit: "л", season: "всесезонно", type: "кисломолочное", emoji: "🥛", badge: null, weight: "1л", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/ad4feff8-9acd-417a-9f05-ead3a10e51a5.jpg" },
  { id: 808, name: "Кефир Молочный Фермер 3,2%", price: 89, unit: "уп", season: "всесезонно", type: "кисломолочное", emoji: "🥛", badge: null, weight: "900 г", weightKg: 0.9, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/765e81a2-a7b3-4fcb-8d6f-c0d697b74e6a.jpg" },
  { id: 805, name: "Масло сливочное крестьянское 72,5% 200 г", price: 0, unit: "уп", season: "всесезонно", type: "масло", emoji: "🧈", badge: null, weight: "200 г", weightKg: 0.2, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/f6fd9cbd-8a99-4182-8b88-c5a5aab5162e.jpg" },
  { id: 806, name: "Сыр домашний", price: 0, unit: "кг", season: "всесезонно", type: "сыр", emoji: "🧀", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/4e9070df-21c7-47f6-8451-f52dc5a6e631.jpg" },
  { id: 807, name: "Сыр сливочный творожный", price: 0, unit: "уп", season: "всесезонно", type: "сыр", emoji: "🧀", badge: null, weight: "", weightKg: 0.2, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/c033d837-1164-4fbb-b65b-7f93b6586a5f.jpg" },
  { id: 901, name: "Колбаса варёная", price: 0, unit: "кг", season: "всесезонно", type: "варёная", emoji: "🌭", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/3a352e6a-6b72-46f2-92ed-f1455f608ce6.jpg" },
  { id: 902, name: "Колбаса копчёная", price: 0, unit: "кг", season: "всесезонно", type: "копчёная", emoji: "🌭", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/ebcef16a-51f5-4021-ab67-e59a20cb593f.jpg" },
  { id: 903, name: "Сосиски домашние", price: 0, unit: "кг", season: "всесезонно", type: "сосиски", emoji: "🌭", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/f9077a1a-5342-4589-9696-708429305cba.jpg" },
  { id: 904, name: "Сардельки", price: 0, unit: "кг", season: "всесезонно", type: "сосиски", emoji: "🌭", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/0b36af7b-d91a-49f2-8017-e81c70eab10b.jpg" },
  { id: 905, name: "Ветчина домашняя", price: 0, unit: "кг", season: "всесезонно", type: "ветчина", emoji: "🥩", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/98da435d-71ee-4b4a-ad60-0ddc87c7dde9.jpg" },
  { id: 1001, name: "Биолан Color капсулы для стирки 35 шт", price: 428, unit: "уп", season: "всесезонно", type: "стирка", emoji: "🧺", badge: null, weight: "35 капсул", weightKg: 0.5, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/8b0ea665-e056-4189-a570-aa8dafce4bba.jpg" },
  { id: 1002, name: "Влажные салфетки для детей 200 шт", price: 99, unit: "уп", season: "всесезонно", type: "салфетки", emoji: "🧻", badge: null, weight: "200 шт", weightKg: 0.3, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/1b71cad8-efca-4674-b743-b9900f396d28.jpg" },
  { id: 1003, name: "Туалетная бумага 3 слоя 8 шт", price: 149, unit: "уп", season: "всесезонно", type: "бумага", emoji: "🧻", badge: null, weight: "8 рулонов", weightKg: 0.8, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/b0d9f5d9-b5c4-4acf-84f5-6aa509d5bd87.jpg" },
  { id: 1004, name: "Порошок BiMax Color Automat 6 кг", price: 599, unit: "уп", season: "всесезонно", type: "стирка", emoji: "🧺", badge: null, weight: "6 кг", weightKg: 6, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/0f1a55dc-f8b3-4802-aa70-e1828d0d04b4.jpg" },
  { id: 1005, name: "Шланг садовый 20м диаметр 18мм", price: 1020, unit: "шт", season: "всесезонно", type: "сад", emoji: "🌿", badge: null, weight: "20 м", weightKg: 2, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/5ed33d2b-a957-482a-b541-3076f93ddeb3.jpg" },
  { id: 1101, name: "Мука пшеничная высший сорт 5 кг", price: 254, unit: "уп", season: "всесезонно", type: "мука", emoji: "🌾", badge: null, weight: "5кг", weightKg: 5, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/8a64f203-60de-40e5-b5ce-41e2be74d9ee.jpg" },
  { id: 1102, name: "Булгур крупа пшеничная 800 г", price: 135, unit: "уп", season: "всесезонно", type: "крупы", emoji: "🌾", badge: null, weight: "800г", weightKg: 0.8, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/951f1306-a64f-4d12-b328-d430a717bcbc.jpg" },
  { id: 1103, name: "Смесь бобовых 800 г", price: 88, unit: "уп", season: "всесезонно", type: "крупы", emoji: "🫘", badge: null, weight: "800г", weightKg: 0.8, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/a7855c6d-c5e7-44c4-8c2a-eb30be522e06.jpg" },
  { id: 1104, name: "Рис шлифованный 2 сорт 900 г", price: 99, unit: "уп", season: "всесезонно", type: "крупы", emoji: "🍚", badge: null, weight: "900г", weightKg: 0.9, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/b501d4e5-0ebc-4ff5-9914-8ab73c2e07e2.jpg" },
  { id: 1105, name: "Майонез Calve Лёгкий 800 г", price: 180, unit: "уп", season: "всесезонно", type: "соусы", emoji: "🥫", badge: null, weight: "800 г", weightKg: 0.8, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/465bd9cc-280c-4b63-a4b8-cdeeef27b4b9.jpg" },
  { id: 1108, name: "Соус Calve Лёгкий 230 г", price: 89, unit: "уп", season: "всесезонно", type: "соусы", emoji: "🥫", badge: null, weight: "230 г", weightKg: 0.23, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/acef4785-f7ee-467e-b43a-8b8a410d5870.jpg" },
  { id: 1106, name: "Чай TANAY 100 пакетов", price: 0, unit: "уп", season: "всесезонно", type: "чай", emoji: "🍵", badge: null, weight: "100 пак", weightKg: 0.2, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/cf05b900-ee74-4322-bb77-8bef4ef410de.jpg" },
  { id: 1109, name: "Вода Казбек-Аква газированная 1,5 л", price: 65, unit: "бут", season: "всесезонно", type: "вода", emoji: "💧", badge: null, weight: "1,5 л", weightKg: 1.5, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/fb9a8c41-d977-43a3-8457-fb637e93333d.jpg" },
  { id: 1110, name: "Квас Желтая Бочка живого брожения 3,5 л", price: 189, unit: "бут", season: "всесезонно", type: "вода", emoji: "🍺", badge: null, weight: "3,5 л", weightKg: 3.5, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/518b9030-56ec-4d38-adad-58c919ff91ae.jpg" },
  { id: 1201, name: "Морковь по-корейски 500 г", price: 85, unit: "уп", season: "всесезонно", type: "салаты", emoji: "🥕", badge: null, weight: "500г", weightKg: 0.5, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/3197f53a-4d44-422c-9779-cd171c8082b4.jpg" },
  { id: 1202, name: "Капуста квашеная с морковью 1 кг", price: 125, unit: "пластиковая тара", season: "всесезонно", type: "соленья", emoji: "🥬", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/47ab454a-57fb-492d-8a3e-5b485c88566f.jpg" },
  { id: 1203, name: "Огурцы маринованные Фрау Марта 680 г", price: 189, unit: "уп", season: "всесезонно", type: "соленья", emoji: "🥒", badge: null, weight: "680 г", weightKg: 0.68, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/332ec4c5-9683-4be4-be84-ad231b5d2567.jpg" },
  { id: 1204, name: "Семечки Белочка жареные 150 г", price: 65, unit: "уп", season: "всесезонно", type: "снэки", emoji: "🌻", badge: null, weight: "150 г", weightKg: 0.15, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/9a0c8177-1ee5-43dd-9a47-01622581ff6f.jpg" },
  { id: 1205, name: "Чипсы Lay's Сметана и зелень 150 г", price: 129, unit: "уп", season: "всесезонно", type: "снэки", emoji: "🍟", badge: null, weight: "150 г", weightKg: 0.15, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/db48f7ea-5442-4937-83da-3eaed06aff3c.jpg" },
];

const BADGE_OPTIONS = ["Нет в наличии", "Хит", "Органик", "Новинка", "Премиум"];

type Order = { id: number; name: string; phone: string; address: string; comment: string; items: Array<{ name: string; quantity: number; price: number }>; total_price: number; status: string; created_at: string; user_id: number | null };
type UserProfile = { id: number; phone: string; name: string; points: number; is_first_order_done: boolean; created_at: string | null; last_seen_at: string | null; order_count: number };
type Review = { id: number; name: string; city: string; text: string; rating: number; avatar: string; approved: boolean; created_at: string };

const ADMIN_TABS = ["📦 Заказы", "👤 Профили", "⭐ Отзывы", "🥬 Каталог"] as const;
type AdminTab = typeof ADMIN_TABS[number];

const inp = "w-full bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-veggie-lime/60 transition-colors";

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem("admin_key") || "");
  const [keyInput, setKeyInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTab>("📦 Заказы");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Заказы
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Пользователи
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [userSaving, setUserSaving] = useState(false);

  // Отзывы
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewSaving, setReviewSaving] = useState(false);

  // Каталог
  type Override = { product_id: number; price: number | null; unit: string | null; badge: string | null; image: string | null; type: string | null; weight: string | null; weight_kg: number | null; hidden: boolean };
  const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [overrides, setOverrides] = useState<Record<number, Override>>({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productSaved, setProductSaved] = useState<number | null>(null);
  const [productSaving, setProductSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'season' | 'emoji'> & { emoji: string; season: string }>({ name: '', price: 0, unit: 'кг', weight: '1кг', type: '', badge: null, image: '', emoji: '🛒', season: 'всесезонно', weightKg: 1 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    setImageUploading(true);
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      const MAX = 1200;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else { w = Math.round(w * MAX / h); h = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      const base64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
      try {
        const res = await fetch(UPLOAD_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'upload', image: base64, contentType: 'image/jpeg', oldUrl: editingProduct?.image || '' })
        });
        const data = await res.json();
        if (data.url) setEditingProduct(prev => prev ? { ...prev, image: data.url } : prev);
      } catch { /* ignore */ }
      setImageUploading(false);
    };
    img.src = objectUrl;
  };

  const hdrs = (extra?: object) => ({ "X-Admin-Key": adminKey, "Content-Type": "application/json", ...extra });

  const login = async () => {
    setLoading(true); setError("");
    const res = await fetch(`${API}?admin=1`, { headers: { "X-Admin-Key": keyInput } });
    if (res.ok) {
      localStorage.setItem("admin_key", keyInput);
      setAdminKey(keyInput);
      const data = await res.json();
      setOrders(data.orders || []);
      setAuthed(true);
    } else { setError("Неверный ключ"); }
    setLoading(false);
  };

  const loadOrders = async (key = adminKey, filter = statusFilter) => {
    setLoading(true);
    const url = filter === "all" ? `${API}?admin=1` : `${API}?admin=1&status=${filter}`;
    const res = await fetch(url, { headers: { "X-Admin-Key": key } });
    if (res.ok) { const data = await res.json(); setOrders(data.orders || []); }
    setLoading(false);
  };

  const loadUsers = async (key = adminKey) => {
    setLoading(true);
    const res = await fetch(`${API}?resource=users`, { headers: { "X-Admin-Key": key } });
    if (res.ok) { const data = await res.json(); setUsers(data.users || []); }
    setLoading(false);
  };

  const loadReviews = async (key = adminKey) => {
    setLoading(true);
    const res = await fetch(`${API}?resource=reviews`, { headers: { "X-Admin-Key": key } });
    if (res.ok) { const data = await res.json(); setReviews(data.reviews || []); }
    setLoading(false);
  };

  const loadCatalog = async () => {
    const res = await fetch(`${API}?resource=catalog`);
    if (!res.ok) return;
    const data = await res.json();
    const map: Record<number, Override> = {};
    for (const o of (data.overrides || [])) map[o.product_id] = o;
    setOverrides(map);
    setProducts(ALL_PRODUCTS.map(p => {
      const o = map[p.id];
      if (!o) return p;
      return { ...p, name: o.name || p.name, price: o.price ?? p.price, unit: o.unit ?? p.unit, badge: o.badge !== undefined ? o.badge : p.badge, image: o.image || p.image, type: o.type ?? p.type, weight: o.weight ?? p.weight, weightKg: o.weight_kg ?? p.weightKg };
    }));
  };

  const saveProduct = async (p: Product) => {
    const hidden = overrides[p.id]?.hidden ?? false;
    setProductSaving(true);
    await fetch(`${API}?resource=catalog`, {
      method: 'PUT',
      headers: hdrs(),
      body: JSON.stringify({ product_id: p.id, name: p.name, price: p.price, unit: p.unit, badge: p.badge, image: p.image, type: p.type, weight: p.weight, weight_kg: p.weightKg, hidden })
    });
    setOverrides(prev => ({ ...prev, [p.id]: { ...p, product_id: p.id, weight_kg: p.weightKg, hidden } }));
    setProducts(prev => prev.map(x => x.id === p.id ? p : x));
    setProductSaved(p.id);
    setProductSaving(false);
    setTimeout(() => setProductSaved(null), 2500);
    setEditingProduct(null);
  };

  const toggleHidden = async (p: Product) => {
    const newHidden = !(overrides[p.id]?.hidden ?? false);
    await fetch(`${API}?resource=catalog`, {
      method: 'PUT',
      headers: hdrs(),
      body: JSON.stringify({ product_id: p.id, price: p.price, unit: p.unit, badge: p.badge, image: p.image, type: p.type, weight: p.weight, weight_kg: p.weightKg, hidden: newHidden })
    });
    setOverrides(prev => ({ ...prev, [p.id]: { ...(prev[p.id] || { product_id: p.id, price: null, unit: null, badge: null, image: null, type: null, weight: null, weight_kg: null }), hidden: newHidden } }));
  };

  useEffect(() => {
    if (adminKey) {
      setAuthed(false);
      fetch(`${API}?admin=1`, { headers: { "X-Admin-Key": adminKey } })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) { setOrders(data.orders || []); setAuthed(true); }
          else { localStorage.removeItem("admin_key"); setAdminKey(""); }
        }).catch(() => {});
    }
  }, []);

  useEffect(() => { if (authed) loadOrders(adminKey, statusFilter); }, [statusFilter]);
  useEffect(() => {
    if (!authed) return;
    if (adminTab === "👤 Профили") loadUsers();
    if (adminTab === "⭐ Отзывы") loadReviews();
    if (adminTab === "🥬 Каталог") loadCatalog();
  }, [adminTab, authed]);

  const changeStatus = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    const res = await fetch(API, { method: "PATCH", headers: hdrs(), body: JSON.stringify({ order_id: orderId, status: newStatus }) });
    if (res.ok) setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setUpdatingId(null);
  };

  const deleteOrder = async (orderId: number) => {
    if (!confirm(`Удалить заказ #${orderId}?`)) return;
    await fetch(API, { method: "DELETE", headers: hdrs(), body: JSON.stringify({ order_id: orderId }) });
    setOrders(prev => prev.filter(o => o.id !== orderId));
    setExpandedId(null);
  };

  const saveOrder = async () => {
    if (!editingOrder) return;
    setUpdatingId(editingOrder.id);
    await fetch(API, { method: "PATCH", headers: hdrs(), body: JSON.stringify({ order_id: editingOrder.id, items: editingOrder.items, total_price: editingOrder.total_price }) });
    setOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...o, items: editingOrder.items, total_price: editingOrder.total_price } : o));
    setUpdatingId(null);
    setEditingOrder(null);
  };

  const saveUser = async () => {
    if (!editingUser) return;
    setUserSaving(true);
    await fetch(`${API}?resource=users`, { method: "PUT", headers: hdrs(), body: JSON.stringify(editingUser) });
    setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...editingUser } : u));
    setUserSaving(false);
    setEditingUser(null);
  };

  const deleteUser = async (userId: number) => {
    if (!confirm("Удалить пользователя? Это действие необратимо.")) return;
    await fetch(`${API}?resource=users`, { method: "DELETE", headers: hdrs(), body: JSON.stringify({ id: userId }) });
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const saveReview = async () => {
    if (!editingReview) return;
    setReviewSaving(true);
    await fetch(`${API}?resource=reviews`, { method: "PUT", headers: hdrs(), body: JSON.stringify(editingReview) });
    setReviews(prev => prev.map(r => r.id === editingReview.id ? editingReview : r));
    setReviewSaving(false);
    setEditingReview(null);
  };

  const deleteReview = async (id: number) => {
    if (!confirm("Удалить отзыв?")) return;
    await fetch(`${API}?resource=reviews`, { method: "DELETE", headers: hdrs(), body: JSON.stringify({ id }) });
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const toggleApprove = async (review: Review) => {
    await fetch(`${API}?resource=reviews`, { method: "PUT", headers: hdrs(), body: JSON.stringify({ id: review.id, approved: !review.approved }) });
    setReviews(prev => prev.map(r => r.id === review.id ? { ...r, approved: !r.approved } : r));
  };

  const fmtDate = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const statusInfo = (s: string) => STATUSES.find(st => st.value === s) || STATUSES[1];
  const countByStatus = (s: string) => orders.filter(o => o.status === s).length;

  const filteredOrders = orders.filter(o => {
    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase();
    return o.name.toLowerCase().includes(q) || o.phone.includes(q) || String(o.id).includes(q) || (o.address || "").toLowerCase().includes(q);
  });
  const filteredUsers = users.filter(u => !userSearch.trim() || u.phone.includes(userSearch) || (u.name || "").toLowerCase().includes(userSearch.toLowerCase()));
  const filteredProducts = products.filter(p => !productSearch.trim() || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.type.toLowerCase().includes(productSearch.toLowerCase()));

  if (!authed) {
    return (
      <div className="min-h-screen bg-veggie-dark flex items-center justify-center p-4">
        <div className="bg-veggie-dark border border-veggie-green/40 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="font-heading text-2xl font-bold text-white">Панель управления</h1>
            <p className="text-white/50 text-sm mt-1">Введите ключ администратора</p>
          </div>
          <input type="password" value={keyInput} onChange={e => setKeyInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            placeholder="ADMIN_KEY"
            className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-veggie-lime/60 transition-colors mb-3"
            autoFocus />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <button onClick={login} disabled={loading || !keyInput.trim()}
            className="w-full bg-veggie-lime text-veggie-dark py-3 rounded-xl font-bold text-sm hover:bg-white transition-colors disabled:opacity-50">
            {loading ? "Проверяем..." : "Войти"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-veggie-dark text-white">
      {/* Шапка */}
      <div className="border-b border-veggie-green/30 px-4 py-4 flex items-center justify-between sticky top-0 bg-veggie-dark z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🥬</span>
          <div>
            <h1 className="font-heading text-lg font-bold">ФИЛИНИ — Панель управления</h1>
            <p className="text-white/40 text-xs">
              {adminTab === "📦 Заказы" && `Заказов: ${orders.length}`}
              {adminTab === "👤 Профили" && `Пользователей: ${users.length}`}
              {adminTab === "⭐ Отзывы" && `Отзывов: ${reviews.length}`}
              {adminTab === "🥬 Каталог" && `Товаров: ${products.length}`}
            </p>
          </div>
        </div>
        <button onClick={() => {
          if (adminTab === "📦 Заказы") loadOrders();
          if (adminTab === "👤 Профили") loadUsers();
          if (adminTab === "⭐ Отзывы") loadReviews();
        }} disabled={loading} className="flex items-center gap-2 border border-white/20 text-white/60 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-colors">
          <Icon name="RefreshCw" size={12} />Обновить
        </button>
      </div>

      {/* Вкладки */}
      <div className="px-4 pt-4 flex gap-2 flex-wrap">
        {ADMIN_TABS.map(t => (
          <button key={t} onClick={() => setAdminTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${adminTab === t ? "bg-veggie-green text-white" : "bg-white/5 text-white/50 hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-4">

        {/* ======= ЗАКАЗЫ ======= */}
        {adminTab === "📦 Заказы" && <>
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

          <div className="flex flex-wrap gap-2 mb-4">
            {STATUSES.map(s => (
              <button key={s.value} onClick={() => setStatusFilter(s.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${statusFilter === s.value ? `${s.bg} ${s.color} border-transparent` : "border-white/15 text-white/40 hover:text-white/70"}`}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="relative mb-4">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
              placeholder="Поиск по имени, телефону, адресу..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-veggie-lime/40 transition-colors" />
          </div>

          {loading ? <div className="text-center py-12 text-white/30">Загрузка...</div>
            : filteredOrders.length === 0 ? <div className="text-center py-12 text-white/30">Заказов не найдено</div>
            : (
              <div className="space-y-3">
                {filteredOrders.map(order => {
                  const si = statusInfo(order.status);
                  const isExpanded = expandedId === order.id;
                  return (
                    <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      <div className="p-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
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
                            <div className="space-y-1 mb-3">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span className="text-white/70">{item.name} × {item.quantity}</span>
                                  <span className="text-white/50">{item.price * item.quantity} ₽</span>
                                </div>
                              ))}
                            </div>
                            {order.comment && <p className="text-white/40 text-xs">💬 {order.comment}</p>}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <button onClick={() => setEditingOrder({ ...order })}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                              <Icon name="Pencil" size={12} />Редактировать позиции
                            </button>
                            <button onClick={() => deleteOrder(order.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                              <Icon name="Trash2" size={12} />Удалить
                            </button>
                          </div>

                          <p className="text-white/40 text-xs mb-2">Изменить статус:</p>
                          <div className="flex flex-wrap gap-2">
                            {STATUSES.filter(s => s.value !== "all").map(s => (
                              <button key={s.value} onClick={() => changeStatus(order.id, s.value)}
                                disabled={updatingId === order.id || order.status === s.value}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${order.status === s.value ? `${s.bg} ${s.color} border-transparent` : "border-white/15 text-white/40 hover:text-white/70"} disabled:opacity-50`}>
                                {updatingId === order.id && order.status !== s.value ? "..." : s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
        </>}

        {/* ======= ПРОФИЛИ ======= */}
        {adminTab === "👤 Профили" && <>
          <div className="relative mb-4">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
              placeholder="Поиск по телефону или имени..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-veggie-lime/40 transition-colors" />
          </div>
          {loading ? <div className="text-center py-12 text-white/30">Загрузка...</div>
            : filteredUsers.length === 0 ? <div className="text-center py-12 text-white/30">Нет пользователей</div>
            : (
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
                      <div className="flex flex-col gap-1 shrink-0">
                        <div className="text-right text-xs text-white/30 mb-2">
                          <p>Визит: <span className={u.last_seen_at ? "text-veggie-lime" : "text-white/30"}>{fmtDate(u.last_seen_at)}</span></p>
                          <p>Рег: {fmtDate(u.created_at)}</p>
                        </div>
                        <button onClick={() => setEditingUser({ ...u })}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                          <Icon name="Pencil" size={11} />Изменить
                        </button>
                        <button onClick={() => deleteUser(u.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                          <Icon name="Trash2" size={11} />Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </>}

        {/* ======= ОТЗЫВЫ ======= */}
        {adminTab === "⭐ Отзывы" && <>
          {loading ? <div className="text-center py-12 text-white/30">Загрузка...</div>
            : reviews.length === 0 ? <div className="text-center py-12 text-white/30">Отзывов нет</div>
            : (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className={`rounded-2xl p-4 border ${r.approved ? "bg-white/5 border-white/10" : "bg-yellow-500/5 border-yellow-500/20"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white/30 text-xs">#{r.id}</span>
                          {r.approved ? <span className="text-[10px] bg-veggie-lime/20 text-veggie-lime px-2 py-0.5 rounded-full">✅ Опубликован</span>
                            : <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">⏳ На модерации</span>}
                        </div>
                        <div className="flex gap-0.5 mb-1">{Array.from({ length: r.rating }).map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}</div>
                        <p className="text-white/80 text-sm italic mb-2">"{r.text}"</p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{r.avatar}</span>
                          <div>
                            <p className="text-white font-semibold text-xs">{r.name}</p>
                            <p className="text-white/40 text-xs">📍 {r.city}</p>
                          </div>
                        </div>
                        <p className="text-white/30 text-xs mt-1">{fmtDate(r.created_at)}</p>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button onClick={() => toggleApprove(r)}
                          className={`px-2 py-1 rounded-lg text-xs transition-colors ${r.approved ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30" : "bg-veggie-lime/20 text-veggie-lime hover:bg-veggie-lime/30"}`}>
                          {r.approved ? "Скрыть" : "Одобрить"}
                        </button>
                        <button onClick={() => setEditingReview({ ...r })}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                          <Icon name="Pencil" size={11} />Изменить
                        </button>
                        <button onClick={() => deleteReview(r.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                          <Icon name="Trash2" size={11} />Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </>}

        {/* ======= КАТАЛОГ ======= */}
        {adminTab === "🥬 Каталог" && <>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={productSearch} onChange={e => setProductSearch(e.target.value)}
                placeholder="Поиск по названию или типу..."
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-veggie-lime/40 transition-colors" />
            </div>
            <button onClick={() => setAddingProduct(true)}
              className="flex items-center gap-2 bg-veggie-lime text-veggie-dark px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white transition-colors shrink-0">
              <Icon name="Plus" size={16} />Добавить
            </button>
          </div>
          <div className="space-y-2">
            {filteredProducts.map(p => {
              const isHidden = overrides[p.id]?.hidden ?? false;
              return (
                <div key={p.id} className={`border rounded-2xl p-3 flex items-center gap-3 transition-opacity ${isHidden ? "opacity-40 bg-red-500/5 border-red-500/20" : p.badge === "Нет в наличии" ? "bg-white/5 border-orange-500/20" : "bg-white/5 border-white/10"}`}>
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                    {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-2xl">{p.emoji}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isHidden ? "line-through text-white/40" : "text-white"}`}>{p.name}</p>
                    <div className="flex gap-2 text-xs text-white/50 mt-0.5 flex-wrap">
                      <span>{p.price} ₽/{p.unit}</span>
                      <span className="text-white/30">{p.weight}</span>
                      {p.badge && <span className={p.badge === "Нет в наличии" ? "text-orange-400" : "text-veggie-lime"}>{p.badge}</span>}
                      {isHidden && <span className="text-red-400">скрыт</span>}
                      {productSaved === p.id && <span className="text-veggie-lime font-semibold">✓ Сохранено</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => toggleHidden(p)} title={isHidden ? "Показать" : "Скрыть"}
                      className={`px-2 py-1.5 rounded-lg text-xs transition-colors ${isHidden ? "bg-veggie-lime/20 text-veggie-lime hover:bg-veggie-lime/30" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`}>
                      <Icon name={isHidden ? "Eye" : "EyeOff"} size={12} />
                    </button>
                    <button onClick={() => setEditingProduct({ ...p })}
                      className="px-2 py-1.5 rounded-lg text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                      <Icon name="Pencil" size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>}
      </div>

      {/* === МОДАЛ: Редактирование заказа === */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setEditingOrder(null)}>
          <div className="bg-veggie-dark border border-veggie-green/40 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-bold">Заказ #{editingOrder.id}</h2>
              <button onClick={() => setEditingOrder(null)} className="text-white/40 hover:text-white"><Icon name="X" size={20} /></button>
            </div>
            <p className="text-white/50 text-xs mb-3">Позиции и итоговая сумма:</p>
            <div className="space-y-2 mb-4">
              {editingOrder.items.map((item, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3">
                  <p className="text-white text-sm mb-2">{item.name}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-white/40 text-xs">Кол-во</label>
                      <input type="number" value={item.quantity} min={1}
                        onChange={e => setEditingOrder({ ...editingOrder, items: editingOrder.items.map((it, j) => j === i ? { ...it, quantity: Number(e.target.value) } : it) })}
                        className={inp + " mt-1"} />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs">Цена за ед.</label>
                      <input type="number" value={item.price} min={0}
                        onChange={e => setEditingOrder({ ...editingOrder, items: editingOrder.items.map((it, j) => j === i ? { ...it, price: Number(e.target.value) } : it) })}
                        className={inp + " mt-1"} />
                    </div>
                    <div className="flex items-end">
                      <button onClick={() => setEditingOrder({ ...editingOrder, items: editingOrder.items.filter((_, j) => j !== i) })}
                        className="w-full py-2 rounded-xl text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                        <Icon name="Trash2" size={12} className="mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="text-white/50 text-xs mb-1 block">Итоговая сумма (₽)</label>
              <input type="number" value={editingOrder.total_price} min={0}
                onChange={e => setEditingOrder({ ...editingOrder, total_price: Number(e.target.value) })}
                className={inp} />
            </div>
            <button onClick={saveOrder} disabled={updatingId === editingOrder.id}
              className="w-full bg-veggie-lime text-veggie-dark py-3 rounded-xl font-bold text-sm disabled:opacity-50">
              {updatingId === editingOrder.id ? "Сохраняем..." : "Сохранить"}
            </button>
          </div>
        </div>
      )}

      {/* === МОДАЛ: Редактирование пользователя === */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setEditingUser(null)}>
          <div className="bg-veggie-dark border border-veggie-green/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-bold">Пользователь #{editingUser.id}</h2>
              <button onClick={() => setEditingUser(null)} className="text-white/40 hover:text-white"><Icon name="X" size={20} /></button>
            </div>
            <div className="flex flex-col gap-3 mb-4">
              <div>
                <label className="text-white/50 text-xs mb-1 block">Имя</label>
                <input value={editingUser.name || ''} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className={inp} placeholder="Имя" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Телефон</label>
                <input value={editingUser.phone} onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })} className={inp} placeholder="+7..." />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Баллы</label>
                <input type="number" value={editingUser.points} min={0} onChange={e => setEditingUser({ ...editingUser, points: Number(e.target.value) })} className={inp} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setEditingUser({ ...editingUser, is_first_order_done: !editingUser.is_first_order_done })}
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0 ${editingUser.is_first_order_done ? 'bg-veggie-lime border-veggie-lime' : 'border-white/30 bg-white/5'}`}>
                  {editingUser.is_first_order_done && <Icon name="Check" size={12} className="text-veggie-dark" />}
                </div>
                <span className="text-white/60 text-sm">Первый заказ выполнен (баллы разблокированы)</span>
              </label>
            </div>
            <button onClick={saveUser} disabled={userSaving}
              className="w-full bg-veggie-lime text-veggie-dark py-3 rounded-xl font-bold text-sm disabled:opacity-50">
              {userSaving ? "Сохраняем..." : "Сохранить"}
            </button>
          </div>
        </div>
      )}

      {/* === МОДАЛ: Редактирование отзыва === */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setEditingReview(null)}>
          <div className="bg-veggie-dark border border-veggie-green/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-bold">Отзыв #{editingReview.id}</h2>
              <button onClick={() => setEditingReview(null)} className="text-white/40 hover:text-white"><Icon name="X" size={20} /></button>
            </div>
            <div className="flex flex-col gap-3 mb-4">
              <div>
                <label className="text-white/50 text-xs mb-1 block">Имя</label>
                <input value={editingReview.name} onChange={e => setEditingReview({ ...editingReview, name: e.target.value })} className={inp} />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Город</label>
                <input value={editingReview.city} onChange={e => setEditingReview({ ...editingReview, city: e.target.value })} className={inp} />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Текст отзыва</label>
                <textarea value={editingReview.text} onChange={e => setEditingReview({ ...editingReview, text: e.target.value })}
                  rows={3} className={inp + " resize-none"} />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Рейтинг</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setEditingReview({ ...editingReview, rating: s })}
                      className={`text-2xl transition-transform hover:scale-110 ${s <= editingReview.rating ? 'text-yellow-400' : 'text-white/20'}`}>★</button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setEditingReview({ ...editingReview, approved: !editingReview.approved })}
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0 ${editingReview.approved ? 'bg-veggie-lime border-veggie-lime' : 'border-white/30 bg-white/5'}`}>
                  {editingReview.approved && <Icon name="Check" size={12} className="text-veggie-dark" />}
                </div>
                <span className="text-white/60 text-sm">Опубликован</span>
              </label>
            </div>
            <button onClick={saveReview} disabled={reviewSaving}
              className="w-full bg-veggie-lime text-veggie-dark py-3 rounded-xl font-bold text-sm disabled:opacity-50">
              {reviewSaving ? "Сохраняем..." : "Сохранить"}
            </button>
          </div>
        </div>
      )}

      {/* === МОДАЛ: Редактирование товара === */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setEditingProduct(null)}>
          <div className="bg-veggie-dark border border-veggie-green/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-bold">{editingProduct.emoji} {editingProduct.name}</h2>
              <button onClick={() => setEditingProduct(null)} className="text-white/40 hover:text-white"><Icon name="X" size={20} /></button>
            </div>
            <div className="flex flex-col gap-3 mb-4">
              <div>
                <label className="text-white/50 text-xs mb-1 block">Название</label>
                <input value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className={inp} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Цена (₽)</label>
                  <input type="number" value={editingProduct.price} min={0}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} className={inp} />
                </div>
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Ед. изм.</label>
                  <input value={editingProduct.unit} onChange={e => setEditingProduct({ ...editingProduct, unit: e.target.value })} className={inp} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Вес / фасовка</label>
                  <input value={editingProduct.weight} onChange={e => setEditingProduct({ ...editingProduct, weight: e.target.value })} className={inp} placeholder="800 г" />
                </div>
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Тип (фильтр)</label>
                  <input value={editingProduct.type} onChange={e => setEditingProduct({ ...editingProduct, type: e.target.value })} className={inp} placeholder="напр. томаты" />
                </div>
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Наличие / значок</label>
                <select value={editingProduct.badge || ''} onChange={e => setEditingProduct({ ...editingProduct, badge: e.target.value || null })}
                  className={inp + " bg-white/10"}>
                  <option value="">Нет значка (в наличии)</option>
                  {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setOverrides(prev => ({ ...prev, [editingProduct.id]: { ...(prev[editingProduct.id] || { product_id: editingProduct.id, price: null, unit: null, badge: null, image: null, type: null, weight: null, weight_kg: null }), hidden: !(prev[editingProduct.id]?.hidden ?? false) } }))}
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0 ${(overrides[editingProduct.id]?.hidden) ? 'bg-red-500 border-red-500' : 'border-white/30 bg-white/5'}`}>
                  {(overrides[editingProduct.id]?.hidden) && <Icon name="EyeOff" size={12} className="text-white" />}
                </div>
                <span className="text-white/60 text-sm">Скрыть товар из каталога</span>
              </label>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Фото товара</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ''; }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUploading}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-white/30 rounded-xl py-3 text-white/60 text-sm hover:border-veggie-lime/60 hover:text-veggie-lime transition-colors disabled:opacity-50"
                >
                  <Icon name={imageUploading ? "Loader2" : "Upload"} size={16} className={imageUploading ? "animate-spin" : ""} />
                  {imageUploading ? "Загружаю..." : "Загрузить с устройства"}
                </button>
                {editingProduct.image && (
                  <img src={editingProduct.image} alt="" className="mt-2 w-full h-28 object-cover rounded-xl" onError={e => (e.currentTarget.style.display = 'none')} />
                )}
                <input value={editingProduct.image} onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className={inp + " mt-2"} placeholder="или вставьте URL https://..." />
              </div>
            </div>
            <button onClick={() => saveProduct(editingProduct)} disabled={productSaving}
              className="w-full bg-veggie-lime text-veggie-dark py-3 rounded-xl font-bold text-sm disabled:opacity-50">
              {productSaving ? "Сохраняем..." : "Сохранить"}
            </button>
          </div>
        </div>
      )}

      {/* === МОДАЛ: Добавление нового товара === */}
      {addingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setAddingProduct(false)}>
          <div className="bg-veggie-dark border border-veggie-green/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-bold">+ Новый товар</h2>
              <button onClick={() => setAddingProduct(false)} className="text-white/40 hover:text-white"><Icon name="X" size={20} /></button>
            </div>
            <div className="flex flex-col gap-3 mb-4">
              <div>
                <label className="text-white/50 text-xs mb-1 block">Название *</label>
                <input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className={inp} placeholder="Например: Томат Черри" autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Цена (₽)</label>
                  <input type="number" value={newProduct.price} min={0} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className={inp} />
                </div>
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Ед. изм.</label>
                  <input value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })} className={inp} placeholder="кг" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Вес / фасовка</label>
                  <input value={newProduct.weight} onChange={e => setNewProduct({ ...newProduct, weight: e.target.value })} className={inp} placeholder="1кг" />
                </div>
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Тип (фильтр)</label>
                  <input value={newProduct.type} onChange={e => setNewProduct({ ...newProduct, type: e.target.value })} className={inp} placeholder="томаты" />
                </div>
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Значок</label>
                <select value={newProduct.badge || ''} onChange={e => setNewProduct({ ...newProduct, badge: e.target.value || null })} className={inp + " bg-white/10"}>
                  <option value="">Нет значка</option>
                  {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Эмодзи</label>
                <input value={newProduct.emoji} onChange={e => setNewProduct({ ...newProduct, emoji: e.target.value })} className={inp} placeholder="🛒" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Фото (URL)</label>
                <input value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} className={inp} placeholder="https://..." />
              </div>
            </div>
            <button onClick={async () => {
              if (!newProduct.name.trim()) return;
              const maxId = Math.max(...products.map(p => p.id), 2000);
              const p: Product = { id: maxId + 1, ...newProduct, weightKg: 1 };
              setProductSaving(true);
              await fetch(`${API}?resource=catalog`, {
                method: 'PUT', headers: hdrs(),
                body: JSON.stringify({ product_id: p.id, name: p.name, price: p.price, unit: p.unit, badge: p.badge, image: p.image, type: p.type, weight: p.weight, weight_kg: p.weightKg, hidden: false })
              });
              setProducts(prev => [...prev, p]);
              setProductSaved(p.id);
              setTimeout(() => setProductSaved(null), 2500);
              setNewProduct({ name: '', price: 0, unit: 'кг', weight: '1кг', type: '', badge: null, image: '', emoji: '🛒', season: 'всесезонно', weightKg: 1 });
              setAddingProduct(false);
              setProductSaving(false);
            }} disabled={productSaving || !newProduct.name.trim()}
              className="w-full bg-veggie-lime text-veggie-dark py-3 rounded-xl font-bold text-sm disabled:opacity-50">
              {productSaving ? "Сохраняем..." : "Добавить товар"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}