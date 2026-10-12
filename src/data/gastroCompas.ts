export interface GastroDishItem {
  id: string;
  name: string;
  emoji: string;
  regionName: string;
  regionCode:
    | 'tashkent_city'
    | 'tashkent_region'
    | 'samarkand'
    | 'bukhara'
    | 'khorezm'
    | 'fergana'
    | 'andijan'
    | 'namangan'
    | 'jizzakh'
    | 'sirdaryo'
    | 'qashqadaryo'
    | 'surxondaryo'
    | 'navoiy'
    | 'karakalpakstan';
  priceRange: string;
  numericPrice: number;
  bestTime: string;
  description: string;
  famousSpots: string[];
  secretTip: string;
  lat: number;
  lng: number;
  tags: string[];
}

export const GASTRO_COMPASS_DATABASE: GastroDishItem[] = [
  // TOSHKENT SHAHRI
  {
    id: 'gastro-toshkent-osh',
    name: 'Toshkent To‘y Oshi (Qazi & Bedana tuxumli)',
    emoji: '🍛',
    regionName: 'Toshkent shahri',
    regionCode: 'tashkent_city',
    priceRange: '45 000 — 75 000 so‘m',
    numericPrice: 60000,
    bestTime: 'Tushlikda (11:30 — 13:30)',
    description:
      'Sariq va qizil sabzi, no‘xat, mayiz hamda yumshoq mol/qo‘y go‘shti bilan katta cho‘yan qozonda damlanadigan afsonaviy Toshkent to‘y palovi.',
    famousSpots: ['Beshqozon Osh Markazi (Teleminor)', 'Kamolon Osh Markazi', 'Ko‘kcha Choyxonalari'],
    secretTip:
      'Eng shirali va yangi suzilgan qozon soat 11:45 da ochiladi. Qazi, pay va achchiq-chuchuk salat bilan buyurtma bering!',
    lat: 41.3455,
    lng: 69.2845,
    tags: ['Halol', 'Milliy shoh taom', 'Tushlik']
  },
  {
    id: 'gastro-toshkent-norin',
    name: 'Toshkent Qo‘lbola Norini & Ko‘kcha Somsasi',
    emoji: '🍜',
    regionName: 'Toshkent shahri (Eski shahar)',
    regionCode: 'tashkent_city',
    priceRange: '40 000 — 70 000 so‘m',
    numericPrice: 55000,
    bestTime: '11:00 — 19:00',
    description:
      'Yupqa yoyilgan xamir, qazi va ot/mol go‘shti mayda to‘g‘ralib, ustiga ziravorli issiq sho‘rva (xo‘rda) bilan tortiladigan asl Toshkent lazzati.',
    famousSpots: ['Chorsu Milliy Taomlar qatori', 'Sag‘bon va Ko‘kcha mahalla oshxonalari', 'Minor Somsa markazi'],
    secretTip:
      'Norinni bir kosa issiq sho‘rvasi (bulon) bilan birga buyurtma qiling — ta’mi ikki barobar ochiladi.',
    lat: 41.3265,
    lng: 69.2345,
    tags: ['Eski shahar', 'Halol', 'Qo‘lbola']
  },

  // TOSHKENT VILOYATI (BO'STONLIQ / SO'QOQ / PARKENT)
  {
    id: 'gastro-soqoq-mador-somsa',
    name: 'So‘qoq Mador Somsasi & So‘qoq Shashlik',
    emoji: '🥟',
    regionName: 'Toshkent viloyati (Parkent / So‘qoq)',
    regionCode: 'tashkent_region',
    priceRange: '12 000 — 65 000 so‘m',
    numericPrice: 45000,
    bestTime: '09:00 — 18:00',
    description:
      'Faqat tog‘ etaklarida o‘sadigan shifobaxsh mador ko‘kati va ismaloqdan tandirda yopiladigan qarsildoq somsa hamda tutunda pishgan yumshoq kabob.',
    famousSpots: ['So‘qoq o‘rmon xo‘jaligi kiraverishi', 'So‘qoq soy bo‘yi so‘rilari', 'Parkent markaziy bozori'],
    secretTip:
      'Mador somsa issiqligida ustiga biroz sariyog‘ yoki qatiq surtib, tog‘ kiyiko‘ti choyi bilan ichilsa, charchoqni darhol oladi.',
    lat: 41.2485,
    lng: 69.7845,
    tags: ['Tog‘ ne’mati', 'Bahoriy & Yozgi', 'Soy bo‘yi']
  },
  {
    id: 'gastro-chorvoq-forel',
    name: 'Bo‘stonliq Xonbalig‘i (Tog‘ Foreli) & Tog‘ Asali',
    emoji: '🐟',
    regionName: 'Toshkent viloyati (Chorvoq / Bochka / Xumson)',
    regionCode: 'tashkent_region',
    priceRange: '90 000 — 160 000 so‘m',
    numericPrice: 120000,
    bestTime: '12:00 — 21:00',
    description:
      'Muzdek tog‘ daryosi suvida yetishtirilgan yangi forel (xonbaliq) — ko‘mirda yoki tandirda limon va tog‘ ziravorlari bilan qizarib pishiriladi.',
    famousSpots: ['Bochka (Xo‘jakent) soy bo‘yi restoranlari', 'Xumson va Oqtosh forel xo‘jaliklari', 'Amirsoy etagi'],
    secretTip:
      'Ertalabki safar bo‘lsa, Bo‘stonliq yo‘lida issiq tandir non bilan qaymoq va yong‘oqli tog‘ asalini albatta tatib ko‘ring!',
    lat: 41.6245,
    lng: 69.9485,
    tags: ['Parhez & Foydali', 'Tog‘ daryosi', 'Oilaviy']
  },

  // JIZZAX VILOYATI
  {
    id: 'gastro-jizzax-somsa',
    name: 'Afsonaviy Jizzax Kosa Somsasi & Zomin Qozon Patiri',
    emoji: '🥧',
    regionName: 'Jizzax viloyati (Jizzax & Zomin)',
    regionCode: 'jizzakh',
    priceRange: '35 000 — 55 000 so‘m (1 dona)',
    numericPrice: 45000,
    bestTime: '10:30 — 17:00',
    description:
      'Og‘irligi 400–500 gramm keladigan, ichida mo‘l to‘g‘ralgan go‘sht, dumbali piyoz va o‘z seli (bulyoni) qaynab turadigan ulkan tandir somsa. Zominda esa sariyog‘li qozon patir mashhur!',
    famousSpots: ['Jizzax shahar kiraverishi (M39 trassa)', 'Zomin archazor yo‘li oshxonalari', 'Sangzor bo‘yi somsaxonalari'],
    secretTip:
      'Bitta Jizzax somsasi bir kishini to‘liq to‘ydiradi! Somsaning tepa qopqog‘ini kesib, ichidagi go‘sht seliga botirib yeyiladi.',
    lat: 40.1158,
    lng: 67.8422,
    tags: ['1 dona = To‘q qorin', 'Tandir', 'Zomin & Jizzax']
  },

  // SAMARQAND VILOYATI
  {
    id: 'gastro-samarqand-zigir-osh',
    name: 'Samarqand Zig‘ir Oshi & Shirmoy Noni',
    emoji: '🍲',
    regionName: 'Samarqand viloyati',
    regionCode: 'samarkand',
    priceRange: '45 000 — 75 000 so‘m',
    numericPrice: 60000,
    bestTime: 'Tushlikda (11:30 — 14:00)',
    description:
      'Qovurilgan zig‘ir yog‘ida, aralashtirmasdan qatlam-qatlam (guruch alohida, sariq sabzi alohida, go‘sht alohida) suziladigan shifobaxsh Samarqand palovi.',
    famousSpots: ['Samarqand Osh Markazlari (Sartepa & Panjob)', 'Siyob bozori atrofidagi choyxonalar', 'Urgut Chorchinor choyxonalari'],
    secretTip:
      'Samarqand oshi hech qachon qozonda aralashtirilmaydi! Qaytishda Siyob bozoridan asl Samarqand gala-osiyo nonidan olishni unutmang.',
    lat: 39.6542,
    lng: 66.9597,
    tags: ['Qatlam osh', 'Tarixiy ta’m', 'Halol']
  },

  // BUXORO VILOYATI
  {
    id: 'gastro-buxoro-oshi-sofi',
    name: 'Buxoro "Oshi Sofi" (Mis qozonda) & Vaguri',
    emoji: '🥘',
    regionName: 'Buxoro viloyati',
    regionCode: 'bukhara',
    priceRange: '55 000 — 95 000 so‘m',
    numericPrice: 75000,
    bestTime: '11:30 — 15:00',
    description:
      'Mis qozonda qovurmasdan, parhez usulda kunjut yog‘i bilan pishiriladigan yengil va xushbo‘y Buxoro palovi hamda suyakdan eriydigan Vaguri go‘shti.',
    famousSpots: ['Labi Hovuz atrofidagi milliy uylar', 'Chorbakr va Kogon choyxonalari', 'Eski Buxoro osh markazlari'],
    secretTip:
      'Oshi Sofi oshqozonga umuman og‘ir botmaydi — parhez tutuvchilar va keksa ota-onalar uchun eng ideal palov.',
    lat: 39.7747,
    lng: 64.4286,
    tags: ['Parhez palov', 'Mis qozon', 'Buxoro siri']
  },

  // XORAZM VILOYATI
  {
    id: 'gastro-xorazm-tuxum-barak',
    name: 'Xorazm Tuxum Baragi, Shivit Oshi & Xorazm Baliq',
    emoji: '🥟',
    regionName: 'Xorazm viloyati (Xiva & Urganch)',
    regionCode: 'khorezm',
    priceRange: '45 000 — 85 000 so‘m',
    numericPrice: 65000,
    bestTime: '12:00 — 20:00',
    description:
      'Ichiga yangi tuxum va sariyog‘ quyib tugiladigan nozik Tuxum barak, ko‘katli yashil lag‘mon (Shivit oshi) hamda Amudaryo qovurma balig‘i.',
    famousSpots: ['Ichan-Qal’a ichidagi oilaviy oshxonalar', 'Urganch Amudaryo bo‘yi baliq saroylari'],
    secretTip:
      'Tuxum barakni tishlaganda ichidagi issiq sariyog‘i oqib ketmasligi uchun bittada butunligicha qoshiq bilan yeyiladi!',
    lat: 41.3775,
    lng: 60.3594,
    tags: ['YUNESKO merosi', 'Noyob retsept', 'Oilaviy']
  },

  // FARG'ONA VODIYSI (FARG'ONA, ANDIJON, NAMANGAN)
  {
    id: 'gastro-vodiy-devzira-osh',
    name: 'Vodiy Devzira Oshi & Qo‘qon Cho‘ponchasi',
    emoji: '🍖',
    regionName: 'Farg‘ona, Andijon va Namangan (Vodiy)',
    regionCode: 'fergana',
    priceRange: '50 000 — 90 000 so‘m',
    numericPrice: 70000,
    bestTime: '11:30 — 20:00',
    description:
      'Qizg‘ish O‘zgan/Chust devzira guruchidan, sarimsoq va achchiq qalampir bosib damlanadigan choyxona palovi hamda suyakli yumshoq Qo‘qon cho‘poncha kabobi.',
    famousSpots: ['Rishton va Qo‘qon choyxonalari', 'Andijon Bog‘ishamol oshxonalari', 'Chust va Kosonsoy bog‘ so‘rilari'],
    secretTip:
      'Vodiy choyxonalarida devzira oshni do‘stlar bilan o‘z qo‘lingizda damlash uchun "Choyxona qozoni" buyurtma qilish ham mumkin.',
    lat: 40.3842,
    lng: 71.7843,
    tags: ['Devzira guruch', 'Choyxona an’anasi', 'Kabob']
  },

  // QASHQADARYO & SURXONDARYO
  {
    id: 'gastro-qashqadaryo-tandir',
    name: 'Qashqadaryo & Boysun Archa Tandir Go‘shti',
    emoji: '🥩',
    regionName: 'Qashqadaryo va Surxondaryo (Hisor & Boysun)',
    regionCode: 'qashqadaryo',
    priceRange: '95 000 — 150 000 so‘m (porsiya)',
    numericPrice: 120000,
    bestTime: '11:00 — 18:00',
    description:
      'Tog‘ archasi shoxlari va ziravorlar bilan yer osti tandirida 3–4 soat davomida bug‘da pishib, og‘izda eriydigan xushbo‘y qo‘y go‘shti.',
    famousSpots: ['Taxtaqoracha dovoni (Kitob) tandirchilar qatori', 'Shahrisabz Oqsaroy atrofi', 'Boysun va Sangardak yo‘li'],
    secretTip:
      'Eng haqiqiy tandir go‘sht Taxtaqoracha dovonining eng baland nuqtasida — tandirdan yangi uzilgan soatda (11:30–14:30) chiqadi!',
    lat: 39.0578,
    lng: 66.8294,
    tags: ['Tog‘ archasi hidi', 'Mashhur dovon', '100% Tabiiy']
  },

  // SIRDARYO & NAVOIY & QORAQALPOG'ISTON
  {
    id: 'gastro-sirdaryo-baliq',
    name: 'Sirdaryo & Aydarko‘l Qovurma Sazan Balig‘i',
    emoji: '🐠',
    regionName: 'Sirdaryo va Navoiy (Aydarko‘l & To‘dako‘l)',
    regionCode: 'navoiy',
    priceRange: '70 000 — 130 000 so‘m',
    numericPrice: 95000,
    bestTime: '12:00 — 21:00',
    description:
      'Sirdaryo o‘zani hamda Aydarko‘lning tiniq suvidan tutilgan yangi sazan, laqqa va sudak balig‘i — qarsildoq oltin rangda qovurilib, limon va ko‘katlar bilan tortiladi.',
    famousSpots: ['Sirdaryo daryosi ko‘prik bo‘yi baliqxonalari', 'Aydarko‘l va Nurota o‘tov lagerlari', 'Qoraqalpog‘iston Mo‘ynoq & Nukus (Juvoz/Baliq)'],
    secretTip:
      'Baliq buyurtma qilganda qiltanoqsiz "Laqqa" (Som) yoki "Sudak" filesini so‘rang — bolalar bilan yeyishga juda qulay.',
    lat: 40.8436,
    lng: 68.6617,
    tags: ['Daryo va Ko‘l ne’mati', 'Qarsildoq baliq', 'Oilaviy']
  }
];

export function getGastroDishesForRegionText(regionText: string): GastroDishItem[] {
  const lower = regionText.toLowerCase();
  if (lower.includes('jizzax') || lower.includes('zomin') || lower.includes('forish') || lower.includes('baxmal')) {
    return GASTRO_COMPASS_DATABASE.filter((d) => d.regionCode === 'jizzakh');
  }
  if (lower.includes('samarqand') || lower.includes('urgut')) {
    return GASTRO_COMPASS_DATABASE.filter((d) => d.regionCode === 'samarkand');
  }
  if (lower.includes('buxoro') || lower.includes('g‘ijduvon')) {
    return GASTRO_COMPASS_DATABASE.filter((d) => d.regionCode === 'bukhara');
  }
  if (lower.includes('xorazm') || lower.includes('xiva') || lower.includes('urganch')) {
    return GASTRO_COMPASS_DATABASE.filter((d) => d.regionCode === 'khorezm');
  }
  if (
    lower.includes('farg‘ona') ||
    lower.includes('fargona') ||
    lower.includes('andijon') ||
    lower.includes('namangan') ||
    lower.includes('shohimardon') ||
    lower.includes('xonobod') ||
    lower.includes('chust') ||
    lower.includes('nanay')
  ) {
    return GASTRO_COMPASS_DATABASE.filter((d) => d.regionCode === 'fergana');
  }
  if (
    lower.includes('qashqadaryo') ||
    lower.includes('surxondaryo') ||
    lower.includes('shahrisabz') ||
    lower.includes('hisor') ||
    lower.includes('boysun') ||
    lower.includes('sangardak')
  ) {
    return GASTRO_COMPASS_DATABASE.filter((d) => d.regionCode === 'qashqadaryo');
  }
  if (
    lower.includes('sirdaryo') ||
    lower.includes('navoiy') ||
    lower.includes('aydarko‘l') ||
    lower.includes('nurota') ||
    lower.includes('qoraqalpog')
  ) {
    return GASTRO_COMPASS_DATABASE.filter((d) => d.regionCode === 'navoiy');
  }
  if (
    lower.includes('bo‘stonliq') ||
    lower.includes('chorvoq') ||
    lower.includes('chimyon') ||
    lower.includes('amirsoy') ||
    lower.includes('so‘qoq') ||
    lower.includes('parkent') ||
    lower.includes('ohangaron') ||
    lower.includes('toshkent viloyati')
  ) {
    return GASTRO_COMPASS_DATABASE.filter((d) => d.regionCode === 'tashkent_region');
  }

  return GASTRO_COMPASS_DATABASE.filter(
    (d) => d.regionCode === 'tashkent_city' || d.regionCode === 'tashkent_region'
  );
}
