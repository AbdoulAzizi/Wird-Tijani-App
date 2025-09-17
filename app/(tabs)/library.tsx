import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  Dimensions,
  Pressable 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Heart, Star, Award, X, Clock, Users, Calendar, MapPin, Book, ArrowLeft, Crown, Fuel as Mosque, Quote, Scroll, Mountain } from 'lucide-react-native';
import GradientHeader from '../../components/GradientHeader';
import ScreenBackground from '../../components/ScreenBackground';

const { width, height } = Dimensions.get('window');

interface LibraryItem {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  description: string;
  fullDescription: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  benefits: string[];
  recitation: {
    frequency: string;
    timing: string;
    requirements: string;
  };
}

interface Master {
  id: string;
  name: string;
  title: string;
  years: string;
  location: string;
  description: string;
  fullBiography: string;
  achievements: string[];
  teachings: string[];
  legacy: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  fullDescription: string;
  keyTopics: string[];
  significance: string;
  arabicTitle?: string;
}

interface HolyPlace {
  id: string;
  name: string;
  location: string;
  description: string;
  fullDescription: string;
  significance: string;
  history: string;
  practices: string[];
  arabicName?: string;
}

interface LivingWord {
  id: string;
  title: string;
  speaker: string;
  description: string;
  fullText: string;
  context: string;
  lessons: string[];
  arabicText?: string;
}

interface Category {
  id: string;
  title: string;
  arabicTitle: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  count: number;
}

type ViewState = 'categories' | 'items' | 'detail';

const categories: Category[] = [
  {
    id: 'masters',
    title: 'Great Masters',
    arabicTitle: 'الأساتذة العظام',
    icon: <Crown color="#D97706" size={32} />,
    color: '#D97706',
    description: 'The blessed guides and spiritual leaders of Islam',
    count: 8
  },
  {
    id: 'formulas',
    title: 'Sacred Formulas',
    arabicTitle: 'الأوراد المقدسة',
    icon: <Heart color="#EF4444" size={32} />,
    color: '#EF4444',
    description: 'Divine formulas and prayers revealed to the Tijāni masters',
    count: 3
  },
  {
    id: 'books',
    title: 'Sacred Books',
    arabicTitle: 'الكتب المقدسة',
    icon: <Book color="#7C3AED" size={32} />,
    color: '#7C3AED',
    description: 'Essential texts and writings of the Tijāni tradition',
    count: 4
  },
  {
    id: 'places',
    title: 'Holy Places',
    arabicTitle: 'الأماكن المقدسة',
    icon: <Mosque color="#059669" size={32} />,
    color: '#059669',
    description: 'Sacred locations and centers of spiritual learning',
    count: 5
  },
  {
    id: 'words',
    title: 'Living Words',
    arabicTitle: 'الكلمات الحية',
    icon: <Quote color="#DC2626" size={32} />,
    color: '#DC2626',
    description: 'Profound sayings and teachings from the masters',
    count: 6
  }
];

const formulasData: LibraryItem[] = [
  {
    id: 'istighfar',
    title: 'Istighfār - Seeking Forgiveness',
    badge: 'Essential',
    badgeColor: '#EF4444',
    icon: <Heart color="#EF4444" size={20} />,
    description: 'The formula of seeking forgiveness purifies the heart and opens the door to divine mercy.',
    fullDescription: 'Istighfār is the gateway to all spiritual stations in the Tijāni path. It consists of seeking forgiveness from Allah with sincere repentance and a broken heart. This practice purifies the soul from the stains of sin and prepares it for higher spiritual receptions.',
    arabicText: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfiru Allah al-ʿAẓīm alladhī lā ilāha illā Huwa al-Ḥayy al-Qayyūm wa atūbu ilayh',
    translation: 'I seek forgiveness from Allah the Magnificent, there is no deity except Him, the Ever-Living, the Sustainer, and I repent to Him.',
    benefits: [
      'Purifies the heart from spiritual impurities',
      'Opens the door to divine mercy and forgiveness',
      'Prepares the soul for higher spiritual experiences',
      'Brings peace and tranquility to the mind',
      'Strengthens the connection with Allah'
    ],
    recitation: {
      frequency: '100 times daily',
      timing: 'After each prayer and before sleep',
      requirements: 'State of purity (wudu) recommended'
    }
  },
  {
    id: 'salat-fatih',
    title: 'Ṣalāt al-Fātiḥ - The Opening Prayer',
    badge: 'Signature',
    badgeColor: '#D97706',
    icon: <Star color="#D97706" size={20} />,
    description: 'This blessed prayer upon the Prophet ﷺ is unique to the Tijāniyya.',
    fullDescription: 'Ṣalāt al-Fātiḥ is the most distinguished prayer upon the Prophet ﷺ in the Tijāni tradition. It was revealed to Shaykh Ahmad al-Tijāni and possesses extraordinary spiritual power.',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بِالْحَقِّ وَالْهَادِي إِلَى صِرَاطِكَ الْمُسْتَقِيمِ وَعَلَى آلِهِ حَقَّ قَدْرِهِ وَمِقْدَارِهِ الْعَظِيمِ',
    transliteration: 'Allāhumma ṣalli ʿalā sayyidinā Muḥammad al-fātiḥi limā ughliqa wa al-khātimi limā sabaqa nāṣir al-ḥaqqi bi al-ḥaqqi wa al-hādī ilā ṣirāṭika al-mustaqīm wa ʿalā ālihī ḥaqqa qadrihi wa miqdārihī al-ʿaẓīm',
    translation: 'O Allah, send prayers upon our master Muhammad, the opener of what was closed, the seal of what preceded, the supporter of truth by truth, and the guide to Your straight path, and upon his family according to his rightful due and his magnificent status.',
    benefits: [
      'Opens spiritual doors and removes obstacles',
      'Brings the believer closer to the Prophet ﷺ',
      'Provides immense reward beyond calculation',
      'Illuminates the heart with prophetic light',
      'Grants spiritual elevation and divine favor'
    ],
    recitation: {
      frequency: '50 times in evening wird, 50 times in morning wird',
      timing: 'Part of the daily wird (morning and evening)',
      requirements: 'Must be recited with the complete wird'
    }
  },
  {
    id: 'jawhara',
    title: 'Jawharat al-Kamāl - Pearl of Perfection',
    badge: 'Advanced',
    badgeColor: '#7C3AED',
    icon: <Award color="#7C3AED" size={20} />,
    description: 'The crown jewel of Tijāni prayers, revealed to Shaykh Ahmad al-Tijāni.',
    fullDescription: 'Jawharat al-Kamāl is the supreme prayer of the Tijāniyya, revealed directly to Shaykh Ahmad al-Tijāni by the Prophet ﷺ. It encapsulates the perfection of the Prophet and serves as a means of achieving spiritual perfection for the reciter.',
    arabicText: `اللهم صل وسلم على عين الرحمة الربانية 
والياقوتة المتحققة الحائطة بمركز الفهوم والمعانى 
ونور الاكوان المتكونة الآدمى صاحب الحق الربانى 
البرق الاسطع بمزون الأرباح المالئة لكل متعرض من البحور والاوانى 
ونورك اللامع الذى ملأت به كونك الحائط بأمكنة المكانى 
اللهم صل وسلم على عين الحق التى تتجلى منها عروش الحقائق 
عين المعارف الاقوم صراطك التام الأسقم 
اللهم صل وسلم على طلعة الحق بالحق الكنز الأعظم 
افاضتك منك اليك احاطة النور المطلسم 
صلى الله عليه وعلى آله صلاة تعرفنا بها اياه`,
    transliteration: `Allāhumma ṣalli wa sallim ʿalā ʿayni r-raḥmati r-rabbāniyya 
wa l-yāqūti l-mutaḥaqqiqati l-ḥā'iṭati bimuqarrati l-fuhūmi wa l-maʿānī 
wa nūri l-akwāni l-mutaʾakkina l-ādami ṣāḥibi l-ḥaqqi r-rabbāni 
l-barqi l-asṭaʿi bimawzuni l-arbāḥi l-māli'ati likulli mutaʿarraḍin mina l-buḥūri wa l-āwānī 
wa nūrika l-lāmiʿi allaḏī mala'ta bihi kawnaka l-ḥā'iṭi bi-amkanati l-makānī 
Allāhumma ṣalli wa sallim ʿalā ṭalʿati l-ḥaqqi bi-l-ḥaqqi 
l-kanzi l-aʿẓami ifāḍataka minka ilayka iḥāṭati n-nūri l-muṭallasami 
ṣallā Llāhu ʿalayhi wa ʿalā ālihi ṣalātan taʿrifunā bihā iyyāhu`,
    translation: `O Allah, send prayers and peace upon the Eye of Divine Mercy 
and the Perfected Ruby, the Encompassing One at the Center of Understandings and Meanings, 
and the Light of the Universes, the Human Being, the Possessor of Divine Truth, 
the Brightest Lightning in the Balance of Profits, filling every sea and vessel. 

And Your Shining Light that has filled Your Universe, the Encompassing One in all Places. 
O Allah, send prayers and peace upon the Manifestation of Truth with Truth, the Greatest Treasure, 
Your Overflowing from You to Him, the Encompassing Light. 

May Allah's prayers be upon him and his family, a prayer through which we come to know Him.`,
    benefits: [
      'Grants spiritual perfection and completion',
      'Connects directly to the Prophet\'s essence',
      'Provides protection from spiritual and physical harm',
      'Opens the highest levels of divine knowledge',
      'Brings the reciter to the station of ihsan'
    ],
    recitation: {
      frequency: '12 times on Friday between Maghrib and Isha',
      timing: 'Exclusively on Friday evening',
      requirements: 'Requires ijaza (permission) from qualified shaykh'
    }
  }
];

const mastersData: Master[] = [
  {
    id: 'prophet',
    name: 'Prophet Muhammad ﷺ',
    title: 'Seal of the Prophets',
    years: '570-632 CE',
    location: 'Mecca and Medina',
    description: 'The final messenger of Allah, peace and blessings be upon him, the perfect example for all humanity.',
    fullBiography: 'Muhammad ibn Abdullah ﷺ was born in Mecca in 570 CE. He received the first revelation at age 40 and spent 23 years conveying the message of Islam. He is the final prophet and messenger of Allah, the perfect example of character and conduct for all humanity. His teachings form the foundation of Islamic spirituality and the Tijāni path traces its spiritual lineage directly to him.',
    achievements: [
      'Received and conveyed the final revelation (Quran)',
      'Established the perfect Islamic community in Medina',
      'Completed the religion of Islam',
      'Demonstrated the highest levels of character and spirituality',
      'United the Arabian Peninsula under Islam'
    ],
    teachings: [
      'Worship Allah alone without partners (Tawhid)',
      'Follow the five pillars of Islam',
      'Treat all people with justice and compassion',
      'Seek knowledge from cradle to grave',
      'Remember Allah frequently and with presence of heart'
    ],
    legacy: 'The Prophet ﷺ is the spiritual source of all Islamic knowledge and practice. Every authentic spiritual path in Islam traces back to his blessed teachings and example.'
  },
  {
    id: 'ali',
    name: 'Ali ibn Abi Talib (ع)',
    title: 'The Lion of Allah',
    years: '599-661 CE',
    location: 'Mecca, Medina, Kufa',
    description: 'The cousin and son-in-law of the Prophet ﷺ, may his face be ennobled, the gate to the city of knowledge.',
    fullBiography: 'Ali ibn Abi Talib (ع) was the cousin and son-in-law of Prophet Muhammad ﷺ, married to Fatima (ع). He was the first male to accept Islam and was known for his courage, wisdom, and deep spiritual knowledge. The Prophet ﷺ said: "I am the city of knowledge and Ali is its gate." He served as the fourth Caliph and is revered by all Muslims for his piety and knowledge.',
    achievements: [
      'First male to accept Islam',
      'Fought valiantly in all major battles',
      'Served as the fourth Rightly-Guided Caliph',
      'Preserved and transmitted prophetic knowledge',
      'Known for his eloquent speeches and deep wisdom'
    ],
    teachings: [
      'The importance of knowledge and wisdom',
      'Justice and fairness in all dealings',
      'Courage in defending truth',
      'Humility despite high station',
      'Deep contemplation and remembrance of Allah'
    ],
    legacy: 'Ali (ع) is considered the spiritual father of Islamic mysticism and many Sufi orders trace their spiritual lineage through him.'
  },
  {
    id: 'fatima',
    name: 'Fatima az-Zahra (ع)',
    title: 'The Radiant One',
    years: '605-632 CE',
    location: 'Mecca and Medina',
    description: 'The beloved daughter of the Prophet ﷺ, may the peace of the Lord be upon her, mother of Hassan and Hussein.',
    fullBiography: 'Fatima az-Zahra (ع) was the youngest daughter of Prophet Muhammad ﷺ and Khadija (ع). She was married to Ali (ع) and was the mother of Hassan and Hussein (ع). The Prophet ﷺ said she was the leader of the women of Paradise. She was known for her piety, patience, and devotion to Allah and her family.',
    achievements: [
      'Beloved daughter of the Prophet ﷺ',
      'Mother of the blessed grandsons Hassan and Hussein',
      'Example of patience and piety for all women',
      'Supported her father\'s mission with dedication',
      'Maintained the prophetic household with dignity'
    ],
    teachings: [
      'Patience in times of difficulty',
      'Devotion to family and faith',
      'The importance of prayer and remembrance',
      'Generosity and care for the poor',
      'Maintaining dignity in all circumstances'
    ],
    legacy: 'Fatima (ع) is revered as the perfect example of Islamic womanhood and spirituality, and her lineage continues the blessed prophetic family.'
  },
  {
    id: 'hassan',
    name: 'Hassan ibn Ali (ع)',
    title: 'The Chosen One',
    years: '625-670 CE',
    location: 'Medina and Kufa',
    description: 'The elder grandson of the Prophet ﷺ, may the peace of the Lord be upon him, known for his wisdom and peacemaking.',
    fullBiography: 'Hassan ibn Ali (ع) was the elder son of Ali (ع) and Fatima (ع), and the beloved grandson of Prophet Muhammad ﷺ. The Prophet ﷺ said: "Hassan and Hussein are the leaders of the youth of Paradise." He served briefly as Caliph but abdicated to preserve Muslim unity, earning him the title "The Peacemaker."',
    achievements: [
      'Beloved grandson of the Prophet ﷺ',
      'Briefly served as the fifth Caliph',
      'Made peace to preserve Muslim unity',
      'Known for his generosity and wisdom',
      'Transmitted prophetic traditions and knowledge'
    ],
    teachings: [
      'The value of peace and unity',
      'Wisdom in leadership and decision-making',
      'Generosity and care for others',
      'Patience and forbearance',
      'Preserving the prophetic legacy'
    ],
    legacy: 'Hassan (ع) is remembered as a wise leader who prioritized the welfare of the Muslim community over personal power.'
  },
  {
    id: 'hussein',
    name: 'Hussein ibn Ali (ع)',
    title: 'Master of Martyrs',
    years: '626-680 CE',
    location: 'Medina and Karbala',
    description: 'The younger grandson of the Prophet ﷺ, may the peace of the Lord be upon him, who sacrificed everything for truth.',
    fullBiography: 'Hussein ibn Ali (ع) was the younger son of Ali (ع) and Fatima (ع), and the beloved grandson of Prophet Muhammad ﷺ. He stood against injustice and tyranny, ultimately sacrificing his life at the Battle of Karbala in 680 CE. His stand for truth and justice has inspired Muslims throughout history.',
    achievements: [
      'Beloved grandson of the Prophet ﷺ',
      'Stood firmly against injustice and tyranny',
      'Sacrificed his life for Islamic principles',
      'Preserved the true teachings of Islam',
      'Became a symbol of resistance against oppression'
    ],
    teachings: [
      'Never compromise on truth and justice',
      'Stand against oppression regardless of cost',
      'The importance of sacrifice for principles',
      'Dignity in the face of adversity',
      'The eternal struggle between good and evil'
    ],
    legacy: 'Hussein (ع) is revered as the "Master of Martyrs" and his sacrifice at Karbala remains a powerful symbol of standing for truth against injustice.'
  },
  {
    id: 'tijani',
    name: 'Shaykh Ahmad al-Tijāni',
    title: 'Founder of the Tijāniyya',
    years: '1737-1815',
    location: 'Fez, Morocco',
    description: 'The blessed founder who received the Tijāni wird directly from the Prophet ﷺ in a waking vision.',
    fullBiography: 'Shaykh Ahmad ibn Muhammad al-Tijāni was born in Ayn Māḍī, Algeria. He traveled extensively seeking knowledge and spiritual guidance before settling in Fez, Morocco. In 1196 AH (1782 CE), he received a direct visitation from the Prophet Muhammad ﷺ while awake, who gave him the Tijāni wird and appointed him as a spiritual guide.',
    achievements: [
      'Received direct spiritual instruction from the Prophet ﷺ',
      'Founded the Tijāniyya Sufi order',
      'Authored numerous spiritual works and prayers',
      'Trained thousands of disciples across North and West Africa',
      'Established the unique Tijāni methodology of dhikr'
    ],
    teachings: [
      'Complete reliance on Allah (tawakkul)',
      'Absolute love for the Prophet Muhammad ﷺ',
      'The importance of spiritual companionship (suhba)',
      'Moderation in all aspects of life',
      'The supremacy of the Tijāni wird over all other spiritual practices'
    ],
    legacy: 'The Tijāniyya became one of the most widespread Sufi orders, with millions of followers across Africa and beyond.'
  },
  {
    id: 'umar-tall',
    name: 'Al-Hajj Umar Tall',
    title: 'Great Khalifa of West Africa',
    years: '1794-1864',
    location: 'Futa Tooro, Senegal',
    description: 'Spread the Tijāniyya throughout West Africa and established many centers of learning.',
    fullBiography: 'Al-Hajj Umar ibn Said Tall was born in Futa Tooro. After performing Hajj, he studied in Mecca and received the Tijāni wird from Muhammad al-Ghali in Medina. Upon returning to West Africa, he became the great propagator of the Tijāniyya order.',
    achievements: [
      'Spread Tijāniyya across West Africa',
      'Established the Tukolor Empire',
      'Founded numerous Islamic schools and centers',
      'Wrote important works on Tijāni doctrine',
      'Unified various ethnic groups under Islamic banner'
    ],
    teachings: [
      'The necessity of seeking authentic Islamic knowledge',
      'Social justice and equality among believers',
      'The importance of economic development in Islamic society',
      'Military discipline in service of Islamic ideals',
      'The role of leadership in spiritual guidance'
    ],
    legacy: 'His efforts resulted in the conversion of millions to Islam and the establishment of the Tijāniyya as the dominant Sufi order in West Africa.'
  },
  {
    id: 'ibrahim-niasse',
    name: 'Ibrahim Niasse',
    title: 'Shaykh al-Islam',
    years: '1900-1975',
    location: 'Kaolack, Senegal',
    description: 'Led the great Tijāni revival in the 20th century, attracting millions to the path.',
    fullBiography: 'Shaykh Ibrahim ibn Abdullah Niasse, known as Baye Niasse, was born in Taiba Niassene, Senegal. He claimed to be the "Ghawth al-Zaman" (Spiritual Pole of the Time) and led a major revival of Tijāni spirituality in the 20th century.',
    achievements: [
      'Led the greatest Tijāni revival in modern times',
      'Established Medina Baye as a major Islamic center',
      'Attracted millions of followers worldwide',
      'Promoted Islamic education and women\'s rights',
      'Authored significant works on Islamic theology'
    ],
    teachings: [
      'The concept of Faydah (Divine Flood) of spiritual knowledge',
      'The importance of ma\'rifa (gnosis) in spiritual development',
      'Universal brotherhood beyond ethnic and racial boundaries',
      'The role of women in Islamic society and spirituality',
      'Practical application of Islamic principles in modern life'
    ],
    legacy: 'The Faydah Tijāniyya branch he established continues to grow globally, with significant communities in Africa, Europe, and the Americas.'
  }
];

const booksData: Book[] = [
  {
    id: 'quran',
    title: 'The Holy Quran',
    arabicTitle: 'القرآن الكريم',
    author: 'Revealed to Prophet Muhammad ﷺ',
    description: 'The final revelation from Allah, the ultimate guide for humanity.',
    fullDescription: 'The Quran is the final revelation from Allah, revealed to Prophet Muhammad ﷺ over a period of 23 years. It is the primary source of Islamic guidance, containing 114 chapters (surahs) with over 6,000 verses (ayahs). The Quran addresses all aspects of human life and provides guidance for spiritual, moral, social, and legal matters.',
    keyTopics: [
      'Tawhid (Unity of Allah)',
      'Prophethood and revelation',
      'The afterlife and Day of Judgment',
      'Moral and ethical guidance',
      'Stories of previous prophets',
      'Laws and social guidance'
    ],
    significance: 'The Quran is the foundation of all Islamic knowledge and practice. In the Tijāni tradition, regular recitation and contemplation of the Quran is essential for spiritual development.'
  },
  {
    id: 'rimah',
    title: 'Rimah Hizb al-Rahim',
    arabicTitle: 'رماح حزب الرحيم',
    author: 'Shaykh Umar al-Futi',
    description: 'A comprehensive work on Tijāni doctrine and spiritual methodology.',
    fullDescription: 'Rimah Hizb al-Rahim is one of the most important works in Tijāni literature, written by Shaykh Umar al-Futi (Al-Hajj Umar Tall). This book serves as a defense and explanation of Tijāni teachings, addressing various aspects of the spiritual path and responding to critics of the order.',
    keyTopics: [
      'The superiority of the Tijāni wird',
      'Spiritual methodology and practices',
      'The role of the spiritual guide (shaykh)',
      'Defense against critics of the order',
      'The spiritual hierarchy and stations',
      'Proper conduct for disciples'
    ],
    significance: 'This work is considered essential reading for serious students of the Tijāni path, providing both theoretical understanding and practical guidance.'
  },
  {
    id: 'jawahir',
    title: 'Jawahir al-Ma\'ani',
    arabicTitle: 'جواهر المعاني',
    author: 'Shaykh Ali Harazim',
    description: 'The primary biographical work about Shaykh Ahmad al-Tijāni and his teachings.',
    fullDescription: 'Jawahir al-Ma\'ani is the most important biographical work about Shaykh Ahmad al-Tijāni, written by his close disciple Shaykh Ali Harazim. The book contains detailed accounts of the Shaykh\'s life, his spiritual experiences, teachings, and the development of the Tijāni order.',
    keyTopics: [
      'Biography of Shaykh Ahmad al-Tijāni',
      'The founding of the Tijāni order',
      'Spiritual visions and experiences',
      'Teachings and guidance of the Shaykh',
      'Stories of early disciples',
      'The spread of the Tijāni path'
    ],
    significance: 'This book is the primary source for understanding the life and teachings of the founder of the Tijāni order and is considered essential for all followers of the path.'
  },
  {
    id: 'kashf',
    title: 'Kashf al-Ilbas',
    arabicTitle: 'كشف الإلباس',
    author: 'Shaykh Ahmad al-Tijāni',
    description: 'A work that removes confusion and clarifies the true nature of the Tijāni path.',
    fullDescription: 'Kashf al-Ilbas (Removing the Confusion) is a work attributed to Shaykh Ahmad al-Tijāni that addresses misconceptions about the Tijāni order and clarifies its authentic teachings. The book serves to distinguish true Tijāni practice from innovations and misunderstandings.',
    keyTopics: [
      'Clarification of Tijāni teachings',
      'Refutation of misconceptions',
      'Proper understanding of spiritual practices',
      'The authentic chain of transmission',
      'Guidelines for disciples and teachers',
      'The importance of following authentic guidance'
    ],
    significance: 'This work helps ensure that the Tijāni teachings remain pure and authentic, protecting followers from deviations and misunderstandings.'
  }
];

const holyPlacesData: HolyPlace[] = [
  {
    id: 'mecca',
    name: 'Mecca',
    arabicName: 'مكة المكرمة',
    location: 'Saudi Arabia',
    description: 'The holiest city in Islam, birthplace of Prophet Muhammad ﷺ and site of the Kaaba.',
    fullDescription: 'Mecca is the holiest city in Islam, located in the Hejaz region of Saudi Arabia. It is the birthplace of Prophet Muhammad ﷺ and the site of the Kaaba, towards which all Muslims pray. Every year, millions of Muslims perform the Hajj pilgrimage to Mecca, fulfilling one of the five pillars of Islam.',
    significance: 'Mecca is the spiritual center of the Islamic world and the direction of prayer (qibla) for all Muslims. It represents the unity of the Muslim ummah.',
    history: 'Mecca has been a sacred site since the time of Prophet Ibrahim (Abraham). The Kaaba was built by Ibrahim and his son Ismail, and later purified by Prophet Muhammad ﷺ when he conquered the city.',
    practices: [
      'Hajj pilgrimage during Dhul-Hijjah',
      'Umrah (lesser pilgrimage) throughout the year',
      'Tawaf (circumambulation) around the Kaaba',
      'Prayer in the Grand Mosque',
      'Drinking from the well of Zamzam'
    ]
  },
  {
    id: 'medina',
    name: 'Medina',
    arabicName: 'المدينة المنورة',
    location: 'Saudi Arabia',
    description: 'The city of the Prophet ﷺ, where he established the first Muslim community.',
    fullDescription: 'Medina, originally called Yathrib, is the second holiest city in Islam. It became the city of Prophet Muhammad ﷺ after the Hijra (migration) from Mecca in 622 CE. Here, the Prophet ﷺ established the first Muslim community and is buried in the Prophet\'s Mosque.',
    significance: 'Medina represents the practical implementation of Islamic teachings and the establishment of the Muslim ummah.',
    history: 'The city welcomed Prophet Muhammad ﷺ and the early Muslims, providing them refuge and support. It became the capital of the early Islamic state.',
    practices: [
      'Visiting the Prophet\'s Mosque',
      'Praying in Rawdah (the blessed garden)',
      'Sending greetings to the Prophet ﷺ',
      'Visiting historical Islamic sites',
      'Studying Islamic history and traditions'
    ]
  },
  {
    id: 'fez',
    name: 'Fez',
    arabicName: 'فاس',
    location: 'Morocco',
    description: 'The blessed city where Shaykh Ahmad al-Tijāni lived and taught, center of Tijāni spirituality.',
    fullDescription: 'Fez is one of the most important cities in Tijāni history, as it was the home of Shaykh Ahmad al-Tijāni for the latter part of his life. The city contains his blessed tomb and remains a major center of Tijāni learning and spirituality.',
    significance: 'Fez is considered the spiritual capital of the Tijāni order, where the founder lived, taught, and is buried.',
    history: 'Shaykh Ahmad al-Tijāni moved to Fez in 1798 and lived there until his death in 1815. The city became the center of Tijāni teaching and administration.',
    practices: [
      'Visiting the tomb of Shaykh Ahmad al-Tijāni',
      'Studying at traditional Islamic schools',
      'Participating in Tijāni gatherings and dhikr',
      'Learning from qualified Tijāni teachers',
      'Following the spiritual practices established by the Shaykh'
    ]
  },
  {
    id: 'kaolack',
    name: 'Kaolack (Medina Baye)',
    arabicName: 'كولخ - المدينة باي',
    location: 'Senegal',
    description: 'The center of the Faydah Tijāniyya movement, established by Shaykh Ibrahim Niasse.',
    fullDescription: 'Kaolack, specifically the area known as Medina Baye, is the spiritual center of the Faydah Tijāniyya branch of the Tijāni order. It was established by Shaykh Ibrahim Niasse and continues to be a major center of Islamic learning and Tijāni spirituality.',
    significance: 'Medina Baye represents the modern revival of Tijāni spirituality and attracts followers from around the world.',
    history: 'Shaykh Ibrahim Niasse established Medina Baye as a center of learning and spirituality, claiming to be the Ghawth (spiritual pole) of his time.',
    practices: [
      'Visiting the tomb of Shaykh Ibrahim Niasse',
      'Participating in the annual Mawlid celebrations',
      'Studying at the Islamic institutes',
      'Joining dhikr gatherings and spiritual sessions',
      'Learning the Faydah methodology'
    ]
  },
  {
    id: 'jerusalem',
    name: 'Jerusalem',
    arabicName: 'القدس الشريف',
    location: 'Palestine',
    description: 'The third holiest city in Islam, site of Al-Aqsa Mosque and the Night Journey.',
    fullDescription: 'Jerusalem is the third holiest city in Islam, home to Al-Aqsa Mosque and the Dome of the Rock. It was the destination of Prophet Muhammad\'s ﷺ Night Journey (Isra) and the starting point of his Ascension (Mi\'raj) to the heavens.',
    significance: 'Jerusalem holds special significance as the first qibla (direction of prayer) and the site of the Prophet\'s ﷺ miraculous night journey.',
    history: 'Jerusalem has been sacred to Muslims since the early days of Islam. The city was conquered by the second Caliph, Umar ibn al-Khattab, who treated its inhabitants with justice and respect.',
    practices: [
      'Praying in Al-Aqsa Mosque',
      'Visiting the Dome of the Rock',
      'Remembering the Night Journey and Ascension',
      'Praying for the liberation of the holy city',
      'Studying the history of Islamic Jerusalem'
    ]
  }
];

const livingWordsData: LivingWord[] = [
  {
    id: 'prophet-knowledge',
    title: 'Seek Knowledge',
    speaker: 'Prophet Muhammad ﷺ',
    description: 'The famous hadith about seeking knowledge from cradle to grave.',
    fullText: 'Seek knowledge from the cradle to the grave.',
    arabicText: 'اطلبوا العلم من المهد إلى اللحد',
    context: 'This saying emphasizes the importance of lifelong learning in Islam. Knowledge is not just academic but includes spiritual, moral, and practical wisdom.',
    lessons: [
      'Learning is a lifelong journey',
      'Knowledge brings one closer to Allah',
      'Ignorance is the enemy of faith',
      'Every Muslim has a duty to seek knowledge',
      'Knowledge should be applied in daily life'
    ]
  },
  {
    id: 'tijani-wird',
    title: 'The Wird is Everything',
    speaker: 'Shaykh Ahmad al-Tijāni',
    description: 'The Shaykh\'s teaching about the supreme importance of the Tijāni wird.',
    fullText: 'Our wird is sufficient for you in this world and the next. Whoever holds fast to it will never be disappointed.',
    context: 'Shaykh Ahmad al-Tijāni emphasized that the Tijāni wird contains all the spiritual nourishment a seeker needs for both worldly and eternal success.',
    lessons: [
      'The wird is complete spiritual nourishment',
      'Consistency in practice brings success',
      'Trust in the spiritual method is essential',
      'The wird connects directly to prophetic blessing',
      'Spiritual practices should be approached with confidence'
    ]
  },
  {
    id: 'ali-knowledge',
    title: 'I am the City of Knowledge',
    speaker: 'Prophet Muhammad ﷺ about Ali (ع)',
    description: 'The Prophet\'s ﷺ famous saying about Ali being the gate to knowledge.',
    fullText: 'I am the city of knowledge and Ali is its gate.',
    arabicText: 'أنا مدينة العلم وعلي بابها',
    context: 'This hadith highlights the special relationship between the Prophet ﷺ and Ali (ع), and Ali\'s role as the gateway to prophetic knowledge.',
    lessons: [
      'Knowledge has proper channels of transmission',
      'Spiritual knowledge requires proper guidance',
      'Ali (ع) is a key figure in Islamic spirituality',
      'The importance of authentic teachers',
      'Knowledge and spirituality are interconnected'
    ]
  },
  {
    id: 'niasse-fayda',
    title: 'The Divine Flood',
    speaker: 'Shaykh Ibrahim Niasse',
    description: 'Teaching about the Faydah (Divine Flood) of spiritual knowledge.',
    fullText: 'This is the time of the Faydah, the divine flood of spiritual knowledge that will reach every corner of the earth.',
    context: 'Shaykh Ibrahim Niasse taught that his era marked a special outpouring of divine knowledge and spiritual awakening.',
    lessons: [
      'Spiritual knowledge comes in waves',
      'Divine grace has its appointed times',
      'Spiritual awakening can be collective',
      'The importance of recognizing spiritual opportunities',
      'Universal access to divine knowledge'
    ]
  },
  {
    id: 'fatima-patience',
    title: 'Patience is from Faith',
    speaker: 'Fatima az-Zahra (ع)',
    description: 'Teaching about the virtue of patience in times of difficulty.',
    fullText: 'Patience in the face of trials is a sign of true faith and brings one closer to Allah.',
    context: 'Fatima (ع) demonstrated extraordinary patience during her life, especially after the death of her father, the Prophet ﷺ.',
    lessons: [
      'Patience is a fundamental virtue in Islam',
      'Trials are opportunities for spiritual growth',
      'Faith is tested through difficulties',
      'Patience brings divine reward',
      'True believers remain steadfast in hardship'
    ]
  },
  {
    id: 'hussein-dignity',
    title: 'Death with Dignity',
    speaker: 'Hussein ibn Ali (ع)',
    description: 'The famous words about choosing death with honor over life with humiliation.',
    fullText: 'Death with dignity is better than life with humiliation.',
    arabicText: 'الموت في عز خير من الحياة في ذل',
    context: 'These words reflect Hussein\'s (ع) stance at Karbala, where he chose to die rather than submit to injustice and tyranny.',
    lessons: [
      'Principles are more important than life itself',
      'Standing for truth requires courage',
      'Dignity cannot be compromised',
      'Some things are worth dying for',
      'True victory comes through sacrifice for truth'
    ]
  }
];

export default function LibraryScreen() {
  const [currentView, setCurrentView] = useState<ViewState>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<HolyPlace | null>(null);
  const [selectedWord, setSelectedWord] = useState<LivingWord | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('items');
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory('');
  };

  const openModal = (type: string, item: any) => {
    switch (type) {
      case 'formula':
        setSelectedItem(item);
        break;
      case 'master':
        setSelectedMaster(item);
        break;
      case 'book':
        setSelectedBook(item);
        break;
      case 'place':
        setSelectedPlace(item);
        break;
      case 'word':
        setSelectedWord(item);
        break;
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setSelectedMaster(null);
    setSelectedBook(null);
    setSelectedPlace(null);
    setSelectedWord(null);
  };

  const getCurrentData = () => {
    switch (selectedCategory) {
      case 'formulas':
        return formulasData;
      case 'masters':
        return mastersData;
      case 'books':
        return booksData;
      case 'places':
        return holyPlacesData;
      case 'words':
        return livingWordsData;
      default:
        return [];
    }
  };

  const renderCategoryCard = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryCard, { borderLeftColor: category.color }]}
      onPress={() => handleCategoryPress(category.id)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryHeader}>
        <View style={styles.categoryIconContainer}>
          {category.icon}
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryArabicTitle}>{category.arabicTitle}</Text>
          <Text style={styles.categoryCount}>{category.count} items</Text>
        </View>
      </View>
      <Text style={styles.categoryDescription}>{category.description}</Text>
    </TouchableOpacity>
  );

  const renderItemCard = (item: any, type: string) => (
    <TouchableOpacity
      key={item.id}
      style={styles.itemCard}
      onPress={() => openModal(type, item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>
          {item.title || item.name}
        </Text>
        {item.badge && (
          <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      {item.arabicTitle && (
        <Text style={styles.itemArabicTitle}>{item.arabicTitle}</Text>
      )}
      {item.speaker && (
        <Text style={styles.itemSpeaker}>— {item.speaker}</Text>
      )}
      {item.author && (
        <Text style={styles.itemAuthor}>by {item.author}</Text>
      )}
      {item.location && (
        <Text style={styles.itemLocation}>{item.location}</Text>
      )}
      {item.years && (
        <Text style={styles.itemYears}>{item.years}</Text>
      )}
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.readMore}>Tap to read more →</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenBackground>
      <GradientHeader
        arabicTitle="المكتبة الروحية"
        englishTitle="Spiritual Library"
        subtitle={currentView === 'categories' ? 'Knowledge & Wisdom' : categories.find(c => c.id === selectedCategory)?.title || ''}
        icon={<BookOpen color="#FFFFFF" size={32} />}
      />

      {currentView === 'items' && (
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToCategories}
            activeOpacity={0.7}
          >
            <ArrowLeft color="#FFFFFF" size={20} />
            <Text style={styles.backButtonText}>Back to Categories</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentView === 'categories' ? (
          <View style={styles.categoriesContainer}>
            {categories.map(renderCategoryCard)}
          </View>
        ) : (
          <View style={styles.itemsContainer}>
            {getCurrentData().map((item: any) => {
              let type = '';
              switch (selectedCategory) {
                case 'formulas':
                  type = 'formula';
                  break;
                case 'masters':
                  type = 'master';
                  break;
                case 'books':
                  type = 'book';
                  break;
                case 'places':
                  type = 'place';
                  break;
                case 'words':
                  type = 'word';
                  break;
              }
              return renderItemCard(item, type);
            })}
          </View>
        )}

        <View style={styles.quoteContainer}>
          <Text style={styles.arabicQuote}>
            وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ
          </Text>
          <Text style={styles.quoteTranslation}>
            "And remember Allah much that you may succeed"
          </Text>
          <Text style={styles.quoteReference}>Quran 62:10</Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Universal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>
                  {selectedItem?.title || selectedMaster?.name || selectedBook?.title || selectedPlace?.name || selectedWord?.title}
                </Text>
              </View>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Sacred Formula Content */}
              {selectedItem && (
                <>
                  <View style={[styles.badge, { backgroundColor: selectedItem.badgeColor, alignSelf: 'flex-start', marginBottom: 16 }]}>
                    <Text style={styles.badgeText}>{selectedItem.badge}</Text>
                  </View>
                  <Text style={styles.modalDescription}>{selectedItem.fullDescription}</Text>
                  <View style={styles.arabicTextContainer}>
                    <Text style={styles.arabicText}>{selectedItem.arabicText}</Text>
                  </View>
                  <View style={styles.transliterationContainer}>
                    <Text style={styles.sectionSubtitle}>Transliteration</Text>
                    <Text style={styles.transliteration}>{selectedItem.transliteration}</Text>
                  </View>
                  <View style={styles.translationContainer}>
                    <Text style={styles.sectionSubtitle}>Translation</Text>
                    <Text style={styles.translation}>{selectedItem.translation}</Text>
                  </View>
                  <View style={styles.benefitsContainer}>
                    <Text style={styles.sectionSubtitle}>Spiritual Benefits</Text>
                    {selectedItem.benefits?.map((benefit, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.benefitText}>{benefit}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.recitationContainer}>
                    <Text style={styles.sectionSubtitle}>Recitation Guidelines</Text>
                    <View style={styles.recitationItem}>
                      <Clock color="#059669" size={16} />
                      <Text style={styles.recitationText}>
                        <Text style={styles.recitationLabel}>Frequency: </Text>
                        {selectedItem.recitation?.frequency}
                      </Text>
                    </View>
                    <View style={styles.recitationItem}>
                      <Star color="#059669" size={16} />
                      <Text style={styles.recitationText}>
                        <Text style={styles.recitationLabel}>Timing: </Text>
                        {selectedItem.recitation?.timing}
                      </Text>
                    </View>
                    <View style={styles.recitationItem}>
                      <Users color="#059669" size={16} />
                      <Text style={styles.recitationText}>
                        <Text style={styles.recitationLabel}>Requirements: </Text>
                        {selectedItem.recitation?.requirements}
                      </Text>
                    </View>
                  </View>
                </>
              )}

              {/* Master Content */}
              {selectedMaster && (
                <>
                  <View style={styles.masterInfoHeader}>
                    <Text style={styles.masterModalTitle}>{selectedMaster.title}</Text>
                    <View style={styles.masterInfoRow}>
                      <Calendar color="#059669" size={16} />
                      <Text style={styles.masterInfoText}>{selectedMaster.years}</Text>
                    </View>
                    <View style={styles.masterInfoRow}>
                      <MapPin color="#059669" size={16} />
                      <Text style={styles.masterInfoText}>{selectedMaster.location}</Text>
                    </View>
                  </View>
                  <View style={styles.biographyContainer}>
                    <Text style={styles.sectionSubtitle}>Biography</Text>
                    <Text style={styles.biographyText}>{selectedMaster.fullBiography}</Text>
                  </View>
                  <View style={styles.achievementsContainer}>
                    <Text style={styles.sectionSubtitle}>Major Achievements</Text>
                    {selectedMaster.achievements?.map((achievement, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.benefitText}>{achievement}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.teachingsContainer}>
                    <Text style={styles.sectionSubtitle}>Key Teachings</Text>
                    {selectedMaster.teachings?.map((teaching, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.benefitText}>{teaching}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.legacyContainer}>
                    <Text style={styles.sectionSubtitle}>Legacy</Text>
                    <Text style={styles.legacyText}>{selectedMaster.legacy}</Text>
                  </View>
                </>
              )}

              {/* Book Content */}
              {selectedBook && (
                <>
                  {selectedBook.arabicTitle && (
                    <Text style={styles.arabicTitle}>{selectedBook.arabicTitle}</Text>
                  )}
                  <Text style={styles.bookAuthor}>by {selectedBook.author}</Text>
                  <Text style={styles.modalDescription}>{selectedBook.fullDescription}</Text>
                  <View style={styles.keyTopicsContainer}>
                    <Text style={styles.sectionSubtitle}>Key Topics</Text>
                    {selectedBook.keyTopics?.map((topic, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.benefitText}>{topic}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.significanceContainer}>
                    <Text style={styles.sectionSubtitle}>Significance</Text>
                    <Text style={styles.significanceText}>{selectedBook.significance}</Text>
                  </View>
                </>
              )}

              {/* Holy Place Content */}
              {selectedPlace && (
                <>
                  {selectedPlace.arabicName && (
                    <Text style={styles.arabicTitle}>{selectedPlace.arabicName}</Text>
                  )}
                  <View style={styles.placeInfoRow}>
                    <MapPin color="#059669" size={16} />
                    <Text style={styles.placeLocation}>{selectedPlace.location}</Text>
                  </View>
                  <Text style={styles.modalDescription}>{selectedPlace.fullDescription}</Text>
                  <View style={styles.significanceContainer}>
                    <Text style={styles.sectionSubtitle}>Significance</Text>
                    <Text style={styles.significanceText}>{selectedPlace.significance}</Text>
                  </View>
                  <View style={styles.historyContainer}>
                    <Text style={styles.sectionSubtitle}>History</Text>
                    <Text style={styles.historyText}>{selectedPlace.history}</Text>
                  </View>
                  <View style={styles.practicesContainer}>
                    <Text style={styles.sectionSubtitle}>Spiritual Practices</Text>
                    {selectedPlace.practices?.map((practice, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.benefitText}>{practice}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              {/* Living Word Content */}
              {selectedWord && (
                <>
                  <Text style={styles.wordSpeaker}>— {selectedWord.speaker}</Text>
                  {selectedWord.arabicText && (
                    <View style={styles.arabicTextContainer}>
                      <Text style={styles.arabicText}>{selectedWord.arabicText}</Text>
                    </View>
                  )}
                  <View style={styles.wordTextContainer}>
                    <Text style={styles.wordText}>"{selectedWord.fullText}"</Text>
                  </View>
                  <View style={styles.contextContainer}>
                    <Text style={styles.sectionSubtitle}>Context</Text>
                    <Text style={styles.contextText}>{selectedWord.context}</Text>
                  </View>
                  <View style={styles.lessonsContainer}>
                    <Text style={styles.sectionSubtitle}>Lessons</Text>
                    {selectedWord.lessons?.map((lesson, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.benefitText}>{lesson}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              <View style={styles.modalBottomSpacing} />
            </ScrollView>
          </View>
        </View>
      </Modal>
      </ScreenBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  backButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
     backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: 8
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  categoriesContainer: {
    padding: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIconContainer: {
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryArabicTitle: {
    fontSize: 16,
    color: '#059669',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  itemsContainer: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  itemArabicTitle: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 4,
  },
  itemSpeaker: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  itemAuthor: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  itemYears: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  readMore: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  quoteContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  arabicQuote: {
    fontSize: 20,
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 12,
  },
  quoteTranslation: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quoteReference: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    minHeight: height * 0.6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  arabicTextContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  arabicText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#1F2937',
    lineHeight: 32,
  },
  arabicTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#059669',
    marginBottom: 8,
  },
  transliterationContainer: {
    marginBottom: 20,
  },
  translationContainer: {
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  transliteration: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  translation: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#059669',
    marginRight: 8,
    marginTop: 2,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    flex: 1,
  },
  recitationContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  recitationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recitationText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  recitationLabel: {
    fontWeight: '600',
    color: '#1F2937',
  },
  // Master Modal Styles
  masterInfoHeader: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  masterModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 12,
  },
  masterInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  masterInfoText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  biographyContainer: {
    marginBottom: 20,
  },
  biographyText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  achievementsContainer: {
    marginBottom: 20,
  },
  teachingsContainer: {
    marginBottom: 20,
  },
  legacyContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  legacyText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  // Book Modal Styles
  bookAuthor: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  keyTopicsContainer: {
    marginBottom: 20,
  },
  significanceContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  significanceText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  // Holy Place Modal Styles
  placeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeLocation: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  historyContainer: {
    marginBottom: 20,
  },
  historyText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  practicesContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  // Living Word Modal Styles
  wordSpeaker: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  wordTextContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  wordText: {
    fontSize: 16,
    color: '#1F2937',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
  },
  contextContainer: {
    marginBottom: 20,
  },
  contextText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  lessonsContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  modalBottomSpacing: {
    height: 20,
  },
});