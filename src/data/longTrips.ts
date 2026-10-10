export type LongTripNatureType =
  | 'waterfall_river'
  | 'mountain_meadow'
  | 'lake_reservoir'
  | 'secluded_wild'
  | 'historic_lively';

export interface TransportOptionInfo {
  available: boolean;
  duration: string;
  cost: string;
  details: string;
}

export interface NearbyFacilityInfo {
  available: boolean;
  statusText: string;
  items: string[];
}

export interface LongTripItem {
  id: string;
  title: string;
  region: string;
  district: string;
  natureType: LongTripNatureType;
  natureLabel: string;
  crowdLevel: 'Gavjum & Mashhur' | 'O‘rtacha' | 'Yolg‘iz & Sokin';
  lat: number;
  lng: number;
  distanceFromTashkentKm: number;
  travelTimeText: string;
  totalBudgetText: string;
  estimatedPrice: number;
  bestSeason: string;
  imageUrl: string;
  shortDesc: string;
  creativeTip: string;
  transport: {
    car: TransportOptionInfo;
    train: TransportOptionInfo;
    bus: TransportOptionInfo;
    plane: TransportOptionInfo;
  };
  nearby: {
    hotels: NearbyFacilityInfo;
    dining: NearbyFacilityInfo;
    shops: NearbyFacilityInfo;
    medical: NearbyFacilityInfo;
    connectivity: string;
  };
}

export const LONG_TRIPS_DATABASE: LongTripItem[] = [
  // ==========================================
  // 1. TOSHKENT VILOYATI (8 ta maskan)
  // ==========================================
  {
    id: 'amirsoy-resort',
    title: 'Amirsoy Mountain Resort & Archazor Yaylovi',
    region: 'Toshkent viloyati',
    district: 'Bo‘stonliq tumani',
    natureType: 'mountain_meadow',
    natureLabel: 'Tog‘ cho‘qqisi & Kanat yo‘li',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 41.4865,
    lng: 69.9362,
    distanceFromTashkentKm: 65,
    travelTimeText: '1 soat 15 daq',
    totalBudgetText: '250 000 — 600 000 so‘m',
    estimatedPrice: 350000,
    bestSeason: 'Yil davomida (4 fasl)',
    imageUrl: '/trips/amirsoy-resort.jpg',
    shortDesc: '2290 metr balandlikka olib chiquvchi Avstriya gondolali dor yo‘li, alp yaylovlari va Yevropa darajasidagi tog‘ kurorti.',
    creativeTip: 'Quyosh botishidan 40 daqiqa oldin eng yuqori "2290" stansiyasiga chiqing — Tyan-Shan tog‘lari pushti-oltin rangga kiradi.',
    transport: {
      car: { available: true, duration: '1 soat 15 daq', cost: '80 000 — 150 000 so‘m (benzin/taksi)', details: 'Yangi 4 polosali G‘azalkent — Chimyon asfalt trassasi orqali juda tekis boriladi.' },
      train: { available: true, duration: '1 soat 10 daq + 20 daq taksi', cost: '20 000 so‘m + 40 000 so‘m taksi', details: 'Janubiy vokzaldan Xo‘jakent tezyurar elektrichkasida Xo‘jakentgacha borib, u yerdan 15 km taksida chiqiladi.' },
      bus: { available: true, duration: '1 soat 30 daq', cost: '25 000 so‘m', details: 'Mashinasozlar metrosidan G‘azalkent/Chimyon yo‘nalishidagi mikroavtobuslar qatnaydi.' },
      plane: { available: false, duration: 'Qatnamaydi', cost: '—', details: 'Toshkentga juda yaqin bo‘lgani uchun samolyot qatnovi yo‘q (vertolyot charter turi mavjud).' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Ko‘p (Shale va 4★–5★ mehmonxonalar)', items: ['Le Chalet by Amirsoy (kurort ichida)', 'Archazor Mountain Resort (4 km)', 'Layner Resort (6 km)', 'Chimyon kotejlari (5 km)'] },
      dining: { available: true, statusText: 'Bor (Kurort ichida va yo‘l bo‘yida)', items: ['2290 Panorama Restaurant (cho‘qqida)', 'Olive Garden Amirsoy', 'Bochka (Xo‘jakent) — sazan baliq va shashlik', 'Fayz Kafe (G‘azalkent)'] },
      shops: { available: true, statusText: 'Bor (Mini-market va suvenir do‘konlari)', items: ['Amirsoy Welcome Center do‘koni', 'Xo‘jakent Korzinka va bozorcha (15 daqiqa pastda)'] },
      medical: { available: true, statusText: '24/7 Qutqaruv va tibbiyot punkti bor', items: ['Amirsoy Ski Patrol & First Aid punkti (kurort ichida)', 'G‘azalkent markaziy shifoxonasi (22 km)'] },
      connectivity: '4G LTE (Uzmobile, Ucell, Beeline) va kurort bo‘ylab bepul Wi-Fi ishlaydi. Yo‘lda Metan/AI-95 zapravkalar va EV quvvatlagich bor.'
    }
  },
  {
    id: 'chimgan-mountains',
    title: 'Katta Chimyon Cho‘qqisi & Otli Yaylovlar',
    region: 'Toshkent viloyati',
    district: 'Bo‘stonliq tumani',
    natureType: 'mountain_meadow',
    natureLabel: 'Tog‘ yaylovi & Soylar',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 41.5290,
    lng: 70.0195,
    distanceFromTashkentKm: 80,
    travelTimeText: '1 soat 30 daq',
    totalBudgetText: '120 000 — 300 000 so‘m',
    estimatedPrice: 180000,
    bestSeason: 'Bahor, Yoz, Kuz va Qish',
    imageUrl: '/trips/chimgan-mountains.jpg',
    shortDesc: '3309 metrli Katta Chimyon etagidagi yashil yaylovlar, otda va kvadrotsiklda sayr, ochiq osma dor yo‘li hamda Qoraarcha soyi.',
    creativeTip: 'Erta tongda soat 07:30 da yetib kelsangiz, bulutlar tog‘ darasidan pastda suzib yurganini ko‘rasiz va otda Oqsoy sharsharasigacha chiqishingiz mumkin.',
    transport: {
      car: { available: true, duration: '1 soat 30 daq', cost: '100 000 — 180 000 so‘m', details: 'G‘azalkent va Yusufxona orqali asfalt yo‘l bilan bevosita Chimyon dor yo‘li etagigacha boriladi.' },
      train: { available: true, duration: '1 soat 10 daq + 25 daq taksi', cost: '20 000 so‘m + 50 000 so‘m taksi', details: 'Toshkent — Xo‘jakent elektrichkasidan tushib, Chimyon taksilariga o‘tiriladi.' },
      bus: { available: true, duration: '1 soat 45 daq', cost: '30 000 so‘m', details: 'Mashinasozlar bekatidan G‘azalkent va Chimyon avtobus/marshrutkalari.' },
      plane: { available: false, duration: 'Qatnamaydi', cost: '—', details: 'Avtomobil va elektrichka asosiy transport.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Sanatoriy, mehmonxona va dachalar)', items: ['Toshkent Chimgan Oromgohi', 'Sky Village Tog‘ Kotejlari', 'Nebesa Chalet', 'Yusufxona oilaviy dachalari'] },
      dining: { available: true, statusText: 'Ko‘p (Tog‘ choyxonalari va so‘rilar)', items: ['Chimyon Soy bo‘yi so‘rilari (qozon kabob va qimiz)', 'Chinorlar (Bochka)', 'Fayz Milliy Taomlar'] },
      shops: { available: true, statusText: 'Bor (Tog‘ asali, qurut va kichik do‘konlar)', items: ['Chimyon bozorchasi (tog‘ asali, dorivor giyohlar, pista-bodom)', 'Yusufxona oziq-ovqat do‘konlari'] },
      medical: { available: true, statusText: 'Bor (Tog‘ qutqaruv va ambulatoriya)', items: ['Chimyon FVV tog‘-qutqaruv posti', 'Chimyon qishloq vrachlik punkti (2 km)'] },
      connectivity: '4G aloqa barqaror, faqat Oqsoy darasi ichkarisiga kirganda 3G ga tushadi.'
    }
  },
  {
    id: 'charvak-reservoir',
    title: 'Chorvoq Suv Ombori & Piramida Sohili',
    region: 'Toshkent viloyati',
    district: 'Bo‘stonliq tumani',
    natureType: 'lake_reservoir',
    natureLabel: 'Moviy tog‘ ko‘li & Plyaj',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 41.6115,
    lng: 70.0250,
    distanceFromTashkentKm: 82,
    travelTimeText: '1 soat 25 daq',
    totalBudgetText: '150 000 — 400 000 so‘m',
    estimatedPrice: 220000,
    bestSeason: 'May — Oktabr',
    imageUrl: '/trips/charvak-reservoir.jpg',
    shortDesc: 'Tog‘lar qurshovidagi ulkan moviy "Chorvoq dengizi" — kater va skuterda suzish, paraplanda uchish va salqin suv bo‘yi.',
    creativeTip: 'Yusufxona paraplan uchish tepaligiga chiqing — butun Chorvoq ko‘li va Pskom tog‘ tizmasi 360 daraja kaftdek ko‘rinadi.',
    transport: {
      car: { available: true, duration: '1 soat 25 daq', cost: '100 000 — 180 000 so‘m', details: 'Bochka (Xo‘jakent) orqali to‘g‘ri Chorvoq Piramida va Yusufxona sohiliga chiqiladi.' },
      train: { available: true, duration: '1 soat 10 daq + 15 daq taksi', cost: '20 000 so‘m + 30 000 so‘m', details: 'Xo‘jakent temiryo‘l bekatidan Chorvoq plyajigacha 10 daqiqalik yo‘l.' },
      bus: { available: true, duration: '1 soat 40 daq', cost: '30 000 so‘m', details: 'Mashinasozlar metrosidan Chorvoq/Xo‘jakent yo‘nalishi.' },
      plane: { available: false, duration: 'Qatnamaydi', cost: '—', details: 'Toshkentdan poyezd yoki mashinada boriladi.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Juda ko‘p (Piramida, mehmonxona va minglab dachalar)', items: ['Charvak Oromgohi (Piramidalar)', 'Avenue Park Resort', 'Green Canyon', 'Bochka va Sijjak dachalari'] },
      dining: { available: true, statusText: 'Juda ko‘p (Mashhur Bochka choyxonalari)', items: ['Bochka Chinaras (forel va sazan baliq)', 'Fayz Restorani', 'Avenue Park Restaurant', 'Yusufxona baliqxonalari'] },
      shops: { available: true, statusText: 'Barcha narsa bor (Supermarket va bozorlar)', items: ['Korzinka Xo‘jakent', 'Chorvoq shaharchasi dehqon bozori', '24/7 yo‘l bo‘yi minimarketlar'] },
      medical: { available: true, statusText: 'Bor (Shifoxona va dorixonalar 24/7)', items: ['Chorvoq shaharchasi poliklinikasi va tez yordam', 'Bochka 24/7 dorixonalari'] },
      connectivity: '4G+ barcha operatorlarda a’lo darajada ishlaydi.'
    }
  },
  {
    id: 'urungach-jade-lakes',
    title: 'Urungach (Nefrit) Zumrad Ko‘llari',
    region: 'Toshkent viloyati',
    district: 'Bo‘stonliq tumani (Ugam-Chotqol)',
    natureType: 'secluded_wild',
    natureLabel: 'Yovvoyi tog‘ ko‘li & Sukunat',
    crowdLevel: 'Yolg‘iz & Sokin',
    lat: 41.9195,
    lng: 70.3055,
    distanceFromTashkentKm: 155,
    travelTimeText: '3 soat',
    totalBudgetText: '150 000 — 300 000 so‘m',
    estimatedPrice: 200000,
    bestSeason: 'May — Oktabr',
    imageUrl: '/trips/urungach-jade-lakes.jpg',
    shortDesc: 'Shahar shovqinidan 150 km uzoqda, Pskom daryosi ortidagi nefrit (zumrad) rangli Kichik va Katta Urungach tog‘ ko‘llari.',
    creativeTip: 'Pastki ko‘ldan yana 25 daqiqa toshloq so‘qmoq bo‘ylab tepaga ko‘tarilsangiz, oyna kabi tiniq Katta Urungach ko‘li va muzdek tog‘ soyi chiqadi.',
    transport: {
      car: { available: true, duration: '3 soat', cost: '180 000 — 280 000 so‘m', details: 'Chorvoq va Sijjakdan o‘tib, Pskom daryosi bo‘ylab boriladi. Oxirgi 4 km tuproq yo‘l uchun Niva/UAZ (20 000 so‘m) yoki piyoda yuriladi. (Chegara zonasi bo‘lgani uchun pasport/ID karta olish shart!)' },
      train: { available: false, duration: 'Xo‘jakentgacha boradi (keyin 85 km mashina)', cost: '—', details: 'To‘g‘ridan-to‘g‘ri poyezd bormaydi, faqat Xo‘jakentgacha borib u yerdan mashina yollash mumkin.' },
      bus: { available: true, duration: '3.5 soat (dam olish kunlari tur-avtobuslar)', cost: '150 000 — 220 000 so‘m', details: 'Shanba-yakshanba kunlari Toshkentdan maxsus mikroavtobus turlari qatnaydi.' },
      plane: { available: false, duration: 'Qatnamaydi', cost: '—', details: 'Faqat avtotransportda boriladi.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Kam (Kemping va Pskom mehmon uylari)', items: ['Urungach kemping chodirlari va o‘tovlar', 'Pskom va Nanay qishloq mehmon uylari (15 km pastda)'] },
      dining: { available: true, statusText: 'Mavsumiy (Soy bo‘yi choyxonasi bor, lekin yegulik olib oling)', items: ['Urungach kirishidagi milliy so‘rilar (issiq choy, qozon kabob)', 'Sijjak va Burchmulla oshxonalari (yo‘lda)'] },
      shops: { available: false, statusText: 'Ko‘l yonida yirik do‘kon yo‘q!', items: ['Oxirgi katta do‘konlar Chorvoq va Burchmullada joylashgan — suv va yegulikni o‘sha yerdan g‘amlab oling.'] },
      medical: { available: false, statusText: 'Uzoq (Shaxsiy aptechka oling!)', items: ['Eng yaqin tibbiyot punkti Pskom qishlog‘ida (14 km) va Chorvoqda (70 km).'] },
      connectivity: 'Ko‘l hududida mobil aloqa va internet deyarli tutmaydi (haqiqiy digital-detoks!). Pskom qishlog‘igacha Uzmobile ishlaydi.'
    }
  },
  {
    id: 'paltau-waterfall',
    title: 'Paltov (Paltau) Sharsharasi & Qayinzor O‘rmoni',
    region: 'Toshkent viloyati',
    district: 'Bo‘stonliq tumani',
    natureType: 'waterfall_river',
    natureLabel: '38m Sharshara & Oq qayin o‘rmoni',
    crowdLevel: 'Yolg‘iz & Sokin',
    lat: 41.5735,
    lng: 70.1450,
    distanceFromTashkentKm: 105,
    travelTimeText: '2 soat + 1 soat piyoda',
    totalBudgetText: '120 000 — 220 000 so‘m',
    estimatedPrice: 160000,
    bestSeason: 'Aprel — Oktabr',
    imageUrl: '/trips/paltau-waterfall.jpg',
    shortDesc: '38 metr balandlikdan qoya ichidan otilib tushuvchi qudratli Paltov sharsharasi, yovvoyi oq qayin o‘rmoni va qadimiy Obirahmat g‘ori.',
    creativeTip: 'Sharsharadan 30 daqiqa teparoqqa chiqsangiz, O‘zbekistonda kam uchraydigan haqiqiy oq qayin (beryoza) o‘rmonzori va salqin buloq bor.',
    transport: {
      car: { available: true, duration: '2 soat', cost: '120 000 — 200 000 so‘m', details: 'Chorvoq suv ombori to‘g‘onidan o‘tib, Auraxmat (Obirahmat) qishlog‘igacha mashinada, u yerdan sharsharagacha 4 km so‘qmoq bo‘ylab piyoda yuriladi.' },
      train: { available: true, duration: '1 soat 10 daq + 30 daq taksi', cost: '20 000 + 60 000 so‘m', details: 'Xo‘jakent vokzaligacha poyezdda borib, Obirahmat ko‘prigigacha taksida o‘tiladi.' },
      bus: { available: false, duration: 'Faqat Chorvoqqacha boradi', cost: '30 000 so‘m', details: 'Chorvoqdan Obirahmatgacha mahalliy taksida 15 daqiqa.' },
      plane: { available: false, duration: 'Qatnamaydi', cost: '—', details: 'Avtomobil va piyoda trekking.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Yaqinida (Auraxmat va Burchmulla dachalari)', items: ['Auraxmat mehmon uylari (4 km)', 'Chorvoq va Yusufxona mehmonxonalari (15 km)'] },
      dining: { available: false, statusText: 'O‘rmon ichida oshxona yo‘q!', items: ['Ryukzakda sendvich, termosda choy va mevalar olib oling. Qaytishda Bochka choyxonalarida ovqatlanish mumkin.'] },
      shops: { available: false, statusText: 'Darada do‘kon yo‘q', items: ['Auraxmat qishlog‘i kirishida kichik do‘kon bor, asosiy xaridni Chorvoqda qiling.'] },
      medical: { available: false, statusText: 'O‘rmon hududi (Aptechka oling)', items: ['Chorvoq shaharchasi shifoxonasi (16 km). Qulay krossovka kiyish shart.'] },
      connectivity: 'Obirahmat g‘ori yonida aloqa bor, sharshara darasi ichida aloqa uziladi.'
    }
  },
  {
    id: 'lashkerek-forest',
    title: 'Lashkarak Archazor Darasi & Tog‘ Soyi',
    region: 'Toshkent viloyati',
    district: 'Ohangaron tumani (Angren)',
    natureType: 'secluded_wild',
    natureLabel: 'Qalin archazor & Muzdek soy',
    crowdLevel: 'Yolg‘iz & Sokin',
    lat: 40.9120,
    lng: 70.2140,
    distanceFromTashkentKm: 125,
    travelTimeText: '2 soat 15 daq',
    totalBudgetText: '130 000 — 250 000 so‘m',
    estimatedPrice: 170000,
    bestSeason: 'May — Oktabr',
    imageUrl: '/trips/lashkerek-forest.jpg',
    shortDesc: 'Qamchiq dovoni yaqinida, gavjum turistlardan xoli bo‘lgan Shveytsariya manzarasini eslatuvchi qalin archazor va sharqiragan Lashkarak soyi.',
    creativeTip: 'Yozning 40 daraja issig‘ida ham Lashkarak archazorida harorat +22 daraja salqin bo‘ladi — soy bo‘yida piknik va gamak osish uchun eng tinch joy.',
    transport: {
      car: { available: true, duration: '2 soat 15 daq', cost: '140 000 — 220 000 so‘m', details: 'Toshkent — Angren trassasidan Abduqahhor (Lashkarak) qishlog‘iga burilib, asfalt va tog‘ yo‘li bilan chiqiladi.' },
      train: { available: true, duration: '1.5 soat (Angrengacha) + 25 daq taksi', cost: '45 000 + 50 000 so‘m', details: 'Toshkent — Qo‘qon/Andijon poyezdida Angren stansiyasigacha borib, u yerdan Lashkarakka taksi olinadi.' },
      bus: { available: false, duration: 'Angren shahrigacha avtobus bor', cost: '30 000 so‘m', details: 'Qo‘yliq / Vodnikdan Angrengacha taksi va avtobuslar qatnaydi.' },
      plane: { available: false, duration: 'Qatnamaydi', cost: '—', details: 'Mashinada borish eng qulay.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Tog‘ kotejlari va tapchanlar)', items: ['Lashkarak Plaza tog‘ dam olish maskani', 'Mahalliy aholi tog‘ kotejlari va so‘rilari'] },
      dining: { available: true, statusText: 'Bor (Soy ustidagi so‘rilar va Angren kaboblari)', items: ['Lashkarak soy bo‘yi choyxonalari', 'Angren yo‘lidagi tandir kabob va somsaxonalar'] },
      shops: { available: true, statusText: 'Qishloq do‘konlari bor', items: ['Lashkarak qishloq do‘koni (suv, non, muzqaymoq)', 'Angren shahridagi supermarketlar (20 km)'] },
      medical: { available: true, statusText: 'Qishloq vrachlik punkti bor', items: ['Lashkarak QVP', 'Angren shahar tibbiyot birlashmasi (22 km)'] },
      connectivity: 'Qishloqda Uzmobile va Ucell 4G/3G ishlaydi, yuqori archazorda aloqa sustlashadi.'
    }
  },
  {
    id: 'sukok-forest-chashma',
    title: 'So‘qoq O‘rmoni, Sharsharali Chashma & Ko‘k Somsa',
    region: 'Toshkent viloyati',
    district: 'Parkent tumani',
    natureType: 'waterfall_river',
    natureLabel: 'Qarag‘ay o‘rmoni & Chashma',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 41.2485,
    lng: 69.7845,
    distanceFromTashkentKm: 55,
    travelTimeText: '1 soat',
    totalBudgetText: '90 000 — 180 000 so‘m',
    estimatedPrice: 130000,
    bestSeason: 'Mart — Noyabr',
    imageUrl: '/trips/sukok-forest-chashma.jpg',
    shortDesc: 'Toshkentdan atigi 1 soatlik yo‘lda joylashgan qalin qarag‘ay o‘rmonzori, qoyadan oqib tushuvchi Chashma bulog‘i va afsonaviy So‘qoq mador somsasi.',
    creativeTip: 'Avval ertalabki salqinda o‘rmon ichidagi 450 pog‘onali zinadan Chashma bulog‘i va "Qo‘shiq aytuvchi g‘or"ga chiqing, tushlikda esa soy bo‘yida madorli So‘qoq somsasini yeng.',
    transport: {
      car: { available: true, duration: '1 soat', cost: '60 000 — 120 000 so‘m', details: 'Yangi O‘zbekiston bog‘i va Parkent trassasi orqali to‘g‘ri So‘qoq o‘rmon xo‘jaligigacha asfalt yo‘l.' },
      train: { available: false, duration: 'Qatnamaydi', cost: '—', details: 'Parkent yo‘nalishida temiryo‘l hozircha qurilish bosqichida.' },
      bus: { available: true, duration: '1 soat 15 daq', cost: '15 000 — 20 000 so‘m', details: 'Mashinasozlar va Rohat bekatlaridan Parkent — So‘qoq avtobus va Damaslari qatnaydi.' },
      plane: { available: false, duration: 'Qatnamaydi', cost: '—', details: 'Toshkentdan 55 km.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Sanatoriy va tog‘ dachalari)', items: ['So‘qoq Oromgohi & Sanatoriysi', 'Parkent-So‘qoq oilaviy dachalari', 'Kumushkon mehmon uylari (12 km)'] },
      dining: { available: true, statusText: 'Juda ko‘p (Soy bo‘yi somsaxona va choyxonalar)', items: ['So‘qoq Soy Choyxonalari (Mador va ismaloq somsa, shashlik)', 'Chashma etagi milliy taomlari'] },
      shops: { available: true, statusText: 'Bor (Bozorcha va do‘konlar)', items: ['So‘qoq qishloq bozorchasi (tog‘ ko‘katlari, qurut, yong‘oq, asal)', 'Parkent markaziy bozori (10 km)'] },
      medical: { available: true, statusText: 'Bor (So‘qoq sanatoriysi va poliklinika)', items: ['So‘qoq poliklinikasi va dorixonalar', 'Parkent tuman markaziy shifoxonasi (11 km)'] },
      connectivity: 'Barcha mobil operatorlar (4G) to‘liq ishlaydi.'
    }
  },
  {
    id: 'kumushkon-chashma',
    title: 'Kumushkon Tog‘ Qishlog‘i & Hazrati Ali Buva Buloqlari',
    region: 'Toshkent viloyati',
    district: 'Parkent tumani',
    natureType: 'waterfall_river',
    natureLabel: 'Kumush soy & Tog‘ bulog‘i',
    crowdLevel: 'O‘rtacha',
    lat: 41.3210,
    lng: 69.8540,
    distanceFromTashkentKm: 60,
    travelTimeText: '1 soat 10 daq',
    totalBudgetText: '90 000 — 180 000 so‘m',
    estimatedPrice: 120000,
    bestSeason: 'Bahor, Yoz va Kuz',
    imageUrl: '/trips/kumushkon-chashma.jpg',
    shortDesc: 'O‘zbekistonning birinchi "Turizm qishlog‘i" — kumushga boy shifobaxsh tog‘ chashmalari, besh chinor va salqin Kumushkon soyi.',
    creativeTip: 'Masjid tepasidagi 5 tup ulkan chinor o‘rtasidan chiquvchi muzdek chashma suvidan ichib, soy ustiga qurilgan yog‘och so‘rilarda dam oling.',
    transport: {
      car: { available: true, duration: '1 soat 10 daq', cost: '70 000 — 130 000 so‘m', details: 'Parkent orqali Kumushkon turizm qishlog‘igacha yangi asfalt yo‘l.' },
      train: { available: false, duration: 'Qatnamaydi', cost: '—', details: 'Avtomobil yoki avtobusda boriladi.' },
      bus: { available: true, duration: '1 soat 25 daq', cost: '20 000 so‘m', details: 'Mashinasozlar metrosidan Parkent — Kumushkon yo‘nalishli avtobuslari.' },
      plane: { available: false, duration: 'Qatnamaydi', cost: '—', details: 'Toshkentga juda yaqin.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Ko‘p (30+ ta eko-mehmon uylari va sanatoriy)', items: ['Kumushkon Eco Guest Houses', 'Kumushkon Oromgohi', 'Chashma tog‘ kotejlari'] },
      dining: { available: true, statusText: 'Ko‘p (Soy bo‘yi choyxonalari)', items: ['Kumushkon Soy So‘rilari (qozon kabob, mastava, tog‘ choyi)', 'Parkent shashlik markazlari'] },
      shops: { available: true, statusText: 'Bor (Hunarmandchilik va oziq-ovqat do‘konlari)', items: ['Kumushkon turizm markazi do‘konlari va suvenir rastalari'] },
      medical: { available: true, statusText: 'Bor (Tibbiyot punkti va dorixona)', items: ['Kumushkon QVP va dorixonasi', 'Parkent tuman shifoxonasi (14 km)'] },
      connectivity: '4G internet va telefon aloqasi barqaror ishlaydi.'
    }
  },

  // ==========================================
  // 2. JIZZAX VILOYATI (4 ta maskan)
  // ==========================================
  {
    id: 'zaamin-national-park',
    title: 'Zomin Milliy Bog‘i, Shishali Ko‘prik & Sherbuloq',
    region: 'Jizzax viloyati',
    district: 'Zomin tumani',
    natureType: 'mountain_meadow',
    natureLabel: 'Ming yillik archazor & Kanat',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 39.6380,
    lng: 68.4910,
    distanceFromTashkentKm: 240,
    travelTimeText: '3 soat 20 daq',
    totalBudgetText: '300 000 — 700 000 so‘m',
    estimatedPrice: 420000,
    bestSeason: 'Yil davomida (Ayniqsa May — Oktabr va Qish)',
    imageUrl: '/trips/zaamin-national-park.jpg',
    shortDesc: 'O‘zbekiston Shveytsariyasi — ming yillik archazorlar, daralar ustidagi 305 metrli osma shishali ko‘prik, zamonaviy dor yo‘li va shifobaxsh tog‘ havosi.',
    creativeTip: 'Sherbuloq chashmasi yonida Zominning mashhur "qozon patiri" (sariyog‘ va qaymoq bilan) hamda archa o‘tinida pishgan Zomin tandir go‘shtini albatta tatib ko‘ring.',
    transport: {
      car: { available: true, duration: '3 soat 20 daq', cost: '120 000 — 200 000 so‘m (kishi boshiga)', details: 'M39 trassasi bilan Sirdaryo va Dashtobod orqali Zomin tog‘lariga silliq asfalt yo‘l bilan chiqiladi.' },
      train: { available: true, duration: '2 soat + 40 daq taksi', cost: '70 000 — 130 000 so‘m', details: 'Toshkentdan poyezdda Dashtobod yoki Jizzax vokzaligacha borib, u yerdan Zomin tog‘igacha taksida chiqiladi.' },
      bus: { available: true, duration: '3.5 soat', cost: '50 000 — 70 000 so‘m', details: 'Toshkent avtovokzalidan (Olmazor metro) Zomin yo‘nalishida har kuni avtobuslar qatnaydi.' },
      plane: { available: true, duration: '45 daq', cost: '250 000 — 400 000 so‘m', details: 'Toshkentdan yangi Zomin aeroportiga Silk Avia samolyotlari qatnovi mavjud!' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Juda ko‘p (Wyndham 4★, sanatoriy va kotejlar)', items: ['Wyndham Garden Zaamin (dor yo‘li tepasida)', 'Zomin Sanatoriysi', 'Azim Zomin Shifo', 'O‘riklisoy kotej va o‘tovlari'] },
      dining: { available: true, statusText: 'Juda ko‘p (Tandir go‘sht va qozon patir maskanlari)', items: ['Sherbuloq Tandir Markazi', 'Zomin Milliy Choyxonalari', 'Wyndham Panorama Restorani'] },
      shops: { available: true, statusText: 'Bor (Tog‘ asali, qurut va do‘konlar)', items: ['Zomin shaharchasi super-marketlari', 'Sherbuloq eko-bozorchasi (tog‘ asali, kiyiko‘t choyi, qozon patir)'] },
      medical: { available: true, statusText: 'Yuqori darajada (Sanatoriy va shifoxonalar)', items: ['Zomin sanatoriysi tibbiyot markazi (kurort ichida)', 'Zomin tuman tibbiyot birlashmasi'] },
      connectivity: 'Dor yo‘li, Shishali ko‘prik va Wyndham atrofida 4G LTE va Wi-Fi to‘liq ishlaydi.'
    }
  },
  {
    id: 'suffa-plateau-zaamin',
    title: 'Suffa Baland Tog‘ Yaylovi & Boboyong‘oq Darasi',
    region: 'Jizzax viloyati',
    district: 'Zomin tumani',
    natureType: 'secluded_wild',
    natureLabel: '2400m Alp yaylovi & Dara',
    crowdLevel: 'Yolg‘iz & Sokin',
    lat: 39.6120,
    lng: 68.4580,
    distanceFromTashkentKm: 252,
    travelTimeText: '3 soat 45 daq',
    totalBudgetText: '250 000 — 550 000 so‘m',
    estimatedPrice: 350000,
    bestSeason: 'May — Oktabr',
    imageUrl: '/trips/suffa-plateau-zaamin.jpg',
    shortDesc: 'Dengiz sathidan 2400 metr balandlikdagi keng Suffa platosi, Chortangi kanyoni, 700 yillik Boboyong‘oq va tungi yulduzlar osmoni.',
    creativeTip: 'Kechqurun Suffa yaylovida bulutlar oyog‘ingiz ostida qoladi va Somon yo‘li yulduzlari oddiy ko‘z bilan shundoq ko‘rinadi — issiq kurtka olishni unutmang!',
    transport: {
      car: { available: true, duration: '3 soat 45 daq', cost: '140 000 — 220 000 so‘m', details: 'Zomin milliy bog‘idan serpantin tog‘ asfalt yo‘li orqali Suffa platosigacha ko‘tariladi.' },
      train: { available: true, duration: '2 soat + 1 soat taksi', cost: '80 000 + 70 000 so‘m', details: 'Dashtobod vokzaligacha poyezd, so‘ngra tog‘ taksisi.' },
      bus: { available: true, duration: '3.5 soat (Zomingacha)', cost: '60 000 so‘m', details: 'Zomin markazidan milliy bog‘ transportlariga o‘tiladi.' },
      plane: { available: true, duration: '45 daq + 40 daq taksi', cost: '300 000 so‘m', details: 'Zomin aeroportiga uchib, tog‘ga taksida chiqish mumkin.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Yaylov kotejlari, glamping va mehmonxonalar)', items: ['Suffa Plateau Hotel & Chalets', 'Everest Zaamin Glamping', 'Zomin sanatoriysi (8 km pastda)'] },
      dining: { available: true, statusText: 'Bor (Plato kafelari va Sherbuloq)', items: ['Suffa Panorama Cafe', 'Sherbuloq milliy taomlari (10 daqiqa pastda)'] },
      shops: { available: true, statusText: 'Kichik do‘konlar bor', items: ['Plato eko-do‘konchasi (issiq choy, qurut, tog‘ giyohlari)'] },
      medical: { available: true, statusText: 'Yaqin (Zomin sanatoriysi 8 km)', items: ['Zomin sanatoriysi navbatchi shifokorlari va dorixonasi'] },
      connectivity: 'Plato markazida Uzmobile va Ucell 4G/3G ishlaydi.'
    }
  },
  {
    id: 'aydarkul-lake-yurt',
    title: 'Aydarko‘l Moviy Sohili & Qizilqum O‘tovlar Lageri',
    region: 'Jizzax viloyati',
    district: 'Forish / Arnasoy tumani',
    natureType: 'lake_reservoir',
    natureLabel: 'Bepoyon cho‘l ko‘li & O‘tovlar',
    crowdLevel: 'Yolg‘iz & Sokin',
    lat: 40.8250,
    lng: 66.8120,
    distanceFromTashkentKm: 290,
    travelTimeText: '4 soat',
    totalBudgetText: '300 000 — 650 000 so‘m',
    estimatedPrice: 400000,
    bestSeason: 'Aprel — Oktabr',
    imageUrl: '/trips/aydarkul-lake-yurt.jpg',
    shortDesc: 'Qizilqum cho‘li va Nurota tog‘lari orasida yastanib yotgan 4000 km² lik firuza rangli Aydarko‘l, tuyada sayr, gulxan atrofidagi oqshom va baliq ovi.',
    creativeTip: 'Ko‘l bo‘yida yangi tutilgan qovurma sazan balig‘idan yeb, oqshomda cho‘l o‘tovlari yonida gulxan atrofida oqinlar qo‘shig‘ini tinglang.',
    transport: {
      car: { available: true, duration: '4 soat', cost: '160 000 — 250 000 so‘m', details: 'Jizzax va Gagarin/Forish orqali Aydarko‘l dam olish zonasigacha asfalt yo‘l.' },
      train: { available: true, duration: '1.5 soat (Jizzaxgacha) + 1.5 soat taksi', cost: '120 000 + 80 000 so‘m', details: 'Afrosiyob yoki Sharq poyezdida Jizzax vokzaligacha borib, u yerdan mashinada ko‘lga o‘tiladi.' },
      bus: { available: false, duration: 'Jizzax shahrigacha bor', cost: '60 000 so‘m', details: 'Ko‘lning o‘ziga jamoat avtobusi bormaydi, Jizzaxdan taksi olinadi.' },
      plane: { available: false, duration: 'Qatnamaydi', cost: '—', details: 'Poyezd + mashina yoki shaxsiy avtomobil.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Sohil kurorti va o‘tov lagerlari)', items: ['Oxus Adventure Yurt Camp', 'Aydarkul Resort & Beach', 'Camel Yurt Camp'] },
      dining: { available: true, statusText: 'Bor (Sohil baliq restoranlari)', items: ['Aydarko‘l Sohil Restorani (qovurma va dudlangan baliq)', 'O‘tov lageri milliy oshxonasi', 'Yo‘lda: Jizzax Katta Somsalari!'] },
      shops: { available: false, statusText: 'Ko‘l bo‘yida katta do‘kon yo‘q!', items: ['Kerakli suv, quyoshdan himoya kremi va gazaklarni Jizzax yoki Forish markazidan olib oling.'] },
      medical: { available: false, statusText: 'Uzoq (Forish tumani 45 km)', items: ['Kurortda birinchi yordam aptechkasi bor, tuman shifoxonasi Forishda.'] },
      connectivity: 'Sohil kurortida aloqa bor, cho‘l ichkarisida faqat Uzmobile 3G/2G tutadi.'
    }
  },
  {
    id: 'parpi-ota-bakhmal',
    title: 'Baxmal Olma Bog‘lari, O‘smat Soyi & Muzbuloq',
    region: 'Jizzax viloyati',
    district: 'Baxmal tumani',
    natureType: 'waterfall_river',
    natureLabel: 'Tog‘ soyi & Salqin bog‘lar',
    crowdLevel: 'Yolg‘iz & Sokin',
    lat: 39.7215,
    lng: 67.9840,
    distanceFromTashkentKm: 265,
    travelTimeText: '3 soat 40 daq',
    totalBudgetText: '180 000 — 350 000 so‘m',
    estimatedPrice: 240000,
    bestSeason: 'May — Noyabr (Kuzda olma pishig‘i!)',
    imageUrl: '/trips/parpi-ota-bakhmal.jpg',
    shortDesc: 'Turkiston tog‘ tizmasi etagidagi yam-yashil Baxmal vodiysi — muzdek Sangzor daryosi boshlanishi, olma bog‘lari va shifobaxsh tog‘ asali.',
    creativeTip: 'Sentyabr-oktabr oylarida borsangiz, shoxlari yerga egilgan mashhur Baxmal olmalarini bog‘ning o‘zidan uzib yeyishingiz mumkin.',
    transport: {
      car: { available: true, duration: '3 soat 40 daq', cost: '140 000 — 200 000 so‘m', details: 'Toshkent — Jizzax — G‘allaorol — O‘smat (Baxmal) yo‘nalishida asfalt yo‘l.' },
      train: { available: true, duration: '1.5 soat (Jizzaxgacha) + 50 daq taksi', cost: '120 000 + 50 000 so‘m', details: 'Jizzax vokzalidan Baxmalga taksilar doimiy qatnaydi.' },
      bus: { available: true, duration: '4 soat', cost: '60 000 so‘m', details: 'Toshkent avtovokzalidan Jizzax/G‘allaorol avtobuslari.' },
      plane: { available: false, duration: 'Zomin aeroportigacha (60 km)', cost: '300 000 so‘m', details: 'Asosan mashina va poyezdda boriladi.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Tog‘ mehmon uylari va so‘rilar)', items: ['Baxmal Eco Guest Houses', 'O‘smat mehmonxonasi', 'Muzbuloq dam olish maskani'] },
      dining: { available: true, statusText: 'Bor (Tandir go‘sht va Jizzax somsa)', items: ['O‘smat Soy Choyxonalari', 'G‘allaorol va Jizzax Katta Somsa markazlari'] },
      shops: { available: true, statusText: 'Bor (O‘smat bozori va do‘konlar)', items: ['Baxmal dehqon bozori (asl tog‘ asali, olma, qurut, yong‘oq)'] },
      medical: { available: true, statusText: 'Bor (O‘smat shaharchasida)', items: ['Baxmal tuman markaziy shifoxonasi va dorixonalar'] },
      connectivity: '4G/3G aloqa O‘smat va bog‘lar hududida yaxshi ishlaydi.'
    }
  },

  // ==========================================
  // 3. SAMARQAND VILOYATI (4 ta maskan)
  // ==========================================
  {
    id: 'registan-samarkand',
    title: 'Registon Maydoni, Go‘ri Amir & Shohi Zinda',
    region: 'Samarqand viloyati',
    district: 'Samarqand shahri',
    natureType: 'historic_lively',
    natureLabel: 'Moviy gumbazlar & 3D Lazer Shou',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 39.6548,
    lng: 66.9758,
    distanceFromTashkentKm: 300,
    travelTimeText: '2 soat 15 daq (Afrosiyob)',
    totalBudgetText: '300 000 — 700 000 so‘m',
    estimatedPrice: 450000,
    bestSeason: 'Yil davomida',
    imageUrl: '/trips/registan-samarkand.jpg',
    shortDesc: 'Sharq me’morchiligining toji bo‘lgan Registon ansambli, Go‘ri Amir maqbarasi, Shohi Zinda moviy koshinlari va Siyob bozori.',
    creativeTip: 'Kechki soat 20:30 da Registon maydonida bepul 3D lazer va musiqa shousi boshlanadi — oldingi qatordan joy oling!',
    transport: {
      car: { available: true, duration: '3 soat 45 daq', cost: '120 000 — 180 000 so‘m', details: 'M39 xalqaro magistrali orqali to‘g‘ri Samarqand markaziga kirib boriladi.' },
      train: { available: true, duration: '2 soat 15 daq', cost: '150 000 — 270 000 so‘m', details: 'Afrosiyob va Sharq tezyurar poyezdlari har kuni kuniga 4–5 mahal qatnaydi (eng qulay usul!).' },
      bus: { available: true, duration: '4.5 soat', cost: '65 000 so‘m', details: 'Toshkent avtovokzalidan zamonaviy Yutong avtobuslari har soatda jo‘naydi.' },
      plane: { available: true, duration: '50 daq', cost: '300 000 — 550 000 so‘m', details: 'Samarqand xalqaro aeroportiga har kuni reyslar bor.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Yuzlab mehmonxona va butik-otellar', items: ['Registan Plaza', 'Bibikhanum Boutique Hotel', 'Emirhan Hotel (rooftop Registon manzarasi bilan)', 'Mövenpick Samarkand'] },
      dining: { available: true, statusText: 'Juda ko‘p (Zig‘ir oshi va Samarqand kabobi)', items: ['Platan Restaurant', 'Samarqand Osh Markazi (Mahmud Koshg‘ariy)', 'Bibixonim Choyxonasi', 'Karimbek'] },
      shops: { available: true, statusText: 'Barcha narsa bor (Siyob bozori va Mallar)', items: ['Siyob Dehqon Bozori (mashhur Samarqand noni, holva va quritilgan mevalar)', 'Family Park Mall'] },
      medical: { available: true, statusText: '24/7 klinika va dorixonalar', items: ['Samarqand shahar shoshilinch tibbiy yordam markazi', 'Har qadamda 24/7 dorixonalar'] },
      connectivity: '5G va 4G+ barcha operatorlarda eng yuqori tezlikda ishlaydi.'
    }
  },
  {
    id: 'eternal-city-silk-road',
    title: 'Boqiy Shahar (Silk Road Samarkand) & Eshkak Kanal',
    region: 'Samarqand viloyati',
    district: 'Samarqand tumani',
    natureType: 'historic_lively',
    natureLabel: 'Suv bo‘yi majmuasi & Qayiqlar',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 39.6695,
    lng: 67.0585,
    distanceFromTashkentKm: 305,
    travelTimeText: '2.5 soat (poyezd bilan)',
    totalBudgetText: '350 000 — 850 000 so‘m',
    estimatedPrice: 500000,
    bestSeason: 'Yil davomida',
    imageUrl: '/trips/eternal-city-silk-road.jpg',
    shortDesc: '2 km uzunlikdagi eshkak eshish kanali bo‘yida qad rostlagan zamonaviy "Boqiy Shahar" tarixiy-etnografik parki, musiqali favvoralar va qayiq sayri.',
    creativeTip: 'Kechki shafaqda kanal bo‘ylab milliy yog‘och qayiqda suzing va Boqiy Shahar ichidagi turli viloyatlar oshxonasidan taomlar tatib ko‘ring.',
    transport: {
      car: { available: true, duration: '3 soat 40 daq', cost: '130 000 — 180 000 so‘m', details: 'M39 trassasidan Samarqandga kiraverishda to‘g‘ri Silk Road Samarkand majmuasiga buriladi.' },
      train: { available: true, duration: '2 soat 15 daq + 20 daq taksi', cost: '160 000 + 30 000 so‘m', details: 'Samarqand vokzalidan Yandex Go taksida 20 daqiqada boriladi.' },
      bus: { available: true, duration: '4.5 soat', cost: '65 000 so‘m', details: 'Toshkent — Samarqand avtobuslari + shahar elektrobusi.' },
      plane: { available: true, duration: '50 daq + 10 daq taksi', cost: '350 000 so‘m', details: 'Samarqand aeroportidan atigi 10 daqiqalik masofada joylashgan!' }
    },
    nearby: {
      hotels: { available: true, statusText: '8 ta 5★ va 4★ jahon darajasidagi mehmonxona', items: ['Samarkand Regency Amir Temur (5★)', 'Savitsky Plaza (4★)', 'Hilton Samarkand Regency', 'Eco Village yog‘och kotejlari'] },
      dining: { available: true, statusText: '20+ ta restoran va choyxonalar', items: ['Buyuk Samarkand (Boqiy shahar ichida)', 'Chorsu Sharq Bozori kafesi', 'Sky Bar Rooftop'] },
      shops: { available: true, statusText: 'Bor (Hunarmandlar bozori va galereyalar)', items: ['Boqiy Shahar ipak gilam, kulolchilik va suvenir do‘konlari'] },
      medical: { available: true, statusText: 'Majmua ichida Wellness & Tibbiy markazlar bor', items: ['Medical Center Silk Road (kurort ichida)', 'Samarqand shahar shifoxonalari (10 daq)'] },
      connectivity: '5G va bepul yuqori tezlikdagi Wi-Fi butun hududda mavjud.'
    }
  },
  {
    id: 'omonquton-cave-forest',
    title: 'Omonqo‘ton Qarag‘ay O‘rmoni, Taxtaqoracha & Tandir Go‘sht',
    region: 'Samarqand viloyati',
    district: 'Urgut tumani',
    natureType: 'mountain_meadow',
    natureLabel: 'Tog‘ dovoni, O‘rmon & G‘or',
    crowdLevel: 'O‘rtacha',
    lat: 39.3125,
    lng: 66.9520,
    distanceFromTashkentKm: 345,
    travelTimeText: '4 soat 20 daq',
    totalBudgetText: '250 000 — 500 000 so‘m',
    estimatedPrice: 320000,
    bestSeason: 'Aprel — Noyabr',
    imageUrl: '/trips/omonquton-cave-forest.jpg',
    shortDesc: 'Zarafshon tog‘ tizmasidagi 1675 metrli Taxtaqoracha dovoni, XIX asrda ekilgan qalin Omonqo‘ton o‘rmoni, "Yurak tosh" va mashhur tandir kabob.',
    creativeTip: 'Taxtaqoracha dovonining eng baland nuqtasida to‘xtab, archa shoxlarida pishirilgan issiq tandir go‘sht va tog‘ qurutini tatib ko‘ring.',
    transport: {
      car: { available: true, duration: '4 soat 20 daq', cost: '160 000 — 230 000 so‘m', details: 'Samarqand — Shahrisabz (M39) tog‘ dovoni yo‘li bo‘yida joylashgan.' },
      train: { available: true, duration: '2 soat 15 daq + 40 daq taksi', cost: '160 000 + 60 000 so‘m', details: 'Samarqand vokzaligacha poyezdda kelib, Kitob/Taxtaqoracha taksilarida 40 daqiqada chiqiladi.' },
      bus: { available: false, duration: 'Katta avtobuslar dovondan o‘tmaydi', cost: '—', details: 'Dovon yo‘lida faqat yengil mashinalar qatnaydi.' },
      plane: { available: true, duration: '50 daq (Samarqandgacha) + 45 daq taksi', cost: '350 000 so‘m', details: 'Samarqand aeroportidan 45 km.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Tog‘ dam olish maskanlari va kemping)', items: ['Omonqo‘ton Tog‘ Oromgohi', 'Mingchinor so‘rilari va mehmon uylari', 'Samarqand mehmonxonalari (35 km)'] },
      dining: { available: true, statusText: 'Juda mashhur (Taxtaqoracha Tandir Go‘sht qatori)', items: ['Taxtaqoracha Dovoni Tandirxonalari', 'Mingchinor Soy Choyxonasi', 'Chorchinor (Urgut)'] },
      shops: { available: true, statusText: 'Dovon bozori (Tog‘ giyohlari va qurutlar)', items: ['Taxtaqoracha tog‘ bozori (pistali qurut, tog‘ asali, zira, kiyiko‘t)', 'Urgut bozori (18 km)'] },
      medical: { available: true, statusText: 'Urgut va Mingchinor tibbiyot punktlari', items: ['Omonqo‘ton QVP', 'Urgut tuman shifoxonasi (20 km)'] },
      connectivity: 'Trassa va dovon cho‘qqisida 4G/3G aloqa bor, g‘or va dara ichida sustlashadi.'
    }
  },
  {
    id: 'konigil-merosi',
    title: 'Konigil Turizm Qishlog‘i, Suv Tegirmoni & Siyob Soyi',
    region: 'Samarqand viloyati',
    district: 'Samarqand tumani',
    natureType: 'waterfall_river',
    natureLabel: 'Soy bo‘yi & Qadimiy tegirmon',
    crowdLevel: 'O‘rtacha',
    lat: 39.6780,
    lng: 67.0150,
    distanceFromTashkentKm: 298,
    travelTimeText: '2.5 soat (poyezd bilan)',
    totalBudgetText: '200 000 — 450 000 so‘m',
    estimatedPrice: 280000,
    bestSeason: 'Yil davomida',
    imageUrl: '/trips/konigil-merosi.jpg',
    shortDesc: 'Shovullab oqayotgan Siyob arig‘i bo‘yida charxpalakli suv tegirmonlari, 1000 yil saqlanadigan tut po‘stlog‘idan Samarqand qog‘ozi ustaxonasi va soyagi bog‘.',
    creativeTip: 'Charxpalak aylanayotgan soy bo‘yida zig‘ir yog‘i hidli yangi Samarqand oshidan yeb, o‘z qo‘lingiz bilan ipak qog‘ozga muhr bosib ko‘ring.',
    transport: {
      car: { available: true, duration: '3 soat 40 daq', cost: '120 000 — 180 000 so‘m', details: 'Samarqandga kiraverishda Cho‘pon Ota tepaligi yaqinida joylashgan.' },
      train: { available: true, duration: '2 soat 15 daq + 15 daq taksi', cost: '160 000 + 25 000 so‘m', details: 'Afrosiyob poyezdida Samarqandga tushib, 15 daqiqada taksida boriladi.' },
      bus: { available: true, duration: '4.5 soat', cost: '65 000 so‘m', details: 'Samarqand avtovokzali Konigilning shundoq yonida joylashgan!' },
      plane: { available: true, duration: '50 daq + 10 daq taksi', cost: '350 000 so‘m', details: 'Samarqand aeroportidan 8 daqiqalik yo‘l.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Konigil etno-mehmon uylari va Samarqand otellari)', items: ['Konigil Meros Guest House', 'Samarqand markazi mehmonxonalari (4 km)'] },
      dining: { available: true, statusText: 'Bor (Soy bo‘yi choyxonasi va nonvoyxona)', items: ['Konigil Soy Bo‘yi Choyxonasi (Samarqand oshi, somsa va qaynoq obi-non)'] },
      shops: { available: true, statusText: 'Bor (Ipak qog‘oz, kulolchilik va yog‘juvoz do‘konlari)', items: ['Meros qog‘oz do‘koni va suvenir ustaxonalari'] },
      medical: { available: true, statusText: 'Shahar ichida (24/7 dorixona va klinikalar)', items: ['Konigil dorixonalari va Samarqand poliklinikalari (2 km)'] },
      connectivity: '4G+ va Wi-Fi to‘liq ishlaydi.'
    }
  },

  // ==========================================
  // 4. QASHQADARYO VILOYATI (4 ta maskan)
  // ==========================================
  {
    id: 'hisorak-suvtushar-waterfall',
    title: 'Hisorak Suv Ombori & 80 Metrli Suvtushar Sharsharasi',
    region: 'Qashqadaryo viloyati',
    district: 'Shahrisabz tumani',
    natureType: 'waterfall_river',
    natureLabel: '80m ulkan sharshara & Ko‘l',
    crowdLevel: 'O‘rtacha',
    lat: 39.0150,
    lng: 67.2650,
    distanceFromTashkentKm: 415,
    travelTimeText: '5.5 soat',
    totalBudgetText: '350 000 — 700 000 so‘m',
    estimatedPrice: 480000,
    bestSeason: 'May — Sentyabr',
    imageUrl: '/trips/hisorak-suvtushar-waterfall.jpg',
    shortDesc: 'Muzliklardan boshlanuvchi 80 metrli haybatli Suvtushar sharsharasi hamda yangi dor yo‘li va tomosha maydoniga ega moviy Hisorak suv ombori.',
    creativeTip: 'Avval Hisorak suv omboridagi yangi kanat yo‘lida ko‘l ustidan uching, so‘ngra UAZ mashinalarida Ko‘ksuv darasi bo‘ylab Suvtushar sharsharasiga boring.',
    transport: {
      car: { available: true, duration: '5.5 soat', cost: '200 000 — 300 000 so‘m', details: 'Samarqand va Taxtaqoracha dovoni orqali Shahrisabz — Hisorak — Suvtushar yo‘nalishi.' },
      train: { available: true, duration: '4 soat (Shahrisabz/Qarshigacha) + 1 soat taksi', cost: '180 000 + 70 000 so‘m', details: 'Toshkent — Qarshi/Shahrisabz poyezdida borib, Shahrisabzdan Hisorakka taksida chiqiladi.' },
      bus: { available: true, duration: '6.5 soat (Shahrisabzgacha)', cost: '90 000 so‘m', details: 'Toshkent avtovokzalidan Shahrisabz/Kitob avtobuslari qatnaydi.' },
      plane: { available: true, duration: '1 soat (Qarshi yoki Samarqandgacha)', cost: '350 000 so‘m', details: 'Samarqand yoki Qarshi aeroportidan 1.5 soatlik yo‘l.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Hisorak va Miraki dam olish maskanlari)', items: ['Miraki Star Resort', 'Hisorak kotej va kempinglari', 'Shahrisabz Oqsaroy Hotel (35 km)'] },
      dining: { available: true, statusText: 'Bor (Hisorak panorama kafesi va Miraki so‘rilari)', items: ['Hisorak Viewpoint Cafe', 'Miraki soy bo‘yi tandir va kabobxonalari'] },
      shops: { available: true, statusText: 'Miraki va Hisorakda do‘konlar bor', items: ['Miraki qishloq supermarketlari (Suvtushar sharsharasining o‘ziga chiqishdan oldin suv olib oling)'] },
      medical: { available: true, statusText: 'Miraki tibbiyot punkti va Shahrisabz shifoxonasi', items: ['Miraki QVP va dorixonasi', 'Shahrisabz tuman shifoxonasi (30 km)'] },
      connectivity: 'Hisorak suv omborida 4G bor, Suvtushar darasi ichida faqat Uzmobile ba’zi joylarda tutadi.'
    }
  },
  {
    id: 'miraki-resort-valley',
    title: 'Miraki Soy Bo‘yi Kurorti & Oqsaroy Tarixiy Majmuasi',
    region: 'Qashqadaryo viloyati',
    district: 'Shahrisabz tumani',
    natureType: 'waterfall_river',
    natureLabel: 'Shovullagan soy & Tog‘ havosi',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 39.0480,
    lng: 67.0820,
    distanceFromTashkentKm: 390,
    travelTimeText: '4 soat 50 daq',
    totalBudgetText: '280 000 — 600 000 so‘m',
    estimatedPrice: 390000,
    bestSeason: 'Aprel — Oktabr',
    imageUrl: '/trips/miraki-resort-valley.jpg',
    shortDesc: 'Amir Temur tug‘ilgan Shahrisabzning muhtasham Oqsaroy peshtog‘i hamda Oqdaryo tog‘ soyi bo‘yida joylashgan so‘lim Miraki kurort zonasi.',
    creativeTip: 'Kunduzi Shahrisabzdagi Oqsaroy va Dorut-Tilovatni aylanib, kechki salqinda Miraki soyining shundoq suv ustiga qurilgan so‘rilarida tandir go‘sht yeng.',
    transport: {
      car: { available: true, duration: '4 soat 50 daq', cost: '180 000 — 260 000 so‘m', details: 'Samarqand va Taxtaqoracha dovoni orqali Shahrisabz va Mirakigacha tekis asfalt.' },
      train: { available: true, duration: '4 soat 15 daq', cost: '170 000 so‘m', details: 'Toshkentdan poyezd bevosita Kitob/Shahrisabz vokzaligacha boradi!' },
      bus: { available: true, duration: '6 soat', cost: '85 000 so‘m', details: 'Toshkent avtovokzalidan Shahrisabz avtobuslari har kuni qatnaydi.' },
      plane: { available: true, duration: '1 soat (Samarqand yoki Qarshi)', cost: '350 000 so‘m', details: 'Samarqand aeroportidan Taxtaqoracha orqali 1 soatlik yo‘l.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Ko‘p (Sanatoriy, mehmonxona va dachalar)', items: ['Miraki Sanatoriysi va Resort', 'Lochin Oromgohi', 'Kesh Palace Hotel (Shahrisabz)'] },
      dining: { available: true, statusText: 'Juda ko‘p (Soy bo‘yi oshxonalari)', items: ['Miraki Soy Choyxonalari (Qashqadaryo tandir go‘shti va jiz)', 'Oqsaroy Milliy Taomlar'] },
      shops: { available: true, statusText: 'Barcha do‘kon va bozorlar bor', items: ['Miraki va Shahrisabz dehqon bozori', '24/7 minimarketlar'] },
      medical: { available: true, statusText: 'To‘liq (Sanatoriy va shifoxonalar)', items: ['Miraki poliklinikasi', 'Shahrisabz shahar tibbiyot birlashmasi'] },
      connectivity: '4G LTE barcha operatorlarda barqaror ishlaydi.'
    }
  },
  {
    id: 'maidanak-observatory',
    title: 'Maydanak Baland Tog‘ Observatoriyasi & Yulduzli Yaylov',
    region: 'Qashqadaryo viloyati',
    district: 'Qamashi tumani',
    natureType: 'secluded_wild',
    natureLabel: '2650m Cho‘qqi & Teleskoplar',
    crowdLevel: 'Yolg‘iz & Sokin',
    lat: 38.6733,
    lng: 66.8964,
    distanceFromTashkentKm: 460,
    travelTimeText: '6 soat',
    totalBudgetText: '350 000 — 700 000 so‘m',
    estimatedPrice: 450000,
    bestSeason: 'May — Oktabr',
    imageUrl: '/trips/maidanak-observatory.jpg',
    shortDesc: 'Dengiz sathidan 2650 metr balandlikda, bulutlardan yuqorida joylashgan Maydanak astrofizika observatoriyasi, Langar kanyoni va cheksiz koinot.',
    creativeTip: 'Bu yer dunyodagi eng tiniq astro-iqlimli 5 nuqtadan biri — tunda minglab yulduzlar va teleskop gumbazlari fonida unutilmas suratlar chiqadi.',
    transport: {
      car: { available: true, duration: '6 soat', cost: '220 000 — 350 000 so‘m', details: 'Shahrisabz — Yakkabog‘ — Qamashi — Langar orqali tog‘ yo‘li bilan chiqiladi (krossover yoki balandroq mashina ma’qul).' },
      train: { available: true, duration: '3.5 soat (Qarshigacha) + 2 soat taksi', cost: '180 000 + 120 000 so‘m', details: 'Afrosiyobda Qarshigacha borib, u yerdan Qamashi va Maydanakka mashinada chiqiladi.' },
      bus: { available: false, duration: 'Faqat Qamashigacha boradi', cost: '95 000 so‘m', details: 'Tog‘ cho‘qqisiga jamoat avtobusi chiqmaydi.' },
      plane: { available: true, duration: '1 soat (Qarshigacha) + 2 soat mashina', cost: '380 000 so‘m', details: 'Qarshi aeroportidan 110 km.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Kam (Observatoriya mehmon uyi va o‘tovlar)', items: ['Maydanak Astro-Guest House va O‘tovlar lageri', 'Langar ota mehmon uylari (25 km pastda)'] },
      dining: { available: false, statusText: 'Cho‘qqida restoran yo‘q (O‘tov lagerida buyurtma bilan)', items: ['Yo‘lda Langar yoki Qamashida ovqatlanib, o‘zingiz bilan issiq choy va yegulik olib chiqing.'] },
      shops: { available: false, statusText: 'Cho‘qqida do‘kon yo‘q!', items: ['Oxirgi do‘konlar Qamashi va Langar qishlog‘ida joylashgan.'] },
      medical: { available: false, statusText: 'Uzoq (Langar QVP 25 km, Qamashi 60 km)', items: ['Balandlik 2650m bo‘lgani uchun issiq kiyim va shaxsiy dori qutisini oling.'] },
      connectivity: 'Observatoriya hududida Uzmobile va Beeline 3G/4G nuqtalari bor, yo‘lda aloqa uzilishi mumkin.'
    }
  },
  {
    id: 'gelon-mountain-village',
    title: 'Gelon (G‘elon) Bulutlar Ustidagi Qadimiy Tog‘ Qishlog‘i',
    region: 'Qashqadaryo viloyati',
    district: 'Shahrisabz tumani',
    natureType: 'secluded_wild',
    natureLabel: 'Hisor tog‘lari & Sholi poyalari',
    crowdLevel: 'Yolg‘iz & Sokin',
    lat: 39.0640,
    lng: 67.4420,
    distanceFromTashkentKm: 430,
    travelTimeText: '5.5 soat',
    totalBudgetText: '300 000 — 600 000 so‘m',
    estimatedPrice: 420000,
    bestSeason: 'May — Noyabr',
    imageUrl: '/trips/gelon-mountain-village.jpg',
    shortDesc: '2018-yilgacha yopiq bo‘lgan, 2600 metr balandlikdagi Hisor tog‘lari bag‘rida qadimiy me’morchilik va an’analarini saqlab qolgan betakror Gelon qishlog‘i.',
    creativeTip: 'Tog‘ yonbag‘rida pog‘ona-pog‘ona bo‘lib joylashgan ikki qavatli uylar, suv tegirmonlari va 4000 metrli Hazrati Sulton cho‘qqisi manzarasini tomosha qiling. (ID karta/pasport olish shart!)',
    transport: {
      car: { available: true, duration: '5.5 soat', cost: '220 000 — 320 000 so‘m', details: 'Shahrisabz va Hisorak suv omboridan o‘tib, tog‘ serpantin yo‘li bilan boriladi (Shahrisabzdan Niva/Damas/Cobalt taksilari qatnaydi).' },
      train: { available: true, duration: '4 soat (Shahrisabzgacha) + 1.5 soat tog‘ taksisi', cost: '170 000 + 80 000 so‘m', details: 'Shahrisabz vokzalidan Gelon mahalliy taksilariga o‘tiriladi.' },
      bus: { available: false, duration: 'Shahrisabzgacha avtobus bor', cost: '85 000 so‘m', details: 'Tog‘ning tor serpantin yo‘lida katta avtobus yurmaydi.' },
      plane: { available: true, duration: '1 soat (Samarqand/Qarshi) + 2 soat mashina', cost: '350 000 so‘m', details: 'Samarqand aeroportidan 120 km.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (20+ ta milliy tog‘ mehmon uylari)', items: ['Gelon Mountain Guest Houses (an’anaviy ayvonli uylar)', 'Hisorak va Miraki kurortlari (30 km pastda)'] },
      dining: { available: true, statusText: 'Bor (Mehmon uylarida tabiiy tog‘ taomlari)', items: ['Gelon qora kartoshkasi, tog‘ asali, qaymoq va tandir nonlari bilan uy oshxonalari'] },
      shops: { available: true, statusText: 'Kichik qishloq do‘konlari bor', items: ['Gelon markazidagi kichik oziq-ovqat do‘konlari va hunarmandlar uyi'] },
      medical: { available: true, statusText: 'Qishloq vrachlik punkti bor', items: ['Gelon QVP (birinchi yordam)', 'Shahrisabz tuman shifoxonasi (45 km)'] },
      connectivity: 'Qishloq markazida Uzmobile 3G/4G ishlaydi.'
    }
  },

  // ==========================================
  // 5. SURXONDARYO VILOYATI (4 ta maskan)
  // ==========================================
  {
    id: 'sangardak-waterfall',
    title: 'Sangardak Moxli Qoya Sharsharasi & Salqin Dara',
    region: 'Surxondaryo viloyati',
    district: 'Sariosiyo tumani',
    natureType: 'waterfall_river',
    natureLabel: 'Yashil moxli qoya sharsharasi',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 38.5325,
    lng: 67.5515,
    distanceFromTashkentKm: 590,
    travelTimeText: '7.5 soat (mashina) / 1 soat (samolyot)',
    totalBudgetText: '450 000 — 950 000 so‘m',
    estimatedPrice: 600000,
    bestSeason: 'Aprel — Noyabr',
    imageUrl: '/trips/sangardak-waterfall.jpg',
    shortDesc: 'O‘zbekistondagi eng go‘zal sharshara — daryo emas, balki yashil mox bilan qoplangan baland qoyatoshning o‘z ichidan minglab jilg‘a bo‘lib otilib chiqadi!',
    creativeTip: 'Sharshara ro‘parasidagi yog‘och supalarda o‘tirib muzdek suv zarralari ostida choy iching va Sangardak daryosining yangi tutilgan Xonbaliq (forel) balig‘ini tatib ko‘ring.',
    transport: {
      car: { available: true, duration: '7.5 soat', cost: '250 000 — 400 000 so‘m', details: 'M39 trassasi bilan Boysun va Denov/Sariosiyo orqali sharshara tagigacha silliq asfalt yo‘l bor.' },
      train: { available: true, duration: '11 soat (Toshkent — Sariosiyo poyezdi)', cost: '160 000 — 280 000 so‘m', details: 'Kechki Toshkent — Sariosiyo poyezdiga chiqsangiz, ertalab Sariosiyo vokzaliga tushasiz va 35 daqiqada sharsharaga yetasiz!' },
      bus: { available: true, duration: '9 soat (Denov/Sariosiyogacha)', cost: '130 000 so‘m', details: 'Toshkent avtovokzalidan Denov va Termiz avtobuslari qatnaydi.' },
      plane: { available: true, duration: '1 soat 10 daq (Sariosiyo yoki Termiz aeroporti)', cost: '400 000 — 650 000 so‘m', details: 'Sariosiyo (va Termiz) aeroportiga aviaqatnovlar mavjud!' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Sanatoriy, mehmonxona va tog‘ kotejlari)', items: ['Sangardak Sanatoriysi (sharshara yaqinida)', 'Sangardak Plaza & Kotejlar', 'Sariosiyo va Denov mehmonxonalari'] },
      dining: { available: true, statusText: 'Ko‘p (Daryo bo‘yi forel baliq va tandir oshxonalari)', items: ['Sangardak Forel (Xonbaliq) Restorani', 'Sharshara Soy Choyxonalari (Surxon tandir go‘shti)'] },
      shops: { available: true, statusText: 'Bor (Bozorcha va oziq-ovqat do‘konlari)', items: ['Sangardak darasi suvenir, tog‘ asali va meva do‘konlari'] },
      medical: { available: true, statusText: 'Bor (Sangardak sanatoriysi va Sariosiyo shifoxonasi)', items: ['Sangardak sanatoriysi tibbiyot bo‘limi (2 km)', 'Sariosiyo tuman shifoxonasi (30 km)'] },
      connectivity: 'Sharshara va sanatoriy atrofida Uzmobile hamda Ucell 4G/3G ishlaydi.'
    }
  },
  {
    id: 'boysun-darband-canyon',
    title: 'Boysun Tog‘lari, Darband Kanyoni & Xo‘ja Mayxona',
    region: 'Surxondaryo viloyati',
    district: 'Boysun tumani',
    natureType: 'secluded_wild',
    natureLabel: 'Qizil kanyon & Tog‘ bulog‘i',
    crowdLevel: 'O‘rtacha',
    lat: 38.2210,
    lng: 67.0780,
    distanceFromTashkentKm: 530,
    travelTimeText: '6.5 soat',
    totalBudgetText: '350 000 — 750 000 so‘m',
    estimatedPrice: 480000,
    bestSeason: 'Mart — Noyabr',
    imageUrl: '/trips/boysun-darband-canyon.jpg',
    shortDesc: 'YuNESKO ro‘yxatiga kirgan Boysun — qoyalar orasidagi tor Darband kanyoni, g‘or ichidan otilib chiquvchi ulkan Xo‘ja Mayxona bulog‘i va Qizil kanyon.',
    creativeTip: 'Darband darasining eni ba’zi joylarda atigi 1–2 metrga torayib, ikki tomoningizda 100 metrli tik qoyalar qad rostlaydi — haqiqiy Gollivud filmi manzarasi!',
    transport: {
      car: { available: true, duration: '6.5 soat', cost: '220 000 — 350 000 so‘m', details: 'M39 xalqaro trassasi shundoq Darband kanyoni va Xo‘ja Mayxona yonidan o‘tadi.' },
      train: { available: true, duration: '8.5 soat (Darband / Boysun vokzaligacha)', cost: '150 000 — 250 000 so‘m', details: 'Toshkent — Termiz / Sariosiyo poyezdi aynan Darband va Boysun stansiyalarida to‘xtaydi!' },
      bus: { available: true, duration: '8 soat', cost: '120 000 so‘m', details: 'Toshkent — Termiz avtobuslari Darbanddan o‘tadi.' },
      plane: { available: true, duration: '1 soat 15 daq (Termizgacha) + 1.5 soat mashina', cost: '450 000 so‘m', details: 'Termiz aeroportidan 110 km.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Boysun mehmonxonalari va etno-lagerlar)', items: ['Gaza Hotel Boysun', 'Boysun Grand Hotel', 'Xo‘ja Mayxona so‘ri va kempinglari'] },
      dining: { available: true, statusText: 'Mashhur (Boysun tandir go‘shti)', items: ['Darband va Xo‘ja Mayxona Tandir Markazlari', 'Boysun Chinor Choyxonasi'] },
      shops: { available: true, statusText: 'Bor (Darband va Boysun bozorlari)', items: ['Boysun hunarmandchilik (so‘zana, do‘ppi) va dehqon bozori'] },
      medical: { available: true, statusText: 'Bor (Boysun tuman shifoxonasi)', items: ['Darband QVP', 'Boysun tuman markaziy shifoxonasi (18 km)'] },
      connectivity: 'Trassa va Boysun markazida 4G ishlaydi, tor kanyon ichida aloqa past.'
    }
  },
  {
    id: 'omonxona-healing-spring',
    title: 'Omonxona Shifobaxsh Buloq, Tog‘ G‘ori & Sanatoriysi',
    region: 'Surxondaryo viloyati',
    district: 'Boysun tumani',
    natureType: 'mountain_meadow',
    natureLabel: 'Shifobaxsh buloq & Tog‘ g‘ori',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 38.2540,
    lng: 67.2910,
    distanceFromTashkentKm: 550,
    travelTimeText: '7 soat',
    totalBudgetText: '350 000 — 700 000 so‘m',
    estimatedPrice: 450000,
    bestSeason: 'Aprel — Noyabr',
    imageUrl: '/trips/omonxona-healing-spring.jpg',
    shortDesc: 'Boysun tog‘lari bag‘rida joylashgan, jigar va ichki a’zolar uchun dunyoga mashhur shifobaxsh Omonxona bulog‘i hamda tabiiy salqin tuzli g‘or.',
    creativeTip: 'Buloq tepasidagi tabiiy g‘or ichiga kirsangiz, eng jazirama yozda ham tabiiy konditsioner kabi +16 daraja salqin havo urib turadi.',
    transport: {
      car: { available: true, duration: '7 soat', cost: '230 000 — 350 000 so‘m', details: 'Boysun shahridan 16 km sharqda, asfaltlangan tog‘ yo‘li orqali boriladi.' },
      train: { available: true, duration: '9 soat (Boysun vokzaligacha) + 20 daq taksi', cost: '160 000 + 30 000 so‘m', details: 'Toshkent — Termiz poyezdida Boysun bekatiga tushib, Omonxonaga taksida chiqiladi.' },
      bus: { available: true, duration: '8 soat (Boysungacha)', cost: '120 000 so‘m', details: 'Boysun avtoshohbekatidan Omonxonaga Damas va taksilar qatnaydi.' },
      plane: { available: true, duration: '1 soat 15 daq (Termiz) + 1.5 soat taksi', cost: '450 000 so‘m', details: 'Termiz aeroportidan Boysun orqali boriladi.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Juda ko‘p (Sanatoriy va 50+ mehmon uylari)', items: ['Omonxona Sanatoriysi', 'Omonxona Plaza Hotel', 'O‘nlab oilaviy mehmon uylari va kotejlar'] },
      dining: { available: true, statusText: 'Ko‘p (Parhez va milliy oshxonalar)', items: ['Omonxona Choyxonalari (parhez sho‘rvalar, tandir go‘sht, tog‘ choyi)'] },
      shops: { available: true, statusText: 'Bor (Bozorcha va do‘konlar)', items: ['Omonxona bozorchasi (tog‘ giyohlari, qurut, bodom, idishlar va oziq-ovqat)'] },
      medical: { available: true, statusText: '24/7 Sanatoriy shifokorlari va dorixonalar', items: ['Omonxona davolash-diagnostika markazi (shundoq buloq yonida)'] },
      connectivity: '4G LTE (Uzmobile, Ucell, Beeline) to‘liq ishlaydi.'
    }
  },
  {
    id: 'zarautsoy-gorge',
    title: 'Zarautsoy Qadimiy Qoyatosh Rasmlari & Ko‘hitang Qo‘riqxonasi',
    region: 'Surxondaryo viloyati',
    district: 'Sherobod tumani',
    natureType: 'secluded_wild',
    natureLabel: 'Yovvoyi tog‘ darasi & Tarix',
    crowdLevel: 'Yolg‘iz & Sokin',
    lat: 37.9320,
    lng: 66.7450,
    distanceFromTashkentKm: 580,
    travelTimeText: '7 soat 20 daq',
    totalBudgetText: '350 000 — 700 000 so‘m',
    estimatedPrice: 460000,
    bestSeason: 'Mart — Июн, Sentyabr — Noyabr',
    imageUrl: '/trips/zarautsoy-gorge.jpg',
    shortDesc: 'Ko‘hitang tog‘laridagi yovvoyi Zarautsoy darasi, 15 ming yillik qizil oxra bilan chizilgan ibtidoiy qoyatosh rasmlari va yovvoyi arxarlar makoni.',
    creativeTip: 'Yo‘l-yo‘lakay Sherobodning mashhur anor bog‘larini ko‘ring va Xo‘jaikon tuz g‘ori sanatoriysiga ham kirib o‘ting.',
    transport: {
      car: { available: true, duration: '7 soat 20 daq', cost: '250 000 — 380 000 so‘m', details: 'M39 trassasi bilan Sherobod tumani Qizilolma qishlog‘i orqali boriladi.' },
      train: { available: true, duration: '9 soat (Boysun/Termizgacha) + 1 soat mashina', cost: '170 000 + 80 000 so‘m', details: 'Poyezdda Boysun yoki Termizga tushib, Sherobodga mashinada o‘tiladi.' },
      bus: { available: true, duration: '8.5 soat (Sherobodgacha)', cost: '125 000 so‘m', details: 'Toshkent — Termiz avtobuslari Sheroboddan o‘tadi.' },
      plane: { available: true, duration: '1 soat 15 daq (Termiz) + 1 soat taksi', cost: '450 000 so‘m', details: 'Termiz aeroportidan 90 km.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Qishloq mehmon uylari va Xo‘jaikon sanatoriysi', items: ['Zarautsoy Eco Guest House', 'Xo‘jaikon Tuz G‘ori Sanatoriysi (yaqinida)', 'Sherobod mehmonxonalari'] },
      dining: { available: true, statusText: 'Qishloq choyxonalari (Dara ichiga yegulik oling)', items: ['Qizilolma va Sherobod tandir kabob hamda baliq choyxonalari'] },
      shops: { available: false, statusText: 'Qo‘riqxona ichida do‘kon yo‘q!', items: ['Suv va oziq-ovqatni Sherobod markazidan yoki Qizilolma qishlog‘idan oling.'] },
      medical: { available: true, statusText: 'Qishloq vrachlik punkti (6 km)', items: ['Qizilolma QVP', 'Sherobod tuman shifoxonasi (30 km)'] },
      connectivity: 'Qishloqda Uzmobile 3G/4G bor, qo‘riqxona darasida aloqa cheklangan.'
    }
  },

  // ==========================================
  // 6. BUXORO VILOYATI (3 ta maskan)
  // ==========================================
  {
    id: 'labi-hovuz-old-bukhara',
    title: 'Labi Hovuz, Minorai Kalon & Ark Qal’asi (Eski Buxoro)',
    region: 'Buxoro viloyati',
    district: 'Buxoro shahri',
    natureType: 'historic_lively',
    natureLabel: 'Qadimiy shahar & Hovuz bo‘yi',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 39.7732,
    lng: 64.4205,
    distanceFromTashkentKm: 570,
    travelTimeText: '3 soat 50 daq (Afrosiyob)',
    totalBudgetText: '400 000 — 900 000 so‘m',
    estimatedPrice: 550000,
    bestSeason: 'Yil davomida',
    imageUrl: '/trips/labi-hovuz-old-bukhara.jpg',
    shortDesc: '2500 yillik tirik tarix — Labi Hovuz atrofidagi tut daraxtlari, Poi Kalon majmuasi, Chor Minor va gumbazli savdo toqlari.',
    creativeTip: 'Ertalab soat 07:00 da turistlar uyg‘onmasdan Minorai Kalon maydonida sayr qiling, tushlikda esa mis qozonda pishgan haqiqiy Buxoro "Oshi Sofi"sini tatib ko‘ring.',
    transport: {
      car: { available: true, duration: '6.5 — 7 soat', cost: '200 000 — 300 000 so‘m', details: 'Samarqand va Navoiy (M37) magistrali orqali tekis yo‘l.' },
      train: { available: true, duration: '3 soat 50 daq', cost: '220 000 — 400 000 so‘m', details: 'Afrosiyob tezyurar poyezdi va Sharq poyezdlari har kuni Kogon (Buxoro) vokzaliga qatnaydi!' },
      bus: { available: true, duration: '8 soat', cost: '100 000 so‘m', details: 'Toshkent avtovokzalidan kunduzgi va tungi avtobuslar qatnaydi.' },
      plane: { available: true, duration: '1 soat 10 daq', cost: '350 000 — 650 000 so‘m', details: 'Buxoro xalqaro aeroporti shahar markazidan atigi 10 daqiqalik masofada.' }
    },
    nearby: {
      hotels: { available: true, statusText: '200+ ta sharqona butik-mehmonxona va 5★ otellar', items: ['Mercure Bukhara Old Town', 'Komil Bukhara Boutique Hotel', 'Wyndham Bukhara', 'Lyabi House Hotel'] },
      dining: { available: true, statusText: 'Juda ko‘p (Rooftop va hovuz bo‘yi restoranlari)', items: ['Chinar (Labi Hovuz)', 'Old Bukhara Restaurant', 'Zaytoon', 'The Plov (Oshi Sofi)'] },
      shops: { available: true, statusText: 'Tarixiy savdo toqlari va supermarketlar', items: ['Toqi Zargaron, Toqi Telpakfurushon (ipak, pichoq, zardo‘zlik, ziravorlar)', 'Buxoro Chinni Mall'] },
      medical: { available: true, statusText: '24/7 klinika va dorixonalar', items: ['Buxoro shahar shifoxonalari va har ko‘chada 24 soatlik dorixonalar'] },
      connectivity: '5G, 4G+ va bepul Wi-Fi barcha maskanlarda ishlaydi.'
    }
  },
  {
    id: 'sitorai-mokhi-khosa',
    title: 'Sitorai Mohi Xosa (Amir Yozgi Saroyi & Tovusli Bog‘)',
    region: 'Buxoro viloyati',
    district: 'Buxoro shahri chekkasi',
    natureType: 'historic_lively',
    natureLabel: 'Tovusli bog‘ & Yozgi saroy',
    crowdLevel: 'O‘rtacha',
    lat: 39.8135,
    lng: 64.4415,
    distanceFromTashkentKm: 565,
    travelTimeText: '4 soat (Afrosiyob bilan)',
    totalBudgetText: '380 000 — 800 000 so‘m',
    estimatedPrice: 500000,
    bestSeason: 'Yil davomida',
    imageUrl: '/trips/sitorai-mokhi-khosa.jpg',
    shortDesc: '"Oy va yulduzlarga o‘xshash saroy" — Buxoro amirining salqin bog‘ va hovuz bilan o‘ralgan, tovuslar erkin yuruvchi muhtasham yozgi qarorgohi.',
    creativeTip: 'Saroyning "Oq zal"idagi ganch ustiga ishlangan ko‘zguli naqshlar va bog‘da quyrug‘ini yoyib yurgan tovuslar fonida ajoyib fotosessiya qiling.',
    transport: {
      car: { available: true, duration: '6.5 soat', cost: '200 000 — 300 000 so‘m', details: 'Buxoro markazidan 4 km shimolda, M37 trassasi yaqinida.' },
      train: { available: true, duration: '3 soat 50 daq + 20 daq taksi', cost: '250 000 + 25 000 so‘m', details: 'Buxoro vokzalidan Yandex taksida 20 daqiqada boriladi.' },
      bus: { available: true, duration: '8 soat', cost: '100 000 so‘m', details: 'Buxoro shahar avtobuslari saroy darvozasigacha qatnaydi.' },
      plane: { available: true, duration: '1 soat 10 daq + 15 daq taksi', cost: '400 000 so‘m', details: 'Buxoro aeroportidan 15 daqiqa.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Sanatoriy va Buxoro mehmonxonalari 4 km)', items: ['Sitorai Mohi Xosa Sanatoriysi (yonida)', 'Eski Buxoro mehmonxonalari (10 daq)'] },
      dining: { available: true, statusText: 'Bor (Bog‘ choyxonalari va tandir kabob)', items: ['Mohi Xosa Bog‘ Choyxonasi', 'Buxoro Vag‘ozi (g‘ijduvon shashlik va baliq)'] },
      shops: { available: true, statusText: 'Suvenir va oziq-ovqat do‘konlari bor', items: ['Saroy kirishidagi kashtachilik va chinni galereyalari, minimarketlar'] },
      medical: { available: true, statusText: 'Shundoq yonida sanatoriy va dorixonalar bor', items: ['Sitorai Mohi Xosa sanatoriysi tibbiyot markazi'] },
      connectivity: '4G LTE to‘liq ishlaydi.'
    }
  },
  {
    id: 'tudakul-silk-road-beach',
    title: 'To‘dako‘l Suv Ombori & Silk Road Family Resort Plyaji',
    region: 'Buxoro / Navoiy chegarasi',
    district: 'Qiziltepa / Kogon yo‘li',
    natureType: 'lake_reservoir',
    natureLabel: 'Cho‘l dengizi & Tropik plyaj',
    crowdLevel: 'O‘rtacha',
    lat: 39.8550,
    lng: 64.7950,
    distanceFromTashkentKm: 530,
    travelTimeText: '3.5 soat (poyezd bilan)',
    totalBudgetText: '350 000 — 750 000 so‘m',
    estimatedPrice: 480000,
    bestSeason: 'May — Sentyabr',
    imageUrl: '/trips/tudakul-silk-road-beach.jpg',
    shortDesc: 'Cho‘l o‘rtasidagi haqiqiy dengiz kurorti — palma soyabonli qumloq plyaj, akvapark, cheksiz (infinity) basseyn, katamaran va SPA.',
    creativeTip: 'Eski Buxoro ziyoratidan so‘ng ikkinchi kunni To‘dako‘l plyajida cho‘milib va quyosh botishini suv bo‘yida kuzatib o‘tkazish ideal kombinatsiya.',
    transport: {
      car: { available: true, duration: '6 soat', cost: '190 000 — 280 000 so‘m', details: 'Navoiy va Buxoro o‘rtasida, M37 trassasidan 12 km asfalt yo‘l bilan kiriladi.' },
      train: { available: true, duration: '3.5 soat (Qiziltepa/Buxorogacha) + 25 daq taksi', cost: '220 000 + 40 000 so‘m', details: 'Buxoro yoki Navoiy vokzalidan taksida 25–30 daqiqa.' },
      bus: { available: true, duration: '7.5 soat', cost: '100 000 so‘m', details: 'Toshkent — Buxoro avtobusida Qiziltepa chorrahasida tushib, taksida kiriladi.' },
      plane: { available: true, duration: '1 soat (Buxoro yoki Navoiy aeroporti)', cost: '400 000 so‘m', details: 'Buxoro aeroportidan 30 km.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Plyaj ichida kotej va bungalo-mehmonxona)', items: ['Silk Road Family Resort Cottages', 'Buxoro mehmonxonalari (30 km)'] },
      dining: { available: true, statusText: 'Bor (Kurort restorani va baliq barlari)', items: ['To‘dako‘l Beach Restaurant', 'Qiziltepa Baliq Markazi (yo‘l bo‘yida)'] },
      shops: { available: true, statusText: 'Kurort ichida do‘kon bor', items: ['Plyaj aksessuarlari va salqin ichimliklar minimarketi'] },
      medical: { available: true, statusText: 'Kurortda qutqaruvchi va tibbiyot xonasi bor', items: ['Silk Road Resort First Aid punkti', 'Qiziltepa tuman shifoxonasi (18 km)'] },
      connectivity: 'Kurort hududida 4G va Wi-Fi ishlaydi.'
    }
  },

  // ==========================================
  // 7. NAVOIY VILOYATI (3 ta maskan)
  // ==========================================
  {
    id: 'sarmishsoy-canyon',
    title: 'Sarmishsoy Qoyatosh Kanyoni & 10 000 ta Petrogliflar',
    region: 'Navoiy viloyati',
    district: 'Navbahor tumani',
    natureType: 'secluded_wild',
    natureLabel: 'Tog‘ kanyoni & Qadimiy rasmlar',
    crowdLevel: 'Yolg‘iz & Sokin',
    lat: 40.2890,
    lng: 65.5820,
    distanceFromTashkentKm: 440,
    travelTimeText: '3 soat 30 daq (poyezd bilan)',
    totalBudgetText: '280 000 — 600 000 so‘m',
    estimatedPrice: 380000,
    bestSeason: 'Mart — Noyabr',
    imageUrl: '/trips/sarmishsoy-canyon.jpg',
    shortDesc: 'Qoratog‘ darasida qora bazalt qoyalarga o‘yib chizilgan 10 000 dan ortiq qadimiy rasmlar (ochiq osmon ostidagi dunyodagi eng yirik tosh galereyalardan biri) va sersuv soy.',
    creativeTip: 'Quyosh qiyalab tushganda qora yaltiroq qoyalardagi kiyik, qoplon va kosmik qiyofali qadimiy chizmalar eng aniq ko‘rinadi.',
    transport: {
      car: { available: true, duration: '5 soat', cost: '180 000 — 260 000 so‘m', details: 'Navoiy — Nurota trassasidan Sarmishsoy muzey-qo‘riqxonasigacha asfalt yo‘l.' },
      train: { available: true, duration: '3 soat (Navoiygacha) + 30 daq taksi', cost: '190 000 + 50 000 so‘m', details: 'Afrosiyob poyezdida Navoiy vokzaliga tushib, 35 km taksida boriladi.' },
      bus: { available: true, duration: '6.5 soat (Navoiygacha)', cost: '85 000 so‘m', details: 'Navoiydan Nurota yo‘nalishidagi taksilar daraga kiraverishdan o‘tadi.' },
      plane: { available: true, duration: '1 soat (Navoiy aeroporti) + 35 daq taksi', cost: '380 000 so‘m', details: 'Navoiy xalqaro aeroportidan 40 km.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Dara ichida kotejlar va o‘tov lageri)', items: ['Sarmishsoy Resort & Yurt Camp', 'Grand M Hotel Navoiy (35 km)'] },
      dining: { available: true, statusText: 'Bor (Sarmishsoy dam olish maskani restorani)', items: ['Sarmishsoy Soy Choyxonasi', 'Karmana tandir va shashlik markazlari'] },
      shops: { available: false, statusText: 'Muzey kirishida suvenir va suv do‘koni bor', items: ['Asosiy xaridlarni Navoiy yoki Navbahor markazida qiling.'] },
      medical: { available: true, statusText: 'Dam olish maskanida tibbiy xona bor', items: ['Navbahor tuman shifoxonasi (20 km)'] },
      connectivity: 'Muzey kirishi va lagerda 4G/3G bor, kanyon ichkarisida signal susayadi.'
    }
  },
  {
    id: 'sentob-ecovillage',
    title: 'Sentob (Sintob) Tosh Qishlog‘i & 1600m Fozilmon Ko‘li',
    region: 'Navoiy viloyati',
    district: 'Nurota tumani',
    natureType: 'secluded_wild',
    natureLabel: 'Qadimiy tosh qishloq & Tog‘ ko‘li',
    crowdLevel: 'Yolg‘iz & Sokin',
    lat: 40.5880,
    lng: 66.6520,
    distanceFromTashkentKm: 320,
    travelTimeText: '4 soat 20 daq',
    totalBudgetText: '280 000 — 550 000 so‘m',
    estimatedPrice: 360000,
    bestSeason: 'Aprel — Noyabr',
    imageUrl: '/trips/sentob-ecovillage.jpg',
    shortDesc: 'UNWTO tomonidan "Dunyoning eng yaxshi turizm qishlog‘i" deb e’tirof etilgan Nurota tog‘laridagi yashil Sentob vohasi va cho‘qqidagi Fozilmon ko‘li.',
    creativeTip: 'Sentob soy bo‘ylab 2500 yillik tosh uylar orasida piyoda yuring va otda yoki Niva mashinasida tog‘ tepasidagi sirli Fozilmon ko‘liga chiqing.',
    transport: {
      car: { available: true, duration: '4 soat 20 daq', cost: '160 000 — 240 000 so‘m', details: 'Jizzax — Forish — Yangiqishloq orqali Sentob qishlog‘igacha asfalt yo‘l.' },
      train: { available: true, duration: '1.5 soat (Jizzaxgacha) + 2 soat taksi', cost: '120 000 + 90 000 so‘m', details: 'Jizzax vokzalidan Forish orqali Sentobga taksida boriladi.' },
      bus: { available: false, duration: 'Forish/Jizzaxgacha boradi', cost: '60 000 so‘m', details: 'Sentobning o‘ziga mahalliy taksilarda kiriladi.' },
      plane: { available: false, duration: 'Navoiy yoki Samarqand aeroportidan 2.5 soat', cost: '—', details: 'Toshkentdan mashina yoki Jizzax poyezdi orqali borish ancha yaqin.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (20+ ta autentik eko-mehmon uylari)', items: ['Rahima Guest House Sentob', 'Muhiddin Eco House', 'Sentob Chashma Guest House'] },
      dining: { available: true, statusText: 'Mehmon uylarida organik tog‘ dasturxoni', items: ['Sentob yong‘oqli holvasi, tandir noni, tog‘ asali va qozon kabobi'] },
      shops: { available: true, statusText: 'Qishloq kichik do‘konlari bor', items: ['Sentob markaziy do‘konchasi (naqd pul olib olish tavsiya etiladi!)'] },
      medical: { available: true, statusText: 'Qishloq vrachlik punkti bor', items: ['Sentob QVP (Fozilmon ko‘liga chiqishda shaxsiy aptechka oling)'] },
      connectivity: 'Qishloqda Uzmobile va Ucell 3G/4G ishlaydi, Fozilmon ko‘lida aloqa yo‘q.'
    }
  },
  {
    id: 'nurota-chashma',
    title: 'Nurota Muqaddas Chashmasi & Iskandar Zulqarnayn Qal’asi',
    region: 'Navoiy viloyati',
    district: 'Nurota shahri',
    natureType: 'historic_lively',
    natureLabel: 'Minglab baliqlar suzuvchi buloq & Qal’a',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 40.5585,
    lng: 65.6895,
    distanceFromTashkentKm: 410,
    travelTimeText: '4 soat (poyezd + taksi)',
    totalBudgetText: '250 000 — 500 000 so‘m',
    estimatedPrice: 340000,
    bestSeason: 'Yil davomida',
    imageUrl: '/trips/nurota-chashma.jpg',
    shortDesc: 'Soniyasiga 400 litr suv chiqaradigan, qishin-yozin +19.5 daraja iliq bo‘lib turadigan shifobaxsh Nurota Chashmasi va tepalikdagi miloddan avvalgi IV asr Nur (Iskandar) qal’asi.',
    creativeTip: 'Chashma ustidagi Nur tepaligiga chiqsangiz, butun Nurota vohasi va qadimiy yer osti "koriz" suv tizimi ko‘rinadi.',
    transport: {
      car: { available: true, duration: '4 soat 50 daq', cost: '170 000 — 250 000 so‘m', details: 'Samarqand/Navoiy yoki Jizzax/Forish orqali Nurota shahriga kirib boriladi.' },
      train: { available: true, duration: '3 soat (Navoiygacha) + 50 daq taksi', cost: '190 000 + 50 000 so‘m', details: 'Afrosiyobda Navoiy vokzaliga tushib, Nurotaga (65 km) taksida boriladi.' },
      bus: { available: true, duration: '6 soat', cost: '85 000 so‘m', details: 'Toshkent — Nurota / Navoiy avtobuslari qatnaydi.' },
      plane: { available: true, duration: '1 soat (Navoiy aeroporti) + 50 daq taksi', cost: '380 000 so‘m', details: 'Navoiy aeroportidan 65 km.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Chashma yonida mehmonxona va mehmon uylari)', items: ['Nurota Hotel', 'Ruslan Guest House (Chashmadan 200m)', 'Nurota Star'] },
      dining: { available: true, statusText: 'Ko‘p (Chashma maydoni oshxonalari)', items: ['Chashma Milliy Taomlar (Nurota tandir go‘shti va shashlik)', 'Nur Choyxonasi'] },
      shops: { available: true, statusText: 'Barcha do‘kon, bozor va suvenirlar bor', items: ['Nurota kashtachilik (so‘zana) do‘konlari', 'Nurota markaziy bozori va bankomatlar'] },
      medical: { available: true, statusText: 'Shahar shifoxonasi va 24/7 dorixonalar', items: ['Nurota tuman tibbiyot birlashmasi (1 km)'] },
      connectivity: '4G LTE barcha operatorlarda to‘liq ishlaydi.'
    }
  },

  // ==========================================
  // 8. FARG‘ONA VILOYATI (3 ta maskan)
  // ==========================================
  {
    id: 'shohimardon-kubbon-lake',
    title: 'Shohimardon Tog‘ Vohasi & Moviy Ko‘kko‘l (Qubbon Ko‘li)',
    region: 'Farg‘ona viloyati',
    district: 'Farg‘ona tumani (Shohimardon)',
    natureType: 'lake_reservoir',
    natureLabel: 'Ikki tog‘ daryosi & Zumrad ko‘l',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 39.9830,
    lng: 71.8050,
    distanceFromTashkentKm: 375,
    travelTimeText: '5.5 soat',
    totalBudgetText: '350 000 — 700 000 so‘m',
    estimatedPrice: 460000,
    bestSeason: 'Aprel — Noyabr',
    imageUrl: '/trips/shohimardon-kubbon-lake.jpg',
    shortDesc: 'Oloy tog‘lari bag‘rida Oqsuv va Ko‘ksuv daryolari qo‘shilgan maftunkor Shohimardon hamda dor yo‘li bilan chiqiladigan 1724 metr balandlikdagi Ko‘kko‘l (Qubbon ko‘li).',
    creativeTip: 'Dor yo‘lida Ko‘kko‘lga ko‘tarilib, ko‘l bo‘yida qayiqda sayr qiling. (Muhim: yo‘l chegara postidan o‘tgani uchun har bir yo‘lovchida ID-karta yoki pasport bo‘lishi shart!)',
    transport: {
      car: { available: true, duration: '5.5 soat', cost: '180 000 — 280 000 so‘m', details: 'Qamchiq dovoni — Farg‘ona — Vodil orqali Shohimardongacha asfalt yo‘l (chegara postida 24/7 o‘tkazish tizimi ishlaydi).' },
      train: { available: true, duration: '4.5 soat (Marg‘ilon/Farg‘onagacha) + 1 soat taksi', cost: '130 000 + 60 000 so‘m', details: 'Toshkent — Andijon poyezdida Marg‘ilon vokzaliga tushib, Vodil/Shohimardon taksisiga o‘tiriladi.' },
      bus: { available: true, duration: '6 soat (Farg‘onagacha)', cost: '90 000 so‘m', details: 'Farg‘ona va Vodildan Shohimardonga avtobus va taksilar qatnaydi.' },
      plane: { available: true, duration: '50 daq (Farg‘ona aeroporti) + 1 soat taksi', cost: '350 000 so‘m', details: 'Farg‘ona xalqaro aeroportidan 55 km.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Ko‘p (Daryo bo‘yi dachalar, sanatoriy va mehmon uylari)', items: ['Shohimardon Oromgohi', 'Oqsuv va Ko‘ksuv bo‘yidagi kotejlar', 'Yordon tog‘ dachalari'] },
      dining: { available: true, statusText: 'Ko‘p (Soy ustidagi so‘rilar va kabobxonalar)', items: ['Shohimardon Soy Choyxonalari (tog‘ shashligi, devzira oshi, qaymoq)'] },
      shops: { available: true, statusText: 'Shohimardon markazida bozor va do‘konlar bor', items: ['Shohimardon dehqon bozori va do‘konlari (naqd pul ham oling)'] },
      medical: { available: true, statusText: 'Shohimardon shifoxonasi va dorixonalar bor', items: ['Shohimardon qishloq shifoxonasi va tez yordam bo‘limi'] },
      connectivity: 'Shohimardon markazida O‘zbekiston mobil operatorlari (Uzmobile, Ucell) ishlaydi, Ko‘kko‘l darasida aloqa pastroq.'
    }
  },
  {
    id: 'vodil-chinor-valley',
    title: 'Vodil Asriy Chinorlari, Chimyon Sanatoriysi & Arsif',
    region: 'Farg‘ona viloyati',
    district: 'Farg‘ona tumani',
    natureType: 'waterfall_river',
    natureLabel: 'Tog‘ etagi soylari & Chinorzor',
    crowdLevel: 'O‘rtacha',
    lat: 40.1750,
    lng: 71.7280,
    distanceFromTashkentKm: 345,
    travelTimeText: '4 soat 45 daq',
    totalBudgetText: '250 000 — 550 000 so‘m',
    estimatedPrice: 360000,
    bestSeason: 'Yil davomida (Yozda malina va meva mavsumi)',
    imageUrl: '/trips/vodil-chinor-valley.jpg',
    shortDesc: 'Oloy tog‘lari etagidagi salqin Vodil bog‘lari, ichiga choyxona sig‘adigan 800 yillik ulkan chinor, Shohimardonsoy va ma’danli Chimyon suv manbai.',
    creativeTip: 'Yozda Vodilning xushbo‘y malina bog‘laridan yangi terilgan malina va qaymoq tatib ko‘ring hamda Farg‘ona devzira oshini buyurtma qiling.',
    transport: {
      car: { available: true, duration: '4 soat 45 daq', cost: '160 000 — 230 000 so‘m', details: 'Qamchiq dovoni va Farg‘ona shahri orqali Vodilga 25 daqiqada boriladi.' },
      train: { available: true, duration: '4.5 soat (Marg‘ilongacha) + 30 daq taksi', cost: '130 000 + 35 000 so‘m', details: 'Marg‘ilon vokzalidan Farg‘ona va Vodilga taksilar juda ko‘p.' },
      bus: { available: true, duration: '5.5 soat', cost: '85 000 so‘m', details: 'Toshkent — Farg‘ona avtobuslari va Qo‘yliq taksilari.' },
      plane: { available: true, duration: '50 daq (Farg‘ona aeroporti) + 20 daq taksi', cost: '320 000 so‘m', details: 'Farg‘ona aeroportidan 22 km.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Ko‘p (Mashhur Chimyon sanatoriysi va Farg‘ona otellari)', items: ['Chimyon Sanatoriysi (Farg‘ona)', 'Vodil dam olish maskanlari', 'Asia Hotel Fergana (20 km)'] },
      dining: { available: true, statusText: 'Juda ko‘p (Soy bo‘yi choyxonalari)', items: ['Vodil Soy Choyxonalari (choyxona devzira palovi, tandir somsa)'] },
      shops: { available: true, statusText: 'Barcha do‘kon va bozorlar bor', items: ['Vodil markaziy bozori (malina, tog‘ asali, bodom, qurut)'] },
      medical: { available: true, statusText: 'Sanatoriy va tuman shifoxonasi', items: ['Farg‘ona tuman tibbiyot birlashmasi (Vodilda joylashgan)'] },
      connectivity: '4G LTE barcha operatorlarda a’lo ishlaydi.'
    }
  },
  {
    id: 'rishton-kokand-palace',
    title: 'Qo‘qon Xudoyorxon O‘rdasi & Rishton Moviy Kulolchilik Markazi',
    region: 'Farg‘ona viloyati',
    district: 'Qo‘qon shahri — Rishton tumani',
    natureType: 'historic_lively',
    natureLabel: 'Xon saroyi & Kulolchilik',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 40.5385,
    lng: 70.9380,
    distanceFromTashkentKm: 235,
    travelTimeText: '3 soat 30 daq',
    totalBudgetText: '220 000 — 500 000 so‘m',
    estimatedPrice: 320000,
    bestSeason: 'Yil davomida',
    imageUrl: '/trips/rishton-kokand-palace.jpg',
    shortDesc: 'Qamchiq dovonidan tushishingiz bilan sizni kutib oluvchi muhtasham Xudoyorxon saroyi, Jome masjidi va Rishtonning xalqaro kulolchilik ustaxonalari.',
    creativeTip: 'Rishtondagi "Xalqaro Kulolchilik Markazi"da kulolchilik charxida o‘z qo‘lingiz bilan lagan yasab ko‘ring va Qo‘qonning mashhur xalvasi hamda garang somsasidan oling.',
    transport: {
      car: { available: true, duration: '3 soat 30 daq', cost: '120 000 — 180 000 so‘m', details: 'Qamchiq dovoni orqali Farg‘ona vodiysiga kirishdagi birinchi yirik shahar.' },
      train: { available: true, duration: '3 soat 40 daq', cost: '110 000 — 180 000 so‘m', details: 'Toshkent — Andijon poyezdi Qo‘qon vokzalida to‘xtaydi (kuniga 2–3 reys).' },
      bus: { available: true, duration: '4 soat', cost: '70 000 so‘m', details: 'Qo‘yliq avtoshohbekatidan taksilar har 5 daqiqada jo‘naydi.' },
      plane: { available: true, duration: '45 daq (Qo‘qon aeroporti)', cost: '280 000 so‘m', details: 'Yangilangan Qo‘qon aeroportiga Silk Avia reyslari bor!' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Ko‘p (Qo‘qon va Rishton mehmonxonalari)', items: ['Asmald Palace Hotel (Qo‘qon)', 'Silk Road Kokand', 'Rishton Kulollar Mehmon Uyi'] },
      dining: { available: true, statusText: 'Juda ko‘p (Choyxona oshi va Qo‘qon somsa)', items: ['Qo‘qon Markaziy Osh va Somsa markazlari', 'Zamin Restorani', 'Rishton Cho‘ng‘ara oshxonalari'] },
      shops: { available: true, statusText: 'Rishton sopol galereyalari va Qo‘qon bozori', items: ['Rishton Xalqaro Kulolchilik Markazi do‘konlari', 'Qo‘qon xalva rastalari'] },
      medical: { available: true, statusText: '24/7 klinika va dorixonalar', items: ['Qo‘qon shahar tibbiyot markazlari va dorixonalar'] },
      connectivity: '5G va 4G+ to‘liq ishlaydi.'
    }
  },

  // ==========================================
  // 9. NAMANGAN VILOYATI (2 ta maskan)
  // ==========================================
  {
    id: 'chodak-waterfall-bridge',
    title: 'Chodak Soyi, Osma Shishali Ko‘prik & Yig‘lovchi Qoya Sharsharasi',
    region: 'Namangan viloyati',
    district: 'Pop tumani',
    natureType: 'waterfall_river',
    natureLabel: 'Sharsharali qoya & Soy usti so‘rilar',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 41.1320,
    lng: 70.7910,
    distanceFromTashkentKm: 185,
    travelTimeText: '2 soat 40 daq',
    totalBudgetText: '200 000 — 450 000 so‘m',
    estimatedPrice: 290000,
    bestSeason: 'Mart — Noyabr',
    imageUrl: '/trips/chodak-waterfall-bridge.jpg',
    shortDesc: 'Qamchiq dovonidan tushganda chap tomonda joylashgan 4000 yillik Chodak qishlog‘i — moxli "Yig‘lovchi qoya" sharsharasi, osma shishali ko‘prik, kanat va muzdek Chodaksoy.',
    creativeTip: 'Chodaksoy daryosi shundoq oyoqlaringiz ostidan shovullab oqib o‘tadigan suv usti so‘rilarida o‘tirib, yangi qovurilgan forel balig‘i va tog‘ choyidan bahramand bo‘ling.',
    transport: {
      car: { available: true, duration: '2 soat 40 daq', cost: '110 000 — 170 000 so‘m', details: 'Qamchiq dovonidan o‘tishingiz bilan (G‘urumsaroy/Chodak burilishi) 15 daqiqada boriladi — Toshkentga vodiydagi eng yaqin maskan!' },
      train: { available: true, duration: '3 soat (Pop vokzaligacha) + 30 daq taksi', cost: '110 000 + 40 000 so‘m', details: 'Toshkent — Andijon poyezdida Pop vokzaliga tushib, Chodakka taksida chiqiladi.' },
      bus: { available: false, duration: 'Qo‘yliqdan vodiy taksilarida to‘g‘ri boriladi', cost: '120 000 so‘m', details: 'Namangan/Pop yo‘nalishidagi barcha mashinalar Chodak burilishidan o‘tadi.' },
      plane: { available: true, duration: '50 daq (Namangan aeroporti) + 1 soat taksi', cost: '320 000 so‘m', details: 'Toshkentdan mashinada borish tezroq (2.5 soat).' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Juda ko‘p (Zamonaviy tog‘ kurortlari va kotejlar)', items: ['Chodak Grand Resort', 'Sohil Chodak Hotel & Cottages', 'Koinot tog‘ kotejlari'] },
      dining: { available: true, statusText: 'Yuzlab soy usti choyxona va restoranlar', items: ['Chodaksoy Suv Usti So‘rilari', 'Yig‘lovchi Qoya Forel Restorani'] },
      shops: { available: true, statusText: 'Bor (Minimarketlar va tog‘ mevalari bozorchasi)', items: ['Chodak markazi do‘konlari, qurut, bodom va yong‘oq rastalari'] },
      medical: { available: true, statusText: 'Chodak shifoxonasi va dorixonalar bor', items: ['Chodak poliklinikasi va 24/7 dorixonalar'] },
      connectivity: '4G LTE va kurortlarda Wi-Fi to‘liq ishlaydi.'
    }
  },
  {
    id: 'nanay-kosonsoy-resort',
    title: 'Nanay Tog‘ Archazorlari & Kosonsoy Suv Ombori',
    region: 'Namangan viloyati',
    district: 'Yangiqo‘rg‘on / Kosonsoy tumani',
    natureType: 'mountain_meadow',
    natureLabel: 'Archazor soy & Moviy suv ombori',
    crowdLevel: 'O‘rtacha',
    lat: 41.4650,
    lng: 71.6820,
    distanceFromTashkentKm: 330,
    travelTimeText: '4 soat 45 daq',
    totalBudgetText: '250 000 — 550 000 so‘m',
    estimatedPrice: 350000,
    bestSeason: 'May — Oktabr',
    imageUrl: '/trips/nanay-kosonsoy-resort.jpg',
    shortDesc: 'Farg‘ona vodiysining "kislorod ombori" hisoblangan salqin Nanay va Kosonsoy tog‘lari — archazor daralar, Podshota daryosi va Kosonsoy suv ombori.',
    creativeTip: 'Yozning eng issiq oyida ham Nanayda kechasi ko‘rpa yopib uxlaysiz — Podshota soy bo‘yida pishgan Namangan devzira oshi va olma choyini tatib ko‘ring.',
    transport: {
      car: { available: true, duration: '4 soat 45 daq', cost: '160 000 — 230 000 so‘m', details: 'Qamchiq dovoni — Chust — Namangan — Yangiqo‘rg‘on — Nanay asfalt trassasi.' },
      train: { available: true, duration: '4 soat (Namangangacha) + 45 daq taksi', cost: '125 000 + 50 000 so‘m', details: 'Namangan vokzalidan Nanay va Kosonsoyga taksilar qatnaydi.' },
      bus: { available: true, duration: '5.5 soat (Namangangacha)', cost: '85 000 so‘m', details: 'Toshkent — Namangan avtobuslari va Qo‘yliq taksilari.' },
      plane: { available: true, duration: '50 daq (Namangan aeroporti) + 50 daq taksi', cost: '320 000 so‘m', details: 'Namangan aeroportidan 55 km.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Ko‘p (Sanatoriy, dam olish maskanlari va dachalar)', items: ['Nanay Oromgohi & Kotejlari', 'Kosonsoy Sanatoriysi', 'O‘ng‘or tog‘ dachalari'] },
      dining: { available: true, statusText: 'Ko‘p (Soy bo‘yi choyxonalari)', items: ['Podshota Soy Choyxonalari', 'Kosonsoy Somsa va Kabob markazlari'] },
      shops: { available: true, statusText: 'Bor (Nanay bozori va do‘konlar)', items: ['Nanay dehqon bozori (olma, olxo‘ri, tog‘ asali, qurut)'] },
      medical: { available: true, statusText: 'Sanatoriy va poliklinika bor', items: ['Kosonsoy sanatoriysi va Nanay QVP'] },
      connectivity: '4G/3G aloqa dam olish maskanlarida barqaror ishlaydi.'
    }
  },

  // ==========================================
  // 10. ANDIJON VILOYATI (2 ta maskan)
  // ==========================================
  {
    id: 'xonobod-resort-kampirravot',
    title: 'Xonobod Tog‘ Kurorti, Kanat Yo‘li & Andijon Dengizi',
    region: 'Andijon viloyati',
    district: 'Xonobod shahri',
    natureType: 'lake_reservoir',
    natureLabel: 'Yashil tepaliklar & Moviy suv ombori',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 40.8050,
    lng: 72.9850,
    distanceFromTashkentKm: 410,
    travelTimeText: '5.5 soat (poyezd yoki mashina)',
    totalBudgetText: '300 000 — 650 000 so‘m',
    estimatedPrice: 420000,
    bestSeason: 'Aprel — Noyabr',
    imageUrl: '/trips/xonobod-resort-kampirravot.jpg',
    shortDesc: 'O‘zbekistonning eng sharqiy nuqtasida joylashgan so‘lim Xonobod kurort shahri — Fozilmon tepaligi, dor yo‘li, Kampirravot (Andijon suv ombori) va Qoradaryo sohili.',
    creativeTip: 'Xonobod tepaligidagi kanat yo‘lidan Farg‘ona tizmasi tog‘lari va Qoradaryo vodiysini tomosha qiling, tushlikda esa haqiqiy Andijon devzira oshini yeng.',
    transport: {
      car: { available: true, duration: '5.5 soat', cost: '180 000 — 280 000 so‘m', details: 'Qamchiq dovoni — Andijon — Xonobod yo‘nalishida keng asfalt yo‘l.' },
      train: { available: true, duration: '5.5 soat (Toshkent — Andijon — Xonobod poyezdi)', cost: '140 000 — 220 000 so‘m', details: 'Poyezd Andijon va Xonobod stansiyasigacha boradi!' },
      bus: { available: true, duration: '6.5 soat', cost: '95 000 so‘m', details: 'Toshkent — Andijon avtobuslari va Qo‘yliq taksilari.' },
      plane: { available: true, duration: '55 daq (Andijon / Farg‘ona aeroporti)', cost: '350 000 so‘m', details: 'Aeroportdan Xonobodgacha 1 soatlik yo‘l.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Juda ko‘p (1000+ ta yangi tog‘ dachalari va sanatoriy)', items: ['Xonobod Sanatoriysi (5★ darajadagi park ichida)', 'Xonobod Tepalik Kotejlari', 'Alisher Navoiy bog‘i mehmon uylari'] },
      dining: { available: true, statusText: 'Juda ko‘p (Qoradaryo baliq va Andijon oshi)', items: ['Qoradaryo Sohil Baliqxonalari', 'Xonobod Choyxonalari', 'Andijon Osh Markazi'] },
      shops: { available: true, statusText: 'Shahar ichida barcha supermarket va bozorlar bor', items: ['Xonobod markaziy savdo majmualari va bankomatlar'] },
      medical: { available: true, statusText: 'Xonobod sanatoriysi va shahar shifoxonasi', items: ['Xonobod sihatgohi tibbiyot markazi va 24/7 dorixonalar'] },
      connectivity: '4G LTE va Wi-Fi butun kurort shahrida ishlaydi.'
    }
  },
  {
    id: 'bogishamol-imom-ota',
    title: 'Imom Ota Tog‘ Ziyoratgohi, Osma Ko‘prik & Bog‘ishamol',
    region: 'Andijon viloyati',
    district: 'Xo‘jaobod tumani / Andijon',
    natureType: 'waterfall_river',
    natureLabel: 'Tog‘ darasi, Buloq & Osma ko‘prik',
    crowdLevel: 'O‘rtacha',
    lat: 40.6120,
    lng: 72.6050,
    distanceFromTashkentKm: 385,
    travelTimeText: '5 soat 15 daq',
    totalBudgetText: '250 000 — 550 000 so‘m',
    estimatedPrice: 360000,
    bestSeason: 'Mart — Noyabr',
    imageUrl: '/trips/bogishamol-imom-ota.jpg',
    shortDesc: 'Chilustun tog‘lari bag‘rida joylashgan yashil Imom Ota turizm qishlog‘i — shifobaxsh tog‘ bulog‘i, daralar ustidagi osma ko‘prik va Zahiriddin Muhammad Bobur Bog‘ishamol bog‘i.',
    creativeTip: 'Imom Ota tog‘ zinalaridan "Orzular cho‘qqisi"ga ko‘tarilib, daraning ikki qoyasini tutashtiruvchi osma ko‘prikdan o‘ting.',
    transport: {
      car: { available: true, duration: '5 soat 15 daq', cost: '170 000 — 250 000 so‘m', details: 'Andijon shahri va Xo‘jaobod orqali Imom Ota darasigacha asfalt yo‘l.' },
      train: { available: true, duration: '5 soat (Andijongacha) + 30 daq taksi', cost: '140 000 + 40 000 so‘m', details: 'Andijon vokzalidan Bog‘ishamol (15 daq) va Imom Otaga (30 daq) taksida boriladi.' },
      bus: { available: true, duration: '6 soat (Andijongacha)', cost: '95 000 so‘m', details: 'Andijondan Xo‘jaobod — Imom Ota mikroavtobuslari qatnaydi.' },
      plane: { available: true, duration: '55 daq', cost: '350 000 so‘m', details: 'Vodiy aeroportlaridan 40 daqiqalik masofada.' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Imom Ota tog‘ mehmon uylari va Andijon otellari)', items: ['Imom Ota Eco Guest Houses', 'Bog‘ishamol Hotel Andijon', 'Vella Elegant Hotel (Andijon)'] },
      dining: { available: true, statusText: 'Ko‘p (Soy bo‘yi choyxonalari)', items: ['Imom Ota Soy Choyxonasi', 'Bog‘ishamol Adir Restoranlari (Andijon oshi va kaboblari)'] },
      shops: { available: true, statusText: 'Bor (Suvenir, shifobaxsh giyohlar va do‘konlar)', items: ['Imom Ota turizm markazi savdo rastalari'] },
      medical: { available: true, statusText: 'Tibbiyot punkti va dorixonalar bor', items: ['Imom Ota poliklinikasi va Xo‘jaobod tuman shifoxonasi'] },
      connectivity: '4G LTE aloqa to‘liq ishlaydi.'
    }
  },

  // ==========================================
  // 11. SIRDARYO VILOYATI (1 ta maskan)
  // ==========================================
  {
    id: 'syrdarya-river-ecopark',
    title: 'Sirdaryo Sohili, Qolgan-Sir Ko‘li & Baliq Ovining So‘lim Maskani',
    region: 'Sirdaryo viloyati',
    district: 'Sayxunobod / Guliston',
    natureType: 'lake_reservoir',
    natureLabel: 'Keng daryo sohili & Baliq ovi',
    crowdLevel: 'Yolg‘iz & Sokin',
    lat: 40.6650,
    lng: 68.7850,
    distanceFromTashkentKm: 95,
    travelTimeText: '1 soat 20 daq',
    totalBudgetText: '150 000 — 350 000 so‘m',
    estimatedPrice: 220000,
    bestSeason: 'Aprel — Noyabr',
    imageUrl: '/trips/syrdarya-river-ecopark.jpg',
    shortDesc: 'Toshkentdan atigi 1 soatlik yo‘lda — ulug‘vor Sirdaryo daryosi va Qolgan-Sir ko‘llari bo‘yida qayiqda suzish, qarmoqda baliq tutish va daryo bo‘yi so‘rilarida qovurma baliq.',
    creativeTip: 'Chinoz va Sirdaryo ko‘prigi yaqinidagi sohil dam olish maskanlarida ertalab qarmoq tashlab o‘tirish va daryo shabadasi ostida yangi laqqa/sazan balig‘idan yeyish — eng yaqin anti-stress safar.',
    transport: {
      car: { available: true, duration: '1 soat 20 daq', cost: '60 000 — 110 000 so‘m', details: 'M39 / M34 trassasi orqali Chinozdan o‘tib Sirdaryo sohiliga juda tez yetib boriladi.' },
      train: { available: true, duration: '1 soat (Guliston/Sirdaryogacha)', cost: '45 000 — 80 000 so‘m', details: 'Toshkentdan o‘tuvchi barcha poyezdlar va elektrichkalar Sirdaryo hamda Guliston vokzalida to‘xtaydi!' },
      bus: { available: true, duration: '1.5 soat', cost: '25 000 so‘m', details: 'Toshkent avtovokzalidan (Olmazor metro) Guliston/Sirdaryo avtobuslari har 20 daqiqada yuradi.' },
      plane: { available: false, duration: 'Qatnamaydi', cost: '—', details: 'Toshkentga juda yaqin (95 km).' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Sohil kotejlari va Guliston mehmonxonalari)', items: ['Sirdaryo Sohil Eco-Cottages', 'Chexra Hotel Guliston', 'Turon Hotel'] },
      dining: { available: true, statusText: 'Juda mashhur (Sirdaryo va Chinoz baliq bozori/restoranlari)', items: ['Sirdaryo Sohil Baliq Choyxonalari', 'Chinoz Baliq Markazi (yo‘l ustida)'] },
      shops: { available: true, statusText: 'Barcha do‘kon va qovun bozorlari bor', items: ['Mirzaobod mashhur qovun-tarvuz bozori (trassa bo‘yida)', 'Guliston supermarketlari'] },
      medical: { available: true, statusText: 'Sirdaryo va Guliston 24/7 shifoxonalari', items: ['Sirdaryo tuman va Guliston shahar tibbiyot markazlari'] },
      connectivity: '4G LTE barcha operatorlarda to‘liq ishlaydi.'
    }
  },

  // ==========================================
  // 12. XORAZM VA QORAQALPOG‘ISTON (2 ta maskan)
  // ==========================================
  {
    id: 'itchan-kala-khiva',
    title: 'Ichan Qal’a (Xiva Ochiq Osmon Ostidagi Ertak-Shahar)',
    region: 'Xorazm viloyati',
    district: 'Xiva shahri',
    natureType: 'historic_lively',
    natureLabel: 'Qadimiy qal’a & Minoralar',
    crowdLevel: 'Gavjum & Mashhur',
    lat: 41.3775,
    lng: 60.3595,
    distanceFromTashkentKm: 980,
    travelTimeText: '1 soat 25 daq (samolyot) / 14 soat (poyezd)',
    totalBudgetText: '600 000 — 1 400 000 so‘m',
    estimatedPrice: 850000,
    bestSeason: 'Mart — Noyabr',
    imageUrl: '/trips/itchan-kala-khiva.jpg',
    shortDesc: 'Qal’a devorlari ichida to‘liq saqlanib qolgan tirik o‘rta asr shahri — Kalta Minor, Ko‘hna Ark, Islom Xo‘ja minorasi va 218 ta naqshinkor yog‘och ustunli Jome masjidi.',
    creativeTip: 'Quyosh botishidan 30 daqiqa oldin Ko‘hna Ark kuzatuv minorasiga chiqing va kechki ovqatga Xorazmning mashhur shivit oshi hamda tuxum baragini tatib ko‘ring.',
    transport: {
      car: { available: true, duration: '12 — 13 soat', cost: '350 000 — 500 000 so‘m', details: 'Buxoro va Qizilqum yangi avtomagistrali orqali Urganch va Xivaga boriladi.' },
      train: { available: true, duration: '14 soat (Toshkent — Xiva poyezdi)', cost: '220 000 — 420 000 so‘m', details: 'Kechqurun poyezdga chiqib, ertalab to‘g‘ri Ichan Qal’a ro‘parasidagi yangi Xiva vokzaliga tushasiz!' },
      bus: { available: true, duration: '14 soat', cost: '160 000 so‘m', details: 'Toshkent avtovokzalidan Urganch/Xiva uzoq masofali avtobuslari qatnaydi.' },
      plane: { available: true, duration: '1 soat 25 daq (Urganch aeroporti) + 30 daq trolleybus/taksi', cost: '500 000 — 850 000 so‘m', details: 'Urganch aeroportidan Xivagacha mashhur Urganch — Xiva trolleybusi yoki taksida 30 daqiqada boriladi!' }
    },
    nearby: {
      hotels: { available: true, statusText: '100+ ta qal’a ichidagi mehmonxona va 5★ otellar', items: ['Farovon Khiva Hotel (5★)', 'Orient Star Khiva (madrasa ichida!)', 'Arkanchi Hotel', 'Madrasa Polvonqori boutique'] },
      dining: { available: true, statusText: 'Juda ko‘p (Terassali va milliy restoranlar)', items: ['Terrassa Cafe & Restaurant (Kalta Minor ro‘parasida)', 'Khorezm Art Restaurant (Xorazm baliq, shivit oshi, gumma)', 'Mirzaboshi'] },
      shops: { available: true, statusText: 'Qal’a bo‘ylab hunarmandlar va savdo rastalari', items: ['Ichan Qal’a yog‘och o‘ymakorligi, cho‘girma, ipak gilam do‘konlari va supermarketlar'] },
      medical: { available: true, statusText: '24/7 dorixonalar va Xiva shifoxonasi', items: ['Xiva shahar tibbiyot birlashmasi (qal’a yonida) va 24/7 dorixonalar'] },
      connectivity: '5G, 4G+ va Wi-Fi butun Ichan Qal’a bo‘ylab ishlaydi.'
    }
  },
  {
    id: 'aral-sea-muynak-ustyurt',
    title: 'Mo‘ynoq Kemalar Qabristoni & Ustyurt Kanyonlari (Orolbo‘yi)',
    region: 'Qoraqalpog‘iston Respublikasi',
    district: 'Mo‘ynoq / Nukus',
    natureType: 'secluded_wild',
    natureLabel: 'Yovvoyi Ustyurt kanyonlari & Orol',
    crowdLevel: 'Yolg‘iz & Sokin',
    lat: 43.7680,
    lng: 59.0210,
    distanceFromTashkentKm: 1180,
    travelTimeText: '1 soat 35 daq (Nukusgacha samolyot) + 2.5 soat',
    totalBudgetText: '750 000 — 1 800 000 so‘m',
    estimatedPrice: 1100000,
    bestSeason: 'Aprel — Oktabr',
    imageUrl: '/trips/aral-sea-muynak-ustyurt.jpg',
    shortDesc: 'Boshqa sayyorani eslatuvchi Ustyurt platosining oq-qizil kanyonlari, Mo‘ynoqdagi cho‘l o‘rtasida qolgan kemalar muzeyi va Nukusdagi dunyoga mashhur Savitskiy muzeyi.',
    creativeTip: 'Nukusga uchib borib, avval "Sahrodagi Luvr" — Savitskiy muzeyini ko‘ring, so‘ngra yo‘ltanlamas (4x4) mashinada Ustyurt kanyonlari va Orol dengizi bo‘yidagi o‘tov lageriga yo‘l oling.',
    transport: {
      car: { available: true, duration: '15 soat (Toshkentdan) / Nukusdan 2.5 soat', cost: 'Nukus — Mo‘ynoq taksi: 60 000 — 100 000 so‘m', details: 'Nukusdan Mo‘ynoqqacha silliq asfalt (210 km), Ustyurt kanyonlari va Orol suviga borish uchun esa 4x4 Jeep yollanadi.' },
      train: { available: true, duration: '16 soat (Toshkent — Qo‘ng‘irot / Nukus poyezdi)', cost: '240 000 — 450 000 so‘m', details: 'Poyezdda Nukus yoki Qo‘ng‘irot stansiyasigacha borib, Mo‘ynoqqa 1 soatda o‘tiladi.' },
      bus: { available: true, duration: 'Nukus — Mo‘ynoq avtobusi (3 soat)', cost: '30 000 so‘m', details: 'Nukus avtovokzalidan Mo‘ynoqqa har kuni avtobus va taksilar qatnaydi.' },
      plane: { available: true, duration: '1 soat 35 daq (Nukus) + Mo‘ynoq kichik aviaqatnovi', cost: '550 000 — 900 000 so‘m', details: 'Toshkent — Nukus har kuni, shuningdek Nukus — Mo‘ynoq aviareyslari ham mavjud!' }
    },
    nearby: {
      hotels: { available: true, statusText: 'Bor (Mo‘ynoq mehmonxonalari va Orol o‘tov lagerlari)', items: ['Muynak Lighthouse Yurt Camp (kemalar tepasida)', 'Bessqala Yurt Camp (Orol bo‘yida)', 'Jipek Joli Hotel (Nukus)'] },
      dining: { available: true, statusText: 'Mo‘ynoqda kafelar bor (Ustyurtga o‘zingiz bilan oling)', items: ['Mayak Cafe Mo‘ynoq (baliq taomlari va Qoraqalpoq juweri gurtigi)', 'Nukus Cinnamon Cafe'] },
      shops: { available: true, statusText: 'Mo‘ynoq shahrida do‘konlar bor (Kanyonlarda yo‘q!)', items: ['Ustyurt va Orol tomon chiqishdan oldin suv hamda yegulikni Mo‘ynoq markazidan olib oling.'] },
      medical: { available: true, statusText: 'Mo‘ynoq tuman shifoxonasi bor', items: ['Mo‘ynoq tibbiyot birlashmasi (Ustyurt ekspeditsiyasi uchun shaxsiy dori qutisi shart)'] },
      connectivity: 'Nukus va Mo‘ynoq shahrida 4G LTE to‘liq ishlaydi; Ustyurt kanyonlarida aloqa yo‘q (yo‘lboshchi bilan boriladi).'
    }
  }
];

export function longTripToLocationItem(trip: LongTripItem): import('../types').LocationItem {
  return {
    id: trip.id,
    title: trip.title,
    category: trip.natureType === 'historic_lively' ? 'sightseeing' : 'park_nature',
    categoryLabel: `${trip.region} • ${trip.natureLabel}`,
    vibeTags: trip.natureType === 'historic_lively' ? ['urban_lively', 'aesthetic_photo'] : ['quiet_nature', 'adventure_active'],
    companionTags: ['friends', 'family', 'couple', 'solo'],
    budgetTier: trip.estimatedPrice >= 700000 ? 'premium' : trip.estimatedPrice >= 350000 ? 'medium' : 'budget',
    averageCheck: trip.totalBudgetText,
    estimatedPrice: trip.estimatedPrice,
    lat: trip.lat,
    lng: trip.lng,
    address: `${trip.district}, ${trip.region} (${trip.distanceFromTashkentKm} km)`,
    district: trip.region,
    tipText: trip.creativeTip,
    imageUrl: trip.imageUrl,
    durationMinutes: 480,
    workingHours: `Mavsum: ${trip.bestSeason} (${trip.travelTimeText})`,
    rating: 4.9,
    features: [
      `⏱️ ${trip.travelTimeText}`,
      `💰 ${trip.totalBudgetText}`,
      trip.transport.train.available ? '🚆 Poyezd bor' : '🚗 Mashina/Taksi',
      trip.nearby.hotels.available ? '🏨 Mehmonxona bor' : '⛺ Yovvoyi tabiat'
    ],
    longTripData: trip
  };
}

