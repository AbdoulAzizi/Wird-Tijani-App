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
    virtue: "Whoever recites it in the morning, will be in the protection of Allah until the evening.",
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
    virtue: "Reciting it 3 times is equivalent to reciting the whole Quran.",
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
    virtue: "These surahs protect against all evil.",
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
    virtue: "These surahs protect against all evil.",
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
    virtue: "The master of seeking forgiveness. Whoever recites it firmly believing in it when it's morning and dies that day before evening shall be from the people of Paradise.",
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

  // ─── ASBAHNA 'ALA FITRATIL ISLAM ─────────────────────────────
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

  // ─── AMSAYNA 'ALA FITRATIL ISLAM ─────────────────────────────
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

  // ─── LA ILAHA ILLA ALLAH ─────────────────────────────────────
  {
    id: 'la_ilaha_illa_allah',
    period: ['morning', 'evening'],
    category: 'tawhid',
    arabic: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamd, wa huwa 'ala kulli shay'in qadir.",
    translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    defaultCount: 10,
    source: "Sahih Bukhari 6404",
    virtue: "Whoever says it 10 times in the morning will have the reward of freeing 4 slaves from the descendants of Ismail, 10 good deeds recorded, 10 sins erased, and protection from Shaytan until evening.",
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
    virtue: "Ibn Umar never abandoned these words morning and evening.",
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
    virtue: "Abu Bakr As-Siddiq asked the Prophet (SAW) to teach him a supplication for morning and evening.",
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

  // ─── SALAWAT 'ALA AL-NABI ─────────────────────────────────────
  {
    id: 'salawat_ibrahim',
    period: ['morning', 'evening'],
    category: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad, kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammad, kama barakta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid.",
    translation: "O Allah, bestow Your favor on Muhammad and on the family of Muhammad as You have bestowed Your favor on Ibrahim and on the family of Ibrahim. You are praiseworthy and glorious. O Allah, bless Muhammad and the family of Muhammad as You have blessed Ibrahim and the family of Ibrahim. You are praiseworthy and glorious.",
    defaultCount: 10,
    source: "Sahih Bukhari 3370",
    virtue: "Sending blessings upon the Prophet (SAW) ten times earns ten blessings from Allah.",
    color: '#1a2a3a',
    glow: '#4a8ab5',
  },

  // ─── SUBHAN ALLAH 33 / ALHAMDULILLAH 33 / ALLAHU AKBAR 34 ───
  {
    id: 'tasbih_tahmid_takbir',
    period: ['morning', 'evening'],
    category: 'praise',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: "Subhanallah / Alhamdulillah / Allahu Akbar",
    translation: "Glory be to Allah (33x) / All praise is for Allah (33x) / Allah is the Greatest (34x)",
    defaultCount: 33,
    source: "Sahih Muslim 597",
    virtue: "Reciting tasbeeh, tahmid and takbeer 33, 33 and 34 times respectively – sins will be forgiven even if they are like the foam of the sea.",
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

  // ─── ALLAHUMMA BIKA ASBAHNA ──────────────────────────────────
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

  // ─── ALLAHUMMA BIKA AMSAYNA ───────────────────────────────────
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

  // ─── PROTECTION OF FAMILY/WEALTH ─────────────────────────────
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

  // ─── DU'A FOR PROTECTION OF CHILDREN ─────────────────────────
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