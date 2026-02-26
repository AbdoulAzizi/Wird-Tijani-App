// ─── Bibliothèque complète des Azkars Islamiques ─────────────────────────────

export type AzkarCategory =
  | 'morning_evening'
  | 'salat'
  | 'quran'
  | 'tasbih'
  | 'dua'
  | 'tijani'
  | 'custom';

export interface AzkarItem {
  id: string;
  category: AzkarCategory;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  defaultTarget: number;
  color: string;
  isCustom?: boolean;
  createdAt?: string;
}

export const CATEGORY_LABELS: Record<AzkarCategory, string> = {
  morning_evening: 'Morning & Evening',
  salat:           'After Prayer',
  quran:           'Quran',
  tasbih:          'Tasbih',
  dua:             'Supplications',
  tijani:          'Tijani',
  custom:          'Custom',
};

export const CATEGORY_ICONS: Record<AzkarCategory, string> = {
  morning_evening: '🌅',
  salat:           '🕌',
  quran:           '📖',
  tasbih:          '📿',
  dua:             '🤲',
  tijani:          '🌿',
  custom:          '✨',
};

export const CATEGORY_COLORS: Record<AzkarCategory, string> = {
  morning_evening: '#F59E0B',
  salat:           '#059669',
  quran:           '#7C3AED',
  tasbih:          '#0891B2',
  dua:             '#DB2777',
  tijani:          '#16A34A',
  custom:          '#6366F1',
};

export const PRESET_AZKARS: AzkarItem[] = [
  // ── Morning & Evening ─────────────────────────────────────────────────────
  {
    id: 'subhanallah_morning',
    category: 'morning_evening',
    title: 'Subḥāna Llāh',
    arabic: 'سُبْحَانَ اللّٰهِ',
    transliteration: 'Subḥāna Llāh',
    translation: 'Glory be to Allah',
    defaultTarget: 33,
    color: '#F59E0B',
  },
  {
    id: 'alhamdulillah_morning',
    category: 'morning_evening',
    title: 'Al-Ḥamdu Li-Llāh',
    arabic: 'الْحَمْدُ لِلّٰهِ',
    transliteration: 'Al-ḥamdu li-Llāh',
    translation: 'All praise belongs to Allah',
    defaultTarget: 33,
    color: '#F59E0B',
  },
  {
    id: 'allahuakbar_morning',
    category: 'morning_evening',
    title: 'Allāhu Akbar',
    arabic: 'اللّٰهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is the Greatest',
    defaultTarget: 34,
    color: '#F59E0B',
  },
  {
    id: 'ayatul_kursi',
    category: 'morning_evening',
    title: 'Āyat al-Kursī',
    arabic: 'اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: 'Allāhu lā ilāha illā huwa l-ḥayyu l-qayyūmu lā taʾkhudhuhū sinatun wa lā nawmun lahu mā fi s-samāwāti wa mā fi l-arḍi man dha lladhī yashfaʿu ʿindahū illā bi-idhnih yaʿlamu mā bayna aydīhim wa mā khalfahum wa lā yuḥīṭūna bi-shayʾin min ʿilmihī illā bi-mā shāʾa wasiʿa kursiyyuhu s-samāwāti wa l-arḍa wa lā yaʾūduhū ḥifẓuhumā wa huwa l-ʿaliyyu l-ʿaẓīm',
    translation: 'Allah — there is no deity except Him, the Ever-Living, the Self-Sustaining. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on the earth. Who can intercede with Him except by His permission? He knows what is before them and what is behind them, and they encompass nothing of His knowledge except what He wills. His Throne extends over the heavens and the earth, and preserving them does not weary Him. He is the Most High, the Magnificent. (Al-Baqara: 255)',
    defaultTarget: 3,
    color: '#F59E0B',
  },
  {
    id: 'ikhlas_morning',
    category: 'morning_evening',
    title: 'Sūrat al-Ikhlāṣ',
    arabic: 'قُلْ هُوَ اللّٰهُ أَحَدٌ اللّٰهُ الصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
    transliteration: 'Qul huwa Llāhu aḥad, Allāhu ṣ-ṣamad, lam yalid wa lam yūlad, wa lam yakun lahū kufuwan aḥad',
    translation: 'Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born. And there is none comparable to Him. (Al-Ikhlāṣ: 1–4)',
    defaultTarget: 3,
    color: '#F59E0B',
  },
  {
    id: 'hasbiyallah',
    category: 'morning_evening',
    title: 'Ḥasbiya Llāh',
    arabic: 'حَسْبِيَ اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: 'Ḥasbiya Llāhu lā ilāha illā huwa ʿalayhi tawakkaltu wa huwa rabbu l-ʿarshi l-ʿaẓīm',
    translation: 'Allah is sufficient for me. There is no deity except Him. In Him I have placed my trust, and He is the Lord of the Magnificent Throne. (At-Tawba: 129)',
    defaultTarget: 7,
    color: '#F59E0B',
  },
  {
    id: 'muawwidhat',
    category: 'morning_evening',
    title: 'Al-Muʿawwidhāt',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ مِنْ شَرِّ مَا خَلَقَ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    transliteration: 'Qul aʿūdhu bi-rabbi l-falaq, min sharri mā khalaq, wa min sharri ghāsiqin idhā waqab, wa min sharri n-naffāthāti fi l-ʿuqad, wa min sharri ḥāsidin idhā ḥasad',
    translation: 'Say: I seek refuge in the Lord of the daybreak, from the evil of what He has created, and from the evil of darkness when it settles, and from the evil of those who blow on knots, and from the evil of an envier when he envies. (Al-Falaq: 1–5)',
    defaultTarget: 3,
    color: '#F59E0B',
  },

  // ── After Prayer ──────────────────────────────────────────────────────────
  {
    id: 'astaghfirullah_salat',
    category: 'salat',
    title: 'Istighfār',
    arabic: 'أَسْتَغْفِرُ اللّٰهَ',
    transliteration: 'Astaghfiru Llāh',
    translation: 'I seek forgiveness from Allah',
    defaultTarget: 3,
    color: '#059669',
  },
  {
    id: 'allahumma_antas_salam',
    category: 'salat',
    title: 'Allāhumma Anta s-Salām',
    arabic: 'اللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    transliteration: 'Allāhumma anta s-salāmu wa minka s-salāmu tabārakta yā dha l-jalāli wa l-ikrām',
    translation: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of Majesty and Honour.',
    defaultTarget: 1,
    color: '#059669',
  },
  {
    id: 'subhanallah_33',
    category: 'salat',
    title: 'Tasbīḥ (33×)',
    arabic: 'سُبْحَانَ اللّٰهِ',
    transliteration: 'Subḥāna Llāh',
    translation: 'Glory be to Allah',
    defaultTarget: 33,
    color: '#059669',
  },
  {
    id: 'alhamdulillah_33',
    category: 'salat',
    title: 'Taḥmīd (33×)',
    arabic: 'الْحَمْدُ لِلّٰهِ',
    transliteration: 'Al-ḥamdu li-Llāh',
    translation: 'All praise belongs to Allah',
    defaultTarget: 33,
    color: '#059669',
  },
  {
    id: 'allahuakbar_34',
    category: 'salat',
    title: 'Takbīr (34×)',
    arabic: 'اللّٰهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is the Greatest',
    defaultTarget: 34,
    color: '#059669',
  },
  {
    id: 'la_ilaha_salat',
    category: 'salat',
    title: 'Lā ilāha illa Llāh (10×)',
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Lā ilāha illa Llāhu waḥdahu lā sharīka lahu, lahu l-mulku wa lahu l-ḥamdu wa huwa ʿalā kulli shayʾin qadīr',
    translation: 'There is no deity except Allah, alone, with no partner. His is the sovereignty and His is the praise, and He is over all things omnipotent.',
    defaultTarget: 10,
    color: '#059669',
  },
  {
    id: 'ayatul_kursi_salat',
    category: 'salat',
    title: 'Āyat al-Kursī (after prayer)',
    arabic: 'اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: 'Allāhu lā ilāha illā huwa l-ḥayyu l-qayyūmu lā taʾkhudhuhū sinatun wa lā nawmun lahu mā fi s-samāwāti wa mā fi l-arḍi man dha lladhī yashfaʿu ʿindahū illā bi-idhnih yaʿlamu mā bayna aydīhim wa mā khalfahum wa lā yuḥīṭūna bi-shayʾin min ʿilmihī illā bi-mā shāʾa wasiʿa kursiyyuhu s-samāwāti wa l-arḍa wa lā yaʾūduhū ḥifẓuhumā wa huwa l-ʿaliyyu l-ʿaẓīm',
    translation: 'Allah — there is no deity except Him, the Ever-Living, the Self-Sustaining. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and on the earth. Who can intercede with Him except by His permission? He knows what is before them and what is behind them, and they encompass nothing of His knowledge except what He wills. His Throne extends over the heavens and the earth, and preserving them does not weary Him. He is the Most High, the Magnificent.',
    defaultTarget: 1,
    color: '#059669',
  },

  // ── Quran ─────────────────────────────────────────────────────────────────
  {
    id: 'basmala',
    category: 'quran',
    title: 'Basmala',
    arabic: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ',
    transliteration: 'Bismi Llāhi r-raḥmāni r-raḥīm',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
    defaultTarget: 21,
    color: '#7C3AED',
  },
  {
    id: 'fatiha',
    category: 'quran',
    title: 'Al-Fātiḥa',
    arabic: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ الرَّحْمٰنِ الرَّحِيمِ مَالِكِ يَوْمِ الدِّينِ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    transliteration: 'Bismi Llāhi r-raḥmāni r-raḥīm. Al-ḥamdu li-Llāhi rabbi l-ʿālamīn. Ar-raḥmāni r-raḥīm. Māliki yawmi d-dīn. Iyyāka naʿbudu wa iyyāka nastaʿīn. Ihdinā ṣ-ṣirāṭa l-mustaqīm. Ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa lā ḍ-ḍāllīn',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful. All praise is due to Allah, Lord of all worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgement. You alone we worship, and You alone we ask for help. Guide us to the straight path — the path of those You have blessed, not of those who have incurred anger, nor of those who have gone astray.',
    defaultTarget: 7,
    color: '#7C3AED',
  },
  {
    id: 'baqara_285_286',
    category: 'quran',
    title: 'Āmana r-Rasūl (Al-Baqara 285–286)',
    arabic: 'آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ كُلٌّ آمَنَ بِاللّٰهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ وَقَالُوا سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ لَا يُكَلِّفُ اللّٰهُ نَفْسًا إِلَّا وُسْعَهَا لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    transliteration: 'Āmana r-rasūlu bi-mā unzila ilayhi min rabbihi wa l-muʾminūn, kullun āmana bi-Llāhi wa malāʾikatihī wa kutubihī wa rusulih, lā nufarriqu bayna aḥadin min rusulih, wa qālū samiʿnā wa aṭaʿnā, ghufrānaka rabbanā wa ilayka l-maṣīr. Lā yukalliful-Llāhu nafsan illā wusʿahā, lahā mā kasabat wa ʿalayhā ma ktasabat, rabbanā lā tuʾākhidhnā in nasīnā aw akhṭaʾnā, rabbanā wa lā taḥmil ʿalaynā iṣran kamā ḥamaltahū ʿalā lladhīna min qablinā, rabbanā wa lā tuḥammilnā mā lā ṭāqata lanā bih, waʿfu ʿannā, waghfir lanā, warḥamnā, anta mawlānā fanṣurnā ʿalā l-qawmi l-kāfirīn',
    translation: 'The Messenger has believed in what was revealed to him from his Lord, as have the believers. All have believed in Allah, His angels, His books, and His messengers — making no distinction between any of His messengers. And they say: We hear and obey. Your forgiveness, our Lord, and to You is the final return. Allah does not burden a soul beyond what it can bear. It receives the good it earns and bears the harm it incurs. Our Lord, do not take us to task if we forget or make a mistake. Our Lord, do not burden us as You burdened those before us. Our Lord, do not impose upon us what we have no strength to bear. Pardon us, forgive us, and have mercy on us. You are our Guardian — grant us victory over the disbelieving people. (Al-Baqara: 285–286)',
    defaultTarget: 1,
    color: '#7C3AED',
  },
  {
    id: 'last_3_surahs',
    category: 'quran',
    title: 'Al-Muʿawwidhāt (3 Quls)',
    arabic: 'قُلْ هُوَ اللّٰهُ أَحَدٌ اللّٰهُ الصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ — قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ مِنْ شَرِّ مَا خَلَقَ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ — قُلْ أَعُوذُ بِرَبِّ النَّاسِ مَلِكِ النَّاسِ إِلٰهِ النَّاسِ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ مِنَ الْجِنَّةِ وَالنَّاسِ',
    transliteration: 'Qul huwa Llāhu aḥad, Allāhu ṣ-ṣamad, lam yalid wa lam yūlad, wa lam yakun lahū kufuwan aḥad — Qul aʿūdhu bi-rabbi l-falaq, min sharri mā khalaq, wa min sharri ghāsiqin idhā waqab, wa min sharri n-naffāthāti fi l-ʿuqad, wa min sharri ḥāsidin idhā ḥasad — Qul aʿūdhu bi-rabbi n-nās, maliki n-nās, ilāhi n-nās, min sharri l-waswāsi l-khannās, alladhī yuwaswisu fī ṣudūri n-nās, mina l-jinnati wa n-nās',
    translation: 'Sūrat al-Ikhlāṣ: Say — He is Allah, the One; Allah, the Eternal Refuge; He neither begets nor is born; and there is none comparable to Him. — Sūrat al-Falaq: Say — I seek refuge in the Lord of the daybreak, from the evil of what He created, from the evil of darkness when it settles, from the evil of those who blow on knots, and from the evil of an envier when he envies. — Sūrat an-Nās: Say — I seek refuge in the Lord of mankind, the King of mankind, the God of mankind, from the evil of the whispering retreater who whispers in the breasts of mankind — from jinn and mankind.',
    defaultTarget: 3,
    color: '#7C3AED',
  },

  // ── Tasbih ────────────────────────────────────────────────────────────────
  {
    id: 'subhanallah_wabihamdihi',
    category: 'tasbih',
    title: 'Subḥāna Llāh wa bi-ḥamdih',
    arabic: 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ',
    transliteration: 'Subḥāna Llāhi wa bi-ḥamdih',
    translation: 'Glory be to Allah and all praise is His',
    defaultTarget: 100,
    color: '#0891B2',
  },
  {
    id: 'subhanallah_azim',
    category: 'tasbih',
    title: 'Subḥāna Llāh al-ʿAẓīm',
    arabic: 'سُبْحَانَ اللّٰهِ الْعَظِيمِ',
    transliteration: 'Subḥāna Llāhi l-ʿaẓīm',
    translation: 'Glory be to Allah, the Immensely Magnificent',
    defaultTarget: 100,
    color: '#0891B2',
  },
  {
    id: 'la_hawla',
    category: 'tasbih',
    title: 'Lā ḥawla wa lā quwwata',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظِيمِ',
    transliteration: 'Lā ḥawla wa lā quwwata illā bi-Llāhi l-ʿaliyyi l-ʿaẓīm',
    translation: 'There is no power and no strength except through Allah, the Most High, the Most Magnificent',
    defaultTarget: 100,
    color: '#0891B2',
  },
  {
    id: 'tasbih_fatima',
    category: 'tasbih',
    title: 'Tasbīḥ Fāṭima',
    arabic: 'سُبْحَانَ اللّٰهِ — الْحَمْدُ لِلّٰهِ — اللّٰهُ أَكْبَرُ',
    transliteration: 'Subḥāna Llāh (33×) — Al-ḥamdu li-Llāh (33×) — Allāhu Akbar (34×)',
    translation: 'Glory be to Allah (33×) — All praise belongs to Allah (33×) — Allah is the Greatest (34×). The tasbīḥ of Fāṭima, recommended after every prayer.',
    defaultTarget: 100,
    color: '#0891B2',
  },
  {
    id: 'salawat_ibrahimiyya',
    category: 'tasbih',
    title: 'Ṣalawāt Ibrāhīmiyya',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ وَبَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: 'Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammadin kamā ṣallayta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, wa bārik ʿalā Muḥammadin wa ʿalā āli Muḥammadin kamā bārakta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka ḥamīdun majīd',
    translation: 'O Allah, send blessings upon Muhammad and upon the family of Muhammad, just as You sent blessings upon Ibrāhīm and the family of Ibrāhīm. And bestow Your grace upon Muhammad and upon the family of Muhammad, just as You bestowed grace upon Ibrāhīm and the family of Ibrāhīm. Verily You are Praiseworthy and Glorious.',
    defaultTarget: 100,
    color: '#0891B2',
  },

  // ── Supplications ─────────────────────────────────────────────────────────
  {
    id: 'allahumma_salli_nabi',
    category: 'dua',
    title: 'Ṣalawāt upon the Prophet ﷺ',
    arabic: 'اللّٰهُمَّ صَلِّ وَسَلِّمْ عَلَى سَيِّدِنَا مُحَمَّدٍ',
    transliteration: 'Allāhumma ṣalli wa sallim ʿalā sayyidinā Muḥammad',
    translation: 'O Allah, send blessings and peace upon our Master Muhammad ﷺ',
    defaultTarget: 10,
    color: '#DB2777',
  },
  {
    id: 'rabbighfirli',
    category: 'dua',
    title: 'Rabbiighfir lī',
    arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الْغَفُورُ',
    transliteration: 'Rabbi ghfir lī wa tub ʿalayya innaka anta t-tawwābu l-ghafūr',
    translation: 'My Lord, forgive me and accept my repentance. Verily You are the Ever-Relenting, the All-Forgiving.',
    defaultTarget: 100,
    color: '#DB2777',
  },
  {
    id: 'allahumma_inni_asaluka',
    category: 'dua',
    title: 'Duʿāʾ al-ʿAfwa (Night of Qadr)',
    arabic: 'اللّٰهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration: 'Allāhumma innaka ʿafuwwun tuḥibbu l-ʿafwa faʿfu ʿannī',
    translation: 'O Allah, You are the Pardoner and You love to pardon, so pardon me.',
    defaultTarget: 100,
    color: '#DB2777',
  },
  {
    id: 'dua_kaffaratul_majlis',
    category: 'dua',
    title: 'Kaffārat al-Majlis',
    arabic: 'سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    transliteration: 'Subḥānaka Llāhumma wa bi-ḥamdika, ashhadu an lā ilāha illā anta, astaghfiruka wa atūbu ilayk',
    translation: 'Glory be to You, O Allah, and all praise. I bear witness that there is no deity but You. I seek Your forgiveness and I turn to You in repentance. (Expiation of a gathering)',
    defaultTarget: 1,
    color: '#DB2777',
  },
  {
    id: 'allahumma_aini',
    category: 'dua',
    title: 'Allāhumma aʿinnī',
    arabic: 'اللّٰهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliteration: 'Allāhumma aʿinnī ʿalā dhikrika wa shukrika wa ḥusni ʿibādatik',
    translation: 'O Allah, help me to remember You, to be grateful to You, and to worship You in the most excellent manner.',
    defaultTarget: 3,
    color: '#DB2777',
  },
  {
    id: 'dua_qunoot',
    category: 'dua',
    title: 'Duʿāʾ al-Qunūt',
    arabic: 'اللّٰهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ وَبَارِكْ لِي فِيمَا أَعْطَيْتَ وَقِنِي شَرَّ مَا قَضَيْتَ فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ',
    transliteration: 'Allāhumma hdinī fīman hadayt, wa ʿāfinī fīman ʿāfayt, wa tawallanī fīman tawallayt, wa bārik lī fīmā aʿṭayt, wa qinī sharra mā qaḍayt, fa-innaka taqḍī wa lā yuqḍā ʿalayk, wa innahū lā yadhillu man wālayt, tabārakta rabbanā wa taʿālayt',
    translation: 'O Allah, guide me among those You have guided, grant me well-being among those You have granted well-being, take me under Your care among those You have taken under Your care, bless me in what You have given me, protect me from the evil of what You have decreed. For You decree and nothing is decreed over You. None is humbled whom You befriend. Blessed and Exalted are You, our Lord.',
    defaultTarget: 1,
    color: '#DB2777',
  },

  // ── Tijani ────────────────────────────────────────────────────────────────
  {
    id: 'istighfar_tijani',
    category: 'tijani',
    title: 'Istighfār',
    arabic: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ الَّذِي لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfiru Llāha l-ʿaẓīma lladhī lā ilāha illā huwa l-ḥayyu l-qayyūmu wa atūbu ilayh',
    translation: 'I seek forgiveness from Allah the Magnificent, there is no deity except Him, the Ever-Living, the Self-Sustaining, and I turn to Him in repentance.',
    defaultTarget: 100,
    color: '#16A34A',
  },
  {
    id: 'salat_fatih',
    category: 'tijani',
    title: 'Ṣalāt al-Fātiḥ',
    arabic: 'اَللَّهُمَّ صَلِّ عَلى سَيِّدِنَا مُحَمَّدٍ اَلْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بِالْحَقِّ وَالْهَادِي إِلَى صِرَاطِكَ الْمُسْتَقِيمِ وَعَلَى آلِهِ حَقَّ قَدْرِهِ وَمِقْدَارِهِ الْعَظِيمِ',
    transliteration: 'Allāhumma ṣalli ʿalā sayyidinā Muḥammadin l-fātiḥi limā ughliq, wa l-khātimi limā sabaq, nāṣiri l-ḥaqqi bi-l-ḥaqq, wa l-hādī ilā ṣirāṭika l-mustaqīm, wa ʿalā ālihi ḥaqqa qadrihi wa miqdārihi l-ʿaẓīm',
    translation: 'O Allah, send blessings upon our Master Muhammad, the Opener of what was closed, the Seal of what has passed, the Helper of Truth through Truth, the Guide to Your straight path — and upon his family, according to his true worth and his immense station.',
    defaultTarget: 100,
    color: '#16A34A',
  },
  {
    id: 'tahlil_tijani',
    category: 'tijani',
    title: 'Tahlīl',
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
    transliteration: 'Lā ilāha illa Llāh',
    translation: 'There is no deity except Allah',
    defaultTarget: 100,
    color: '#16A34A',
  },
  {
    id: 'jawhara',
    category: 'tijani',
    title: 'Jawharat al-Kamāl',
    arabic: 'اَللَّهُـمَّ صَـلِّ وَسَلِّـمْ عَـلَى عَيْـنِ الـرَّحْـمَـةِ الرَّبَّــانِـيَـةِ وَاليَاقُـوتَـةِ المُتَـحَقِّـقَـةِ الحَـائِطَةِ بِمَـرْكَزِ الفُـهُومِ والمَعَـانِي، وَنُـورِ الأَكْـوَانِ المُتَـكَوِّنَـةِ الآدَمِـي صَـاحِبِ الحَـقِّ الـرَّبَّانِي، البَرْقِ الأَسْطَعِ بِمُزُونِ الأَرْبَاحِ المَالِئَةِ لِكُلِّ مُتَعَرِّضٍ مِنَ البُحُورِ وَالأَوَانِي، وَنُـورِكَ اللاَّمِعِ الـذِي مَـلأْتَ بِهِ كَوْنَكَ الحَـائِطِ بِأَمْكِنَةِ المَـكَانِي، اَللَّهُـمَّ صَلِّ وَسَلِّمْ عَلَى عَيْنِ الحَقِّ التِي تَتَجَلَّى مِنْهَا عُرُوشُ الحَقَـائِقِ عَيْــنِ المَـعَارِفِ الأَقْـوَمِ صِـرَاطِـكَ التَّـــامِّ الأَسْـقَــمِ، اللَّهُـمَّ صَـلِّ وَسَلِّـمْ عَلَى طَلْعَةِ الحَـقِّ بَالحَـقِّ الكَـنْزِ الأَعْـظَمِ إِفَـاضَتِـكَ مِنْـكَ إِلَيْــكَ إِحَـاطَـةِ النُّـورِ المُطَــلْسَــمِ صَلَّـى اللهُ عَلَيْـهِ وَعَـلَى آلِـهِ، صَـلاَةً تُعَرِّفُنَـا بِـهَا إِيَّـــاهُ',
    transliteration: 'Allāhumma ṣalli wa sallim ʿalā ʿayni r-raḥmati r-rabbāniyya, wa l-yāqūtati l-mutaḥaqqiqa l-ḥāʾiṭa bi-markazi l-fuhūmi wa l-maʿānī, wa nūri l-akwāni l-mutakawwina l-ādamiyy ṣāḥibi l-ḥaqqi r-rabbānī, al-barqi l-asṭaʿ bi-muzūni l-arbāḥi l-māliʾa li-kulli mutaʿarriḍin mina l-buḥūri wa l-awānī, wa nūrika l-lāmiʿi lladhī malaʾta bihi kawnaka l-ḥāʾiṭi bi-amkinati l-makānī. Allāhumma ṣalli wa sallim ʿalā ʿayni l-ḥaqqi llatī tatajallā minhā ʿurūshu l-ḥaqāʾiq, ʿayni l-maʿārifi l-aqwam, ṣirāṭika t-tāmmi l-asqam. Allāhumma ṣalli wa sallim ʿalā ṭalʿati l-ḥaqqi bi-l-ḥaqq, al-kanzi l-aʿẓam, ifāḍatika minka ilayka iḥāṭati n-nūri l-muṭalsam. Ṣallā Llāhu ʿalayhi wa ʿalā ālih, ṣalātan tuʿarrifunā bihā iyyāh',
    translation: 'O Allah, send blessings and peace upon the Essence of Divine Mercy, the verified Ruby encompassing the centre of all understanding and meanings, the Light of all existing worlds — the human one — the possessor of Divine Truth, the most brilliant lightning of the clouds of benefit filling every vessel from the seas and containers, and Your radiant light with which You filled Your universe encompassing all places. O Allah, send blessings and peace upon the Essence of Truth from which the thrones of realities manifest — the most upright Eye of gnosis, Your most complete and perfect path. O Allah, send blessings and peace upon the Manifestation of Truth through Truth, the Greatest Treasure, Your outpouring from You to You, the encompassment of the sealed Light. May Allah send blessings upon him and upon his family — blessings through which You make him truly known to us.',
    defaultTarget: 12,
    color: '#16A34A',
  },
];