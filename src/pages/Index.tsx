import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import AuthModal, { User } from "@/components/AuthModal";
import Navbar from "@/components/Navbar";
import CatalogSection from "@/components/CatalogSection";
import CartDrawer from "@/components/CartDrawer";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/58f8e18c-3a1d-4321-a0d0-d558c40958c4.jpg";

const VEGETABLES = [
  { id: 1, name: "Картофель мытый", price: 55, unit: "кг", season: "осень", type: "картофель", emoji: "🥔", badge: "Премиум", weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/3dbd5d4c-347d-4306-be77-864030e67c89.jpg" },
  { id: 2, name: "Картофель Галла", price: 50, unit: "кг", season: "осень", type: "картофель", emoji: "🥔", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/0b53ae19-45d1-401c-a50f-69f9baefa75d.jpg" },
  { id: 3, name: "Картофель Колумба", price: 55, unit: "кг", season: "осень", type: "картофель", emoji: "🥔", badge: "Премиум", weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/2dc69047-7f79-4790-aaff-6796da1b4d8b.jpg" },
  { id: 4, name: "Капуста белокочанная свежая", price: 40, unit: "кг", season: "осень", type: "капуста", emoji: "🥬", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/fb2afc14-76f3-4957-a98a-46fccffd7d06.jpg" },
  { id: 5, name: "Морковь свежая", price: 38, unit: "кг", season: "осень", type: "корнеплоды", emoji: "🥕", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/files/fa17750d-f8fc-45c4-aee0-c2bf301d6679.jpg" },
  { id: 6, name: "Лук репчатый свежий", price: 50, unit: "кг", season: "осень", type: "лук", emoji: "🧅", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/f43c952c-d59f-43f3-ba60-b4e845e3d9ea.jpg" },
  { id: 7, name: "Лук репчатый Казахстан", price: 30, unit: "кг", season: "осень", type: "лук", emoji: "🧅", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/87a24ecf-e70e-44ff-8b75-dc77258e72f9.jpg" },
  { id: 8, name: "Свёкла Краснодар", price: 45, unit: "кг", season: "осень", type: "корнеплоды", emoji: "🫐", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/0f37a7bf-5b2b-40cc-ae88-a26e9e1e0c33.jpg" },
  { id: 9, name: "Помидор Малиновка", price: 250, unit: "кг", season: "лето", type: "томаты", emoji: "🍅", badge: "Хит", weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/eed9e168-bf2c-4e6c-aa37-e5305573727f.jpeg" },
  { id: 10, name: "Помидор на ветке", price: 150, unit: "кг", season: "лето", type: "томаты", emoji: "🍅", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/1f46a197-22de-4fac-8b33-16bab135c783.jpg" },
  { id: 12, name: "Помидор Парадайс", price: 220, unit: "кг", season: "лето", type: "томаты", emoji: "🍅", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/05cd7a84-8e00-40ff-9e35-a9a9ae50e85f.jpg" },
  { id: 11, name: "Огурец пупырчатый Чечня", price: 150, unit: "кг", season: "лето", type: "огурцы", emoji: "🥒", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/3a013d01-ce48-4918-893a-f2b121197ad6.jpg" },
  { id: 14, name: "Огурец пупырчатый высший сорт", price: 180, unit: "кг", season: "лето", type: "огурцы", emoji: "🥒", badge: "Хит", weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/ff8b7607-7013-4833-82d8-20b1b4606a94.jpg" },
  { id: 15, name: "Огурец пупырчатый Кубань", price: 110, unit: "кг", season: "лето", type: "огурцы", emoji: "🥒", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/1e585955-87f9-452f-888e-b9dff0b9ef99.jpg" },
  { id: 13, name: "Огурец гладкий", price: 170, unit: "кг", season: "лето", type: "огурцы", emoji: "🥒", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/35de6ab4-856a-4bb1-984a-179054b55956.jpg" },
  { id: 126, name: "Чеснок", price: 280, unit: "кг", season: "осень", type: "чеснок", emoji: "🧄", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/42e6134c-6301-4e0b-9f01-0f3ca4992c96.jpg" },
];

const FRUITS = [
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
  { id: 120, name: "Виноград зелёный", price: 400, unit: "кг", season: "лето", type: "виноград", emoji: "🍇", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/e297dbd9-367c-4e7e-8566-dec490f4005f.jpg" },
  { id: 121, name: "Виноград Кишмиш", price: 500, unit: "кг", season: "лето", type: "виноград", emoji: "🍇", badge: "Хит", weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/04d46d49-1d9d-4f90-858f-6529a20e9b1d.jpg" },
  { id: 122, name: "Киви", price: 240, unit: "кг", season: "зима", type: "экзотика", emoji: "🥝", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/21e5e478-abd2-474d-a69b-57a1afeb8efa.jpg" },
  { id: 123, name: "Бананы", price: 200, unit: "кг", season: "всесезонно", type: "экзотика", emoji: "🍌", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/f1ea2d7e-9421-41af-870f-f5fda8fa74d2.jpg" },
  { id: 124, name: "Ананас", price: 700, unit: "шт", season: "всесезонно", type: "экзотика", emoji: "🍍", badge: null, weight: "1шт", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/cf486d6c-b07f-4475-8e0b-5ad338f9d4eb.jpg" },
  { id: 125, name: "Лимон", price: 350, unit: "кг", season: "всесезонно", type: "цитрусы", emoji: "🍋", badge: null, weight: "100г", weightKg: 0.1, minWeightG: 100, pricePerKg: 350, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/1b019d83-7dff-436c-9485-ac15228b2727.jpg" },
  { id: 127, name: "Имбирь", price: 500, unit: "кг", season: "всесезонно", type: "специи", emoji: "🫚", badge: null, weight: "100г", weightKg: 0.1, minWeightG: 100, pricePerKg: 500, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/eacc26e4-2549-49c7-8736-035a493ebfc5.jpg" },
];

const BERRIES = [
  { id: 201, name: "Клубника", price: 380, unit: "кг", season: "лето", type: "ягоды", emoji: "🍓", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/44e96e8d-07f3-41ce-8e27-317b96d7e983.jpg" },
  { id: 202, name: "Арбуз", price: 100, unit: "кг", season: "лето", type: "ягоды", emoji: "🍉", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/24ba02fb-6f23-425a-9712-df87d2d19810.jpg" },
];

const JUICES = [
  { id: 301, name: "Гранатовый сок", price: 150, unit: "л", season: "всесезонно", type: "соки", emoji: "🧃", badge: null, weight: "1л", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/27b44605-bf85-4a79-8bed-96fa0b0e9bee.jpg" },
];

const MUSHROOMS = [
  { id: 401, name: "Шампиньоны", price: 200, unit: "500г", season: "всесезонно", type: "грибы", emoji: "🍄", badge: null, weight: "500г", weightKg: 0.5, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/da021203-9133-4526-883c-fc5259cb330f.jpg" },
];

const GREENS = [
  { id: 501, name: "Лук зелёный", price: 100, unit: "150г", season: "всесезонно", type: "зелень", emoji: "🌿", badge: null, weight: "150г", weightKg: 0.15, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/b149c52e-2be0-435c-ad60-5ab6eeff4949.jpg" },
  { id: 502, name: "Укроп", price: 100, unit: "150г", season: "всесезонно", type: "зелень", emoji: "🌿", badge: null, weight: "150г", weightKg: 0.15, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/af4217eb-8531-4c84-9d69-174509a26f14.jpg" },
  { id: 503, name: "Петрушка", price: 100, unit: "150г", season: "всесезонно", type: "зелень", emoji: "🌿", badge: null, weight: "150г", weightKg: 0.15, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/57746e8d-1294-47fa-8e3f-5ceb34923f0d.jpg" },
  { id: 504, name: "Редиска", price: 200, unit: "кг", season: "лето", type: "зелень", emoji: "🌰", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/af50cd41-2e37-4b5b-afa3-770d535a9e4a.jpg" },
];

const EGGS = [
  { id: 601, name: "Яйцо домашнее", price: 150, unit: "упак", season: "всесезонно", type: "яйца", emoji: "🥚", badge: null, weight: "10шт", weightKg: 0.6, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/93ea36d9-51c0-4187-a153-edd5dcabcb3a.jpg" },
  { id: 602, name: "Яйцо инкубаторское 2 категория", price: 227, unit: "упак", season: "всесезонно", type: "яйца", emoji: "🥚", badge: null, weight: "30шт", weightKg: 1.8, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/70ebee28-7c7b-4c90-86c2-d59abdb0ad04.jpg" },
];

const MEAT = [
  { id: 710, name: "Свинина на кости свежая", price: 300, unit: "кг", season: "всесезонно", type: "свинина", emoji: "🥩", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/533fc478-d5a4-4852-baa3-f8f30d550eb0.jpg" },
];

const VEG_TYPES = ["все", "картофель", "капуста", "корнеплоды", "лук", "томаты", "огурцы", "чеснок", "специи"];
const FRUIT_TYPES = ["все", "яблоки", "груши", "цитрусы", "сливы", "виноград", "экзотика"];
const BERRY_TYPES = ["все", "ягоды"];
const JUICE_TYPES = ["все", "соки"];
const MUSHROOM_TYPES = ["все", "грибы"];
const GREEN_TYPES = ["все", "зелень"];
const EGG_TYPES = ["все", "яйца"];
const MEAT_TYPES = ["все", "птица", "говядина", "свинина", "фарш"];

const DAIRY = [
  { id: 801, name: "Молоко Вкус Облако 3.2%", price: 82, unit: "л", season: "всесезонно", type: "молоко", emoji: "🥛", badge: null, weight: "1 л", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/fc30e904-a250-4e7a-803f-d096683b1402.jpg" },
  { id: 802, name: "Сметана Сочные Луга", price: 88, unit: "уп", season: "всесезонно", type: "кисломолочное", emoji: "🥛", badge: null, weight: "300 г", weightKg: 0.3, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/0b55606c-fb21-4d72-9ce9-c4819b1bea5a.jpg" },
  { id: 803, name: "Творог домашний", price: 0, unit: "500г", season: "всесезонно", type: "творог", emoji: "🧀", badge: null, weight: "500г", weightKg: 0.5, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/bcdf791f-7baf-4e6b-b7c6-e105d69380c3.jpg" },
  { id: 804, name: "Кефир домашний", price: 0, unit: "л", season: "всесезонно", type: "кисломолочное", emoji: "🥛", badge: null, weight: "1л", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/ad4feff8-9acd-417a-9f05-ead3a10e51a5.jpg" },
  { id: 805, name: "Масло сливочное", price: 0, unit: "200г", season: "всесезонно", type: "масло", emoji: "🧈", badge: null, weight: "200г", weightKg: 0.2, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/1cc03daf-8d1e-4780-a8c7-3a904a1f2dd4.jpg" },
  { id: 806, name: "Сыр домашний", price: 0, unit: "кг", season: "всесезонно", type: "сыр", emoji: "🧀", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/4e9070df-21c7-47f6-8451-f52dc5a6e631.jpg" },
  { id: 807, name: "Сыр сливочный творожный", price: 0, unit: "уп", season: "всесезонно", type: "сыр", emoji: "🧀", badge: null, weight: "", weightKg: 0.2, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/a7cb72a6-0230-4a89-b2b3-dcda45809202.jpg" },
];
const DAIRY_TYPES = ["все", "молоко", "кисломолочное", "творог", "масло", "сыр"];

const SAUSAGE = [
  { id: 901, name: "Колбаса варёная", price: 0, unit: "кг", season: "всесезонно", type: "варёная", emoji: "🌭", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/3a352e6a-6b72-46f2-92ed-f1455f608ce6.jpg" },
  { id: 902, name: "Колбаса копчёная", price: 0, unit: "кг", season: "всесезонно", type: "копчёная", emoji: "🌭", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/ebcef16a-51f5-4021-ab67-e59a20cb593f.jpg" },
  { id: 903, name: "Сосиски домашние", price: 0, unit: "кг", season: "всесезонно", type: "сосиски", emoji: "🌭", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/f9077a1a-5342-4589-9696-708429305cba.jpg" },
  { id: 904, name: "Сардельки", price: 0, unit: "кг", season: "всесезонно", type: "сосиски", emoji: "🌭", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/0b36af7b-d91a-49f2-8017-e81c70eab10b.jpg" },
  { id: 905, name: "Ветчина домашняя", price: 0, unit: "кг", season: "всесезонно", type: "ветчина", emoji: "🥩", badge: null, weight: "1кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/98da435d-71ee-4b4a-ad60-0ddc87c7dde9.jpg" },
];
const SAUSAGE_TYPES = ["все", "варёная", "копчёная", "сосиски", "ветчина"];

const HOUSEHOLD = [
  { id: 1001, name: "Биолан Color капсулы для стирки 35 шт", price: 428, unit: "уп", season: "всесезонно", type: "стирка", emoji: "🧺", badge: null, weight: "35 капсул", weightKg: 0.5, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/8b0ea665-e056-4189-a570-aa8dafce4bba.jpg" },
  { id: 1002, name: "Влажные салфетки для детей 200 шт", price: 99, unit: "уп", season: "всесезонно", type: "салфетки", emoji: "🧻", badge: null, weight: "200 шт", weightKg: 0.3, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/1b71cad8-efca-4674-b743-b9900f396d28.jpg" },
  { id: 1003, name: "Туалетная бумага 3 слоя 8 шт", price: 149, unit: "уп", season: "всесезонно", type: "бумага", emoji: "🧻", badge: null, weight: "8 рулонов", weightKg: 0.8, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/b0d9f5d9-b5c4-4acf-84f5-6aa509d5bd87.jpg" },
];
const HOUSEHOLD_TYPES = ["все", "стирка", "салфетки", "бумага"];

const GROCERY = [
  { id: 1101, name: "Мука пшеничная высший сорт 5 кг", price: 254, unit: "уп", season: "всесезонно", type: "мука", emoji: "🌾", badge: null, weight: "5 кг", weightKg: 5, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/8a64f203-60de-40e5-b5ce-41e2be74d9ee.jpg" },
  { id: 1102, name: "Булгур крупа пшеничная 800 г", price: 135, unit: "уп", season: "всесезонно", type: "крупы", emoji: "🌾", badge: null, weight: "800 г", weightKg: 0.8, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/951f1306-a64f-4d12-b328-d430a717bcbc.jpg" },
  { id: 1103, name: "Смесь бобовых 800 г", price: 88, unit: "уп", season: "всесезонно", type: "крупы", emoji: "🫘", badge: null, weight: "800 г", weightKg: 0.8, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/a7855c6d-c5e7-44c4-8c2a-eb30be522e06.jpg" },
  { id: 1104, name: "Рис шлифованный 2 сорт 900 г", price: 99, unit: "уп", season: "всесезонно", type: "крупы", emoji: "🍚", badge: null, weight: "900 г", weightKg: 0.9, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/b501d4e5-0ebc-4ff5-9914-8ab73c2e07e2.jpg" },
  { id: 1105, name: "Майонез Calve Лёгкий 800 г", price: 180, unit: "уп", season: "всесезонно", type: "соусы", emoji: "🥫", badge: null, weight: "800 г", weightKg: 0.8, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/465bd9cc-280c-4b63-a4b8-cdeeef27b4b9.jpg" },
  { id: 1106, name: "Чай TANAY 100 пакетов", price: 0, unit: "уп", season: "всесезонно", type: "чай", emoji: "🍵", badge: null, weight: "100 пак", weightKg: 0.2, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/bucket/cf05b900-ee74-4322-bb77-8bef4ef410de.jpg" },
];
const GROCERY_TYPES = ["все", "мука", "крупы", "соусы", "чай"];

const READYFOOD = [
  { id: 1201, name: "Морковь по-корейски 500 г", price: 85, unit: "уп", season: "всесезонно", type: "салаты", emoji: "🥕", badge: null, weight: "500 г", weightKg: 0.5, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/3197f53a-4d44-422c-9779-cd171c8082b4.jpg" },
  { id: 1202, name: "Капуста квашеная с морковью 1 кг", price: 125, unit: "пластиковая тара", season: "всесезонно", type: "соленья", emoji: "🥬", badge: null, weight: "1 кг", weightKg: 1, image: "https://cdn.poehali.dev/projects/7e63b123-cce1-42dc-b476-af41b89879ce/files/5a9179e7-bc9e-4d08-a700-1652f62aacf1.jpg" },
];
const READYFOOD_TYPES = ["все", "салаты", "соленья"];

const PRODUCTS = [...VEGETABLES, ...FRUITS, ...BERRIES, ...JUICES, ...MUSHROOMS, ...GREENS, ...EGGS, ...MEAT, ...DAIRY, ...SAUSAGE, ...HOUSEHOLD, ...GROCERY, ...READYFOOD];

const REVIEWS = [
  { id: 1, name: "Анна К.", text: "Уже третий месяц заказываю каждую неделю! Овощи всегда свежайшие, как с грядки. Брокколи и шпинат — просто объедение!", rating: 5, avatar: "👩‍🦰", location: "Уфа" },
  { id: 2, name: "Михаил Р.", text: "Отличный сервис! Фильтр по сезонности помог найти именно то, что сейчас вкуснее всего. Доставка по предзаказу — очень удобно!", rating: 5, avatar: "👨‍💼", location: "Уфа" },
  { id: 3, name: "Светлана П.", text: "Беру органические овощи для всей семьи. Дети едят с удовольствием! Цены адекватные, особенно на сезонное.", rating: 5, avatar: "👩‍👧", location: "Уфа" },
];

const FAQ_ITEMS = [
  { q: "Как работает доставка?", a: "Доставляем в течение 2–3 часов после оформления заказа. Просто оформите заказ — и свежие продукты приедут к вам быстро и удобно." },
  { q: "Откуда берутся овощи?", a: "Работаем напрямую с фермерами Подмосковья и соседних регионов. Все овощи проходят контроль качества перед отправкой." },
  { q: "Есть ли минимальная сумма заказа?", a: "Минимальный заказ — 800 рублей. При заказе от 2000 рублей доставка бесплатная." },
  { q: "Что если товар мне не понравится?", a: "Гарантируем свежесть! Если вы недовольны качеством — вернём деньги или заменим товар без лишних вопросов." },
  { q: "Как выбрать сезонные овощи?", a: "Используйте фильтр по сезонности в каталоге. Сезонные овощи вкуснее, питательнее и дешевле — они в приоритете." },
];

const ARTICLES = [
  {
    id: 1, emoji: "🥒", title: "Полезные советы по выращиванию огурцов", tag: "Выращивание",
    intro: "Огурцы — популярная овощная культура, которая при правильном уходе даёт богатый урожай. Разберём ключевые рекомендации для успешного выращивания.",
    sections: [
      { title: "1. Выбор места и подготовка почвы", text: "Огурцы любят тепло, свет (но без палящего солнца в полдень) и плодородную рыхлую почву с нейтральной или слабокислой реакцией (pH 6–7). Осенью перекопайте участок и внесите органические удобрения (перегной, компост). Весной снова разрыхлите, добавьте комплексные минеральные удобрения. Идеально подходят «тёплые грядки» — они прогреваются быстрее." },
      { title: "2. Посев и высадка рассады", text: "В открытый грунт — когда почва прогреется и минует угроза заморозков. Для рассады — за 30–35 дней до высадки. Расстояние между растениями — 50–60 см, между рядами — 100–120 см. Семена сажают острым краем вверх — из него прорастают корни." },
      { title: "3. Полив", text: "Используйте тёплую воду (+23…+25°C). В период роста поливайте каждые 6–7 дней, после начала плодоношения — каждые 3–4 дня. На куст — не менее 2 л воды. Лучшее время для полива — вечер. Избегайте сильного напора воды." },
      { title: "4. Подкормка", text: "За сезон — не менее 5 подкормок. Органические: перегной, компост, перепревший навоз. Минеральные: азот (для роста), фосфор (для корней), калий (для плодоношения). Народные средства: раствор молока 1:2 каждые 2 недели; зольный раствор (1 стакан золы на ведро воды)." },
      { title: "5. Мульчирование", text: "Мульча сохраняет влагу, сдерживает сорняки и улучшает структуру почвы. Материалы: перепревший навоз, опилки, торф, солома. Слой мульчи не должен касаться стеблей. В жару тёмную мульчу прикройте светлым материалом." },
      { title: "6. Формирование растений", text: "Удаляйте нижние побеги, касающиеся земли. Формируйте в один стебель или прищипывайте после 5–6 листа для ветвления. Укрепляйте корневую систему: прижмите стебель к земле и присыпьте влажной почвой." },
      { title: "7. Опыление и защита от болезней", text: "При недостатке насекомых проводите искусственное опыление мягкой кисточкой. Соблюдайте севооборот, хорошие предшественники: лук, горох, капуста, свёкла. Обрабатывайте почву «Фитоспорином» перед посадкой." },
      { title: "8. Сбор урожая и соседство", text: "Собирайте огурцы регулярно — чем чаще, тем выше урожайность. Не дожидайтесь максимального размера плодов. Хорошие соседи: фасоль, горох, капуста, кукуруза, салат. Плохие соседи: томаты." },
    ],
  },
];

const TIPS = [
  {
    id: 1, emoji: "🥕", title: "Как выбрать свежую морковь",
    tag: "Выбор продуктов",
    text: "Свежая морковь должна быть твёрдой, без трещин и мягких пятен. Яркий оранжевый цвет говорит о высоком содержании бета-каротина. Хвостик должен быть зелёным, а не засохшим — это признак недавней уборки.",
  },
  {
    id: 2, emoji: "🍅", title: "Помидоры: как хранить правильно",
    tag: "Хранение",
    text: "Никогда не кладите помидоры в холодильник — холод разрушает вкус и аромат. Храните при комнатной температуре подальше от прямых солнечных лучей. Спелые томаты лучше съесть в течение 2–3 дней.",
  },
  {
    id: 3, emoji: "🥦", title: "Почему стоит есть сезонные овощи",
    tag: "Польза",
    text: "Сезонные овощи содержат в 2–3 раза больше витаминов, чем выращенные в теплице зимой. Они не проходят долгую транспортировку и не обрабатываются консервантами. Плюс — они значительно вкуснее и дешевле.",
  },
  {
    id: 4, emoji: "🧅", title: "Лук: польза для иммунитета",
    tag: "Польза",
    text: "Лук содержит кверцетин — мощный антиоксидант, который укрепляет иммунитет и борется с воспалениями. Особенно полезен в сыром виде. Добавляйте в салаты, маринады и закуски для максимальной пользы.",
  },
  {
    id: 5, emoji: "🥒", title: "Огурцы: освежают и очищают",
    tag: "Польза",
    text: "Огурцы на 95% состоят из воды и отлично утоляют жажду в жаркий день. Они содержат калий, который полезен для сердца, и клетчатку для нормальной работы кишечника. Лучше есть со шкуркой — в ней больше всего питательных веществ.",
  },
  {
    id: 6, emoji: "🥔", title: "Картофель: как варить с пользой",
    tag: "Приготовление",
    text: "Варите картофель в мундире — так сохраняется максимум витамина C и калия. Не оставляйте очищенный картофель в воде надолго: витамины вымываются. Молодой картофель особенно полезен — в нём много антиоксидантов.",
  },
];

const NAV_LINKS = ["Каталог", "Доставка", "О сервисе", "Советы", "Отзывы", "FAQ", "Контакты"];

type CartItem = { id: number; name: string; price: number; emoji: string; qty: number; weightKg: number; minWeightG?: number; pricePerKg?: number; grams?: number };

export default function Index() {
  const [activeSection, setActiveSection] = useState<"vegetables" | "fruits" | "berries" | "juices" | "mushrooms" | "greens" | "eggs" | "meat" | "dairy" | "sausage" | "household" | "grocery" | "readyfood">("vegetables");
  const [openArticle, setOpenArticle] = useState<number | null>(null);
  const [activeType, setActiveType] = useState("все");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });
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
  const [orders, setOrders] = useState<Array<{id: number; address: string; items: Array<{name: string; quantity: number; price: number}>; total_price: number; status: string; created_at: string}>>([]);
  const [transactions, setTransactions] = useState<Array<{id: number; points: number; reason: string; created_at: string}>>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profileTab, setProfileTab] = useState<'orders' | 'points'>('orders');
  const [editingOrder, setEditingOrder] = useState<{id: number; address: string; comment: string; items: Array<{name: string; quantity: number; price: number}>} | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [orderName, setOrderName] = useState(() => localStorage.getItem('order_name') || '');
  const [orderPhone, setOrderPhone] = useState(() => localStorage.getItem('order_phone') || '');
  const [orderAddress, setOrderAddress] = useState(() => localStorage.getItem('order_address') || '');
  const [orderFlat, setOrderFlat] = useState(() => localStorage.getItem('order_flat') || '');
  const [orderTime, setOrderTime] = useState<'morning' | 'evening'>('morning');
  const [orderComment, setOrderComment] = useState('');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [orderStep, setOrderStep] = useState<1 | 2>(1);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [dbReviews, setDbReviews] = useState<Array<{id: number; name: string; city: string; text: string; rating: number; avatar: string}>>([]);
  const [reviewForm, setReviewForm] = useState(false);
  const [catalogOverrides, setCatalogOverrides] = useState<Record<number, {price?: number; unit?: string; badge?: string | null; image?: string; type?: string; weight?: string; weight_kg?: number; hidden?: boolean; name?: string}>>({});
  const [extraProducts, setExtraProducts] = useState<typeof PRODUCTS>([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewStatus, setReviewStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    fetch('https://functions.poehali.dev/d8e8eac1-b7f3-41b8-b041-69e6d80a1c03?resource=reviews')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.reviews) setDbReviews(data.reviews); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('https://functions.poehali.dev/d8e8eac1-b7f3-41b8-b041-69e6d80a1c03?resource=catalog')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.overrides?.length) return;
        const map: Record<number, {price?: number; unit?: string; badge?: string | null; image?: string; type?: string; weight?: string; weight_kg?: number; hidden?: boolean; name?: string}> = {};
        const knownIds = new Set(PRODUCTS.map((p: {id: number}) => p.id));
        const extras: typeof PRODUCTS = [];
        for (const o of data.overrides) {
          map[o.product_id] = o;
          if (!knownIds.has(o.product_id) && !o.hidden && o.name) {
            extras.push({ id: o.product_id, name: o.name, price: o.price ?? 0, unit: o.unit ?? 'уп', season: 'всесезонно', type: o.type ?? 'разное', emoji: '🛒', badge: o.badge ?? null, weight: o.weight ?? '', weightKg: o.weight_kg ?? 1, image: o.image ?? '' });
          }
        }
        setCatalogOverrides(map);
        setExtraProducts(extras);
      })
      .catch(() => {});
  }, []);

  const submitReview = async () => {
    if (!reviewName.trim() || !reviewText.trim()) return;
    setReviewStatus('loading');
    try {
      const res = await fetch('https://functions.poehali.dev/d8e8eac1-b7f3-41b8-b041-69e6d80a1c03?resource=reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: reviewName, city: reviewCity || 'Уфа', text: reviewText, rating: reviewRating }),
      });
      if (res.ok) {
        setReviewStatus('success');
        setReviewName(''); setReviewCity(''); setReviewText(''); setReviewRating(5);
        setTimeout(() => { setReviewStatus('idle'); setReviewForm(false); }, 2500);
      } else setReviewStatus('error');
    } catch { setReviewStatus('error'); }
  };

  useEffect(() => {
    if (!user) return;
    if (!orderName && user.name) setOrderName(user.name);
    if (!orderPhone && user.phone) setOrderPhone(user.phone);
    fetch(`https://functions.poehali.dev/d8e8eac1-b7f3-41b8-b041-69e6d80a1c03?user_id=${user.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const updated = { ...user, points: data.points ?? user.points, is_first_order_done: data.is_first_order_done ?? user.is_first_order_done };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => { localStorage.setItem('order_name', orderName); }, [orderName]);
  useEffect(() => { localStorage.setItem('order_phone', orderPhone); }, [orderPhone]);
  useEffect(() => { localStorage.setItem('order_address', orderAddress); }, [orderAddress]);
  useEffect(() => { localStorage.setItem('order_flat', orderFlat); }, [orderFlat]);

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
  const applyOverrides = (arr: typeof PRODUCTS) =>
    arr.filter(p => !catalogOverrides[p.id]?.hidden).map(p => {
      const o = catalogOverrides[p.id];
      if (!o) return p;
      return { ...p, name: o.name || p.name, price: o.price ?? p.price, unit: o.unit ?? p.unit, badge: o.badge !== undefined ? o.badge : p.badge, image: o.image || p.image, type: o.type ?? p.type, weight: o.weight ?? p.weight, weightKg: o.weight_kg ?? p.weightKg };
    });

  const SECTION_MAP = {
    vegetables: applyOverrides(VEGETABLES),
    fruits: applyOverrides(FRUITS),
    berries: applyOverrides(BERRIES),
    juices: applyOverrides(JUICES),
    mushrooms: applyOverrides(MUSHROOMS),
    greens: applyOverrides(GREENS),
    eggs: applyOverrides(EGGS),
    meat: applyOverrides(MEAT),
    dairy: applyOverrides(DAIRY),
    sausage: applyOverrides(SAUSAGE),
    household: applyOverrides(HOUSEHOLD),
    grocery: applyOverrides(GROCERY),
    readyfood: applyOverrides(READYFOOD),
  };
  const TYPES_MAP = {
    vegetables: VEG_TYPES,
    fruits: FRUIT_TYPES,
    berries: BERRY_TYPES,
    juices: JUICE_TYPES,
    mushrooms: MUSHROOM_TYPES,
    greens: GREEN_TYPES,
    eggs: EGG_TYPES,
    meat: MEAT_TYPES,
    dairy: DAIRY_TYPES,
    sausage: SAUSAGE_TYPES,
    household: HOUSEHOLD_TYPES,
    grocery: GROCERY_TYPES,
    readyfood: READYFOOD_TYPES,
  };
  const allProducts = [...PRODUCTS, ...extraProducts];
  const currentProducts = isSearching ? applyOverrides(allProducts) : (SECTION_MAP[activeSection] ?? applyOverrides(VEGETABLES));
  const currentTypes = TYPES_MAP[activeSection] ?? VEG_TYPES;
  const filteredProducts = currentProducts.filter(p => {
    const matchesType = isSearching || activeType === "все" || p.type === activeType;
    const matchesSearch = !isSearching || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalWeight = cart.reduce((s, i) => s + i.weightKg * i.qty, 0);
  const freeDelivery = totalPrice >= 1500;

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      const isGram = !!product.minWeightG;
      return [...prev, {
        id: product.id, name: product.name,
        price: isGram ? Math.round((product.pricePerKg ?? product.price) * (product.minWeightG! / 1000)) : product.price,
        emoji: product.emoji, qty: 1, weightKg: product.weightKg,
        minWeightG: product.minWeightG, pricePerKg: product.pricePerKg ?? (isGram ? product.price : undefined),
        grams: isGram ? product.minWeightG : undefined,
      }];
    });
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };
  const updateGrams = (id: number, grams: number) => {
    setCart(prev => prev.map(i => {
      if (i.id !== id || !i.pricePerKg) return i;
      const g = Math.max(i.minWeightG ?? 100, grams);
      return { ...i, grams: g, price: Math.round(i.pricePerKg * g / 1000), weightKg: g / 1000 };
    }));
  };

  const scrollTo = (section: string) => {
    const map: Record<string, string> = {
      "Каталог": "catalog", "Доставка": "delivery", "О сервисе": "about",
      "Советы": "tips", "Отзывы": "reviews", "FAQ": "faq", "Контакты": "contacts"
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

  const logout = () => { setUser(null); localStorage.removeItem('user'); setProfileOpen(false); setOrders([]); };

  const openProfile = async () => {
    setProfileOpen(true);
    if (!user) return;
    setOrdersLoading(true);
    try {
      const res = await fetch(`https://functions.poehali.dev/d8e8eac1-b7f3-41b8-b041-69e6d80a1c03?user_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setTransactions(data.transactions || []);
      }
    } catch { /* ignore */ }
    setOrdersLoading(false);
  };

  const handleOrder = async () => {
    if (!orderName.trim() || !orderPhone.trim() || !orderAddress.trim()) return;
    setOrderStatus('loading');
    const delivery = freeDelivery ? 0 : 300;
    const totalBeforeDiscount = totalPrice + delivery;
    const discount = Math.min(pointsToUse, user?.points ?? 0, totalBeforeDiscount);
    const total = totalBeforeDiscount - discount;
    const timeLabel = orderTime === 'morning' ? 'Утро (до 12:00)' : 'Вечер (с 18:00)';
    const address = orderFlat ? `${orderAddress}, кв. ${orderFlat}` : orderAddress;
    const items = cart.map(i => ({ name: i.name, quantity: i.qty, price: i.price }));
    const comment = `⏰ ${timeLabel}${orderComment ? ` | 💬 ${orderComment}` : ''}${discount > 0 ? ` | ⭐ Списано ${discount} баллов` : ''}`;
    try {
      const res = await fetch('https://functions.poehali.dev/d8e8eac1-b7f3-41b8-b041-69e6d80a1c03', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || null,
          name: orderName,
          phone: orderPhone,
          address,
          comment,
          items,
          total_price: total,
          points_used: discount,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (user) {
          const updatedUser = { ...user, points: data.points, is_first_order_done: data.is_first_order_done ?? user.is_first_order_done };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        setOrderStatus('success');
        setCart([]);
        setPointsToUse(0);
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-veggie-lime/20 flex items-center justify-center text-2xl">👤</div>
              <div>
                <p className="text-white font-semibold">{user.name}</p>
                <p className="text-white/50 text-sm">{user.phone}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <div>
                <label className="text-white/50 text-xs mb-1 block">Имя для заказа</label>
                <input
                  type="text"
                  value={orderName}
                  onChange={e => { setOrderName(e.target.value); localStorage.setItem('order_name', e.target.value); }}
                  placeholder="Как к вам обращаться"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-veggie-green transition-colors"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Адрес доставки</label>
                <input
                  type="text"
                  value={orderAddress}
                  onChange={e => { setOrderAddress(e.target.value); localStorage.setItem('order_address', e.target.value); }}
                  placeholder="Улица, дом"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-veggie-green transition-colors"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1 block">Квартира / офис</label>
                <input
                  type="text"
                  value={orderFlat}
                  onChange={e => { setOrderFlat(e.target.value); localStorage.setItem('order_flat', e.target.value); }}
                  placeholder="Необязательно"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-veggie-green transition-colors"
                />
              </div>
            </div>
            <div className="bg-veggie-lime/10 border border-veggie-lime/30 rounded-xl p-4 mb-3 flex items-center gap-4">
              <span className="text-3xl">⭐</span>
              <div>
                <p className="text-veggie-lime text-2xl font-bold">{user.points} баллов</p>
                <p className="text-white/50 text-sm">1 балл = 1 ₽ скидки</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-3">
              <p className="text-white/60 text-xs leading-relaxed">
                💡 Бонусы зачисляются <span className="text-veggie-lime font-medium">1-го числа каждого месяца</span>:<br />
                от 1 ₽ до 10 000 ₽ — <span className="text-veggie-lime font-medium">1%</span><br />
                от 10 000 ₽ до 20 000 ₽ — <span className="text-veggie-lime font-medium">3%</span><br />
                от 20 000 ₽ — <span className="text-veggie-lime font-medium">10%</span>
              </p>
            </div>
            {!user.is_first_order_done ? (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 mb-4 flex items-center gap-2">
                <span>🔒</span>
                <p className="text-orange-400 text-xs">Баллы можно тратить после первого заказа</p>
              </div>
            ) : (
              <div className="bg-veggie-lime/10 border border-veggie-lime/20 rounded-xl p-3 mb-4 flex items-center gap-2">
                <span>🔓</span>
                <p className="text-veggie-lime text-xs">Баллы разблокированы — можно тратить при заказе</p>
              </div>
            )}


            <div className="flex bg-white/5 rounded-xl p-1 mb-3 gap-1">
              <button onClick={() => setProfileTab('orders')} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${profileTab === 'orders' ? 'bg-veggie-green text-white' : 'text-white/50 hover:text-white'}`}>Заказы</button>
              <button onClick={() => setProfileTab('points')} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${profileTab === 'points' ? 'bg-veggie-green text-white' : 'text-white/50 hover:text-white'}`}>Баллы</button>
            </div>

            <div className="mb-4">
              {ordersLoading ? (
                <div className="text-center py-4 text-white/40 text-sm">Загрузка...</div>
              ) : profileTab === 'orders' ? (
                orders.length === 0 ? (
                  <div className="text-center py-4 text-white/30 text-sm">Заказов пока нет</div>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/50 text-xs">#{order.id} · {new Date(order.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-veggie-lime text-sm font-bold">{order.total_price} ₽</span>
                            {order.status === 'new' && (
                              <button
                                onClick={() => setEditingOrder({ id: order.id, address: order.address || '', comment: '', items: order.items })}
                                className="text-white/30 hover:text-veggie-lime transition-colors"
                                title="Изменить заказ"
                              >
                                <Icon name="Pencil" size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="mb-1">
                          {order.status === 'new' && <span className="inline-flex items-center gap-1 text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full">🕐 Новый</span>}
                          {order.status === 'processing' && <span className="inline-flex items-center gap-1 text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">⚙️ В обработке</span>}
                          {order.status === 'delivering' && <span className="inline-flex items-center gap-1 text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">🚚 Доставляется</span>}
                          {order.status === 'done' && <span className="inline-flex items-center gap-1 text-[10px] bg-veggie-lime/20 text-veggie-lime px-2 py-0.5 rounded-full">✅ Выполнен</span>}
                          {order.status === 'cancelled' && <span className="inline-flex items-center gap-1 text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">❌ Отменён</span>}
                        </div>
                        {order.address && <p className="text-white/40 text-xs mb-1">📍 {order.address}</p>}
                        <div className="text-white/60 text-xs">
                          {order.items.slice(0, 3).map((item, i) => (
                            <span key={i}>{item.name} ×{item.quantity}{i < Math.min(order.items.length, 3) - 1 ? ', ' : ''}</span>
                          ))}
                          {order.items.length > 3 && <span className="text-white/30"> +ещё {order.items.length - 3}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                transactions.length === 0 ? (
                  <div className="text-center py-4 text-white/30 text-sm">Начислений пока нет</div>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {transactions.map(tx => (
                      <div key={tx.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-xs">{tx.reason}</p>
                          <p className="text-white/40 text-xs">{new Date(tx.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <span className="text-veggie-lime font-bold text-sm">+{tx.points} ⭐</span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            <button onClick={logout} className="w-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 py-2.5 rounded-xl text-sm transition-colors">
              Выйти
            </button>
          </div>
        </div>
      )}

      {editingOrder && user && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setEditingOrder(null)}>
          <div className="bg-veggie-dark border border-veggie-green/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-lg font-bold text-white">Изменить заказ #{editingOrder.id}</h2>
              <button onClick={() => setEditingOrder(null)} className="text-white/40 hover:text-white transition-colors"><Icon name="X" size={20} /></button>
            </div>
            <label className="text-white/60 text-xs mb-1 block">Адрес доставки</label>
            <input
              value={editingOrder.address}
              onChange={e => setEditingOrder({ ...editingOrder, address: e.target.value })}
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-veggie-lime/60 transition-colors mb-3"
            />
            <label className="text-white/60 text-xs mb-1 block">Комментарий</label>
            <textarea
              value={editingOrder.comment}
              onChange={e => setEditingOrder({ ...editingOrder, comment: e.target.value })}
              rows={2}
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-veggie-lime/60 transition-colors mb-3 resize-none"
            />
            <div className="mb-4">
              <p className="text-white/60 text-xs mb-2">Товары:</p>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {editingOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <span className="text-white/70 text-xs flex-1">{item.name}</span>
                    <button onClick={() => setEditingOrder({ ...editingOrder, items: editingOrder.items.map((it, j) => j === i ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it) })} className="text-white/40 hover:text-white w-5 h-5 flex items-center justify-center"><Icon name="Minus" size={10} /></button>
                    <span className="text-white text-xs w-4 text-center">{item.quantity}</span>
                    <button onClick={() => setEditingOrder({ ...editingOrder, items: editingOrder.items.map((it, j) => j === i ? { ...it, quantity: it.quantity + 1 } : it) })} className="text-white/40 hover:text-white w-5 h-5 flex items-center justify-center"><Icon name="Plus" size={10} /></button>
                    <button onClick={() => setEditingOrder({ ...editingOrder, items: editingOrder.items.filter((_, j) => j !== i) })} className="text-red-400/60 hover:text-red-400 ml-1"><Icon name="Trash2" size={10} /></button>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={async () => {
                setEditSaving(true);
                const res = await fetch('https://functions.poehali.dev/d8e8eac1-b7f3-41b8-b041-69e6d80a1c03', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ order_id: editingOrder.id, user_id: user.id, address: editingOrder.address, comment: editingOrder.comment, items: editingOrder.items }),
                });
                if (res.ok) {
                  setOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...o, address: editingOrder.address, items: editingOrder.items } : o));
                  setEditingOrder(null);
                }
                setEditSaving(false);
              }}
              disabled={editSaving}
              className="w-full bg-veggie-lime text-veggie-dark py-3 rounded-xl font-bold text-sm hover:bg-white transition-colors disabled:opacity-50"
            >
              {editSaving ? 'Сохраняем...' : 'Сохранить изменения'}
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
        onProfileOpen={openProfile}
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
              Доставляем на ваш стол свежие продукты только высшего качества. Каждая партия проходит строгий контроль, чтобы гарантировать вам безупречный вкус и пользу. Наша гарантия: если продукт не соответствует вашим ожиданиям, мы заменим его бесплатно — быстро и без лишних хлопот.
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
          {["🍅", "🥦", "🥕", "🌽", "🥒"].map((emoji, i) => (
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

      {/* TIPS */}
      <section id="tips" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-5xl font-bold text-veggie-green mb-3">ПОЛЕЗНЫЕ СОВЕТЫ</h2>
            <div className="section-divider w-24 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Как выбирать, хранить и готовить с пользой для здоровья</p>
          </div>

          {/* Статьи */}
          <div className="flex flex-col gap-4 mb-10">
            {ARTICLES.map(article => (
              <div key={article.id} className="border border-border rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenArticle(openArticle === article.id ? null : article.id)}
                  className="w-full flex items-center gap-4 px-6 py-5 bg-background hover:bg-muted/50 transition-colors text-left"
                >
                  <span className="text-3xl shrink-0">{article.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold bg-veggie-lime/20 text-veggie-green px-3 py-1 rounded-full mb-2 inline-block">{article.tag}</span>
                    <h3 className="font-heading text-lg font-bold text-foreground">{article.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{article.intro}</p>
                  </div>
                  <Icon name={openArticle === article.id ? "ChevronUp" : "ChevronDown"} size={20} className="text-muted-foreground shrink-0" />
                </button>
                {openArticle === article.id && (
                  <div className="px-6 pb-6 pt-2 bg-background border-t border-border">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5">{article.intro}</p>
                    <div className="flex flex-col gap-4">
                      {article.sections.map((s, i) => (
                        <div key={i} className="bg-veggie-lime/5 border border-veggie-lime/20 rounded-xl p-4">
                          <h4 className="font-semibold text-veggie-green mb-2 text-sm">{s.title}</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">{s.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Карточки советов */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TIPS.map(tip => (
              <div key={tip.id} className="card-hover bg-background rounded-2xl p-6 border border-border shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{tip.emoji}</span>
                  <span className="text-xs font-semibold bg-veggie-lime/20 text-veggie-green px-3 py-1 rounded-full">{tip.tag}</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">{tip.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{tip.text}</p>
              </div>
            ))}
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

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[...REVIEWS.map(r => ({ ...r, location: r.location })), ...dbReviews.map(r => ({ id: r.id + 1000, name: r.name, text: r.text, rating: r.rating, avatar: r.avatar, location: r.city }))].map((review, i) => (
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

            {/* Карточка-форма "Оставить отзыв" */}
            {!reviewForm ? (
              <div
                onClick={() => setReviewForm(true)}
                className="bg-veggie-green/5 border-2 border-dashed border-veggie-green/30 rounded-2xl p-6 cursor-pointer hover:border-veggie-green hover:bg-veggie-green/10 transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[180px]"
              >
                <div className="w-10 h-10 rounded-full bg-veggie-green/20 flex items-center justify-center text-xl">✏️</div>
                <div>
                  <div className="font-semibold text-veggie-green">Оставить отзыв!</div>
                  <div className="text-xs text-muted-foreground mt-1">Поделитесь своим опытом</div>
                </div>
              </div>
            ) : (
              <div className="bg-background rounded-2xl p-6 border border-border">
                {reviewStatus === 'success' ? (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-2">🙏</div>
                    <p className="font-semibold text-veggie-green">Спасибо за отзыв!</p>
                    <p className="text-sm text-muted-foreground mt-1">Он появится после проверки</p>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-1 mb-3">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => setReviewRating(s)} className={`text-2xl transition-transform hover:scale-110 ${s <= reviewRating ? 'text-veggie-yellow' : 'text-gray-300'}`}>★</button>
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-4 italic text-sm">
                      <textarea
                        value={reviewText} onChange={e => setReviewText(e.target.value)}
                        placeholder="Ваш отзыв о нашем сервисе..."
                        rows={3}
                        className="w-full border border-border rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-veggie-green not-italic text-foreground"
                      />
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-veggie-green/10 flex items-center justify-center text-xl">👤</div>
                      <div className="flex-1 flex flex-col gap-2">
                        <input value={reviewName} onChange={e => setReviewName(e.target.value)} placeholder="Ваше имя" className="border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-veggie-green w-full" />
                        <input value={reviewCity} onChange={e => setReviewCity(e.target.value)} placeholder="Город" className="border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-veggie-green w-full" />
                      </div>
                    </div>
                    {reviewStatus === 'error' && <p className="text-red-500 text-xs mt-2">Ошибка. Попробуйте снова.</p>}
                    <div className="flex gap-2 mt-3">
                      <button onClick={submitReview} disabled={reviewStatus === 'loading' || !reviewName.trim() || !reviewText.trim()} className="flex-1 bg-veggie-green text-white py-2 rounded-xl text-sm font-semibold hover:bg-veggie-green/90 transition-colors disabled:opacity-50">
                        {reviewStatus === 'loading' ? 'Отправка...' : 'Отправить'}
                      </button>
                      <button onClick={() => setReviewForm(false)} className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl text-sm transition-colors">Отмена</button>
                    </div>
                  </>
                )}
              </div>
            )}
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
                  <input type="tel" placeholder="+7 900 000-00-00" value={formPhone}
                    onChange={e => { const v = e.target.value; if (v !== '' && !v.startsWith('+7')) return; setFormPhone(v); }}
                    onFocus={e => { if (!e.target.value) setFormPhone('+7'); }}
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
          pointsToUse={pointsToUse} setPointsToUse={setPointsToUse}
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