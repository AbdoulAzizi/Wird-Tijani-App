// data/libraryData.ts
import { Heart, Crown, Book, Mountain, Quote } from 'lucide-react-native';

export const categories = [
  {
    id: 'formulas',
    title: 'Formules Sacrées',
    arabicTitle: 'الأوراد المقدسة',
    icon: Heart,
    color: '#059669',
    description: 'Formules divines et prières révélées aux maîtres Tijāni',
    count: 3
  },
  {
    id: 'masters',
    title: 'Grands Maîtres',
    arabicTitle: 'الأساتذة العظام',
    icon: Crown,
    color: '#047857',
    description: 'Les guides bénis et leaders spirituels de l\'Islam',
    count: 8
  },
  {
    id: 'books',
    title: 'Livres Sacrés',
    arabicTitle: 'الكتب المقدسة',
    icon: Book,
    color: '#065F46',
    description: 'Textes essentiels et écrits de la tradition Tijāni',
    count: 4
  },
  {
    id: 'places',
    title: 'Lieux Saints',
    arabicTitle: 'الأماكن المقدسة',
    icon: Mountain,
    color: '#10B981',
    description: 'Lieux sacrés et centres d\'apprentissage spirituel',
    count: 5
  },
  {
    id: 'words',
    title: 'Paroles Vivantes',
    arabicTitle: 'الكلمات الحية',
    icon: Quote,
    color: '#34D399',
    description: 'Enseignements profonds des maîtres',
    count: 6
  }
];

export const formulasData = [
  {
    id: 'istighfar',
    title: 'Istighfār - Demande de Pardon',
    badge: 'Essentiel',
    badgeColor: '#059669',
    description: 'La formule de demande de pardon purifie le cœur et ouvre la porte à la miséricorde divine.',
    fullDescription: 'L\'Istighfār est la porte d\'entrée vers toutes les stations spirituelles du chemin Tijāni. Elle consiste à demander pardon à Allah avec un repentir sincère et un cœur brisé. Cette pratique purifie l\'âme des taches du péché et la prépare aux réceptions spirituelles supérieures.',
    arabicText: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfiru Allah al-ʿAẓīm alladhī lā ilāha illā Huwa al-Ḥayy al-Qayyūm wa atūbu ilayh',
    translation: 'Je demande pardon à Allah le Magnifique, il n\'y a de divinité que Lui, le Vivant, le Subsistant, et je me repens à Lui.',
    benefits: [
      'Purifie le cœur des impuretés spirituelles',
      'Ouvre la porte à la miséricorde et au pardon divins',
      'Prépare l\'âme aux expériences spirituelles supérieures',
      'Apporte paix et tranquillité à l\'esprit',
      'Renforce la connexion avec Allah'
    ],
    recitation: {
      frequency: '100 fois par jour',
      timing: 'Après chaque prière et avant le sommeil',
      requirements: 'État de pureté (wudu) recommandé'
    }
  },
  {
    id: 'salat-fatih',
    title: 'Ṣalāt al-Fātiḥ - La Prière d\'Ouverture',
    badge: 'Signature',
    badgeColor: '#047857',
    description: 'Cette prière bénie sur le Prophète ﷺ est unique à la Tijāniyya.',
    fullDescription: 'Ṣalāt al-Fātiḥ est la prière la plus distinguée sur le Prophète ﷺ dans la tradition Tijāni. Elle a été révélée au Shaykh Ahmad al-Tijāni et possède un pouvoir spirituel extraordinaire.',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بِالْحَقِّ وَالْهَادِي إِلَى صِرَاطِكَ الْمُسْتَقِيمِ وَعَلَى آلِهِ حَقَّ قَدْرِهِ وَمِقْدَارِهِ الْعَظِيمِ',
    transliteration: 'Allāhumma ṣalli ʿalā sayyidinā Muḥammad al-fātiḥi limā ughliqa wa al-khātimi limā sabaqa nāṣir al-ḥaqqi bi al-ḥaqqi wa al-hādī ilā ṣirāṭika al-mustaqīm wa ʿalā ālihī ḥaqqa qadrihi wa miqdārihī al-ʿaẓīm',
    translation: 'Ô Allah, envoie des prières sur notre maître Muhammad, celui qui ouvre ce qui était fermé, le sceau de ce qui a précédé, le soutien de la vérité par la vérité, et le guide vers Ton droit chemin, et sur sa famille selon son dû et son statut magnifique.',
    benefits: [
      'Ouvre les portes spirituelles et élimine les obstacles',
      'Rapproche le croyant du Prophète ﷺ',
      'Procure une récompense immense au-delà de tout calcul',
      'Illumine le cœur de la lumière prophétique',
      'Accorde l\'élévation spirituelle et la faveur divine'
    ],
    recitation: {
      frequency: '50 fois dans le wird du soir, 50 fois dans le wird du matin',
      timing: 'Partie intégrante du wird quotidien (matin et soir)',
      requirements: 'Doit être récité avec le wird complet'
    }
  },
  {
    id: 'jawhara',
    title: 'Jawharat al-Kamāl - Perle de la Perfection',
    badge: 'Avancé',
    badgeColor: '#7C3AED',
    description: 'Le joyau de la couronne des prières Tijāni, révélé au Shaykh Ahmad al-Tijāni.',
    fullDescription: 'Jawharat al-Kamāl est la prière suprême de la Tijāniyya, révélée directement au Shaykh Ahmad al-Tijāni par le Prophète ﷺ. Elle encapsule la perfection du Prophète et sert de moyen pour atteindre la perfection spirituelle pour le récitant.',
    arabicText: `اللهم صل وسلم على عين الرحمة الربانية والياقوتة المتحققة الحائطة بمركز الفهوم والمعانى ونور الاكوان المتكونة الآدمى صاحب الحق الربانى`,
    transliteration: `Allāhumma ṣalli wa sallim ʿalā ʿayni r-raḥmati r-rabbāniyya wa l-yāqūti l-mutaḥaqqiqati l-ḥā'iṭati bimuqarrati l-fuhūmi wa l-maʿānī wa nūri l-akwāni l-mutaʾakkina l-ādami ṣāḥibi l-ḥaqqi r-rabbāni`,
    translation: `Ô Allah, envoie des prières et la paix sur l'Œil de la Miséricorde Divine et le Rubis Parfait, l'Englobant au Centre des Compréhensions et des Significations, et la Lumière des Univers, l'Être Humain, le Possesseur de la Vérité Divine.`,
    benefits: [
      'Accorde la perfection et l\'accomplissement spirituels',
      'Connecte directement à l\'essence du Prophète',
      'Fournit une protection contre les dangers spirituels et physiques',
      'Ouvre les plus hauts niveaux de connaissance divine',
      'Amène le récitant à la station de l\'ihsan'
    ],
    recitation: {
      frequency: '12 fois le vendredi entre Maghrib et Isha',
      timing: 'Exclusivement le vendredi soir',
      requirements: 'Requiert l\'ijaza (permission) d\'un shaykh qualifié'
    }
  }
];

export const mastersData = [
  {
    id: 'prophet',
    name: 'Prophète Muhammad ﷺ',
    title: 'Sceau des Prophètes',
    years: '570-632 de notre ère',
    location: 'La Mecque et Médine',
    description: 'Le dernier messager d\'Allah, paix et bénédictions sur lui, l\'exemple parfait pour toute l\'humanité.',
    fullBiography: 'Muhammad ibn Abdullah ﷺ est né à La Mecque en 570. Il a reçu la première révélation à l\'âge de 40 ans et a passé 23 ans à transmettre le message de l\'Islam. Il est le prophète et messager final d\'Allah, l\'exemple parfait de caractère et de conduite pour toute l\'humanité. Ses enseignements forment la fondation de la spiritualité islamique et le chemin Tijāni retrace sa lignée spirituelle directement jusqu\'à lui.',
    achievements: [
      'A reçu et transmis la révélation finale (Coran)',
      'A établi la communauté islamique parfaite à Médine',
      'A complété la religion de l\'Islam',
      'A démontré les plus hauts niveaux de caractère et de spiritualité',
      'A unifié la péninsule arabique sous l\'Islam'
    ],
    teachings: [
      'Adorer Allah seul sans associés (Tawhid)',
      'Suivre les cinq piliers de l\'Islam',
      'Traiter tous les gens avec justice et compassion',
      'Chercher la connaissance du berceau à la tombe',
      'Se souvenir fréquemment d\'Allah avec présence du cœur'
    ],
    legacy: 'Le Prophète ﷺ est la source spirituelle de toute connaissance et pratique islamique. Chaque voie spirituelle authentique en Islam remonte à ses enseignements et son exemple bénis.'
  },
  {
    id: 'ali',
    name: 'Ali ibn Abi Talib (ع)',
    title: 'Le Lion d\'Allah',
    years: '599-661 de notre ère',
    location: 'La Mecque, Médine, Kufa',
    description: 'Le cousin et gendre du Prophète ﷺ, que son visage soit ennobli, la porte de la cité de la connaissance.',
    fullBiography: 'Ali ibn Abi Talib (ع) était le cousin et le gendre du Prophète Muhammad ﷺ, marié à Fatima (ع). Il a été le premier homme à accepter l\'Islam et était connu pour son courage, sa sagesse et sa profonde connaissance spirituelle. Le Prophète ﷺ a dit : "Je suis la cité de la connaissance et Ali en est la porte." Il a servi comme quatrième Calife et est révéré par tous les musulmans pour sa piété et sa connaissance.',
    achievements: [
      'Premier homme à accepter l\'Islam',
      'A combattu vaillamment dans toutes les batailles majeures',
      'A servi comme quatrième Calife bien guidé',
      'A préservé et transmis la connaissance prophétique',
      'Connu pour ses discours éloquents et sa sagesse profonde'
    ],
    teachings: [
      'L\'importance de la connaissance et de la sagesse',
      'Justice et équité dans toutes les relations',
      'Courage dans la défense de la vérité',
      'Humilité malgré une haute station',
      'Contemplation profonde et souvenir d\'Allah'
    ],
    legacy: 'Ali (ع) est considéré comme le père spirituel du mysticisme islamique et de nombreux ordres soufis retracent leur lignée spirituelle à travers lui.'
  },
  {
    id: 'fatima',
    name: 'Fatima az-Zahra (ع)',
    title: 'La Radieuse',
    years: '605-632 de notre ère',
    location: 'La Mecque et Médine',
    description: 'La fille bien-aimée du Prophète ﷺ, que la paix du Seigneur soit sur elle, mère de Hassan et Hussein.',
    fullBiography: 'Fatima az-Zahra (ع) était la fille cadette du Prophète Muhammad ﷺ et de Khadija (ع). Elle était mariée à Ali (ع) et était la mère de Hassan et Hussein (ع). Le Prophète ﷺ a dit qu\'elle était la leader des femmes du Paradis. Elle était connue pour sa piété, sa patience et sa dévotion à Allah et à sa famille.',
    achievements: [
      'Fille bien-aimée du Prophète ﷺ',
      'Mère des petits-fils bénis Hassan et Hussein',
      'Exemple de patience et de piété pour toutes les femmes',
      'A soutenu la mission de son père avec dévouement',
      'A maintenu la maison prophétique avec dignité'
    ],
    teachings: [
      'Patience dans les moments difficiles',
      'Dévotion à la famille et à la foi',
      'L\'importance de la prière et du souvenir',
      'Générosité et soin pour les pauvres',
      'Maintenir la dignité en toutes circonstances'
    ],
    legacy: 'Fatima (ع) est révérée comme l\'exemple parfait de la féminité et de la spiritualité islamiques, et sa lignée continue la famille prophétique bénie.'
  },
  {
    id: 'hassan',
    name: 'Hassan ibn Ali (ع)',
    title: 'L\'Élu',
    years: '625-670 de notre ère',
    location: 'Médine et Kufa',
    description: 'Le petit-fils aîné du Prophète ﷺ, que la paix du Seigneur soit sur lui, connu pour sa sagesse et sa pacification.',
    fullBiography: 'Hassan ibn Ali (ع) était le fils aîné d\'Ali (ع) et de Fatima (ع), et le petit-fils bien-aimé du Prophète Muhammad ﷺ. Le Prophète ﷺ a dit : "Hassan et Hussein sont les leaders de la jeunesse du Paradis." Il a brièvement servi comme Calife mais a abdiqué pour préserver l\'unité musulmane, lui valant le titre de "Le Pacificateur".',
    achievements: [
      'Petit-fils bien-aimé du Prophète ﷺ',
      'A brièvement servi comme cinquième Calife',
      'A fait la paix pour préserver l\'unité musulmane',
      'Connu pour sa générosité et sa sagesse',
      'A transmis les traditions et la connaissance prophétiques'
    ],
    teachings: [
      'La valeur de la paix et de l\'unité',
      'Sagesse dans le leadership et la prise de décision',
      'Générosité et soin pour les autres',
      'Patience et tolérance',
      'Préserver l\'héritage prophétique'
    ],
    legacy: 'Hassan (ع) est rappelé comme un leader sage qui a donné la priorité au bien-être de la communauté musulmane sur le pouvoir personnel.'
  },
  {
    id: 'hussein',
    name: 'Hussein ibn Ali (ع)',
    title: 'Maître des Martyrs',
    years: '626-680 de notre ère',
    location: 'Médine et Karbala',
    description: 'Le petit-fils cadet du Prophète ﷺ, que la paix du Seigneur soit sur lui, qui a tout sacrifié pour la vérité.',
    fullBiography: 'Hussein ibn Ali (ع) était le fils cadet d\'Ali (ع) et de Fatima (ع), et le petit-fils bien-aimé du Prophète Muhammad ﷺ. Il s\'est opposé à l\'injustice et à la tyrannie, sacrifiant finalement sa vie à la Bataille de Karbala en 680. Sa position pour la vérité et la justice a inspiré les musulmans à travers l\'histoire.',
    achievements: [
      'Petit-fils bien-aimé du Prophète ﷺ',
      'S\'est fermement opposé à l\'injustice et à la tyrannie',
      'A sacrifié sa vie pour les principes islamiques',
      'A préservé les vrais enseignements de l\'Islam',
      'Est devenu un symbole de résistance contre l\'oppression'
    ],
    teachings: [
      'Ne jamais compromettre la vérité et la justice',
      'Se dresser contre l\'oppression quel qu\'en soit le coût',
      'L\'importance du sacrifice pour les principes',
      'Dignité face à l\'adversité',
      'La lutte éternelle entre le bien et le mal'
    ],
    legacy: 'Hussein (ع) est révéré comme le "Maître des Martyrs" et son sacrifice à Karbala reste un symbole puissant de la défense de la vérité contre l\'injustice.'
  },
  {
    id: 'tijani',
    name: 'Shaykh Ahmad al-Tijāni',
    title: 'Fondateur de la Tijāniyya',
    years: '1737-1815',
    location: 'Fès, Maroc',
    description: 'Le fondateur béni qui a reçu le wird Tijāni directement du Prophète ﷺ dans une vision éveillée.',
    fullBiography: 'Shaykh Ahmad ibn Muhammad al-Tijāni est né à Ayn Māḍī, en Algérie. Il a beaucoup voyagé à la recherche de connaissance et de guidance spirituelle avant de s\'installer à Fès, au Maroc. En 1196 AH (1782), il a reçu une visite directe du Prophète Muhammad ﷺ à l\'état de veille, qui lui a donné le wird Tijāni et l\'a nommé guide spirituel.',
    achievements: [
      'A reçu une instruction spirituelle directe du Prophète ﷺ',
      'A fondé l\'ordre soufi Tijāniyya',
      'A écrit de nombreuses œuvres spirituelles et prières',
      'A formé des milliers de disciples à travers l\'Afrique du Nord et de l\'Ouest',
      'A établi la méthodologie unique Tijāni du dhikr'
    ],
    teachings: [
      'Confiance complète en Allah (tawakkul)',
      'Amour absolu pour le Prophète Muhammad ﷺ',
      'L\'importance de la compagnie spirituelle (suhba)',
      'Modération dans tous les aspects de la vie',
      'La suprématie du wird Tijāni sur toutes les autres pratiques spirituelles'
    ],
    legacy: 'La Tijāniyya est devenue l\'un des ordres soufis les plus répandus, avec des millions de fidèles à travers l\'Afrique et au-delà.'
  },
  {
    id: 'umar-tall',
    name: 'Al-Hajj Umar Tall',
    title: 'Grand Khalifa d\'Afrique de l\'Ouest',
    years: '1794-1864',
    location: 'Fouta Tooro, Sénégal',
    description: 'A répandu la Tijāniyya à travers l\'Afrique de l\'Ouest et établi de nombreux centres d\'apprentissage.',
    fullBiography: 'Al-Hajj Umar ibn Said Tall est né au Fouta Tooro. Après avoir effectué le Hajj, il a étudié à La Mecque et a reçu le wird Tijāni de Muhammad al-Ghali à Médine. À son retour en Afrique de l\'Ouest, il est devenu le grand propagateur de l\'ordre Tijāniyya.',
    achievements: [
      'A répandu la Tijāniyya à travers l\'Afrique de l\'Ouest',
      'A établi l\'Empire Toucouleur',
      'A fondé de nombreuses écoles et centres islamiques',
      'A écrit des œuvres importantes sur la doctrine Tijāni',
      'A unifié divers groupes ethniques sous la bannière islamique'
    ],
    teachings: [
      'La nécessité de rechercher une connaissance islamique authentique',
      'Justice sociale et égalité parmi les croyants',
      'L\'importance du développement économique dans la société islamique',
      'Discipline militaire au service des idéaux islamiques',
      'Le rôle du leadership dans la guidance spirituelle'
    ],
    legacy: 'Ses efforts ont abouti à la conversion de millions de personnes à l\'Islam et à l\'établissement de la Tijāniyya comme ordre soufi dominant en Afrique de l\'Ouest.'
  },
  {
    id: 'ibrahim-niasse',
    name: 'Ibrahim Niasse',
    title: 'Shaykh al-Islam',
    years: '1900-1975',
    location: 'Kaolack, Sénégal',
    description: 'A dirigé le grand renouveau Tijāni du 20e siècle, attirant des millions au chemin.',
    fullBiography: 'Shaykh Ibrahim ibn Abdullah Niasse, connu sous le nom de Baye Niasse, est né à Taiba Niassene, au Sénégal. Il a affirmé être le "Ghawth al-Zaman" (Pôle Spirituel du Temps) et a mené un renouveau majeur de la spiritualité Tijāni au 20e siècle.',
    achievements: [
      'A dirigé le plus grand renouveau Tijāni des temps modernes',
      'A établi Medina Baye comme centre islamique majeur',
      'A attiré des millions de fidèles dans le monde entier',
      'A promu l\'éducation islamique et les droits des femmes',
      'A écrit des œuvres importantes sur la théologie islamique'
    ],
    teachings: [
      'Le concept de Faydah (Inondation Divine) de connaissance spirituelle',
      'L\'importance de la ma\'rifa (gnose) dans le développement spirituel',
      'Fraternité universelle au-delà des frontières ethniques et raciales',
      'Le rôle des femmes dans la société et la spiritualité islamiques',
      'Application pratique des principes islamiques dans la vie moderne'
    ],
    legacy: 'La branche Faydah Tijāniyya qu\'il a établie continue de croître mondialement, avec des communautés importantes en Afrique, en Europe et dans les Amériques.'
  }
];

export const booksData = [
  {
    id: 'quran',
    title: 'Le Saint Coran',
    arabicTitle: 'القرآن الكريم',
    author: 'Révélé au Prophète Muhammad ﷺ',
    description: 'La révélation finale d\'Allah, le guide ultime pour l\'humanité.',
    fullDescription: 'Le Coran est la révélation finale d\'Allah, révélée au Prophète Muhammad ﷺ sur une période de 23 ans. C\'est la source principale de guidance islamique, contenant 114 chapitres (sourates) avec plus de 6 000 versets (ayahs). Le Coran aborde tous les aspects de la vie humaine et fournit des conseils spirituels, moraux, sociaux et juridiques.',
    keyTopics: [
      'Tawhid (Unicité d\'Allah)',
      'Prophétie et révélation',
      'L\'au-delà et le Jour du Jugement',
      'Guidance morale et éthique',
      'Histoires des prophètes précédents',
      'Lois et guidance sociale'
    ],
    significance: 'Le Coran est le fondement de toute connaissance et pratique islamique. Dans la tradition Tijāni, la récitation et la contemplation régulières du Coran sont essentielles au développement spirituel.'
  },
  {
    id: 'rimah',
    title: 'Rimah Hizb al-Rahim',
    arabicTitle: 'رماح حزب الرحيم',
    author: 'Shaykh Umar al-Futi',
    description: 'Une œuvre complète sur la doctrine et la méthodologie spirituelle Tijāni.',
    fullDescription: 'Rimah Hizb al-Rahim est l\'une des œuvres les plus importantes de la littérature Tijāni, écrite par Shaykh Umar al-Futi (Al-Hajj Umar Tall). Ce livre sert de défense et d\'explication des enseignements Tijāni, abordant divers aspects du chemin spirituel et répondant aux critiques de l\'ordre.',
    keyTopics: [
      'La supériorité du wird Tijāni',
      'Méthodologie et pratiques spirituelles',
      'Le rôle du guide spirituel (shaykh)',
      'Défense contre les critiques de l\'ordre',
      'La hiérarchie spirituelle et les stations',
      'Conduite appropriée pour les disciples'
    ],
    significance: 'Cette œuvre est considérée comme une lecture essentielle pour les étudiants sérieux du chemin Tijāni, fournissant à la fois une compréhension théorique et des conseils pratiques.'
  },
  {
    id: 'jawahir',
    title: 'Jawahir al-Ma\'ani',
    arabicTitle: 'جواهر المعاني',
    author: 'Shaykh Ali Harazim',
    description: 'L\'œuvre biographique principale sur Shaykh Ahmad al-Tijāni et ses enseignements.',
    fullDescription: 'Jawahir al-Ma\'ani est l\'œuvre biographique la plus importante sur Shaykh Ahmad al-Tijāni, écrite par son disciple proche Shaykh Ali Harazim. Le livre contient des récits détaillés de la vie du Shaykh, ses expériences spirituelles, ses enseignements et le développement de l\'ordre Tijāni.',
    keyTopics: [
      'Biographie de Shaykh Ahmad al-Tijāni',
      'La fondation de l\'ordre Tijāni',
      'Visions et expériences spirituelles',
      'Enseignements et guidance du Shaykh',
      'Histoires des premiers disciples',
      'La diffusion du chemin Tijāni'
    ],
    significance: 'Ce livre est la source principale pour comprendre la vie et les enseignements du fondateur de l\'ordre Tijāni et est considéré comme essentiel pour tous les adeptes du chemin.'
  },
  {
    id: 'kashf',
    title: 'Kashf al-Ilbas',
    arabicTitle: 'كشف الإلباس',
    author: 'Shaykh Ahmad al-Tijāni',
    description: 'Une œuvre qui élimine la confusion et clarifie la vraie nature du chemin Tijāni.',
    fullDescription: 'Kashf al-Ilbas (Éliminer la Confusion) est une œuvre attribuée à Shaykh Ahmad al-Tijāni qui aborde les idées fausses sur l\'ordre Tijāni et clarifie ses enseignements authentiques. Le livre sert à distinguer la vraie pratique Tijāni des innovations et des malentendus.',
    keyTopics: [
      'Clarification des enseignements Tijāni',
      'Réfutation des idées fausses',
      'Compréhension correcte des pratiques spirituelles',
      'La chaîne authentique de transmission',
      'Directives pour les disciples et les enseignants',
      'L\'importance de suivre une guidance authentique'
    ],
    significance: 'Cette œuvre aide à garantir que les enseignements Tijāni restent purs et authentiques, protégeant les adeptes des déviations et des malentendus.'
  }
];

export const holyPlacesData = [
  {
    id: 'mecca',
    name: 'La Mecque',
    arabicName: 'مكة المكرمة',
    location: 'Arabie Saoudite',
    description: 'La ville la plus sainte de l\'Islam, lieu de naissance du Prophète Muhammad ﷺ et site de la Kaaba.',
    fullDescription: 'La Mecque est la ville la plus sainte de l\'Islam, située dans la région du Hedjaz en Arabie Saoudite. C\'est le lieu de naissance du Prophète Muhammad ﷺ et le site de la Kaaba, vers laquelle tous les musulmans prient. Chaque année, des millions de musulmans accomplissent le pèlerinage du Hajj à La Mecque, accomplissant l\'un des cinq piliers de l\'Islam.',
    significance: 'La Mecque est le centre spirituel du monde islamique et la direction de la prière (qibla) pour tous les musulmans. Elle représente l\'unité de la oummah musulmane.',
    history: 'La Mecque est un site sacré depuis l\'époque du Prophète Ibrahim (Abraham). La Kaaba a été construite par Ibrahim et son fils Ismail, et plus tard purifiée par le Prophète Muhammad ﷺ lorsqu\'il a conquis la ville.',
    practices: [
      'Pèlerinage du Hajj pendant le mois de Dhul-Hijjah',
      'Umrah (petit pèlerinage) tout au long de l\'année',
      'Tawaf (circumambulation) autour de la Kaaba',
      'Prière dans la Grande Mosquée',
      'Boire l\'eau du puits de Zamzam'
    ]
  },
  {
    id: 'medina',
    name: 'Médine',
    arabicName: 'المدينة المنورة',
    location: 'Arabie Saoudite',
    description: 'La ville du Prophète ﷺ, où il a établi la première communauté musulmane.',
    fullDescription: 'Médine, appelée à l\'origine Yathrib, est la deuxième ville la plus sainte de l\'Islam. Elle est devenue la ville du Prophète Muhammad ﷺ après l\'Hijra (migration) de La Mecque en 622. Ici, le Prophète ﷺ a établi la première communauté musulmane et est enterré dans la Mosquée du Prophète.',
    significance: 'Médine représente la mise en œuvre pratique des enseignements islamiques et l\'établissement de la oummah musulmane.',
    history: 'La ville a accueilli le Prophète Muhammad ﷺ et les premiers musulmans, leur offrant refuge et soutien. Elle est devenue la capitale du premier État islamique.',
    practices: [
      'Visite de la Mosquée du Prophète',
      'Prière dans la Rawdah (le jardin béni)',
      'Envoi de salutations au Prophète ﷺ',
      'Visite des sites historiques islamiques',
      'Étude de l\'histoire et des traditions islamiques'
    ]
  },
  {
    id: 'fez',
    name: 'Fès',
    arabicName: 'فاس',
    location: 'Maroc',
    description: 'La ville bénie où Shaykh Ahmad al-Tijāni a vécu et enseigné, centre de la spiritualité Tijāni.',
    fullDescription: 'Fès est l\'une des villes les plus importantes de l\'histoire Tijāni, car elle a été la demeure de Shaykh Ahmad al-Tijāni pendant la dernière partie de sa vie. La ville contient sa tombe bénie et reste un centre majeur d\'apprentissage et de spiritualité Tijāni.',
    significance: 'Fès est considérée comme la capitale spirituelle de l\'ordre Tijāni, où le fondateur a vécu, enseigné et est enterré.',
    history: 'Shaykh Ahmad al-Tijāni s\'est installé à Fès en 1798 et y a vécu jusqu\'à sa mort en 1815. La ville est devenue le centre de l\'enseignement et de l\'administration Tijāni.',
    practices: [
      'Visite de la tombe de Shaykh Ahmad al-Tijāni',
      'Étude dans les écoles islamiques traditionnelles',
      'Participation aux rassemblements et dhikr Tijāni',
      'Apprentissage auprès d\'enseignants Tijāni qualifiés',
      'Suivi des pratiques spirituelles établies par le Shaykh'
    ]
  },
  {
    id: 'kaolack',
    name: 'Kaolack (Medina Baye)',
    arabicName: 'كولخ - المدينة باي',
    location: 'Sénégal',
    description: 'Le centre du mouvement Faydah Tijāniyya, établi par Shaykh Ibrahim Niasse.',
    fullDescription: 'Kaolack, spécifiquement la zone connue sous le nom de Medina Baye, est le centre spirituel de la branche Faydah Tijāniyya de l\'ordre Tijāni. Elle a été établie par Shaykh Ibrahim Niasse et continue d\'être un centre majeur d\'apprentissage islamique et de spiritualité Tijāni.',
    significance: 'Medina Baye représente le renouveau moderne de la spiritualité Tijāni et attire des fidèles du monde entier.',
    history: 'Shaykh Ibrahim Niasse a établi Medina Baye comme centre d\'apprentissage et de spiritualité, affirmant être le Ghawth (pôle spirituel) de son temps.',
    practices: [
      'Visite de la tombe de Shaykh Ibrahim Niasse',
      'Participation aux célébrations annuelles du Mawlid',
      'Étude dans les instituts islamiques',
      'Participation aux rassemblements de dhikr et sessions spirituelles',
      'Apprentissage de la méthodologie Faydah'
    ]
  },
  {
    id: 'jerusalem',
    name: 'Jérusalem',
    arabicName: 'القدس الشريف',
    location: 'Palestine',
    description: 'La troisième ville la plus sainte de l\'Islam, site de la Mosquée Al-Aqsa et du Voyage Nocturne.',
    fullDescription: 'Jérusalem est la troisième ville la plus sainte de l\'Islam, abritant la Mosquée Al-Aqsa et le Dôme du Rocher. C\'était la destination du Voyage Nocturne (Isra) du Prophète Muhammad ﷺ et le point de départ de son Ascension (Mi\'raj) vers les cieux.',
    significance: 'Jérusalem revêt une importance particulière en tant que première qibla (direction de prière) et site du voyage nocturne miraculeux du Prophète ﷺ.',
    history: 'Jérusalem est sacrée pour les musulmans depuis les premiers jours de l\'Islam. La ville a été conquise par le deuxième Calife, Umar ibn al-Khattab, qui a traité ses habitants avec justice et respect.',
    practices: [
      'Prière dans la Mosquée Al-Aqsa',
      'Visite du Dôme du Rocher',
      'Commémoration du Voyage Nocturne et de l\'Ascension',
      'Prière pour la libération de la ville sainte',
      'Étude de l\'histoire de Jérusalem islamique'
    ]
  }
];

export const livingWordsData = [
  {
    id: 'prophet-knowledge',
    title: 'Chercher la Connaissance',
    speaker: 'Prophète Muhammad ﷺ',
    description: 'Le célèbre hadith sur la recherche de la connaissance du berceau à la tombe.',
    fullText: 'Cherchez la connaissance du berceau à la tombe.',
    arabicText: 'اطلبوا العلم من المهد إلى اللحد',
    context: 'Cette parole souligne l\'importance de l\'apprentissage tout au long de la vie dans l\'Islam. La connaissance n\'est pas seulement académique mais inclut la sagesse spirituelle, morale et pratique.',
    lessons: [
      'L\'apprentissage est un voyage qui dure toute la vie',
      'La connaissance rapproche d\'Allah',
      'L\'ignorance est l\'ennemie de la foi',
      'Chaque musulman a le devoir de chercher la connaissance',
      'La connaissance doit être appliquée dans la vie quotidienne'
    ]
  },
  {
    id: 'tijani-wird',
    title: 'Le Wird est Tout',
    speaker: 'Shaykh Ahmad al-Tijāni',
    description: 'L\'enseignement du Shaykh sur l\'importance suprême du wird Tijāni.',
    fullText: 'Notre wird vous suffit dans ce monde et dans l\'au-delà. Quiconque s\'y accroche ne sera jamais déçu.',
    context: 'Shaykh Ahmad al-Tijāni a souligné que le wird Tijāni contient toute la nourriture spirituelle dont un chercheur a besoin pour le succès mondain et éternel.',
    lessons: [
      'Le wird est une nourriture spirituelle complète',
      'La constance dans la pratique apporte le succès',
      'La confiance dans la méthode spirituelle est essentielle',
      'Le wird se connecte directement à la bénédiction prophétique',
      'Les pratiques spirituelles doivent être abordées avec confiance'
    ]
  },
  {
    id: 'ali-knowledge',
    title: 'Je suis la Cité de la Connaissance',
    speaker: 'Prophète Muhammad ﷺ à propos d\'Ali (ع)',
    description: 'La célèbre parole du Prophète ﷺ à propos d\'Ali étant la porte de la connaissance.',
    fullText: 'Je suis la cité de la connaissance et Ali en est la porte.',
    arabicText: 'أنا مدينة العلم وعلي بابها',
    context: 'Ce hadith souligne la relation spéciale entre le Prophète ﷺ et Ali (ع), et le rôle d\'Ali comme porte d\'accès à la connaissance prophétique.',
    lessons: [
      'La connaissance a des canaux appropriés de transmission',
      'La connaissance spirituelle nécessite une guidance appropriée',
      'Ali (ع) est une figure clé de la spiritualité islamique',
      'L\'importance des enseignants authentiques',
      'La connaissance et la spiritualité sont interconnectées'
    ]
  },
  {
    id: 'niasse-fayda',
    title: 'L\'Inondation Divine',
    speaker: 'Shaykh Ibrahim Niasse',
    description: 'Enseignement sur la Faydah (Inondation Divine) de connaissance spirituelle.',
    fullText: 'C\'est le temps de la Faydah, l\'inondation divine de connaissance spirituelle qui atteindra tous les coins de la terre.',
    context: 'Shaykh Ibrahim Niasse a enseigné que son époque marquait un déversement spécial de connaissance divine et d\'éveil spirituel.',
    lessons: [
      'La connaissance spirituelle vient par vagues',
      'La grâce divine a ses temps désignés',
      'L\'éveil spirituel peut être collectif',
      'L\'importance de reconnaître les opportunités spirituelles',
      'Accès universel à la connaissance divine'
    ]
  },
  {
    id: 'fatima-patience',
    title: 'La Patience vient de la Foi',
    speaker: 'Fatima az-Zahra (ع)',
    description: 'Enseignement sur la vertu de la patience dans les moments difficiles.',
    fullText: 'La patience face aux épreuves est un signe de foi véritable et rapproche d\'Allah.',
    context: 'Fatima (ع) a démontré une patience extraordinaire pendant sa vie, surtout après la mort de son père, le Prophète ﷺ.',
    lessons: [
      'La patience est une vertu fondamentale dans l\'Islam',
      'Les épreuves sont des opportunités de croissance spirituelle',
      'La foi est testée à travers les difficultés',
      'La patience apporte la récompense divine',
      'Les vrais croyants restent fermes dans l\'épreuve'
    ]
  },
  {
    id: 'hussein-dignity',
    title: 'Mort avec Dignité',
    speaker: 'Hussein ibn Ali (ع)',
    description: 'Les paroles célèbres sur le choix de la mort avec honneur plutôt que la vie dans l\'humiliation.',
    fullText: 'La mort dans la dignité est meilleure que la vie dans l\'humiliation.',
    arabicText: 'الموت في عز خير من الحياة في ذل',
    context: 'Ces paroles reflètent la position de Hussein (ع) à Karbala, où il a choisi de mourir plutôt que de se soumettre à l\'injustice et à la tyrannie.',
    lessons: [
      'Les principes sont plus importants que la vie elle-même',
      'Se dresser pour la vérité nécessite du courage',
      'La dignité ne peut être compromise',
      'Certaines choses valent la peine qu\'on meure pour elles',
      'La vraie victoire vient du sacrifice pour la vérité'
    ]
  },
  {
    id: 'prophet-character',
    title: 'Le Meilleur des Caractères',
    speaker: 'Prophète Muhammad ﷺ',
    description: 'L\'enseignement du Prophète sur l\'importance du bon caractère.',
    fullText: 'Je n\'ai été envoyé que pour parfaire les nobles caractères.',
    arabicText: 'إنما بعثت لأتمم مكارم الأخلاق',
    context: 'Le Prophète ﷺ a souligné que la mission principale de l\'Islam est de perfectionner le caractère moral de l\'humanité.',
    lessons: [
      'Le bon caractère est au cœur de l\'Islam',
      'La spiritualité doit se manifester dans le comportement',
      'Le perfectionnement du caractère est un objectif de toute une vie',
      'La religion sans bon caractère est vide',
      'Le meilleur croyant est celui qui a le meilleur caractère'
    ]
  }
];

// Helper function to get data by category
export const getDataByCategory = (categoryId: string) => {
  switch (categoryId) {
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

// Helper function to get category by id
export const getCategoryById = (categoryId: string) => {
  return categories.find(cat => cat.id === categoryId);
};

// Helper function to get item by id across all categories
export const getItemById = (itemId: string) => {
  const allData = [
    ...formulasData,
    ...mastersData,
    ...booksData,
    ...holyPlacesData,
    ...livingWordsData
  ];
  return allData.find(item => item.id === itemId);
};

// Search function across all data
// export const searchLibrary = (query: string) => {
//   const lowercaseQuery = query.toLowerCase();
//   const allData = [
//     ...formulasData.map(item => ({ ...item, type: 'formula' })),
//     ...mastersData.map(item => ({ ...item, type: 'master' })),
//     ...booksData.map(item => ({ ...item, type: 'book' })),
//     ...holyPlacesData.map(item => ({ ...item, type: 'place' })),
//     ...livingWordsData.map(item => ({ ...item, type: 'word' }))
//   ];

//   return allData.filter(item => {
//     const title = (item.title || item.name || '').toLowerCase();
//     const description = (item.description || '').toLowerCase();
//     const arabicTitle = (item.arabicTitle || item.arabicName || '').toLowerCase();
    
//     return title.includes(lowercaseQuery) || 
//            description.includes(lowercaseQuery) ||
//            arabicTitle.includes(lowercaseQuery);
//   });
// };