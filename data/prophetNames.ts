// ─── 201 Names of the Prophet ﷺ ─────────────────────────────────────────────

export type NameTheme =
  | 'essence'      // Names of his essential nature
  | 'mercy'        // Names expressing mercy & compassion
  | 'light'        // Names related to light & guidance
  | 'praise'       // Names of praise & glory
  | 'intercession' // Names related to intercession
  | 'prophecy'     // Names related to his prophetic mission
  | 'character'    // Names of his noble character
  | 'quran';       // Names mentioned in the Quran

export interface ProphetName {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  theme: NameTheme;
  description?: string;
}

export const PROPHET_NAMES: ProphetName[] = [
  // ── Essence ──────────────────────────────────────────────────────────────────
  { id: 1,   arabic: 'مُحَمَّد',          transliteration: 'Muḥammad',           translation: 'The Most Praised',                      theme: 'essence',      description: 'His blessed given name, meaning one who is perpetually praised' },
  { id: 2,   arabic: 'أَحْمَد',           transliteration: 'Aḥmad',              translation: 'The Most Praising of Allah',             theme: 'essence',      description: 'His name in the heavens, the one who praises Allah most' },
  { id: 3,   arabic: 'حَامِد',           transliteration: 'Ḥāmid',              translation: 'The Praiser',                            theme: 'essence' },
  { id: 4,   arabic: 'مَحْمُود',          transliteration: 'Maḥmūd',             translation: 'The Praiseworthy',                       theme: 'essence' },
  { id: 5,   arabic: 'أَحْيَد',           transliteration: 'Aḥyad',              translation: 'The One Who Turns Away from Evil',       theme: 'character' },
  { id: 6,   arabic: 'وَاحِد',           transliteration: 'Wāḥid',              translation: 'The One, the Unique',                    theme: 'essence' },
  { id: 7,   arabic: 'مَاحٍ',            transliteration: 'Māḥin',              translation: 'The Eraser of Disbelief',                theme: 'prophecy' },
  { id: 8,   arabic: 'حَاشِر',           transliteration: 'Ḥāshir',             translation: 'The Gatherer',                           theme: 'prophecy',     description: 'People will be gathered after him on the Day of Resurrection' },
  { id: 9,   arabic: 'عَاقِب',           transliteration: 'ʿĀqib',              translation: 'The Last of Prophets',                   theme: 'prophecy',     description: 'He comes after all prophets, sealing prophethood' },
  { id: 10,  arabic: 'خَاتِم النَّبِيِّين', transliteration: 'Khātam al-Nabiyyīn', translation: 'The Seal of Prophets',                  theme: 'prophecy',     description: 'The final prophet, closing the door of prophethood' },

  // ── Light ─────────────────────────────────────────────────────────────────────
  { id: 11,  arabic: 'نُور',             transliteration: 'Nūr',                translation: 'The Light',                             theme: 'light',        description: 'He is the primordial light from which all creation was made' },
  { id: 12,  arabic: 'سِرَاج',           transliteration: 'Sirāj',              translation: 'The Lamp',                              theme: 'light' },
  { id: 13,  arabic: 'سِرَاجٌ مُنِير',   transliteration: 'Sirājun Munīr',      translation: 'The Illuminating Lamp',                  theme: 'light',        description: 'Mentioned in the Quran (33:46)' },
  { id: 14,  arabic: 'مِصْبَاح',         transliteration: 'Miṣbāḥ',             translation: 'The Torch',                             theme: 'light' },
  { id: 15,  arabic: 'مُنِير',           transliteration: 'Munīr',              translation: 'The Radiant',                           theme: 'light' },
  { id: 16,  arabic: 'ضِيَاء',           transliteration: 'Ḍiyāʾ',              translation: 'The Radiance',                          theme: 'light' },
  { id: 17,  arabic: 'هَادٍ',            transliteration: 'Hādī',               translation: 'The Guide',                             theme: 'light',        description: 'He guides humanity to the straight path' },
  { id: 18,  arabic: 'مَهْدِي',          transliteration: 'Mahdī',              translation: 'The Rightly Guided',                    theme: 'light' },
  { id: 19,  arabic: 'رَشِيد',           transliteration: 'Rashīd',             translation: 'The Director to Righteousness',         theme: 'light' },
  { id: 20,  arabic: 'مُرْشِد',          transliteration: 'Murshid',            translation: 'The Spiritual Guide',                   theme: 'light' },

  // ── Mercy ─────────────────────────────────────────────────────────────────────
  { id: 21,  arabic: 'رَحْمَة',          transliteration: 'Raḥma',              translation: 'The Mercy',                             theme: 'mercy',        description: 'He is mercy itself sent to all worlds' },
  { id: 22,  arabic: 'رَحِيم',           transliteration: 'Raḥīm',              translation: 'The Compassionate',                     theme: 'mercy' },
  { id: 23,  arabic: 'رَؤُوف',           transliteration: 'Raʾūf',              translation: 'The Kind',                              theme: 'mercy',        description: 'Mentioned in the Quran (9:128): "Raʾūfun Raḥīm"' },
  { id: 24,  arabic: 'رَحْمَةٌ لِلْعَالَمِين', transliteration: 'Raḥmatul-lil-ʿĀlamīn', translation: 'Mercy to All the Worlds',        theme: 'mercy',        description: 'Mentioned in the Quran (21:107)' },
  { id: 25,  arabic: 'شَفِيق',           transliteration: 'Shafīq',             translation: 'The Tender-Hearted',                    theme: 'mercy' },
  { id: 26,  arabic: 'حَنِين',           transliteration: 'Ḥanīn',              translation: 'The Longing, Full of Yearning',         theme: 'mercy' },
  { id: 27,  arabic: 'وَصُول',           transliteration: 'Waṣūl',              translation: 'The One Who Maintains Bonds',           theme: 'mercy' },
  { id: 28,  arabic: 'ذُو الرَّحْمَة',   transliteration: 'Dhū r-Raḥma',        translation: 'Possessor of Mercy',                    theme: 'mercy' },
  { id: 29,  arabic: 'مُوَقَّى',         transliteration: 'Muwaqqā',            translation: 'The Protected',                         theme: 'mercy' },
  { id: 30,  arabic: 'كَرِيم',           transliteration: 'Karīm',              translation: 'The Noble, the Generous',               theme: 'character' },

  // ── Praise ────────────────────────────────────────────────────────────────────
  { id: 31,  arabic: 'مُصْطَفَى',        transliteration: 'Muṣṭafā',            translation: 'The Chosen One',                        theme: 'praise',       description: 'Chosen by Allah above all creation' },
  { id: 32,  arabic: 'مُجْتَبَى',        transliteration: 'Mujtabā',            translation: 'The Elected',                           theme: 'praise' },
  { id: 33,  arabic: 'مُخْتَار',         transliteration: 'Mukhtār',            translation: 'The Selected',                          theme: 'praise' },
  { id: 34,  arabic: 'أَمِين',           transliteration: 'Amīn',               translation: 'The Trustworthy',                       theme: 'character',    description: 'His people named him al-Amīn before prophethood' },
  { id: 35,  arabic: 'صَادِق',           transliteration: 'Ṣādiq',              translation: 'The Truthful',                          theme: 'character' },
  { id: 36,  arabic: 'مَصْدُوق',         transliteration: 'Maṣdūq',             translation: 'The One Deemed Truthful',               theme: 'character' },
  { id: 37,  arabic: 'شَرِيف',           transliteration: 'Sharīf',             translation: 'The Noble',                             theme: 'praise' },
  { id: 38,  arabic: 'صَفِي',            transliteration: 'Ṣafī',               translation: 'The Pure, the Chosen Friend',           theme: 'praise' },
  { id: 39,  arabic: 'صَفِيُّ اللهِ',    transliteration: 'Ṣafiyyullāh',        translation: "Allah's Chosen Pure One",               theme: 'praise' },
  { id: 40,  arabic: 'حَبِيبُ اللهِ',    transliteration: 'Ḥabībullāh',         translation: 'The Beloved of Allah',                  theme: 'praise',       description: 'The most beloved of all creation to Allah' },

  // ── Intercession ─────────────────────────────────────────────────────────────
  { id: 41,  arabic: 'شَافِع',           transliteration: 'Shāfiʿ',             translation: 'The Intercessor',                       theme: 'intercession', description: 'He will intercede for his Ummah on the Day of Judgment' },
  { id: 42,  arabic: 'مُشَفَّع',         transliteration: 'Mushaffaʿ',          translation: 'The One Whose Intercession is Accepted', theme: 'intercession' },
  { id: 43,  arabic: 'شَفِيع المُذْنِبِين', transliteration: 'Shafīʿ al-Mudhnibīn', translation: 'Intercessor of the Sinners',       theme: 'intercession' },
  { id: 44,  arabic: 'صَاحِب المَقَام المَحْمُود', transliteration: 'Ṣāḥib al-Maqām al-Maḥmūd', translation: 'Owner of the Praised Station', theme: 'intercession', description: 'The station of al-Maqām al-Maḥmūd from which he will intercede' },
  { id: 45,  arabic: 'صَاحِب الشَّفَاعَة', transliteration: 'Ṣāḥib al-Shafāʿa',  translation: 'Master of Intercession',               theme: 'intercession' },
  { id: 46,  arabic: 'صَاحِب الوَسِيلَة',  transliteration: 'Ṣāḥib al-Wasīla',   translation: 'Owner of the Highest Station in Paradise', theme: 'intercession' },
  { id: 47,  arabic: 'صَاحِب الحَوْض',    transliteration: 'Ṣāḥib al-Ḥawḍ',     translation: 'Master of the Sacred Pool (Kawthar)', theme: 'intercession' },
  { id: 48,  arabic: 'صَاحِب اللِّوَاء',  transliteration: 'Ṣāḥib al-Liwāʾ',    translation: 'Bearer of the Banner of Praise',       theme: 'intercession' },
  { id: 49,  arabic: 'صَاحِب الدَّرَجَة الرَّفِيعَة', transliteration: 'Ṣāḥib al-Daraja al-Rafīʿa', translation: 'Owner of the Lofty Rank', theme: 'intercession' },
  { id: 50,  arabic: 'شَفِيع الأُمَم',    transliteration: 'Shafīʿ al-Umam',     translation: 'Intercessor of All Nations',           theme: 'intercession' },

  // ── Prophecy ──────────────────────────────────────────────────────────────────
  { id: 51,  arabic: 'نَبِي',            transliteration: 'Nabī',               translation: 'The Prophet',                           theme: 'prophecy' },
  { id: 52,  arabic: 'رَسُول',           transliteration: 'Rasūl',              translation: 'The Messenger',                         theme: 'prophecy' },
  { id: 53,  arabic: 'نَبِيُّ الرَّحْمَة', transliteration: 'Nabī al-Raḥma',    translation: 'The Prophet of Mercy',                  theme: 'prophecy' },
  { id: 54,  arabic: 'نَبِيُّ التَّوْبَة', transliteration: 'Nabī al-Tawba',    translation: 'The Prophet of Repentance',             theme: 'prophecy' },
  { id: 55,  arabic: 'نَبِيُّ المَلْحَمَة', transliteration: 'Nabī al-Malḥama', translation: 'The Prophet of the Final Battle',       theme: 'prophecy' },
  { id: 56,  arabic: 'رَسُولُ الرَّحْمَة', transliteration: 'Rasūl al-Raḥma',  translation: 'The Messenger of Mercy',                theme: 'prophecy' },
  { id: 57,  arabic: 'خَيْر الأَنْبِيَاء', transliteration: 'Khayr al-Anbiyāʾ', translation: 'The Best of Prophets',                 theme: 'prophecy' },
  { id: 58,  arabic: 'خَيْر الخَلْق',    transliteration: 'Khayr al-Khalq',     translation: 'The Best of Creation',                 theme: 'prophecy' },
  { id: 59,  arabic: 'خَيْر البَرِيَّة',  transliteration: 'Khayr al-Bariyya',  translation: 'The Best of All Beings',                theme: 'prophecy' },
  { id: 60,  arabic: 'سَيِّد الأَنْبِيَاء', transliteration: 'Sayyid al-Anbiyāʾ', translation: 'Master of the Prophets',             theme: 'prophecy' },

  // ── Character ─────────────────────────────────────────────────────────────────
  { id: 61,  arabic: 'حَلِيم',           transliteration: 'Ḥalīm',              translation: 'The Forbearing',                        theme: 'character' },
  { id: 62,  arabic: 'عَلِيم',           transliteration: 'ʿAlīm',              translation: 'The Knowledgeable',                     theme: 'character' },
  { id: 63,  arabic: 'حَكِيم',           transliteration: 'Ḥakīm',              translation: 'The Wise',                              theme: 'character' },
  { id: 64,  arabic: 'عَادِل',           transliteration: 'ʿĀdil',              translation: 'The Just',                              theme: 'character' },
  { id: 65,  arabic: 'صَبُور',           transliteration: 'Ṣabūr',              translation: 'The Patient',                           theme: 'character' },
  { id: 66,  arabic: 'شَكُور',           transliteration: 'Shakūr',             translation: 'The Grateful',                          theme: 'character' },
  { id: 67,  arabic: 'زَاهِد',           transliteration: 'Zāhid',              translation: 'The Ascetic, Detached from the World',  theme: 'character' },
  { id: 68,  arabic: 'حَيِيٌّ',          transliteration: 'Ḥayyī',              translation: 'The Modest, Possessing Hayāʾ',          theme: 'character' },
  { id: 69,  arabic: 'كَرِيمُ الأَخْلاق', transliteration: 'Karīm al-Akhlāq',   translation: 'Noble in Character',                    theme: 'character' },
  { id: 70,  arabic: 'عَظِيمُ الخُلُق',  transliteration: 'ʿAẓīm al-Khuluq',   translation: 'Immense in Character',                  theme: 'character',  description: 'Mentioned in the Quran (68:4): "wa innaka laʿalā khuluqin ʿaẓīm"' },

  // ── Quranic Names ─────────────────────────────────────────────────────────────
  { id: 71,  arabic: 'بَشِير',           transliteration: 'Bashīr',             translation: 'The Bearer of Glad Tidings',            theme: 'quran' },
  { id: 72,  arabic: 'نَذِير',           transliteration: 'Nadhīr',             translation: 'The Warner',                            theme: 'quran' },
  { id: 73,  arabic: 'دَاعٍ إِلَى اللهِ', transliteration: 'Dāʿī ilallāh',      translation: 'The Caller to Allah',                   theme: 'quran' },
  { id: 74,  arabic: 'شَاهِد',           transliteration: 'Shāhid',             translation: 'The Witness',                           theme: 'quran',        description: 'Mentioned in the Quran (33:45)' },
  { id: 75,  arabic: 'مُبَشِّر',         transliteration: 'Mubashshir',         translation: 'The Announcer of Good News',            theme: 'quran' },
  { id: 76,  arabic: 'مُنْذِر',          transliteration: 'Mundhir',            translation: 'The Admonisher',                        theme: 'quran' },
  { id: 77,  arabic: 'مُذَكِّر',         transliteration: 'Mudhakkir',          translation: 'The Reminder',                          theme: 'quran' },
  { id: 78,  arabic: 'شَهِيد',           transliteration: 'Shahīd',             translation: 'The Witness Over His Nation',           theme: 'quran' },
  { id: 79,  arabic: 'رَءُوفٌ رَحِيم',   transliteration: 'Raʾūfun Raḥīm',     translation: 'Compassionate and Merciful',            theme: 'quran',        description: 'Exactly as Allah describes him in Quran (9:128)' },
  { id: 80,  arabic: 'حَرِيصٌ عَلَيكُم', transliteration: 'Ḥarīṣun ʿalaykum', translation: 'Ardently Desirous of Your Wellbeing',   theme: 'quran' },

  // ── More Light Names ──────────────────────────────────────────────────────────
  { id: 81,  arabic: 'بَدْرٌ تَمَام',    transliteration: 'Badrun Tamām',       translation: 'The Full Moon',                         theme: 'light' },
  { id: 82,  arabic: 'شَمْس',            transliteration: 'Shams',              translation: 'The Sun',                               theme: 'light' },
  { id: 83,  arabic: 'قَمَر',            transliteration: 'Qamar',              translation: 'The Moon',                              theme: 'light' },
  { id: 84,  arabic: 'نَجْم',            transliteration: 'Najm',               translation: 'The Star',                              theme: 'light' },
  { id: 85,  arabic: 'سَنَا',            transliteration: 'Sanā',               translation: 'The Splendor',                          theme: 'light' },
  { id: 86,  arabic: 'فَجْر',            transliteration: 'Fajr',               translation: 'The Dawn',                              theme: 'light' },
  { id: 87,  arabic: 'ضُحَى',            transliteration: 'Ḍuḥā',               translation: 'The Morning Light',                     theme: 'light' },
  { id: 88,  arabic: 'تَنْوِير',         transliteration: 'Tanwīr',             translation: 'The Illuminator',                       theme: 'light' },
  { id: 89,  arabic: 'مُنَوِّر القُلُوب', transliteration: 'Munawwir al-Qulūb', translation: 'The Illuminator of Hearts',             theme: 'light' },
  { id: 90,  arabic: 'مِفْتَاح الرَّحْمَة', transliteration: 'Miftāḥ al-Raḥma', translation: 'The Key of Mercy',                    theme: 'light' },

  // ── More Essence Names ────────────────────────────────────────────────────────
  { id: 91,  arabic: 'سَيِّد',           transliteration: 'Sayyid',             translation: 'The Master, the Chief',                 theme: 'essence',      description: 'Master of all of humanity' },
  { id: 92,  arabic: 'سَيِّدُ الكَوْنَيْن', transliteration: 'Sayyid al-Kawnayn', translation: 'Master of Both Worlds',               theme: 'essence' },
  { id: 93,  arabic: 'سَيِّدُ الثَّقَلَيْن', transliteration: 'Sayyid al-Thaqalayn', translation: 'Master of Humans and Jinn',        theme: 'essence' },
  { id: 94,  arabic: 'سَيِّدُنَا',        transliteration: 'Sayyidunā',          translation: 'Our Master',                            theme: 'essence' },
  { id: 95,  arabic: 'إِمَام المُتَّقِين', transliteration: 'Imām al-Muttaqīn',  translation: 'Leader of the God-Fearing',            theme: 'essence' },
  { id: 96,  arabic: 'إِمَام الأَنْبِيَاء', transliteration: 'Imām al-Anbiyāʾ', translation: 'Leader of the Prophets',               theme: 'essence' },
  { id: 97,  arabic: 'أَوَّل',           transliteration: 'Awwal',              translation: 'The First (in Creation)',               theme: 'essence',      description: 'First in the divine plan of creation' },
  { id: 98,  arabic: 'آخِر',             transliteration: 'Ākhir',              translation: 'The Last (of Prophets)',                theme: 'essence' },
  { id: 99,  arabic: 'ظَاهِر',           transliteration: 'Ẓāhir',              translation: 'The Manifest',                          theme: 'essence' },
  { id: 100, arabic: 'بَاطِن',           transliteration: 'Bāṭin',              translation: 'The Hidden (in his reality)',           theme: 'essence' },

  // ── More Character Names ──────────────────────────────────────────────────────
  { id: 101, arabic: 'شُجَاع',           transliteration: 'Shujāʿ',             translation: 'The Brave',                             theme: 'character' },
  { id: 102, arabic: 'جَوَاد',           transliteration: 'Jawād',              translation: 'The Generous, the Magnanimous',         theme: 'character' },
  { id: 103, arabic: 'وَفِيّ',           transliteration: 'Wafī',               translation: 'The Loyal',                             theme: 'character' },
  { id: 104, arabic: 'تَقِيّ',           transliteration: 'Taqī',               translation: 'The Pious',                             theme: 'character' },
  { id: 105, arabic: 'نَقِيّ',           transliteration: 'Naqī',               translation: 'The Pure',                              theme: 'character' },
  { id: 106, arabic: 'رَضِيّ',           transliteration: 'Raḍī',               translation: 'The Content, Well-Pleased',             theme: 'character' },
  { id: 107, arabic: 'مَرْضِيّ',         transliteration: 'Marḍī',              translation: 'The One Pleasing to All',               theme: 'character' },
  { id: 108, arabic: 'طَاهِر',           transliteration: 'Ṭāhir',              translation: 'The Purified One',                      theme: 'character' },
  { id: 109, arabic: 'مُطَهَّر',         transliteration: 'Muṭahhar',           translation: 'The Sanctified',                        theme: 'character' },
  { id: 110, arabic: 'طَيِّب',           transliteration: 'Ṭayyib',             translation: 'The Good, the Pure',                    theme: 'character' },

  // ── More Mercy Names ──────────────────────────────────────────────────────────
  { id: 111, arabic: 'غِيَاث',           transliteration: 'Ghiyāth',            translation: 'The Succor, the Helper in Distress',    theme: 'mercy' },
  { id: 112, arabic: 'مُغِيث',           transliteration: 'Mughīth',            translation: 'The Rescuer',                           theme: 'mercy' },
  { id: 113, arabic: 'وَلِيّ',           transliteration: 'Walī',               translation: 'The Protecting Friend',                  theme: 'mercy' },
  { id: 114, arabic: 'نَاصِر',           transliteration: 'Nāṣir',              translation: 'The Helper, the Supporter',             theme: 'mercy' },
  { id: 115, arabic: 'مَنْصُور',         transliteration: 'Manṣūr',             translation: 'The Supported by Allah',                theme: 'mercy' },
  { id: 116, arabic: 'مُعِين',           transliteration: 'Muʿīn',              translation: 'The Aiding',                            theme: 'mercy' },
  { id: 117, arabic: 'مَدَد',            transliteration: 'Madad',              translation: 'The Support',                           theme: 'mercy' },
  { id: 118, arabic: 'شَفِيق بِالمُؤْمِنِين', transliteration: 'Shafīq bil-Muʾminīn', translation: 'Tenderly Attached to the Believers', theme: 'mercy' },
  { id: 119, arabic: 'أَبُو الأَرَامِل',  transliteration: 'Abū al-Arāmil',     translation: 'Father of the Widows',                  theme: 'mercy' },
  { id: 120, arabic: 'أَبُو اليَتَامَى',  transliteration: 'Abū al-Yatāmā',     translation: 'Father of the Orphans',                 theme: 'mercy' },

  // ── More Prophetic Names ──────────────────────────────────────────────────────
  { id: 121, arabic: 'خَلِيل الرَّحْمَن', transliteration: 'Khalīl al-Raḥmān',  translation: 'The Intimate Friend of the Most Merciful', theme: 'praise' },
  { id: 122, arabic: 'رُوحُ القُدُس',    transliteration: 'Rūḥ al-Quds',        translation: 'The Holy Spirit of Truth',              theme: 'essence' },
  { id: 123, arabic: 'أُسْوَة',          transliteration: 'Uswa',               translation: 'The Perfect Example',                  theme: 'prophecy',     description: 'Mentioned in the Quran (33:21) as the perfect model' },
  { id: 124, arabic: 'قُدْوَة',          transliteration: 'Qudwa',              translation: 'The Role Model',                        theme: 'prophecy' },
  { id: 125, arabic: 'مُعَلِّم',         transliteration: 'Muʿallim',           translation: 'The Teacher',                           theme: 'prophecy' },
  { id: 126, arabic: 'مُزَكِّي',         transliteration: 'Muzakkī',             translation: 'The Purifier of Souls',                 theme: 'prophecy' },
  { id: 127, arabic: 'مُبَيِّن',         transliteration: 'Mubayyin',           translation: 'The Clarifier',                         theme: 'prophecy' },
  { id: 128, arabic: 'مُبَلِّغ',         transliteration: 'Muballigh',          translation: 'The Transmitter of the Message',        theme: 'prophecy' },
  { id: 129, arabic: 'شَاهِدٌ وَمَشْهُود', transliteration: 'Shāhidun wa Mashhūd', translation: 'Witness and Witnessed',             theme: 'prophecy' },
  { id: 130, arabic: 'حُجَّة',           transliteration: 'Ḥujja',              translation: 'The Proof of Allah',                    theme: 'prophecy' },

  // ── More Praise Names ─────────────────────────────────────────────────────────
  { id: 131, arabic: 'خَيْر البَشَر',    transliteration: 'Khayr al-Bashar',    translation: 'The Best of Mankind',                  theme: 'praise' },
  { id: 132, arabic: 'سَيِّد وَلَد آدَم', transliteration: 'Sayyid Walad Ādam', translation: 'Master of the Children of Adam',        theme: 'praise' },
  { id: 133, arabic: 'فَخْرُ العَرَب',   transliteration: 'Fakhr al-ʿArab',     translation: 'Pride of the Arabs',                   theme: 'praise' },
  { id: 134, arabic: 'فَخْرُ العَالَمِين', transliteration: 'Fakhr al-ʿĀlamīn', translation: 'Pride of All the Worlds',              theme: 'praise' },
  { id: 135, arabic: 'تَاجُ الكَرَامَة',  transliteration: 'Tāj al-Karāma',     translation: 'Crown of Nobility',                    theme: 'praise' },
  { id: 136, arabic: 'عَزِيز',           transliteration: 'ʿAzīz',              translation: 'The Mighty, the Honored',               theme: 'praise' },
  { id: 137, arabic: 'مَكِين',           transliteration: 'Makīn',              translation: 'The Firmly Established',                theme: 'praise' },
  { id: 138, arabic: 'مَتِين',           transliteration: 'Matīn',              translation: 'The Firm in Strength',                  theme: 'praise' },
  { id: 139, arabic: 'رَفِيع',           transliteration: 'Rafīʿ',              translation: 'The Exalted',                           theme: 'praise' },
  { id: 140, arabic: 'عَلِيّ',           transliteration: 'ʿAlī',               translation: 'The High in Rank',                     theme: 'praise' },

  // ── Spiritual Stations ────────────────────────────────────────────────────────
  { id: 141, arabic: 'صَاحِبُ المِعْرَاج', transliteration: 'Ṣāḥib al-Miʿrāj',  translation: 'The One of the Night Ascension',       theme: 'essence',      description: 'He ascended through the heavens to meet Allah' },
  { id: 142, arabic: 'صَاحِبُ الإِسْرَاء', transliteration: 'Ṣāḥib al-Isrāʾ',   translation: 'The One of the Night Journey',         theme: 'essence' },
  { id: 143, arabic: 'مَن دَنَا فَتَدَلَّى', transliteration: 'Man danā fa-tadallā', translation: 'The One Who Drew Near and Descended', theme: 'essence',     description: 'Quran (53:8): he came within two bow-lengths of Allah' },
  { id: 144, arabic: 'قَابَ قَوْسَيْن',   transliteration: 'Qāba Qawsayn',      translation: 'Within Two Bow-Lengths (of Allah)',     theme: 'essence',      description: 'The closest any creation has ever been to Allah' },
  { id: 145, arabic: 'صَاحِبُ الحَقِيقَة', transliteration: 'Ṣāḥib al-Ḥaqīqa',  translation: 'Possessor of the Supreme Reality',     theme: 'essence' },
  { id: 146, arabic: 'مَخْصُوص بِالكَرَامَة', transliteration: 'Makhṣūṣ bil-Karāma', translation: 'Specially Honored',                theme: 'praise' },
  { id: 147, arabic: 'صَاحِبُ الكَوْثَر',  transliteration: 'Ṣāḥib al-Kawthar',  translation: 'Owner of the River of Abundance',      theme: 'intercession' },
  { id: 148, arabic: 'أُمِّي',            transliteration: 'Ummī',               translation: 'The Unlettered (Divinely Taught)',      theme: 'prophecy',     description: 'He did not learn from humans — his knowledge was from Allah' },
  { id: 149, arabic: 'مُحَدَّث',          transliteration: 'Muḥaddath',          translation: 'The One Spoken To (by Angels)',         theme: 'prophecy' },
  { id: 150, arabic: 'مُؤَيَّد',          transliteration: 'Muʾayyad',           translation: 'The One Divinely Supported',            theme: 'prophecy' },

  // ── Names of Beauty ───────────────────────────────────────────────────────────
  { id: 151, arabic: 'جَمِيل',           transliteration: 'Jamīl',              translation: 'The Beautiful',                         theme: 'character' },
  { id: 152, arabic: 'أَجْمَل الخَلْق',  transliteration: 'Ajmal al-Khalq',     translation: 'The Most Beautiful of Creation',        theme: 'praise' },
  { id: 153, arabic: 'حَسَن',            transliteration: 'Ḥasan',              translation: 'The Handsome, the Good',                theme: 'character' },
  { id: 154, arabic: 'أَحْسَن',          transliteration: 'Aḥsan',              translation: 'The Most Beautiful',                    theme: 'character' },
  { id: 155, arabic: 'بَهِيّ',           transliteration: 'Bahī',               translation: 'The Resplendent',                       theme: 'character' },
  { id: 156, arabic: 'وَضَّاح',          transliteration: 'Waḍḍāḥ',             translation: 'The Radiant in Face',                   theme: 'character' },
  { id: 157, arabic: 'أَزْهَر',          transliteration: 'Azhar',              translation: 'The Brilliantly Bright',                theme: 'character' },
  { id: 158, arabic: 'مُشْرِق',          transliteration: 'Mushhriq',           translation: 'The Glowing, the Radiant',              theme: 'light' },
  { id: 159, arabic: 'مُضِيء',           transliteration: 'Muḍīʾ',              translation: 'The Shining',                           theme: 'light' },
  { id: 160, arabic: 'وَجِيه',           transliteration: 'Wajīh',              translation: 'The Honored in the Sight of Allah',     theme: 'praise' },

  // ── Names of Mission ──────────────────────────────────────────────────────────
  { id: 161, arabic: 'فَاتِح',           transliteration: 'Fātiḥ',              translation: 'The Opener',                            theme: 'prophecy',     description: 'He opened the hearts to faith and guidance' },
  { id: 162, arabic: 'خَاتِم',           transliteration: 'Khātim',             translation: 'The Seal',                              theme: 'prophecy' },
  { id: 163, arabic: 'مُتِمّ',           transliteration: 'Mutimm',             translation: 'The Completer',                         theme: 'prophecy' },
  { id: 164, arabic: 'مُكَمِّل',         transliteration: 'Mukammil',           translation: 'The Perfecter',                         theme: 'prophecy' },
  { id: 165, arabic: 'حَافِظ',           transliteration: 'Ḥāfiẓ',              translation: 'The Preserver',                         theme: 'prophecy' },
  { id: 166, arabic: 'مُحْيِي',          transliteration: 'Muḥyī',              translation: 'The Reviver (of Dead Hearts)',          theme: 'prophecy' },
  { id: 167, arabic: 'مُهَيْمِن',        transliteration: 'Muhaymın',           translation: 'The Guardian Over Religion',            theme: 'prophecy' },
  { id: 168, arabic: 'قَيِّم',           transliteration: 'Qayyim',             translation: 'The Straight, the Upright',             theme: 'prophecy' },
  { id: 169, arabic: 'مُقِيم',           transliteration: 'Muqīm',              translation: 'The Establisher of Religion',           theme: 'prophecy' },
  { id: 170, arabic: 'مُكِين',           transliteration: 'Mukīn',              translation: 'The Firmly Established in Mission',     theme: 'prophecy' },

  // ── Names of Blessing ─────────────────────────────────────────────────────────
  { id: 171, arabic: 'مُبَارَك',         transliteration: 'Mubārak',            translation: 'The Blessed',                           theme: 'praise' },
  { id: 172, arabic: 'مَيْمُون',         transliteration: 'Maymūn',             translation: 'The Blessed, the Auspicious',           theme: 'praise' },
  { id: 173, arabic: 'سَعِيد',           transliteration: 'Saʿīd',              translation: 'The Happy, the Felicitous',             theme: 'praise' },
  { id: 174, arabic: 'مَسْعُود',         transliteration: 'Masʿūd',             translation: 'The Fortunate',                         theme: 'praise' },
  { id: 175, arabic: 'ذُو الفَضْل',      transliteration: 'Dhū l-Faḍl',         translation: 'Possessor of Grace and Excellence',     theme: 'praise' },
  { id: 176, arabic: 'ذُو المَجْد',      transliteration: 'Dhū l-Majd',         translation: 'Possessor of Glory',                    theme: 'praise' },
  { id: 177, arabic: 'ذُو العِزّ',       transliteration: 'Dhū l-ʿIzz',         translation: 'Possessor of Honor',                    theme: 'praise' },
  { id: 178, arabic: 'ذُو الكَرَم',      transliteration: 'Dhū l-Karam',        translation: 'Possessor of Generosity',               theme: 'praise' },
  { id: 179, arabic: 'صَاحِبُ التَّاج',  transliteration: 'Ṣāḥib al-Tāj',      translation: 'Bearer of the Crown',                   theme: 'praise' },
  { id: 180, arabic: 'صَاحِبُ الدِّرَع', transliteration: 'Ṣāḥib al-Dirrāʿ',   translation: 'The Warrior in Armor for Allah',        theme: 'praise' },

  // ── Final Names ───────────────────────────────────────────────────────────────
  { id: 181, arabic: 'قُرَّةُ العَيْن',  transliteration: 'Qurrat al-ʿAyn',     translation: 'The Coolness of the Eyes (Delight)',    theme: 'essence' },
  { id: 182, arabic: 'رَوْح',            transliteration: 'Rūḥ',                translation: 'The Spirit',                            theme: 'essence' },
  { id: 183, arabic: 'فَرَح',            transliteration: 'Faraḥ',              translation: 'The Joy',                               theme: 'essence' },
  { id: 184, arabic: 'سُرُور',           transliteration: 'Surūr',              translation: 'The Happiness',                         theme: 'essence' },
  { id: 185, arabic: 'رَجَاء',           transliteration: 'Rajāʾ',              translation: 'The Hope',                              theme: 'mercy' },
  { id: 186, arabic: 'نِعْمَة',          transliteration: 'Niʿma',              translation: 'The Blessing',                          theme: 'mercy' },
  { id: 187, arabic: 'كِفَاح',           transliteration: 'Kifāḥ',              translation: 'The Struggler for Truth',               theme: 'character' },
  { id: 188, arabic: 'صِرَاطُ المُسْتَقِيم', transliteration: 'Ṣirāṭ al-Mustaqīm', translation: 'The Straight Path (in his person)', theme: 'light' },
  { id: 189, arabic: 'رُوحُ الحَق',      transliteration: 'Rūḥ al-Ḥaqq',       translation: 'The Spirit of Truth',                   theme: 'essence' },
  { id: 190, arabic: 'وَجْهُ اللهِ',     transliteration: 'Wajh Allāh',         translation: 'The Face of Allah\'s Manifestation',    theme: 'essence' },
  { id: 191, arabic: 'رَحِيمٌ بِأُمَّتِه', transliteration: 'Raḥīmun bi-Ummatihi', translation: 'Merciful Toward His Nation',         theme: 'mercy' },
  { id: 192, arabic: 'شَفِيقٌ بِأُمَّتِه', transliteration: 'Shafīqun bi-Ummatihi', translation: 'Tender Toward His Nation',          theme: 'mercy' },
  { id: 193, arabic: 'أَبُو القَاسِم',    transliteration: 'Abū l-Qāsim',        translation: 'Father of al-Qāsim (his kunya)',       theme: 'essence' },
  { id: 194, arabic: 'أَبُو إِبْرَاهِيم', transliteration: 'Abū Ibrāhīm',        translation: 'Father of Ibrāhīm',                    theme: 'essence' },
  { id: 195, arabic: 'مَعْدِن الجُود',    transliteration: 'Maʿdin al-Jūd',      translation: 'The Mine of Generosity',               theme: 'character' },
  { id: 196, arabic: 'مَعْدِن الحِكْمَة', transliteration: 'Maʿdin al-Ḥikma',    translation: 'The Mine of Wisdom',                   theme: 'character' },
  { id: 197, arabic: 'خَازِن العِلْم',    transliteration: 'Khāzin al-ʿIlm',     translation: 'The Treasurer of Knowledge',           theme: 'character' },
  { id: 198, arabic: 'بَاب الله',         transliteration: 'Bāb Allāh',          translation: 'The Door to Allah',                    theme: 'light' },
  { id: 199, arabic: 'مِفْتَاح الجَنَّة', transliteration: 'Miftāḥ al-Janna',    translation: 'The Key to Paradise',                  theme: 'intercession' },
  { id: 200, arabic: 'حَبِيب القُلُوب',   transliteration: 'Ḥabīb al-Qulūb',     translation: 'The Beloved of Hearts',                 theme: 'praise' },
  { id: 201, arabic: 'سِرُّ الوُجُود',    transliteration: 'Sirr al-Wujūd',       translation: 'The Secret of Existence',               theme: 'essence',    description: 'He is the reason for which all of creation was brought into being' },
];

export const THEME_LABELS: Record<NameTheme, string> = {
  essence:      'Essence',
  mercy:        'Mercy',
  light:        'Light & Guidance',
  praise:       'Praise & Glory',
  intercession: 'Intercession',
  prophecy:     'Prophetic Mission',
  character:    'Noble Character',
  quran:        'Quranic Names',
};

export const THEME_COLORS: Record<NameTheme, { bg: string; text: string; border: string }> = {
  essence:      { bg: '#1E1B4B', text: '#A5B4FC', border: '#4338CA' },
  mercy:        { bg: '#1A2E22', text: '#6EE7B7', border: '#059669' },
  light:        { bg: '#2D1B00', text: '#FCD34D', border: '#D97706' },
  praise:       { bg: '#2D1515', text: '#FCA5A5', border: '#DC2626' },
  intercession: { bg: '#1A1A2E', text: '#C4B5FD', border: '#7C3AED' },
  prophecy:     { bg: '#0C1A2E', text: '#93C5FD', border: '#2563EB' },
  character:    { bg: '#1A2A2A', text: '#5EEAD4', border: '#0D9488' },
  quran:        { bg: '#2A1A00', text: '#FDBA74', border: '#EA580C' },
};