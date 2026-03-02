// ============================================================
// AZKARS DATA - Complete Morning & Evening Adhkar
// ============================================================

export type AzkarPeriod = 'morning' | 'evening';
export type AzkarCategory = 'protection' | 'praise' | 'forgiveness' | 'dua' | 'tawhid' | 'salawat';

export interface Azkar {
  id: string;
  period: AzkarPeriod[];
  category: AzkarCategory;
  arabic: string;
  transliteration: string;
  translation: string;
  defaultCount: number;
  source: string;
  virtue?: string;
  color: string;
  glow: string;
}

export const MORNING_OPENING = {
  arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
  transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah",
  translation: "We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.",
};

export const EVENING_OPENING = {
  arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
  transliteration: "Amsayna wa amsal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah",
  translation: "We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.",
};

export const AZKARS: Azkar[] = [

  // ─── AYAT AL-KURSI ───────────────────────────────────────────
  {
    id: 'ayat_kursi',
    period: ['morning', 'evening'],
    category: 'protection',
    arabic: 'اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ، لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ، لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ، مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ، وَلاَ يَؤُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: "Allahu la ilaha illa huwal hayyul qayyum, la ta'khuzuhu sinatun wa la nawm, lahu ma fis samawati wa ma fil ard, man zal lazi yashfa'u 'indahu illa bi'iznih, ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi shay'in min 'ilmihi illa bima sha', wasi'a kursiyyuhus samawati wal ard, wa la ya'uduhu hifzuhuma, wa huwal 'aliyyul 'azim",
    translation: "Allah! There is none worthy of worship but He, the Ever-Living, the One Who sustains and protects all that exists. Neither slumber nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi (Throne) extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
    defaultCount: 1,
    source: "Al-Baqarah 2:255",
    virtue: "Whoever recites it in the morning will be in the protection of Allah until the evening, and whoever recites it in the evening will be in the protection of Allah until the morning.",
    color: '#1a4a6b',
    glow: '#4a9fd4',
  },

  // ─── SURAH AL-IKHLAS ─────────────────────────────────────────
  {
    id: 'surah_ikhlas',
    period: ['morning', 'evening'],
    category: 'tawhid',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    transliteration: "Qul huwallahu ahad. Allahus samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
    translation: "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born. Nor is there to Him any equivalent.",
    defaultCount: 3,
    source: "Surah Al-Ikhlas (112)",
    virtue: "Reciting it 3 times in the morning and evening is equivalent to reciting the whole Quran.",
    color: '#1a3d2e',
    glow: '#4aab6d',
  },

  // ─── SURAH AL-FALAQ ──────────────────────────────────────────
  {
    id: 'surah_falaq',
    period: ['morning', 'evening'],
    category: 'protection',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    transliteration: "Qul a'udhu bi rabbil falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin naffathati fil 'uqad. Wa min sharri hasidin idha hasad.",
    translation: "Say: I seek refuge in the Lord of the daybreak. From the evil of that which He created. And from the evil of darkness when it settles. And from the evil of the blowers in knots. And from the evil of an envier when he envies.",
    defaultCount: 3,
    source: "Surah Al-Falaq (113)",
    virtue: "These Mu'awwidhatayn (the two surahs of refuge) suffice against everything.",
    color: '#3d1a1a',
    glow: '#c45c5c',
  },

  // ─── SURAH AN-NAS ────────────────────────────────────────────
  {
    id: 'surah_nas',
    period: ['morning', 'evening'],
    category: 'protection',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',
    transliteration: "Qul a'udhu bi rabbin nas. Malikin nas. Ilahin nas. Min sharril waswasil khannas. Alladhi yuwaswisu fi sudurin nas. Minal jinnati wan nas.",
    translation: "Say: I seek refuge in the Lord of mankind. The Sovereign of mankind. The God of mankind. From the evil of the retreating whisperer. Who whispers evil into the breasts of mankind. From among the jinn and mankind.",
    defaultCount: 3,
    source: "Surah An-Nas (114)",
    virtue: "These Mu'awwidhatayn (the two surahs of refuge) suffice against everything.",
    color: '#2d1a3d',
    glow: '#7c4ab8',
  },

  // ─── SAYYID AL-ISTIGHFAR ─────────────────────────────────────
  {
    id: 'sayyid_istighfar',
    period: ['morning', 'evening'],
    category: 'forgiveness',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ',
    transliteration: "Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika 'alayy, wa abu'u bidhanbi faghfir li fa'innahu la yaghfirudh dhunuba illa ant.",
    translation: "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide by Your covenant and promise as best as I can. I seek refuge with You from the evil that I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for verily none can forgive sins except You.",
    defaultCount: 1,
    source: "Sahih Al-Bukhari 6306",
    virtue: "The master of seeking forgiveness. Whoever recites it firmly believing in it when it is morning and dies that day before evening shall be from the people of Paradise.",
    color: '#3d2a0a',
    glow: '#c8922a',
  },

  // ─── BISMILLAH PROTECTION ─────────────────────────────────────
  {
    id: 'bismillah_protection',
    period: ['morning', 'evening'],
    category: 'protection',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahil ladhi la yadurru ma'asmihi shay'un fil ardi wa la fis sama'i wa huwas sami'ul 'alim.",
    translation: "In the name of Allah with Whose name nothing can harm on earth or in the heavens, and He is the All-Hearing, All-Knowing.",
    defaultCount: 3,
    source: "Sunan Abu Dawud 5088",
    virtue: "Whoever recites it 3 times in the morning and evening, nothing shall harm him.",
    color: '#1a3340',
    glow: '#3a8fb5',
  },

  // ─── RADITU BILLAHI RABBA ─────────────────────────────────────
  {
    id: 'raditu_billahi',
    period: ['morning', 'evening'],
    category: 'praise',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيهِ وَسَلَّمَ نَبِيًّا',
    transliteration: "Raditu billahi rabba, wa bil-Islami dina, wa bi Muhammadin sallallahu 'alayhi wa sallama nabiyya.",
    translation: "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace be upon him) as my Prophet.",
    defaultCount: 3,
    source: "Sunan Abu Dawud 5072",
    virtue: "Allah will please him on the Day of Judgement.",
    color: '#1f3a1f',
    glow: '#5ab85a',
  },

  // ─── YA HAYYU YA QAYYUM ──────────────────────────────────────
  {
    id: 'ya_hayyu_ya_qayyum',
    period: ['morning', 'evening'],
    category: 'dua',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
    transliteration: "Ya Hayyu ya Qayyumu bi rahmatika astaghith, aslih li sha'ni kullahu, wa la takilni ila nafsi tarfata 'ayn.",
    translation: "O Ever-Living, O Sustainer, in Your mercy I seek relief. Rectify all my affairs and do not leave me to rely on myself for even the blink of an eye.",
    defaultCount: 1,
    source: "Al-Hakim, Mustadrak",
    virtue: "The Prophet (SAW) used to say this every morning.",
    color: '#3a1a3a',
    glow: '#9b59b6',
  },

  // ─── ASBAHNA 'ALA FITRATIL ISLAM (morning) ───────────────────
  {
    id: 'fitrat_al_islam',
    period: ['morning'],
    category: 'praise',
    arabic: 'أَصْبَحْنَا عَلَى فِطْرَةِ الإِسْلاَمِ، وَعَلَى كَلِمَةِ الإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ',
    transliteration: "Asbahna 'ala fitra til Islam, wa 'ala kalimati til ikhlas, wa 'ala dini nabiyyina Muhammadin sallallahu 'alayhi wa sallam, wa 'ala millati abina Ibrahima hanifan musliman wa ma kana minal mushrikin.",
    translation: "We have reached the morning upon the natural religion of Islam, upon the word of sincerity, upon the religion of our Prophet Muhammad (peace be upon him), and upon the way of our father Ibrahim, who was a Muslim, upright in faith, and was not among the polytheists.",
    defaultCount: 1,
    source: "Ahmad 14666",
    virtue: "Affirming one's commitment to Islam and Tawhid every morning.",
    color: '#1a2f3a',
    glow: '#3a8fb5',
  },

  // ─── AMSAYNA 'ALA FITRATIL ISLAM (evening) ───────────────────
  {
    id: 'fitrat_al_islam_evening',
    period: ['evening'],
    category: 'praise',
    arabic: 'أَمْسَيْنَا عَلَى فِطْرَةِ الإِسْلاَمِ، وَعَلَى كَلِمَةِ الإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ',
    transliteration: "Amsayna 'ala fitra til Islam, wa 'ala kalimati til ikhlas, wa 'ala dini nabiyyina Muhammadin sallallahu 'alayhi wa sallam, wa 'ala millati abina Ibrahima hanifan musliman wa ma kana minal mushrikin.",
    translation: "We have reached the evening upon the natural religion of Islam, upon the word of sincerity, upon the religion of our Prophet Muhammad (peace be upon him), and upon the way of our father Ibrahim, who was a Muslim, upright in faith, and was not among the polytheists.",
    defaultCount: 1,
    source: "Ahmad 14666",
    virtue: "Affirming one's commitment to Islam and Tawhid every evening.",
    color: '#1a2f3a',
    glow: '#3a8fb5',
  },

  // ─── SUBHAN ALLAH WA BIHAMDIHI ───────────────────────────────
  {
    id: 'subhanallah_bihamdihi',
    period: ['morning', 'evening'],
    category: 'praise',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: "Subhanallahi wa bihamdihi.",
    translation: "Glory be to Allah and praise be to Him.",
    defaultCount: 100,
    source: "Sahih Muslim 2692",
    virtue: "Whoever says it 100 times in the morning and evening, his sins are forgiven even if they are like the foam of the sea.",
    color: '#1a3a2a',
    glow: '#2aab6a',
  },

  // ─── LA ILAHA ILLA ALLAH WAHDAHU ─────────────────────────────
  {
    id: 'la_ilaha_illa_allah',
    period: ['morning', 'evening'],
    category: 'tawhid',
    arabic: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamd, wa huwa 'ala kulli shay'in qadir.",
    translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    defaultCount: 10,
    source: "Sahih Bukhari 6404",
    virtue: "Whoever says it 10 times in the morning will have the reward of freeing 4 slaves, 10 good deeds recorded, 10 sins erased, and protection from Shaytan until evening.",
    color: '#1a1a3a',
    glow: '#5a5ab5',
  },

  // ─── ALLAHUMMA INNI AS'ALUKA AL-'AFW ────────────────────────
  {
    id: 'allahumma_afw',
    period: ['morning', 'evening'],
    category: 'forgiveness',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِن بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِن فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
    transliteration: "Allahumma inni as'alukal 'afwa wal 'afiyata fid dunya wal akhirah. Allahumma inni as'alukal 'afwa wal 'afiyata fi dini wa dunyaya wa ahli wa mali. Allahummastur 'awrati wa amin raw'ati. Allahummahfazni min bayni yadayya wa min khalfi wa 'an yamini wa 'an shimali wa min fawqi, wa a'udhu bi 'azamatika an ughtala min tahti.",
    translation: "O Allah, I ask You for pardon and well-being in this life and the next. O Allah, I ask You for pardon and well-being in my religious and worldly affairs, and my family and my wealth. O Allah, veil my weaknesses and calm my fears. O Allah, guard me from before me and behind me, from my right and my left, and from above me, and I seek refuge in Your greatness from being unexpectedly overcome from below me.",
    defaultCount: 1,
    source: "Sunan Abu Dawud 5074",
    virtue: "Ibn Umar said: The Messenger of Allah never abandoned these words morning and evening.",
    color: '#2a1a0a',
    glow: '#c87a2a',
  },

  // ─── ALLAHUMMA 'AFINI FI BADANI ──────────────────────────────
  {
    id: 'allahumma_afini',
    period: ['morning', 'evening'],
    category: 'dua',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ',
    transliteration: "Allahumma 'afini fi badani. Allahumma 'afini fi sam'i. Allahumma 'afini fi basari. La ilaha illa ant. Allahumma inni a'udhu bika minal kufri wal faqr, wa a'udhu bika min 'adhabil qabr, la ilaha illa ant.",
    translation: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. None has the right to be worshipped except You. O Allah, I seek refuge with You from disbelief and poverty, and I seek refuge with You from the punishment of the grave. None has the right to be worshipped except You.",
    defaultCount: 3,
    source: "Sunan Abu Dawud 5090",
    virtue: "Abu Bakr As-Siddiq asked the Prophet (SAW) to teach him a supplication for morning and evening, and the Prophet taught him this.",
    color: '#1a2a1a',
    glow: '#4ab54a',
  },

  // ─── HASBIYALLAHU LA ILAHA ILLA HU ───────────────────────────
  {
    id: 'hasbiyallahu',
    period: ['morning', 'evening'],
    category: 'tawhid',
    arabic: 'حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu wa huwa rabbul 'arshil 'azim.",
    translation: "Allah is sufficient for me; there is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.",
    defaultCount: 7,
    source: "Sunan Abu Dawud 5081",
    virtue: "Allah will suffice him in whatever concerns him of the affairs of this world and the Hereafter.",
    color: '#0a1a2a',
    glow: '#2a6ab5',
  },

  // ─── ALLAHUMMA ANTA RABBI ─────────────────────────────────────
  {
    id: 'allahumma_anta_rabbi',
    period: ['morning', 'evening'],
    category: 'praise',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، عَلَيْكَ تَوَكَّلْتُ وَأَنْتَ رَبُّ الْعَرْشِ الْكَرِيمِ، مَا شَاءَ اللَّهُ كَانَ وَمَا لَمْ يَشَأْ لَمْ يَكُنْ، لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ الْعَلِيِّ الْعَظِيمِ، أَعْلَمُ أَنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ وَأَنَّ اللَّهَ قَدْ أَحَاطَ بِكُلِّ شَيْءٍ عِلْمًا، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ كُلِّ دَابَّةٍ أَنْتَ آخِذٌ بِنَاصِيَتِهَا، إِنَّ رَبِّي عَلَى صِرَاطٍ مُّسْتَقِيمٍ',
    transliteration: "Allahumma anta rabbi la ilaha illa ant, 'alayka tawakkaltu wa anta rabbul 'arshil karim, ma sha'allahu kana wa ma lam yasha' lam yakun, la hawla wa la quwwata illa billahil 'aliyyil 'azim, a'lamu annallaha 'ala kulli shay'in qadir wa annallaha qad ahata bi kulli shay'in 'ilma. Allahumma inni a'udhu bika min sharri nafsi wa min sharri kulli dabbatin anta akhidhun binasiyatiha, inna rabbi 'ala siratin mustaqim.",
    translation: "O Allah, You are my Lord, none has the right to be worshipped except You. Upon You I rely and You are the Lord of the Noble Throne. Whatever Allah wills comes to pass and what He does not will, does not come to pass. There is no power or strength except through Allah, the Most High, the Most Great. I know that Allah is Able to do all things and that Allah has encompassed all things in His knowledge. O Allah, I seek refuge in You from the evil of my soul and from the evil of every creature that You hold by its forelock. Indeed my Lord is on a Straight Path.",
    defaultCount: 1,
    source: "Sunan Abu Dawud 5075",
    virtue: "Comprehensive morning/evening supplication of the Prophet (SAW).",
    color: '#2a1a0a',
    glow: '#d4803a',
  },

  // ─── SALAWAT IBRAHIMIYYA ──────────────────────────────────────
  {
    id: 'salawat_ibrahim',
    period: ['morning', 'evening'],
    category: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad, kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammad, kama barakta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid.",
    translation: "O Allah, bestow Your favor on Muhammad and on the family of Muhammad as You have bestowed Your favor on Ibrahim and on the family of Ibrahim. You are praiseworthy and glorious. O Allah, bless Muhammad and the family of Muhammad as You have blessed Ibrahim and the family of Ibrahim. You are praiseworthy and glorious.",
    defaultCount: 10,
    source: "Sahih Bukhari 3370",
    virtue: "Sending blessings upon the Prophet (SAW) ten times earns ten blessings from Allah, ten sins are erased, and he is elevated ten degrees.",
    color: '#1a2a3a',
    glow: '#4a8ab5',
  },

  // ─── TASBIH / TAHMID / TAKBIR ────────────────────────────────
  {
    id: 'tasbih_tahmid_takbir',
    period: ['morning', 'evening'],
    category: 'praise',
    arabic: 'سُبْحَانَ اللَّهِ — الْحَمْدُ لِلَّهِ — اللَّهُ أَكْبَرُ',
    transliteration: "Subhanallah (33x) — Alhamdulillah (33x) — Allahu Akbar (34x)",
    translation: "Glory be to Allah (33 times) — All praise is for Allah (33 times) — Allah is the Greatest (34 times)",
    defaultCount: 33,
    source: "Sahih Muslim 597",
    virtue: "Sins will be forgiven even if they are like the foam of the sea.",
    color: '#1a3a1a',
    glow: '#3ab53a',
  },

  // ─── A'UDHU BILLAHI MIN AL-SHAYTAN ───────────────────────────
  {
    id: 'ta_awwudh',
    period: ['morning', 'evening'],
    category: 'protection',
    arabic: 'أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ مِنْ هَمْزِهِ وَنَفْخِهِ وَنَفْثِهِ',
    transliteration: "A'udhu billahis sami'il 'alimi minash shaytanir rajim, min hamzihi wa nafkhihi wa nafthih.",
    translation: "I seek refuge with Allah, the All-Hearing, the All-Knowing, from the accursed Shaytan, from his maddening, his arrogance, and his poetry.",
    defaultCount: 3,
    source: "Sunan Abu Dawud 775",
    virtue: "Protection from Shaytan throughout the day.",
    color: '#2a0a0a',
    glow: '#b54a4a',
  },

  // ─── ALLAHUMMA BIKA ASBAHNA (morning) ────────────────────────
  {
    id: 'allahumma_bika_asbahna',
    period: ['morning'],
    category: 'praise',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    transliteration: "Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaikan nushur.",
    translation: "O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our return.",
    defaultCount: 1,
    source: "Sunan At-Tirmidhi 3391",
    virtue: "A comprehensive morning supplication acknowledging Allah's control over all affairs.",
    color: '#1a1a2a',
    glow: '#5a5ab5',
  },

  // ─── ALLAHUMMA BIKA AMSAYNA (evening) ────────────────────────
  {
    id: 'allahumma_bika_amsayna',
    period: ['evening'],
    category: 'praise',
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
    transliteration: "Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal masir.",
    translation: "O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our destination.",
    defaultCount: 1,
    source: "Sunan At-Tirmidhi 3391",
    virtue: "A comprehensive evening supplication acknowledging Allah's control over all affairs.",
    color: '#1a1a2a',
    glow: '#5a5ab5',
  },

  // ─── ALLAHUMMA INNI AS'ALUKA 'ILMAN ─────────────────────────
  {
    id: 'protection_family',
    period: ['morning', 'evening'],
    category: 'dua',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلاً مُتَقَبَّلاً',
    transliteration: "Allahumma inni as'aluka 'ilman nafi'an wa rizqan tayyiban wa 'amalan mutaqabbala.",
    translation: "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.",
    defaultCount: 1,
    source: "Sunan Ibn Majah 925",
    virtue: "To be recited after Fajr prayer.",
    color: '#1a2a0a',
    glow: '#6ab52a',
  },

  // ─── ALLAHUMMA INNI AS'ALUKA AL-JANNAH ───────────────────────
  {
    id: 'allahumma_jannah',
    period: ['morning', 'evening'],
    category: 'dua',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ',
    transliteration: "Allahumma inni as'alukal jannata wa ma qarraba ilayha min qawlin aw 'amal, wa a'udhu bika minan nari wa ma qarraba ilayha min qawlin aw 'amal.",
    translation: "O Allah, I ask You for Paradise and for whatever brings me closer to it, in word and deed. And I seek refuge in You from the Fire and from whatever brings me closer to it, in word and deed.",
    defaultCount: 3,
    source: "Sunan Ibn Majah 3846",
    virtue: "Whoever asks for Paradise three times, Paradise says: O Allah, admit him. Whoever seeks refuge from the Fire three times, the Fire says: O Allah, protect him.",
    color: '#1a0a2a',
    glow: '#8a4ab5',
  },

  // ─── ISTIGHFAR ────────────────────────────────────────────────
  {
    id: 'astaghfirullah',
    period: ['morning', 'evening'],
    category: 'forgiveness',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: "Astaghfirullaha wa atubu ilayh.",
    translation: "I seek forgiveness from Allah and turn to Him in repentance.",
    defaultCount: 100,
    source: "Sahih Bukhari 6307",
    virtue: "The Prophet (SAW) said: I seek Allah's forgiveness 100 times a day.",
    color: '#3a1a0a',
    glow: '#b5602a',
  },

  // ─── A'UDHU BI KALIMATILLAH AL-TAMMAH ────────────────────────
  {
    id: 'protection_verse',
    period: ['morning', 'evening'],
    category: 'protection',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bi kalimatillahit tammati min sharri ma khalaq.",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    defaultCount: 3,
    source: "Sahih Muslim 2709",
    virtue: "Whoever recites this in the evening, no harm will come to him that night.",
    color: '#0a1a3a',
    glow: '#2a5ab5',
  },

  // ─── LAST 2 AYAHS OF AL-BAQARAH ──────────────────────────────
  {
    id: 'last_2_ayahs_baqarah',
    period: ['morning', 'evening'],
    category: 'protection',
    arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ۝ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    transliteration: "Amanar rasulu bima unzila ilayhi min rabbihi wal mu'minun, kullun amana billahi wa mala'ikatihi wa kutubihi wa rusulihi la nufarriqu bayna ahadin min rusulih, wa qalu sami'na wa ata'na ghufranaka rabbana wa ilaykal masir. La yukallifullahu nafsan illa wus'aha, laha ma kasabat wa 'alayha maktasabat, rabbana la tu'akhidhna in nasina aw akhta'na, rabbana wa la tahmil 'alayna isran kama hamaltahu 'alal ladhina min qablina, rabbana wa la tuhammilna ma la taqata lana bih, wa'fu 'anna waghfir lana warhamna, anta mawlana fansurna 'alal qawmil kafirin.",
    translation: "The Messenger has believed in what was revealed to him from his Lord, and the believers as well. All of them have believed in Allah and His angels and His books and His messengers. We make no distinction between any of His messengers. And they said: We hear and we obey. Your forgiveness, our Lord! And to You is the final return. Allah does not burden a soul beyond what it can bear. It gets what it earns, and it is harmed by what it does. Our Lord, do not hold us accountable if we forget or err. Our Lord, and do not lay upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us, and forgive us, and have mercy upon us. You are our protector, so give us victory over the disbelieving people.",
    defaultCount: 1,
    source: "Al-Baqarah 2:285-286",
    virtue: "Whoever recites the last two ayahs of Al-Baqarah at night, they will be sufficient for him.",
    color: '#1a2a3a',
    glow: '#3a7ab5',
  },

  // ════════════════════════════════════════════════════════════
  // AZKARS COMPLÉTÉS — absents du fichier original
  // ════════════════════════════════════════════════════════════

  // ─── SURAH AL-FATIHA ─────────────────────────────────────────
  {
    id: 'surah_fatiha',
    period: ['morning', 'evening'],
    category: 'praise',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    transliteration: "Bismillahir rahmanir rahim. Alhamdu lillahi rabbil 'alamin. Ar-rahmanir rahim. Maliki yawmid din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas siratal mustaqim. Siratal ladhina an'amta 'alayhim ghayril maghdubi 'alayhim wa lad dallin.",
    translation: "In the name of Allah, the Most Gracious, the Most Merciful. All praise is for Allah, Lord of all worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgment. You alone we worship, and You alone we ask for help. Guide us to the straight path — the path of those You have blessed, not those You are angry with, or those who are astray.",
    defaultCount: 1,
    source: "Surah Al-Fatiha (1)",
    virtue: "Umm Al-Quran (The Mother of the Quran). There is no prayer without it. Whoever recites it in the morning and evening has praised Allah perfectly.",
    color: '#2a1a3a',
    glow: '#7a4ab5',
  },

  // ─── ALLAHUMMA MA ASBAHA BI MIN NI'MATIN ─────────────────────
  {
    id: 'allahumma_ni_mah_morning',
    period: ['morning'],
    category: 'praise',
    arabic: 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
    transliteration: "Allahumma ma asbaha bi min ni'matin aw bi ahadin min khalqika fa minka wahdaka la sharika lak, falakal hamdu wa lakash shukr.",
    translation: "O Allah, whatever blessing I or any of Your creation have received this morning is from You alone, You have no partner. To You belongs all praise and thanks.",
    defaultCount: 1,
    source: "Sunan Abu Dawud 5073",
    virtue: "Whoever says this in the morning has fulfilled the gratitude due for that day.",
    color: '#3a2a0a',
    glow: '#c8922a',
  },

  // ─── ALLAHUMMA MA AMSA BI MIN NI'MATIN ───────────────────────
  {
    id: 'allahumma_ni_mah_evening',
    period: ['evening'],
    category: 'praise',
    arabic: 'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
    transliteration: "Allahumma ma amsa bi min ni'matin aw bi ahadin min khalqika fa minka wahdaka la sharika lak, falakal hamdu wa lakash shukr.",
    translation: "O Allah, whatever blessing I or any of Your creation have received this evening is from You alone, You have no partner. To You belongs all praise and thanks.",
    defaultCount: 1,
    source: "Sunan Abu Dawud 5073",
    virtue: "Whoever says this in the evening has fulfilled the gratitude due for that night.",
    color: '#0a1a3a',
    glow: '#4a6ab5',
  },

  // ─── LA HAWLA WA LA QUWWATA ILLA BILLAH ──────────────────────
  {
    id: 'la_hawla_wa_la_quwwata',
    period: ['morning', 'evening'],
    category: 'tawhid',
    arabic: 'لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    transliteration: "La hawla wa la quwwata illa billahil 'aliyyil 'azim.",
    translation: "There is no might nor power except with Allah, the Most High, the Most Great.",
    defaultCount: 10,
    source: "Sahih Bukhari 6384",
    virtue: "It is a treasure from the treasures of Paradise. Whoever says it, Allah removes seventy calamities from him.",
    color: '#1a3d2e',
    glow: '#3aab6a',
  },

  // ─── ALLAHUMMA INNI A'UDHU BIKA MIN AL-HAMM ─────────────────
  {
    id: 'allahumma_audhu_hamm',
    period: ['morning', 'evening'],
    category: 'dua',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
    transliteration: "Allahumma inni a'udhu bika minal hammi wal hazan, wa a'udhu bika minal 'ajzi wal kasal, wa a'udhu bika minal jubni wal bukhl, wa a'udhu bika min ghalabatid dayni wa qahrir rijal.",
    translation: "O Allah, I seek refuge in You from grief and sorrow, from weakness and laziness, from miserliness and cowardice, from the burden of debts and from being overpowered by men.",
    defaultCount: 3,
    source: "Sahih Bukhari 6369",
    virtue: "The Prophet (SAW) used to seek refuge from these eight things every morning and evening.",
    color: '#3a1a2a',
    glow: '#b54a8a',
  },

  // ─── SUBHAN ALLAH AL-AZIM WA BIHAMDIHI ───────────────────────
  {
    id: 'subhanallah_azim',
    period: ['morning', 'evening'],
    category: 'praise',
    arabic: 'سُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ',
    transliteration: "Subhanallahil 'azimi wa bihamdihi.",
    translation: "Glory be to Allah the Almighty and praise be to Him.",
    defaultCount: 100,
    source: "Sahih Muslim 2694",
    virtue: "Two phrases beloved to Allah, light on the tongue, heavy on the scales — Glory be to Allah the Almighty and in His praise.",
    color: '#1a3a1a',
    glow: '#4ab54a',
  },

  // ─── ALLAHUMMA ANTAL AWWAL ────────────────────────────────────
  {
    id: 'allahumma_awwal_akhir',
    period: ['morning', 'evening'],
    category: 'tawhid',
    arabic: 'اللَّهُمَّ أَنْتَ الأَوَّلُ فَلَيْسَ قَبْلَكَ شَيْءٌ، وَأَنْتَ الآخِرُ فَلَيْسَ بَعْدَكَ شَيْءٌ، وَأَنْتَ الظَّاهِرُ فَلَيْسَ فَوْقَكَ شَيْءٌ، وَأَنْتَ الْبَاطِنُ فَلَيْسَ دُونَكَ شَيْءٌ، اقْضِ عَنَّا الدَّيْنَ وَأَغْنِنَا مِنَ الْفَقْرِ',
    transliteration: "Allahumma antal awwalu fa laysa qablaka shay', wa antal akhiru fa laysa ba'daka shay', wa antaz zahiru fa laysa fawqaka shay', wa antal batinu fa laysa dunaka shay', iqdi 'annad dayna wa aghinna minal faqr.",
    translation: "O Allah, You are the First so there is nothing before You. You are the Last so there is nothing after You. You are the Manifest so there is nothing above You. You are the Hidden so there is nothing closer than You. Settle our debts and spare us from poverty.",
    defaultCount: 1,
    source: "Sahih Muslim 2713",
    virtue: "The Prophet (SAW) used to recite this when going to bed, and it is equally recommended in the morning and evening.",
    color: '#0a0a2a',
    glow: '#4a4ab5',
  },

  // ─── ALLAHUMMA INNI ASBAHTU USH-HIDUKA ───────────────────────
  {
    id: 'ashhiduka_morning',
    period: ['morning'],
    category: 'tawhid',
    arabic: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلاَئِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لاَ إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
    transliteration: "Allahumma inni asbahtu ushhiduka wa ushhidu hamalata 'arshika wa mala'ikataka wa jami'a khalqik, annaka antallahu la ilaha illa anta wahdaka la sharika lak, wa anna Muhammadan 'abduka wa rasuluk.",
    translation: "O Allah, I have reached the morning calling You to witness, and calling to witness the bearers of Your Throne, Your angels, and all of Your creation, that You are Allah, there is none worthy of worship but You alone, without any partner, and that Muhammad is Your slave and Your messenger.",
    defaultCount: 4,
    source: "Sunan Abu Dawud 5069",
    virtue: "Whoever says this 4 times in the morning, Allah will free one quarter of him from the Fire. Whoever says it 4 times, Allah will free him entirely from the Fire.",
    color: '#1a2a3d',
    glow: '#4a7ab5',
  },

  // ─── ALLAHUMMA INNI AMSAYTU USH-HIDUKA ───────────────────────
  {
    id: 'ashhiduka_evening',
    period: ['evening'],
    category: 'tawhid',
    arabic: 'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلاَئِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لاَ إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
    transliteration: "Allahumma inni amsaytu ushhiduka wa ushhidu hamalata 'arshika wa mala'ikataka wa jami'a khalqik, annaka antallahu la ilaha illa anta wahdaka la sharika lak, wa anna Muhammadan 'abduka wa rasuluk.",
    translation: "O Allah, I have reached the evening calling You to witness, and calling to witness the bearers of Your Throne, Your angels, and all of Your creation, that You are Allah, there is none worthy of worship but You alone, without any partner, and that Muhammad is Your slave and Your messenger.",
    defaultCount: 4,
    source: "Sunan Abu Dawud 5069",
    virtue: "Whoever says this 4 times in the evening, Allah will free one quarter of him from the Fire. Whoever says it 4 times, Allah will free him entirely from the Fire.",
    color: '#0a1a2a',
    glow: '#3a5a9b',
  },

  // ─── ALLAHUMMA SALLI 'ALA MUHAMMAD (courte) ──────────────────
  {
    id: 'salawat_short',
    period: ['morning', 'evening'],
    category: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    transliteration: "Allahumma salli wa sallim wa barik 'ala nabiyyina Muhammad.",
    translation: "O Allah, send Your prayers, peace, and blessings upon our Prophet Muhammad.",
    defaultCount: 10,
    source: "Sahih Muslim 408",
    virtue: "Whoever sends blessings upon me once, Allah will send blessings upon him ten times.",
    color: '#1a2535',
    glow: '#3a7aaa',
  },

  // ─── DU'A KAFFARAH AL-MAJLIS ─────────────────────────────────
  {
    id: 'kaffarah_majlis',
    period: ['morning', 'evening'],
    category: 'forgiveness',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    transliteration: "Subhanakallahumma wa bihamdik, ashhadu an la ilaha illa ant, astaghfiruka wa atubu ilayk.",
    translation: "Glory be to You, O Allah, and in Your praise. I bear witness that there is none worthy of worship but You. I seek Your forgiveness and I repent to You.",
    defaultCount: 3,
    source: "Sunan At-Tirmidhi 3433",
    virtue: "Whoever says this will have their sins from that session forgiven, even if they are like the foam of the sea.",
    color: '#2a0a1a',
    glow: '#a53a6a',
  },

  // ─── ALLAHUMMA INNI A'UDHU BIKA MIN AL-SHIRK ─────────────────
  {
    id: 'audhu_min_shirk',
    period: ['morning', 'evening'],
    category: 'tawhid',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أُشْرِكَ بِكَ وَأَنَا أَعْلَمُ، وَأَسْتَغْفِرُكَ لِمَا لاَ أَعْلَمُ',
    transliteration: "Allahumma inni a'udhu bika an ushrika bika wa ana a'lam, wa astaghfiruka lima la a'lam.",
    translation: "O Allah, I seek refuge in You from knowingly associating partners with You, and I seek Your forgiveness for what I do unknowingly.",
    defaultCount: 3,
    source: "Al-Adab Al-Mufrad 716",
    virtue: "Protection from shirk, both apparent and hidden. The Prophet (SAW) recommended this supplication.",
    color: '#1a0a0a',
    glow: '#8a2a2a',
  },

  // ─── ALLAHUMMA INNI A'UDHU BIKA MIN ZAWAL NI'MAH ─────────────
  {
    id: 'audhu_zawal_nimah',
    period: ['morning', 'evening'],
    category: 'dua',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ، وَتَحَوُّلِ عَافِيَتِكَ، وَفُجَاءَةِ نِقْمَتِكَ، وَجَمِيعِ سَخَطِكَ',
    transliteration: "Allahumma inni a'udhu bika min zawali ni'matik, wa tahawwuli 'afiyatik, wa fuja'ati niqmatik, wa jami'i sakhatik.",
    translation: "O Allah, I seek refuge in You from the removal of Your blessing, the change of Your protection, the suddenness of Your punishment, and all of Your anger.",
    defaultCount: 1,
    source: "Sahih Muslim 2739",
    virtue: "Ibn Umar said the Prophet never abandoned these words morning and evening.",
    color: '#2a1a0a',
    glow: '#b57a2a',
  },

  // ─── ALLAHUMMA RABBAS SAMAWAT ─────────────────────────────────
  {
    id: 'allahumma_rabb_samawat',
    period: ['morning', 'evening'],
    category: 'dua',
    arabic: 'اللَّهُمَّ رَبَّ السَّمَاوَاتِ وَرَبَّ الأَرْضِ وَرَبَّ الْعَرْشِ الْعَظِيمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، وَمُنَزِّلَ التَّوْرَاةِ وَالإِنْجِيلِ وَالْفُرْقَانِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ، اللَّهُمَّ أَنْتَ الأَوَّلُ فَلَيْسَ قَبْلَكَ شَيْءٌ، وَأَنْتَ الآخِرُ فَلَيْسَ بَعْدَكَ شَيْءٌ، وَأَنْتَ الظَّاهِرُ فَلَيْسَ فَوْقَكَ شَيْءٌ، وَأَنْتَ الْبَاطِنُ فَلَيْسَ دُونَكَ شَيْءٌ، اقْضِ عَنَّا الدَّيْنَ وَأَغْنِنَا مِنَ الْفَقْرِ',
    transliteration: "Allahumma rabbas samawati wa rabbal ardi wa rabbal 'arshil 'azim, rabbana wa rabba kulli shay', faliqal habbi wan nawa, wa munazzilat tawrati wal injili wal furqan, a'udhu bika min sharri kulli shay'in anta akhidhun binasiyatih. Allahumma antal awwalu fa laysa qablaka shay', wa antal akhiru fa laysa ba'daka shay', wa antaz zahiru fa laysa fawqaka shay', wa antal batinu fa laysa dunaka shay', iqdi 'annad dayna wa aghinna minal faqr.",
    translation: "O Allah, Lord of the heavens and Lord of the earth and Lord of the Magnificent Throne. Our Lord and Lord of everything. Splitter of the grain and the date-stone. Revealer of the Torah, the Gospel and the Criterion. I seek refuge in You from the evil of everything that You have in Your grip. O Allah, You are the First and nothing comes before You, You are the Last and nothing comes after You, You are the Manifest and there is nothing above You, You are the Hidden and there is nothing beyond You. Pay off our debt for us and spare us from poverty.",
    defaultCount: 1,
    source: "Sahih Muslim 2713",
    virtue: "Comprehensive supplication acknowledging Allah's dominion over all creation.",
    color: '#0a1a2a',
    glow: '#3a6aab',
  },

  // ─── TAWAKKUL DU'A ────────────────────────────────────────────
  {
    id: 'tawakkul_dua',
    period: ['morning', 'evening'],
    category: 'dua',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ، نِعْمَ الْمَوْلَى وَنِعْمَ النَّصِيرُ',
    transliteration: "Hasbunallahu wa ni'mal wakil, ni'mal mawla wa ni'man nasir.",
    translation: "Allah is sufficient for us, and He is the best Disposer of affairs. How excellent a Protector, and how excellent a Helper.",
    defaultCount: 3,
    source: "Al-Baqarah 2:173 / Al-Anfal 8:40",
    virtue: "The words of Ibrahim (AS) when he was cast into the fire. Allah's help follows its recitation.",
    color: '#1a2a0a',
    glow: '#5ab52a',
  },

  // ─── ALLAHUMMA IHDINI WA SADDIDNI ────────────────────────────
  {
    id: 'allahumma_ihdini',
    period: ['morning', 'evening'],
    category: 'dua',
    arabic: 'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي',
    transliteration: "Allahummahdini wa saddidni.",
    translation: "O Allah, guide me and keep me steadfast.",
    defaultCount: 3,
    source: "Sahih Muslim 2725",
    virtue: "A concise and comprehensive supplication the Prophet (SAW) taught Ali (RA).",
    color: '#1a3a2a',
    glow: '#3aab5a',
  },

  // ─── ALLAHUMMA INNI AS'ALUKA AL-SABATA ───────────────────────
  {
    id: 'allahumma_thabat',
    period: ['morning', 'evening'],
    category: 'dua',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الثَّبَاتَ فِي الأَمْرِ، وَالْعَزِيمَةَ عَلَى الرُّشْدِ، وَأَسْأَلُكَ شُكْرَ نِعْمَتِكَ، وَحُسْنَ عِبَادَتِكَ، وَأَسْأَلُكَ قَلْبًا سَلِيمًا، وَلِسَانًا صَادِقًا، وَأَسْأَلُكَ مِنْ خَيْرِ مَا تَعْلَمُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا تَعْلَمُ، وَأَسْتَغْفِرُكَ لِمَا تَعْلَمُ',
    transliteration: "Allahumma inni as'alukat thabata fil amr, wal 'azimata 'alar rushd, wa as'aluka shukra ni'matik, wa husna 'ibadatik, wa as'aluka qalban salima, wa lisanan sadiqan, wa as'aluka min khayri ma ta'lam, wa a'udhu bika min sharri ma ta'lam, wa astaghfiruka lima ta'lam.",
    translation: "O Allah, I ask You for steadfastness in my affairs, and determination in guidance, and I ask You to make me grateful for Your blessings and to worship You in the best manner. I ask You for a sound heart and a truthful tongue. I ask You for the best of what You know, I seek refuge with You from the worst of what You know, and I seek Your forgiveness for what You know.",
    defaultCount: 1,
    source: "Sunan An-Nasa'i 1304",
    virtue: "A comprehensive supplication for steadfastness, worship, and protection.",
    color: '#2a1a3a',
    glow: '#8a5ab5',
  },

  // ─── ALLAHUMMA INNAKA 'AFUWWUN ────────────────────────────────
  {
    id: 'allahumma_afuwwun',
    period: ['morning', 'evening'],
    category: 'forgiveness',
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration: "Allahumma innaka 'afuwwun karimun tuhibbul 'afwa fa'fu 'anni.",
    translation: "O Allah, You are Pardoning and Generous, and You love to pardon, so pardon me.",
    defaultCount: 3,
    source: "Sunan At-Tirmidhi 3513",
    virtue: "Aisha (RA) asked the Prophet what to say on Laylatul Qadr, and he taught her this supplication.",
    color: '#3a2a1a',
    glow: '#c89a5a',
  },

  // ─── AYAT 18 AL-IMRAN ─────────────────────────────────────────
  {
    id: 'shahida_allah',
    period: ['morning', 'evening'],
    category: 'tawhid',
    arabic: 'شَهِدَ اللَّهُ أَنَّهُ لاَ إِلَهَ إِلاَّ هُوَ وَالْمَلاَئِكَةُ وَأُولُو الْعِلْمِ قَائِمًا بِالْقِسْطِ، لاَ إِلَهَ إِلاَّ هُوَ الْعَزِيزُ الْحَكِيمُ',
    transliteration: "Shahidallahu annahu la ilaha illa huwa, wal mala'ikatu wa ulul 'ilmi qa'iman bil qist, la ilaha illa huwal 'azizul hakim.",
    translation: "Allah bears witness that there is no deity except Him, and so do the angels and those of knowledge — upholding justice. There is no deity except Him, the Almighty, the Wise.",
    defaultCount: 1,
    source: "Al-Imran 3:18",
    virtue: "Whoever recites it faithfully, Allah will honor him on the Day of Resurrection.",
    color: '#0a1a3a',
    glow: '#3a5ab5',
  },

  // ─── THAL THALATHA WA THALATHIN ──────────────────────────────
  {
    id: 'tasbih_33_hamd_33_akbar_34',
    period: ['morning', 'evening'],
    category: 'praise',
    arabic: 'سُبْحَانَ اللَّهِ ۝ الْحَمْدُ لِلَّهِ ۝ اللَّهُ أَكْبَرُ',
    transliteration: "Subhanallah (33x) / Alhamdulillah (33x) / Allahu Akbar (34x) = 100",
    translation: "Glory be to Allah (33 times) / All praise is for Allah (33 times) / Allah is the Greatest (34 times) — total 100",
    defaultCount: 33,
    source: "Sahih Muslim 597",
    virtue: "No one will come on the Day of Resurrection with anything better than one who said Subhanallah 33 times, Alhamdulillah 33 times, and Allahu Akbar 34 times.",
    color: '#1a2a0a',
    glow: '#5ab53a',
  },

  // ─── DU'A POUR LA FAMILLE ET LA SANTÉ ────────────────────────
  {
    id: 'dua_afia_complete',
    period: ['morning', 'evening'],
    category: 'dua',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الصِّحَّةَ وَالْعِفَّةَ وَالأَمَانَةَ وَحُسْنَ الْخُلُقِ وَالرِّضَا بِالْقَدَرِ',
    transliteration: "Allahumma inni as'alukas sihhata wal 'iffata wal amanata wa husnal khuluqi war rida bil qadar.",
    translation: "O Allah, I ask You for health, chastity, trustworthiness, good character, and contentment with Your decree.",
    defaultCount: 1,
    source: "Al-Adab Al-Mufrad 310",
    virtue: "A complete supplication covering the fundamental qualities of a righteous believer.",
    color: '#1a3a2a',
    glow: '#4aab7a',
  },

];

export type CustomAzkar = {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  period: AzkarPeriod[];
  isCustom: true;
};

export const getCategoryLabel = (cat: AzkarCategory) => {
  const labels: Record<AzkarCategory, string> = {
    protection: 'Protection',
    praise: 'Praise & Glorification',
    forgiveness: 'Forgiveness & Repentance',
    dua: 'Supplication',
    tawhid: 'Monotheism',
    salawat: 'Salawat',
  };
  return labels[cat];
};

export const CATEGORY_COLORS: Record<AzkarCategory, string> = {
  protection: '#3a8fb5',
  praise: '#4ab54a',
  forgiveness: '#c8922a',
  dua: '#9b59b6',
  tawhid: '#5a5ab5',
  salawat: '#3ab5b5',
};