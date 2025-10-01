export interface AsmaAlHusnaItem {
  id: number;
  arabic: string;
  transliteration: string;
  english: string;
  french: string;
  verse: {
    arabic: string;
    english: string;
    french: string;
    reference: string;
  };
  meditation: {
    english: string;
    french: string;
  };
}

export const asmaAlHusna: AsmaAlHusnaItem[] = [
  {
    id: 1,
    arabic: "اللّٰه",
    transliteration: "Allah",
    english: "The Supreme Divine Reality",
    french: "La Réalité Divine Suprême",
    verse: {
      arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
      english: "Allah - there is no deity except Him, the Ever-Living, the Self-Sustaining",
      french: "Allah - il n'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même",
      reference: "Quran 2:255"
    },
    meditation: {
      english: "Contemplate the absolute Unity of Allah. Let your heart be filled with the recognition that there is no power, no will, no existence except through Allah.",
      french: "Contemplez l'Unité absolue d'Allah. Que votre cœur soit empli de la reconnaissance qu'il n'y a de pouvoir, de volonté, d'existence que par Allah."
    }
  },
  {
    id: 2,
    arabic: "الرَّحْمَٰن",
    transliteration: "Ar-Rahman",
    english: "The All-Radiant in Love",
    french: "Le Tout Rayonnant d'Amour",
    verse: {
      arabic: "الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ",
      english: "The All-Radiant in Love established Himself above the Throne",
      french: "Le Tout Rayonnant d'Amour s'est établi au-dessus du Trône",
      reference: "Quran 20:5"
    },
    meditation: {
      english: "Contemplate how Allah’s love shines upon every part of creation without distinction. His radiance of love always comes before His justice.",
      french: "Contemplez comment l’amour d’Allah rayonne sur toute la création sans distinction. Son éclat d’amour précède toujours Sa justice."
    }
  },
  {
    id: 3,
    arabic: "الرَّحِيم",
    transliteration: "Ar-Rahim",
    english: "The Especially Radiant in Love",
    french: "Le Très Rayonnant d'Amour",
    verse: {
      arabic: "وَهُوَ الْغَفُورُ الرَّحِيمُ",
      english: "And He is the Forgiving, the Especially Radiant in Love",
      french: "Et Il est le Pardonneur, le Très Rayonnant d'Amour",
      reference: "Quran 2:173"
    },
    meditation: {
      english: "Reflect on Allah’s tender love reserved for those who believe and draw near to Him. His radiance embraces hearts that strive in devotion.",
      french: "Réfléchissez à l’amour tendre d’Allah, réservé à ceux qui croient et s’approchent de Lui. Son éclat enveloppe les cœurs qui s’efforcent dans la dévotion."
    }
  },
  {
    id: 4,
    arabic: "الْمَلِك",
    transliteration: "Al-Malik",
    english: "The King",
    french: "Le Roi",
    verse: {
      arabic: "فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ",
      english: "So high [above all] is Allah, the sovereign, the truth",
      french: "Que soit donc exalté Allah, le vrai Souverain !",
      reference: "Quran 20:114"
    },
    meditation: {
      english: "Contemplate Allah as the ultimate King whose sovereignty is absolute. Unlike earthly rulers, His kingdom is eternal.",
      french: "Contemplez Allah comme le Roi ultime dont la souveraineté est absolue. Contrairement aux dirigeants terrestres, Son royaume est éternel."
    }
  },
  {
    id: 5,
    arabic: "الْقُدُّوس",
    transliteration: "Al-Quddus",
    english: "The Most Sacred",
    french: "Le Très-Saint",
    verse: {
      arabic: "يُسَبِّحُ لِلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ الْمَلِكِ الْقُدُّوسِ",
      english: "Whatever is in the heavens and whatever is on the earth exalts Allah, the Sovereign, the Holy",
      french: "Tout ce qui est dans les cieux et tout ce qui est sur la terre exalte Allah, le Souverain, le Saint",
      reference: "Quran 62:1"
    },
    meditation: {
      english: "Reflect on Allah's absolute purity and holiness. He is free from all imperfections, faults, and limitations.",
      french: "Réfléchissez à la pureté et à la sainteté absolues d'Allah. Il est exempt de toute imperfection, défaut et limitation."
    }
  },
  {
    id: 6,
    arabic: "السَّلاَم",
    transliteration: "As-Salam",
    english: "The Source of Peace",
    french: "La Source de Paix",
    verse: {
      arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ",
      english: "He is Allah, other than whom there is no deity, the Sovereign, the Pure, the Perfection",
      french: "Il est Allah. Nulle divinité autre que Lui ; Le Souverain, le Pur, L'Apaisant",
      reference: "Quran 59:23"
    },
    meditation: {
      english: "Meditate on Allah as the ultimate source of all peace and tranquility. In His presence, all anxiety dissolves.",
      french: "Méditez sur Allah comme la source ultime de toute paix et tranquillité. En Sa présence, toute anxiété se dissipe."
    }
  },
  {
    id: 7,
    arabic: "الْمُؤْمِن",
    transliteration: "Al-Mu'min",
    english: "The Guardian of Faith",
    french: "Le Gardien de la Foi",
    verse: {
      arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ",
      english: "He is Allah, other than whom there is no deity, the Sovereign, the Pure, the Perfection, the Bestower of Faith",
      french: "Il est Allah. Nulle divinité autre que Lui ; Le Souverain, le Pur, L'Apaisant, Le Rassurant",
      reference: "Quran 59:23"
    },
    meditation: {
      english: "Contemplate Allah as the one who grants and protects faith. He is the source of security and trust.",
      french: "Contemplez Allah comme celui qui accorde et protège la foi. Il est la source de sécurité et de confiance."
    }
  },
  {
    id: 8,
    arabic: "الْمُهَيْمِن",
    transliteration: "Al-Muhaymin",
    english: "The Guardian",
    french: "Le Gardien Vigilant",
    verse: {
      arabic: "وَمُهَيْمِنًا عَلَيْهِ",
      english: "And guardian over it",
      french: "Et gardien vigilant sur lui",
      reference: "Quran 5:48"
    },
    meditation: {
      english: "Reflect on Allah's constant watchfulness over all creation. Nothing escapes His attention.",
      french: "Réfléchissez à la vigilance constante d'Allah sur toute la création. Rien n'échappe à Son attention."
    }
  },
  {
    id: 9,
    arabic: "الْعَزِيز",
    transliteration: "Al-Aziz",
    english: "The Mighty",
    french: "Le Puissant",
    verse: {
      arabic: "وَهُوَ الْعَزِيزُ الْحَكِيمُ",
      english: "And He is the Exalted in Might, the Wise",
      french: "Et Il est le Puissant, le Sage",
      reference: "Quran 2:260"
    },
    meditation: {
      english: "Meditate on Allah's invincible might and power. No force in creation can overcome Him.",
      french: "Méditez sur la puissance et le pouvoir invincibles d'Allah. Aucune force dans la création ne peut Le surpasser."
    }
  },
  {
    id: 10,
    arabic: "الْجَبَّار",
    transliteration: "Al-Jabbar",
    english: "The Compeller",
    french: "Le Contraignant",
    verse: {
      arabic: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ",
      english: "He is Allah, the Creator, the Inventor, the Fashioner",
      french: "Il est Allah, le Créateur, Celui qui donne un commencement à toute chose, le Formateur",
      reference: "Quran 59:24"
    },
    meditation: {
      english: "Contemplate Allah's irresistible will. He mends what is broken and sets right what is wrong.",
      french: "Contemplez la volonté irrésistible d'Allah. Il répare ce qui est brisé et redresse ce qui est faux."
    }
  },
  {
    id: 11,
    arabic: "الْمُتَكَبِّر",
    transliteration: "Al-Mutakabbir",
    english: "The Supreme",
    french: "Le Suprême",
    verse: {
      arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ",
      english: "He is Allah, other than whom there is no deity, the Sovereign, the Pure, the Perfection, the Bestower of Faith, the Overseer, the Exalted in Might, the Compeller, the Superior",
      french: "Il est Allah. Nulle divinité autre que Lui ; Le Souverain, le Pur, L'Apaisant, Le Rassurant, Le Prédominant, Le Puissant, Le Contraignant, L'Orgueilleux",
      reference: "Quran 59:23"
    },
    meditation: {
      english: "Reflect on Allah's supreme greatness above all creation. His pride is justified and perfect, unlike human arrogance.",
      french: "Réfléchissez à la grandeur suprême d'Allah au-dessus de toute la création. Sa fierté est justifiée et parfaite, contrairement à l'arrogance humaine."
    }
  },
  {
    id: 12,
    arabic: "الْخَالِق",
    transliteration: "Al-Khaliq",
    english: "The Creator",
    french: "Le Créateur",
    verse: {
      arabic: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ",
      english: "He is Allah, the Creator, the Inventor, the Fashioner",
      french: "Il est Allah, le Créateur, Celui qui donne un commencement à toute chose, le Formateur",
      reference: "Quran 59:24"
    },
    meditation: {
      english: "Marvel at Allah's infinite creativity. Every atom, every star, every soul is His unique creation.",
      french: "Émerveillez-vous de la créativité infinie d'Allah. Chaque atome, chaque étoile, chaque âme est Sa création unique."
    }
  },
  {
    id: 13,
    arabic: "الْبَارِئ",
    transliteration: "Al-Bari",
    english: "The Inventor",
    french: "Celui qui donne un commencement",
    verse: {
      arabic: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ",
      english: "He is Allah, the Creator, the Inventor, the Fashioner",
      french: "Il est Allah, le Créateur, Celui qui donne un commencement à toute chose, le Formateur",
      reference: "Quran 59:24"
    },
    meditation: {
      english: "Contemplate Allah as the one who brings forth existence from nothingness. He creates without model or precedent.",
      french: "Contemplez Allah comme celui qui fait surgir l'existence du néant. Il crée sans modèle ni précédent."
    }
  },
  {
    id: 14,
    arabic: "الْمُصَوِّر",
    transliteration: "Al-Musawwir",
    english: "The Fashioner",
    french: "Le Formateur",
    verse: {
      arabic: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ",
      english: "He is Allah, the Creator, the Inventor, the Fashioner",
      french: "Il est Allah, le Créateur, Celui qui donne un commencement à toute chose, le Formateur",
      reference: "Quran 59:24"
    },
    meditation: {
      english: "Reflect on Allah's perfect artistry in shaping all forms. Every face, every flower, every fingerprint bears His artistic touch.",
      french: "Réfléchissez à l'art parfait d'Allah dans la formation de toutes les formes. Chaque visage, chaque fleur, chaque empreinte porte Sa touche artistique."
    }
  },
  {
    id: 15,
    arabic: "الْغَفَّار",
    transliteration: "Al-Ghaffar",
    english: "The Repeatedly Forgiving",
    french: "Celui qui pardonne sans cesse",
    verse: {
      arabic: "وَإِنِّي لَغَفَّارٌ لِّمَن تَابَ وَآمَنَ وَعَمِلَ صَالِحًا ثُمَّ اهْتَدَىٰ",
      english: "But indeed, I am the Perpetual Forgiver of whoever repents and believes and does righteousness and then continues in guidance",
      french: "Et Je suis Grand Pardonneur à celui qui se repent, croit, fait bonne œuvre, puis se met sur le bon chemin",
      reference: "Quran 20:82"
    },
    meditation: {
      english: "Find hope in Allah's endless forgiveness. No matter how many times you fall, His mercy is always there for the repentant.",
      french: "Trouvez l'espoir dans le pardon infini d'Allah. Peu importe combien de fois vous tombez, Sa miséricorde est toujours là pour le repentant."
    }
  },
  {
    id: 16,
    arabic: "الْقَهَّار",
    transliteration: "Al-Qahhar",
    english: "The Subduer",
    french: "Le Dominateur suprême",
    verse: {
      arabic: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ وَتَنزِعُ الْمُلْكَ مِمَّن تَشَاءُ",
      english: "Say, 'O Allah, Owner of Sovereignty, You give sovereignty to whom You will and You take sovereignty away from whom You will'",
      french: "Dis : « Ô Allah, Maître de l'autorité absolue. Tu donnes l'autorité à qui Tu veux, et Tu arraches l'autorité à qui Tu veux »",
      reference: "Quran 3:26"
    },
    meditation: {
      english: "Recognize Allah's absolute dominance over all affairs. Nothing happens in His creation without His permission.",
      french: "Reconnaissez la domination absolue d'Allah sur toutes les affaires. Rien ne se passe dans Sa création sans Sa permission."
    }
  },
  {
    id: 17,
    arabic: "الْوَهَّاب",
    transliteration: "Al-Wahhab",
    english: "The Giver of All",
    french: "Le Donateur",
    verse: {
      arabic: "أَمْ عِندَهُمْ خَزَائِنُ رَحْمَةِ رَبِّكَ الْعَزِيزِ الْوَهَّابِ",
      english: "Or do they have the depositories of the mercy of your Lord, the Exalted in Might, the Bestower?",
      french: "Possèdent-ils les trésors de la miséricorde de ton Seigneur, le Puissant, le Grand Donateur ?",
      reference: "Quran 38:9"
    },
    meditation: {
      english: "Contemplate Allah's endless generosity. Every blessing in your life is a gift from His infinite treasuries.",
      french: "Contemplez la générosité infinie d'Allah. Chaque bénédiction dans votre vie est un don de Ses trésors infinis."
    }
  },
  {
    id: 18,
    arabic: "الرَّزَّاق",
    transliteration: "Ar-Razzaq",
    english: "The Sustainer",
    french: "Celui qui accorde la subsistance",
    verse: {
      arabic: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ",
      english: "Indeed, it is Allah who is the [continual] Provider, the firm possessor of strength",
      french: "En vérité, c'est Allah qui est le Grand Pourvoyeur, Le Détenteur de la force, l'Inébranlable",
      reference: "Quran 51:58"
    },
    meditation: {
      english: "Trust in Allah's provision. He feeds the birds in the sky and the fish in the sea - He will not forget you.",
      french: "Faites confiance à la provision d'Allah. Il nourrit les oiseaux du ciel et les poissons de la mer - Il ne vous oubliera pas."
    }
  },
  {
    id: 19,
    arabic: "الْفَتَّاح",
    transliteration: "Al-Fattah",
    english: "The Opener",
    french: "Celui qui ouvre",
    verse: {
      arabic: "وَهُوَ الْفَتَّاحُ الْعَلِيمُ",
      english: "And He is the Opener, the Knowing",
      french: "Et c'est Lui l'Ouvreur et l'Omniscient",
      reference: "Quran 34:26"
    },
    meditation: {
      english: "Seek Allah's help to open closed doors in your life. He opens hearts, minds, and paths that seem impossible.",
      french: "Demandez l'aide d'Allah pour ouvrir les portes fermées de votre vie. Il ouvre les cœurs, les esprits et les chemins qui semblent impossibles."
    }
  },
  {
    id: 20,
    arabic: "الْعَلِيم",
    transliteration: "Al-Alim",
    english: "The Knower of All",
    french: "L'Omniscient",
    verse: {
      arabic: "وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ",
      english: "And Allah is Knowing of all things",
      french: "Et Allah est Omniscient",
      reference: "Quran 2:282"
    },
    meditation: {
      english: "Find comfort in Allah's perfect knowledge. He knows your struggles, your hopes, and what's best for you.",
      french: "Trouvez du réconfort dans la connaissance parfaite d'Allah. Il connaît vos luttes, vos espoirs et ce qui est le mieux pour vous."
    }
  },
  {
    id: 21,
    arabic: "الْقَابِض",
    transliteration: "Al-Qabid",
    english: "The Constrictor",
    french: "Celui qui restreint",
    verse: {
      arabic: "وَاللَّهُ يَقْبِضُ وَيَبْسُطُ",
      english: "And Allah restricts and extends",
      french: "Allah restreint et étend",
      reference: "Quran 2:245"
    },
    meditation: {
      english: "Accept Allah's wisdom in times of restriction. Sometimes He withholds to protect and guide us to something better.",
      french: "Acceptez la sagesse d'Allah dans les moments de restriction. Parfois Il retient pour protéger et nous guider vers quelque chose de meilleur."
    }
  },
  {
    id: 22,
    arabic: "الْبَاسِط",
    transliteration: "Al-Basit",
    english: "The Reliever",
    french: "Celui qui étend",
    verse: {
      arabic: "وَاللَّهُ يَقْبِضُ وَيَبْسُطُ",
      english: "And Allah restricts and extends",
      french: "Allah restreint et étend",
      reference: "Quran 2:245"
    },
    meditation: {
      english: "Rejoice in Allah's expansion of blessings. He extends His mercy, provision, and relief when the time is right.",
      french: "Réjouissez-vous de l'expansion des bénédictions d'Allah. Il étend Sa miséricorde, Sa provision et Son soulagement quand le moment est venu."
    }
  },
  {
    id: 23,
    arabic: "الْخَافِض",
    transliteration: "Al-Khafid",
    english: "The Abaser",
    french: "Celui qui abaisse",
    verse: {
      arabic: "يَرْفَعُ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
      english: "Allah will raise those who have believed among you and those who were given knowledge, by degrees",
      french: "Allah élèvera en degrés ceux d'entre vous qui auront cru et ceux qui auront reçu le savoir",
      reference: "Quran 58:11"
    },
    meditation: {
      english: "Humble yourself before Allah's power to abase. True honor comes only from Him, not from worldly status.",
      french: "Humiliez-vous devant le pouvoir d'Allah d'abaisser. Le vrai honneur ne vient que de Lui, pas du statut mondain."
    }
  },
  {
    id: 24,
    arabic: "الرَّافِع",
    transliteration: "Ar-Rafi",
    english: "The Exalter",
    french: "Celui qui élève",
    verse: {
      arabic: "يَرْفَعُ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
      english: "Allah will raise those who have believed among you and those who were given knowledge, by degrees",
      french: "Allah élèvera en degrés ceux d'entre vous qui auront cru et ceux qui auront reçu le savoir",
      reference: "Quran 58:11"
    },
    meditation: {
      english: "Seek elevation through righteousness and knowledge. Allah raises those who humble themselves before Him.",
      french: "Cherchez l'élévation par la droiture et la connaissance. Allah élève ceux qui s'humilient devant Lui."
    }
  },
  {
    id: 25,
    arabic: "الْمُعِزّ",
    transliteration: "Al-Muizz",
    english: "The Bestower of Honors",
    french: "Celui qui donne la puissance",
    verse: {
      arabic: "تُعِزُّ مَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ",
      english: "You honor whom You will and You humble whom You will",
      french: "Tu donnes la puissance à qui Tu veux, et Tu humilies qui Tu veux",
      reference: "Quran 3:26"
    },
    meditation: {
      english: "Seek honor through serving Allah. True dignity comes from being honored by the Most High.",
      french: "Cherchez l'honneur en servant Allah. La vraie dignité vient d'être honoré par le Très-Haut."
    }
  },
  {
    id: 26,
    arabic: "الْمُذِلّ",
    transliteration: "Al-Mudhill",
    english: "The Humiliator",
    french: "Celui qui humilie",
    verse: {
      arabic: "تُعِزُّ مَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ",
      english: "You honor whom You will and You humble whom You will",
      french: "Tu donnes la puissance à qui Tu veux, et Tu humilies qui Tu veux",
      reference: "Quran 3:26"
    },
    meditation: {
      english: "Be mindful of Allah's power to humble the arrogant. Stay humble to avoid the humiliation that comes from pride.",
      french: "Soyez conscient du pouvoir d'Allah d'humilier les arrogants. Restez humble pour éviter l'humiliation qui vient de l'orgueil."
    }
  },
  {
    id: 27,
    arabic: "السَّمِيع",
    transliteration: "As-Sami",
    english: "The Hearer of All",
    french: "Celui qui entend tout",
    verse: {
      arabic: "وَاللَّهُ سَمِيعٌ عَلِيمٌ",
      english: "And Allah is Hearing and Knowing",
      french: "Et Allah entend tout et sait tout",
      reference: "Quran 2:137"
    },
    meditation: {
      english: "Speak to Allah knowing He hears every word, every whisper, every thought. Your prayers never go unheard.",
      french: "Parlez à Allah en sachant qu'Il entend chaque mot, chaque murmure, chaque pensée. Vos prières ne passent jamais inaperçues."
    }
  },
  {
    id: 28,
    arabic: "الْبَصِير",
    transliteration: "Al-Basir",
    english: "The Seer of All",
    french: "Celui qui voit tout",
    verse: {
      arabic: "وَاللَّهُ بَصِيرٌ بِمَا تَعْمَلُونَ",
      english: "And Allah is Seeing of what you do",
      french: "Et Allah voit parfaitement ce que vous faites",
      reference: "Quran 2:96"
    },
    meditation: {
      english: "Live knowing that Allah sees all your actions, intentions, and hidden struggles. Find comfort in His watchful care.",
      french: "Vivez en sachant qu'Allah voit toutes vos actions, intentions et luttes cachées. Trouvez du réconfort dans Sa surveillance bienveillante."
    }
  },
  {
    id: 29,
    arabic: "الْحَكَم",
    transliteration: "Al-Hakam",
    english: "The Judge",
    french: "Le Juge",
    verse: {
      arabic: "أَفَغَيْرَ اللَّهِ أَبْتَغِي حَكَمًا",
      english: "Then is it other than Allah I should seek as judge?",
      french: "Est-ce donc un autre qu'Allah que je prendrai pour juge ?",
      reference: "Quran 6:114"
    },
    meditation: {
      english: "Trust in Allah's perfect judgment. His decisions are always just and wise, even when we don't understand them.",
      french: "Faites confiance au jugement parfait d'Allah. Ses décisions sont toujours justes et sages, même quand nous ne les comprenons pas."
    }
  },
  {
    id: 30,
    arabic: "الْعَدْل",
    transliteration: "Al-Adl",
    english: "The Just",
    french: "Le Juste",
    verse: {
      arabic: "وَتَمَّتْ كَلِمَتُ رَبِّكَ صِدْقًا وَعَدْلًا",
      english: "And the word of your Lord has been fulfilled in truth and in justice",
      french: "Et la parole de ton Seigneur s'est accomplie en toute vérité et équité",
      reference: "Quran 6:115"
    },
    meditation: {
      english: "Find peace in Allah's absolute justice. He wrongs no one and will reward every good deed.",
      french: "Trouvez la paix dans la justice absolue d'Allah. Il ne fait de tort à personne et récompensera chaque bonne action."
    }
  },
  {
    id: 31,
    arabic: "اللَّطِيف",
    transliteration: "Al-Latif",
    english: "The Subtle One",
    french: "Le Bienveillant",
    verse: {
      arabic: "اللَّهُ لَطِيفٌ بِعِبَادِهِ",
      english: "Allah is kind to His servants",
      french: "Allah est Bienveillant envers Ses serviteurs",
      reference: "Quran 42:19"
    },
    meditation: {
      english: "Marvel at Allah's gentle kindness. He works in subtle ways to bring about what's best for you.",
      french: "Émerveillez-vous de la douce bonté d'Allah. Il agit de manière subtile pour apporter ce qui est le mieux pour vous."
    }
  },
  {
    id: 32,
    arabic: "الْخَبِير",
    transliteration: "Al-Khabir",
    english: "The All-Aware",
    french: "Le Parfaitement Connaisseur",
    verse: {
      arabic: "وَاللَّهُ خَبِيرٌ بِمَا تَعْمَلُونَ",
      english: "And Allah is Acquainted with what you do",
      french: "Et Allah est Parfaitement Connaisseur de ce que vous faites",
      reference: "Quran 9:16"
    },
    meditation: {
      english: "Take comfort that Allah is aware of your every circumstance, need, and struggle. Nothing escapes His knowledge.",
      french: "Réconfortez-vous qu'Allah connaît chacune de vos circonstances, besoins et luttes. Rien n'échappe à Sa connaissance."
    }
  },
  {
    id: 33,
    arabic: "الْحَلِيم",
    transliteration: "Al-Halim",
    english: "The Forbearing",
    french: "Le Longanime",
    verse: {
      arabic: "وَاللَّهُ غَفُورٌ حَلِيمٌ",
      english: "And Allah is Forgiving and Forbearing",
      french: "Et Allah est Pardonneur et Longanime",
      reference: "Quran 2:225"
    },
    meditation: {
      english: "Be grateful for Allah's patience with your shortcomings. He gives you time to repent and improve.",
      french: "Soyez reconnaissant pour la patience d'Allah face à vos défauts. Il vous donne le temps de vous repentir et de vous améliorer."
    }
  },
  {
    id: 34,
    arabic: "الْعَظِيم",
    transliteration: "Al-Azim",
    english: "The Magnificent",
    french: "L'Immense",
    verse: {
      arabic: "وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      english: "And He is the Most High, the Great",
      french: "Et Il est le Très-Haut, l'Immense",
      reference: "Quran 2:255"
    },
    meditation: {
      english: "Contemplate Allah's infinite magnificence. His greatness encompasses all of creation and beyond.",
      french: "Contemplez la magnificence infinie d'Allah. Sa grandeur englobe toute la création et au-delà."
    }
  },
  {
    id: 35,
    arabic: "الْغَفُور",
    transliteration: "Al-Ghafur",
    english: "The Forgiving",
    french: "Le Pardonneur",
    verse: {
      arabic: "وَاللَّهُ غَفُورٌ رَّحِيمٌ",
      english: "And Allah is Forgiving and Merciful",
      french: "Et Allah est Pardonneur et Miséricordieux",
      reference: "Quran 2:173"
    },
    meditation: {
      english: "Never despair of Allah's forgiveness. His mercy encompasses all sins for those who sincerely repent.",
      french: "Ne désespérez jamais du pardon d'Allah. Sa miséricorde englobe tous les péchés pour ceux qui se repentent sincèrement."
    }
  },
  {
    id: 36,
    arabic: "الشَّكُور",
    transliteration: "Ash-Shakur",
    english: "The Recognizer and Rewarder of Good",
    french: "Le Reconnaissant",
    verse: {
      arabic: "إِنَّهُ غَفُورٌ شَكُورٌ",
      english: "Indeed, He is Forgiving and Appreciative",
      french: "Il est certes Pardonneur et Reconnaissant",
      reference: "Quran 35:30"
    },
    meditation: {
      english: "Be encouraged that Allah appreciates and multiplies your good deeds, no matter how small.",
      french: "Soyez encouragé qu'Allah apprécie et multiplie vos bonnes actions, si petites soient-elles."
    }
  },
  {
    id: 37,
    arabic: "الْعَلِيّ",
    transliteration: "Al-Ali",
    english: "The Most High",
    french: "Le Très-Haut",
    verse: {
      arabic: "وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      english: "And He is the Most High, the Great",
      french: "Et Il est le Très-Haut, l'Immense",
      reference: "Quran 2:255"
    },
    meditation: {
      english: "Look up to Allah's supreme position above all creation. Turn to Him when you need elevation from worldly concerns.",
      french: "Regardez vers la position suprême d'Allah au-dessus de toute la création. Tournez-vous vers Lui quand vous avez besoin d'élévation des préoccupations mondaines."
    }
  },
  {
    id: 38,
    arabic: "الْكَبِير",
    transliteration: "Al-Kabir",
    english: "The Greatest",
    french: "Le Grand",
    verse: {
      arabic: "ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ وَأَنَّ مَا يَدْعُونَ مِن دُونِهِ هُوَ الْبَاطِلُ وَأَنَّ اللَّهَ هُوَ الْعَلِيُّ الْكَبِيرُ",
      english: "That is because Allah is the Truth, and that which they call upon other than Him is falsehood, and because Allah is the Most High, the Grand",
      french: "C'est ainsi qu'Allah est Lui le Vrai, alors que ce qu'ils invoquent en dehors de Lui est le faux ; c'est Allah qui est le Sublime, le Grand",
      reference: "Quran 22:62"
    },
    meditation: {
      english: "Remember Allah's supreme greatness when faced with any challenge. Nothing is greater than Him.",
      french: "Souvenez-vous de la grandeur suprême d'Allah face à tout défi. Rien n'est plus grand que Lui."
    }
  },
  {
    id: 39,
    arabic: "الْحَفِيظ",
    transliteration: "Al-Hafiz",
    english: "The Preserver",
    french: "Le Gardien",
    verse: {
      arabic: "وَرَبُّكَ عَلَىٰ كُلِّ شَيْءٍ حَفِيظٌ",
      english: "And your Lord is, over all things, Guardian",
      french: "Et ton Seigneur prend soin de toute chose",
      reference: "Quran 11:57"
    },
    meditation: {
      english: "Rest in the security of Allah's perfect preservation. He guards your faith, your soul, and your wellbeing.",
      french: "Reposez-vous dans la sécurité de la préservation parfaite d'Allah. Il garde votre foi, votre âme et votre bien-être."
    }
  },
  {
    id: 40,
    arabic: "الْمُقيِت",
    transliteration: "Al-Muqit",
    english: "The Nourisher",
    french: "Celui qui nourrit",
    verse: {
      arabic: "وَكَانَ اللَّهُ عَلَىٰ كُلِّ شَيْءٍ مُّقِيتًا",
      english: "And ever is Allah, over all things, a Keeper of careful account",
      french: "Et Allah a toujours été Gardien de toute chose",
      reference: "Quran 4:85"
    },
    meditation: {
      english: "Trust that Allah nourishes your body, mind, and spirit with exactly what you need for growth.",
      french: "Ayez confiance qu'Allah nourrit votre corps, votre esprit et votre âme avec exactement ce dont vous avez besoin pour grandir."
    }
  },
  {
    id: 41,
    arabic: "الْحسِيب",
    transliteration: "Al-Hasib",
    english: "The Accounter",
    french: "Celui qui suffit pour régler les comptes",
    verse: {
      arabic: "وَكَفَىٰ بِاللَّهِ حَسِيبًا",
      english: "And sufficient is Allah as Accountant",
      french: "Allah suffit pour régler les comptes",
      reference: "Quran 4:6"
    },
    meditation: {
      english: "Know that Allah keeps perfect account of all deeds. This should inspire both hope for reward and care in actions.",
      french: "Sachez qu'Allah tient un compte parfait de toutes les actions. Cela devrait inspirer à la fois l'espoir de récompense et la prudence dans les actions."
    }
  },
  {
    id: 42,
    arabic: "الْجَلِيل",
    transliteration: "Al-Jalil",
    english: "The Mighty",
    french: "Le Majestueux",
    verse: {
      arabic: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ",
      english: "And there will remain the Face of your Lord, Owner of Majesty and Honor",
      french: "Seule subsistera La Face de ton Seigneur, plein de majesté et de noblesse",
      reference: "Quran 55:27"
    },
    meditation: {
      english: "Stand in awe of Allah's majestic presence. His majesty inspires both reverence and love.",
      french: "Restez émerveillé devant la présence majestueuse d'Allah. Sa majesté inspire à la fois la révérence et l'amour."
    }
  },
  {
    id: 43,
    arabic: "الْكَرِيم",
    transliteration: "Al-Karim",
    english: "The Generous",
    french: "Le Généreux",
    verse: {
      arabic: "اقْرَأْ وَرَبُّكَ الْأَكْرَمُ",
      english: "Recite, and your Lord is the most Generous",
      french: "Lis ! Ton Seigneur est le Très Noble",
      reference: "Quran 96:3"
    },
    meditation: {
      english: "Appreciate Allah's boundless generosity. He gives without being asked and more than what is deserved.",
      french: "Appréciez la générosité sans limites d'Allah. Il donne sans qu'on Lui demande et plus que ce qui est mérité."
    }
  },
  {
    id: 44,
    arabic: "الرَّقِيب",
    transliteration: "Ar-Raqib",
    english: "The Watchful One",
    french: "Le Vigilant",
    verse: {
      arabic: "وَاللَّهُ عَلَىٰ كُلِّ شَيْءٍ رَّقِيبٌ",
      english: "And Allah is, over all things, an Observer",
      french: "Et Allah observe toute chose",
      reference: "Quran 5:117"
    },
    meditation: {
      english: "Live with consciousness that Allah is always watching. Let this awareness guide you to righteousness.",
      french: "Vivez avec la conscience qu'Allah regarde toujours. Que cette conscience vous guide vers la droiture."
    }
  },
  {
    id: 45,
    arabic: "الْمُجِيب",
    transliteration: "Al-Mujib",
    english: "The Responder to Prayer",
    french: "Celui qui répond",
    verse: {
      arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
      english: "And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me",
      french: "Et quand Mes serviteurs t'interrogent sur Moi.. alors Je suis tout proche : Je réponds à l'appel de celui qui Me prie quand il Me prie",
      reference: "Quran 2:186"
    },
    meditation: {
      english: "Call upon Allah with certainty that He hears and responds. His response may not always be what you expect, but it's always what's best.",
      french: "Invoquez Allah avec la certitude qu'Il entend et répond. Sa réponse n'est peut-être pas toujours ce que vous attendez, mais c'est toujours ce qu'il y a de mieux."
    }
  },
  {
    id: 46,
    arabic: "الْوَاسِع",
    transliteration: "Al-Wasi",
    english: "The All-Encompassing",
    french: "L'Immense",
    verse: {
      arabic: "وَاللَّهُ وَاسِعٌ عَلِيمٌ",
      english: "And Allah is all-Encompassing and Knowing",
      french: "Allah est Immense et Omniscient",
      reference: "Quran 2:247"
    },
    meditation: {
      english: "Marvel at how Allah's mercy, knowledge, and power encompass everything. There are no limits to His attributes.",
      french: "Émerveillez-vous de comment la miséricorde, la connaissance et le pouvoir d'Allah englobent tout. Il n'y a pas de limites à Ses attributs."
    }
  },
  {
    id: 47,
    arabic: "الْحَكِيم",
    transliteration: "Al-Hakim",
    english: "The Perfectly Wise",
    french: "Le Sage",
    verse: {
      arabic: "وَاللَّهُ عَزِيزٌ حَكِيمٌ",
      english: "And Allah is Exalted in Might and Wise",
      french: "Et Allah est Puissant et Sage",
      reference: "Quran 3:62"
    },
    meditation: {
      english: "Trust in Allah's perfect wisdom behind every decree. What seems difficult now may be a blessing in disguise.",
      french: "Faites confiance à la sagesse parfaite d'Allah derrière chaque décret. Ce qui semble difficile maintenant peut être une bénédiction déguisée."
    }
  },
  {
    id: 48,
    arabic: "الْوَدُود",
    transliteration: "Al-Wadud",
    english: "The Loving One",
    french: "Le Bien-Aimant",
    verse: {
      arabic: "وَهُوَ الْغَفُورُ الْوَدُودُ",
      english: "And He is the Forgiving, the Affectionate",
      french: "Et c'est Lui le Pardonneur, le Bien-Aimant",
      reference: "Quran 85:14"
    },
    meditation: {
      english: "Feel Allah's infinite love for you. His love is more tender than a mother's love for her child.",
      french: "Ressentez l'amour infini d'Allah pour vous. Son amour est plus tendre que l'amour d'une mère pour son enfant."
    }
  },
  {
    id: 49,
    arabic: "الْمَجِيد",
    transliteration: "Al-Majid",
    english: "The Majestic One",
    french: "Le Glorieux",
    verse: {
      arabic: "ذُو الْعَرْشِ الْمَجِيدُ",
      english: "Honorable Owner of the Throne",
      french: "Le Maître du Trône, le Glorieux",
      reference: "Quran 85:15"
    },
    meditation: {
      english: "Contemplate Allah's absolute glory and honor. His majesty fills the heavens and the earth.",
      french: "Contemplez la gloire et l'honneur absolus d'Allah. Sa majesté remplit les cieux et la terre."
    }
  },
  {
    id: 50,
    arabic: "الْبَاعِث",
    transliteration: "Al-Ba'ith",
    english: "The Resurrector",
    french: "Celui qui ressuscite",
    verse: {
      arabic: "ثُمَّ بَعَثْنَاهُم لِّنَعْلَمَ أَيُّ الْحِزْبَيْنِ أَحْصَىٰ لِمَا لَبِثُوا أَمَدًا",
      english: "Then We awakened them that We might test which of the two factions was most precise in calculating what [extent] they had remained in time",
      french: "Puis Nous les avons ressuscités, afin de savoir lequel des deux groupes saurait le mieux calculer la durée exacte de leur séjour",
      reference: "Quran 18:12"
    },
    meditation: {
      english: "Remember that Allah will resurrect all for judgment. Live as if you will stand before Him tomorrow.",
      french: "Souvenez-vous qu'Allah ressuscitera tous pour le jugement. Vivez comme si vous deviez comparaître devant Lui demain."
    }
  },
  {
    id: 51,
    arabic: "الشَّهِيد",
    transliteration: "Ash-Shahid",
    english: "The Witness",
    french: "Le Témoin",
    verse: {
      arabic: "وَاللَّهُ عَلَىٰ كُلِّ شَيْءٍ شَهِيدٌ",
      english: "And Allah is, over all things, Witness",
      french: "Et Allah est témoin de toute chose",
      reference: "Quran 58:6"
    },
    meditation: {
      english: "Know that Allah witnesses all your struggles, efforts, and intentions. Nothing you do in His path goes unseen.",
      french: "Sachez qu'Allah témoigne de toutes vos luttes, efforts et intentions. Rien de ce que vous faites sur Son chemin ne passe inaperçu."
    }
  },
  {
    id: 52,
    arabic: "الْحَقّ",
    transliteration: "Al-Haqq",
    english: "The Truth",
    french: "La Vérité",
    verse: {
      arabic: "فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ",
      english: "So high [above all] is Allah, the sovereign, the truth",
      french: "Que soit donc exalté Allah, le vrai Souverain !",
      reference: "Quran 20:114"
    },
    meditation: {
      english: "Seek Allah as the source of all truth. In a world of confusion, He is the ultimate reality.",
      french: "Cherchez Allah comme la source de toute vérité. Dans un monde de confusion, Il est la réalité ultime."
    }
  },
  {
    id: 53,
    arabic: "الْوَكِيل",
    transliteration: "Al-Wakil",
    english: "The Trustee",
    french: "Le Gérant",
    verse: {
      arabic: "وَكَفَىٰ بِاللَّهِ وَكِيلًا",
      english: "And sufficient is Allah as Disposer of affairs",
      french: "Et Allah suffit comme gérant",
      reference: "Quran 4:81"
    },
    meditation: {
      english: "Entrust all your affairs to Allah. He is the best manager of your life's circumstances.",
      french: "Confiez toutes vos affaires à Allah. Il est le meilleur gestionnaire des circonstances de votre vie."
    }
  },
  {
    id: 54,
    arabic: "الْقَوِيّ",
    transliteration: "Al-Qawiyy",
    english: "The Possessor of All Strength",
    french: "Le Fort",
    verse: {
      arabic: "إِنَّ اللَّهَ قَوِيٌّ عَزِيزٌ",
      english: "Indeed, Allah is Powerful and Exalted in Might",
      french: "Allah est certes Fort et Puissant",
      reference: "Quran 22:40"
    },
    meditation: {
      english: "Draw strength from Allah's infinite power. When you feel weak, remember His strength supports you.",
      french: "Puisez la force dans le pouvoir infini d'Allah. Quand vous vous sentez faible, souvenez-vous que Sa force vous soutient."
    }
  },
  {
    id: 55,
    arabic: "الْمَتِين",
    transliteration: "Al-Matin",
    english: "The Forceful One",
    french: "L'Inébranlable",
    verse: {
      arabic: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ",
      english: "Indeed, it is Allah who is the [continual] Provider, the firm possessor of strength",
      french: "En vérité, c'est Allah qui est le Grand Pourvoyeur, Le Détenteur de la force, l'Inébranlable",
      reference: "Quran 51:58"
    },
    meditation: {
      english: "Find stability in Allah's unshakeable strength. While everything changes, His power remains constant.",
      french: "Trouvez la stabilité dans la force inébranlable d'Allah. Tandis que tout change, Son pouvoir reste constant."
    }
  },
  {
    id: 56,
    arabic: "الْوَلِيّ",
    transliteration: "Al-Waliyy",
    english: "The Friend",
    french: "Le Maître tutélaire",
    verse: {
      arabic: "اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا",
      english: "Allah is the ally of those who believe",
      french: "Allah est le défenseur de ceux qui ont la foi",
      reference: "Quran 2:257"
    },
    meditation: {
      english: "Rejoice that Allah is your closest friend and protector. His friendship is loyal and eternal.",
      french: "Réjouissez-vous qu'Allah soit votre ami le plus proche et votre protecteur. Son amitié est loyale et éternelle."
    }
  },
  {
    id: 57,
    arabic: "الْحَمِيد",
    transliteration: "Al-Hamid",
    english: "The Praised One",
    french: "Le Digne de louange",
    verse: {
      arabic: "وَاللَّهُ غَنِيٌّ حَمِيدٌ",
      english: "And Allah is Free of need and Praiseworthy",
      french: "Et Allah se passe de tout, et Il est digne de louange",
      reference: "Quran 2:267"
    },
    meditation: {
      english: "Praise Allah in all circumstances. He is inherently worthy of all praise, whether we recognize it or not.",
      french: "Louez Allah en toutes circonstances. Il est intrinsèquement digne de toute louange, que nous le reconnaissions ou non."
    }
  },
  {
    id: 58,
    arabic: "الْمُحْصِي",
    transliteration: "Al-Muhsi",
    english: "The Counter",
    french: "Celui qui dénombre",
    verse: {
      arabic: "لَقَدْ أَحْصَاهُمْ وَعَدَّهُمْ عَدًّا",
      english: "He has enumerated them and counted them a [full] counting",
      french: "Il les a certes dénombrés et bien comptés",
      reference: "Quran 19:94"
    },
    meditation: {
      english: "Know that Allah counts every deed, every breath, every moment. Nothing in your life is insignificant to Him.",
      french: "Sachez qu'Allah compte chaque action, chaque souffle, chaque moment. Rien dans votre vie n'est insignifiant pour Lui."
    }
  },
  {
    id: 59,
    arabic: "الْمُبْدِئ",
    transliteration: "Al-Mubdi",
    english: "The Originator",
    french: "Celui qui commence",
    verse: {
      arabic: "إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ",
      english: "Indeed, it is He who originates [creation] and repeats",
      french: "C'est Lui qui commence (la création) et la refait",
      reference: "Quran 85:13"
    },
    meditation: {
      english: "Marvel at Allah's power to create from nothing. Every beginning in your life is a sign of His creative power.",
      french: "Émerveillez-vous du pouvoir d'Allah de créer à partir de rien. Chaque commencement dans votre vie est un signe de Son pouvoir créateur."
    }
  },
  {
    id: 60,
    arabic: "الْمُعِيد",
    transliteration: "Al-Muid",
    english: "The Restorer",
    french: "Celui qui restitue",
    verse: {
      arabic: "إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ",
      english: "Indeed, it is He who originates [creation] and repeats",
      french: "C'est Lui qui commence (la création) et la refait",
      reference: "Quran 85:13"
    },
    meditation: {
      english: "Trust Allah's power to restore what was lost. He can bring back hope, health, and happiness.",
      french: "Faites confiance au pouvoir d'Allah de restaurer ce qui était perdu. Il peut ramener l'espoir, la santé et le bonheur."
    }
  },
  {
    id: 61,
    arabic: "الْمُحْيِي",
    transliteration: "Al-Muhyi",
    english: "The Giver of Life",
    french: "Celui qui donne la vie",
    verse: {
      arabic: "وَأَنَّهُ هُوَ أَمَاتَ وَأَحْيَا",
      english: "And that it is He who causes death and gives life",
      french: "et que c'est Lui qui donne la mort et donne la vie",
      reference: "Quran 53:44"
    },
    meditation: {
      english: "Appreciate Allah as the source of all life. Every breath is His gift to you.",
      french: "Appréciez Allah comme la source de toute vie. Chaque souffle est Son don pour vous."
    }
  },
  {
    id: 62,
    arabic: "الْمُمِيت",
    transliteration: "Al-Mumit",
    english: "The Taker of Life",
    french: "Celui qui donne la mort",
    verse: {
      arabic: "وَأَنَّهُ هُوَ أَمَاتَ وَأَحْيَا",
      english: "And that it is He who causes death and gives life",
      french: "et que c'est Lui qui donne la mort et donne la vie",
      reference: "Quran 53:44"
    },
    meditation: {
      english: "Accept Allah's decree over life and death. Death is not the end but a transition to eternal life with Him.",
      french: "Acceptez le décret d'Allah sur la vie et la mort. La mort n'est pas la fin mais une transition vers la vie éternelle avec Lui."
    }
  },
  {
    id: 63,
    arabic: "الْحَيّ",
    transliteration: "Al-Hayy",
    english: "The Ever Living One",
    french: "Le Vivant",
    verse: {
      arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
      english: "Allah - there is no deity except Him, the Ever-Living, the Self-Sustaining",
      french: "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même",
      reference: "Quran 2:255"
    },
    meditation: {
      english: "Connect with Allah's eternal life. His life never diminishes, never weakens, never ends.",
      french: "Connectez-vous à la vie éternelle d'Allah. Sa vie ne diminue jamais, ne s'affaiblit jamais, ne se termine jamais."
    }
  },
  {
    id: 64,
    arabic: "الْقَيُّوم",
    transliteration: "Al-Qayyum",
    english: "The Self-Existing One",
    french: "Celui qui subsiste par Lui-même",
    verse: {
      arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
      english: "Allah - there is no deity except Him, the Ever-Living, the Self-Sustaining",
      french: "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même",
      reference: "Quran 2:255"
    },
    meditation: {
      english: "Depend on Allah who depends on nothing. While all creation needs sustenance, He is self-sufficient.",
      french: "Dépendez d'Allah qui ne dépend de rien. Tandis que toute la création a besoin de subsistance, Il est autosuffisant."
    }
  },
  {
    id: 65,
    arabic: "الْوَاجِد",
    transliteration: "Al-Wajid",
    english: "The Finder",
    french: "Celui qui trouve",
    verse: {
      arabic: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ",
      english: "And He found you lost and guided [you]",
      french: "Il t'a trouvé égaré, puis Il t'a guidé",
      reference: "Quran 93:7"
    },
    meditation: {
      english: "Be grateful that Allah found you when you were lost. He seeks out those who are searching for truth.",
      french: "Soyez reconnaissant qu'Allah vous ait trouvé quand vous étiez perdu. Il cherche ceux qui recherchent la vérité."
    }
  },
  {
    id: 66,
    arabic: "الْمَاجِد",
    transliteration: "Al-Majid",
    english: "The Glorious",
    french: "Le Noble",
    verse: {
      arabic: "ذُو الْعَرْشِ الْمَجِيدُ",
      english: "Honorable Owner of the Throne",
      french: "Le Maître du Trône, le Glorieux",
      reference: "Quran 85:15"
    },
    meditation: {
      english: "Bask in Allah's infinite glory. His nobility elevates and dignifies those who serve Him.",
      french: "Baignez-vous dans la gloire infinie d'Allah. Sa noblesse élève et dignifie ceux qui Le servent."
    }
  },
  {
    id: 67,
    arabic: "الْوَاحِد",
    transliteration: "Al-Wahid",
    english: "The Unity",
    french: "L'Unique",
    verse: {
      arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
      english: "Say, 'He is Allah, [who is] One'",
      french: "Dis : « Il est Allah, Unique »",
      reference: "Quran 112:1"
    },
    meditation: {
      english: "Contemplate Allah's perfect unity. In His oneness, find unity for your scattered thoughts and divided heart.",
      french: "Contemplez l'unité parfaite d'Allah. Dans Son unicité, trouvez l'unité pour vos pensées éparpillées et votre cœur divisé."
    }
  },
  {
    id: 68,
    arabic: "الأَحَد",
    transliteration: "Al-Ahad",
    english: "The One",
    french: "L'Un",
    verse: {
      arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
      english: "Say, 'He is Allah, [who is] One'",
      french: "Dis : « Il est Allah, Unique »",
      reference: "Quran 112:1"
    },
    meditation: {
      english: "Focus on Allah's absolute oneness. He is indivisible, incomparable, and completely unique.",
      french: "Concentrez-vous sur l'unicité absolue d'Allah. Il est indivisible, incomparable et complètement unique."
    }
  },
  {
    id: 69,
    arabic: "الصَّمَد",
    transliteration: "As-Samad",
    english: "The Satisfier of All Needs",
    french: "Le Maître Absolu",
    verse: {
      arabic: "اللَّهُ الصَّمَدُ",
      english: "Allah, the Eternal Refuge",
      french: "Allah, Le Maître Absolu",
      reference: "Quran 112:2"
    },
    meditation: {
      english: "Turn to Allah for all your needs. He is completely self-sufficient yet fulfills the needs of all creation.",
      french: "Tournez-vous vers Allah pour tous vos besoins. Il est complètement autosuffisant mais satisfait les besoins de toute la création."
    }
  },
  {
    id: 70,
    arabic: "الْقَادِر",
    transliteration: "Al-Qadir",
    english: "The All Powerful",
    french: "Le Puissant",
    verse: {
      arabic: "وَاللَّهُ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
      english: "And Allah is over all things competent",
      french: "Et Allah est Omnipotent",
      reference: "Quran 2:20"
    },
    meditation: {
      english: "Have faith in Allah's unlimited power. Nothing is impossible for Him to accomplish.",
      french: "Ayez foi dans le pouvoir illimité d'Allah. Rien n'est impossible pour Lui à accomplir."
    }
  },
  {
    id: 71,
    arabic: "الْمُقْتَدِر",
    transliteration: "Al-Muqtadir",
    english: "The Creator of All Power",
    french: "Le Déterminant",
    verse: {
      arabic: "فِي مَقْعَدِ صِدْقٍ عِندَ مَلِيكٍ مُّقْتَدِرٍ",
      english: "In a seat of honor near a Sovereign, Perfect in Ability",
      french: "Ils seront dans un séjour de vérité, auprès d'un Souverain Omnipotent",
      reference: "Quran 54:55"
    },
    meditation: {
      english: "Recognize Allah as the source of all power in the universe. Every ability you have comes from Him.",
      french: "Reconnaissez Allah comme la source de tout pouvoir dans l'univers. Chaque capacité que vous avez vient de Lui."
    }
  },
  {
    id: 72,
    arabic: "الْمُقَدِّم",
    transliteration: "Al-Muqaddim",
    english: "The Expediter",
    french: "Celui qui met en avant",
    verse: {
      arabic: "وَلَقَدْ عَلِمْتُمُ الَّذِينَ اعْتَدَوْا مِنكُمْ فِي السَّبْتِ فَقُلْنَا لَهُمْ كُونُوا قِرَدَةً خَاسِئِينَ",
      english: "And you had already known about those who transgressed among you concerning the sabbath, and We said to them, 'Be apes, despised'",
      french: "Et bien, vous avez su ce qui est advenu à ceux d'entre vous qui ont transgressé le Sabbat. Et bien Nous leur avons dit : « Soyez des singes abjects ! »",
      reference: "Quran 2:65"
    },
    meditation: {
      english: "Trust Allah's timing in advancing matters. He brings forward what is good and delays what would harm you.",
      french: "Faites confiance au timing d'Allah pour faire avancer les choses. Il fait avancer ce qui est bon et retarde ce qui vous ferait du mal."
    }
  },
  {
    id: 73,
    arabic: "الْمُؤَخِّر",
    transliteration: "Al-Mu'akhkhir",
    english: "The Delayer",
    french: "Celui qui retarde",
    verse: {
      arabic: "يَوْمَ يَدْعُوكُمْ فَتَسْتَجِيبُونَ بِحَمْدِهِ وَتَظُنُّونَ إِن لَّبِثْتُمْ إِلَّا قَلِيلًا",
      english: "On the Day He will call you and you will respond with [words of] His praise and think that you had not remained [in the world] except for a little",
      french: "Le jour où Il vous appellera, vous Lui répondrez en Le glorifiant. Vous penserez n'être restés [sur terre] que peu de temps !",
      reference: "Quran 17:52"
    },
    meditation: {
      english: "Be patient with Allah's delays. His postponement of something you want may be protection from harm.",
      french: "Soyez patient avec les retards d'Allah. Son report de quelque chose que vous voulez peut être une protection contre le mal."
    }
  },
  {
    id: 74,
    arabic: "الأوَّل",
    transliteration: "Al-Awwal",
    english: "The First",
    french: "Le Premier",
    verse: {
      arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ",
      english: "He is the First and the Last, the Ascendant and the Intimate",
      french: "Il est le Premier et le Dernier, l'Apparent et le Caché",
      reference: "Quran 57:3"
    },
    meditation: {
      english: "Begin everything with Allah's name. He existed before all creation and will exist after all ends.",
      french: "Commencez tout au nom d'Allah. Il existait avant toute création et existera après que tout se termine."
    }
  },
  {
    id: 75,
    arabic: "الآخِر",
    transliteration: "Al-Akhir",
    english: "The Last",
    french: "Le Dernier",
    verse: {
      arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ",
      english: "He is the First and the Last, the Ascendant and the Intimate",
      french: "Il est le Premier et le Dernier, l'Apparent et le Caché",
      reference: "Quran 57:3"
    },
    meditation: {
      english: "End everything seeking Allah's pleasure. When all else fades away, He will remain eternal.",
      french: "Terminez tout en cherchant le plaisir d'Allah. Quand tout le reste s'effacera, Il restera éternel."
    }
  },
  {
    id: 76,
    arabic: "الظَّاهِر",
    transliteration: "Az-Zahir",
    english: "The Manifest One",
    french: "L'Apparent",
    verse: {
      arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ",
      english: "He is the First and the Last, the Ascendant and the Intimate",
      french: "Il est le Premier et le Dernier, l'Apparent et le Caché",
      reference: "Quran 57:3"
    },
    meditation: {
      english: "See Allah's signs everywhere in creation. His presence is manifest in every leaf, every sunrise, every heartbeat.",
      french: "Voyez les signes d'Allah partout dans la création. Sa présence est manifeste dans chaque feuille, chaque lever de soleil, chaque battement de cœur."
    }
  },
  {
    id: 77,
    arabic: "الْبَاطِن",
    transliteration: "Al-Batin",
    english: "The Hidden One",
    french: "Le Caché",
    verse: {
      arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ",
      english: "He is the First and the Last, the Ascendant and the Intimate",
      french: "Il est le Premier et le Dernier, l'Apparent et le Caché",
      reference: "Quran 57:3"
    },
    meditation: {
      english: "Seek Allah in the hidden depths of your heart. He is closer to you than your jugular vein.",
      french: "Cherchez Allah dans les profondeurs cachées de votre cœur. Il est plus proche de vous que votre veine jugulaire."
    }
  },
  {
    id: 78,
    arabic: "الْوَالِي",
    transliteration: "Al-Wali",
    english: "The Ruler",
    french: "Le Gouverneur",
    verse: {
      arabic: "أَنتَ وَلِيِّي فِي الدُّنْيَا وَالْآخِرَةِ",
      english: "You are my protector in this world and in the Hereafter",
      french: "Tu es mon patron ici-bas et dans l'au-delà",
      reference: "Quran 12:101"
    },
    meditation: {
      english: "Submit to Allah's perfect governance. He rules with justice, mercy, and infinite wisdom.",
      french: "Soumettez-vous au gouvernement parfait d'Allah. Il gouverne avec justice, miséricorde et sagesse infinie."
    }
  },
  {
    id: 79,
    arabic: "الْمُتَعَالِي",
    transliteration: "Al-Muta'ali",
    english: "The Supreme One",
    french: "Le Très-Élevé",
    verse: {
      arabic: "عَالِمُ الْغَيْبِ وَالشَّهَادَةِ الْكَبِيرُ الْمُتَعَالِ",
      english: "Knower of the unseen and the witnessed, the Grand, the Exalted",
      french: "Connaisseur de l'Invisible et du visible, le Grand, le Sublime !",
      reference: "Quran 13:9"
    },
    meditation: {
      english: "Raise your aspirations toward Allah's supreme heights. Let His elevation lift your soul above worldly concerns.",
      french: "Élevez vos aspirations vers les hauteurs suprêmes d'Allah. Que Son élévation élève votre âme au-dessus des préoccupations mondaines."
    }
  },
  {
    id: 80,
    arabic: "الْبَرّ",
    transliteration: "Al-Barr",
    english: "The Beneficent One",
    french: "Le Bienfaisant",
    verse: {
      arabic: "إِنَّهُ هُوَ الْبَرُّ الرَّحِيمُ",
      english: "Indeed, it is He who is the Beneficent, the Merciful",
      french: "C'est Lui, certes, le Compatissant, le Miséricordieux !",
      reference: "Quran 52:28"
    },
    meditation: {
      english: "Experience Allah's constant kindness toward you. Every moment of ease is His beneficence.",
      french: "Expérimentez la bonté constante d'Allah envers vous. Chaque moment de facilité est Sa bienfaisance."
    }
  },
  {
    id: 81,
    arabic: "التَّوَاب",
    transliteration: "At-Tawwab",
    english: "The Guide to Repentance",
    french: "Celui qui accepte le repentir",
    verse: {
      arabic: "وَاللَّهُ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ",
      english: "And Allah loves those who are constantly repentant and loves those who purify themselves",
      french: "Car Allah aime ceux qui se repentent, et Il aime ceux qui se purifient",
      reference: "Quran 2:222"
    },
    meditation: {
      english: "Turn to Allah in repentance frequently. He loves the heart that returns to Him again and again.",
      french: "Tournez-vous vers Allah en repentir fréquemment. Il aime le cœur qui revient à Lui encore et encore."
    }
  },
  {
    id: 82,
    arabic: "الْمُنْتَقِم",
    transliteration: "Al-Muntaqim",
    english: "The Avenger",
    french: "Le Vengeur",
    verse: {
      arabic: "وَاللَّهُ عَزِيزٌ ذُو انتِقَامٍ",
      english: "And Allah is Exalted in Might and Owner of Retribution",
      french: "Et Allah est Puissant et Détenteur du châtiment",
      reference: "Quran 3:4"
    },
    meditation: {
      english: "Trust Allah's perfect justice. He will deal with oppression and wrongdoing in His own way and time.",
      french: "Faites confiance à la justice parfaite d'Allah. Il traitera l'oppression et les méfaits à Sa manière et en Son temps."
    }
  },
  {
    id: 83,
    arabic: "العَفُوّ",
    transliteration: "Al-Afuww",
    english: "The Forgiver",
    french: "L'Indulgent",
    verse: {
      arabic: "وَاللَّهُ عَفُوٌّ غَفُورٌ",
      english: "And Allah is Pardoning and Forgiving",
      french: "Et Allah est Indulgent et Pardonneur",
      reference: "Quran 4:43"
    },
    meditation: {
      english: "Hope in Allah's complete pardon. He can erase sins as if they never existed.",
      french: "Espérez dans le pardon complet d'Allah. Il peut effacer les péchés comme s'ils n'avaient jamais existé."
    }
  },
  {
    id: 84,
    arabic: "الرَّؤُوف",
    transliteration: "Ar-Ra'uf",
    english: "The Compassionate",
    french: "Le Compatissant",
    verse: {
      arabic: "إِنَّ اللَّهَ بِالنَّاسِ لَرَءُوفٌ رَّحِيمٌ",
      english: "Indeed, Allah is, to the people, Kind and Merciful",
      french: "Allah est certainement Compatissant et Miséricordieux envers les gens",
      reference: "Quran 2:143"
    },
    meditation: {
      english: "Feel Allah's tender compassion for you. His gentleness soothes every wound and worry.",
      french: "Ressentez la tendre compassion d'Allah pour vous. Sa douceur apaise chaque blessure et souci."
    }
  },
  {
    id: 85,
    arabic: "مَالِكُ الْمُلْك",
    transliteration: "Malik-ul-Mulk",
    english: "Owner of All",
    french: "Maître de l'Autorité absolue",
    verse: {
      arabic: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ",
      english: "Say, 'O Allah, Owner of Sovereignty'",
      french: "Dis : « Ô Allah, Maître de l'autorité absolue »",
      reference: "Quran 3:26"
    },
    meditation: {
      english: "Acknowledge Allah's absolute ownership of everything. You are a trustee of His gifts.",
      french: "Reconnaissez la propriété absolue d'Allah sur tout. Vous êtes un dépositaire de Ses dons."
    }
  },
  {
    id: 86,
    arabic: "ذُوالْجَلاَلِ وَالإكْرَام",
    transliteration: "Dhu-l-Jalali wa-l-Ikram",
    english: "Owner of Majesty and Bounty",
    french: "Le Détenteur de la Majesté et de la Générosité",
    verse: {
      arabic: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ",
      english: "And there will remain the Face of your Lord, Owner of Majesty and Honor",
      french: "Seule subsistera La Face de ton Seigneur, plein de majesté et de noblesse",
      reference: "Quran 55:27"
    },
    meditation: {
      english: "Stand in awe before Allah's majesty while gratefully receiving His generous bounties.",
      french: "Restez émerveillé devant la majesté d'Allah tout en recevant avec gratitude Ses généreuses bontés."
    }
  },
  {
    id: 87,
    arabic: "الْمُقْسِط",
    transliteration: "Al-Muqsit",
    english: "The Equitable One",
    french: "L'Équitable",
    verse: {
      arabic: "إِنَّ اللَّهَ يُحِبُّ الْمُقْسِطِينَ",
      english: "Indeed, Allah loves those who act justly",
      french: "Car Allah aime les équitables",
      reference: "Quran 5:42"
    },
    meditation: {
      english: "Strive for justice knowing Allah loves the equitable. His perfect fairness is your model.",
      french: "Efforcez-vous d'être juste en sachant qu'Allah aime les équitables. Sa parfaite équité est votre modèle."
    }
  },
  {
    id: 88,
    arabic: "الْجَامِع",
    transliteration: "Al-Jami",
    english: "The Gatherer",
    french: "Celui qui réunit",
    verse: {
      arabic: "رَبَّنَا إِنَّكَ جَامِعُ النَّاسِ لِيَوْمٍ لَّا رَيْبَ فِيهِ",
      english: "Our Lord, surely You will gather the people for a Day about which there is no doubt",
      french: "Notre Seigneur ! Tu rassembleras certes les gens, un Jour - sur lequel il n'y a point de doute",
      reference: "Quran 3:9"
    },
    meditation: {
      english: "Know that Allah will gather all for final judgment. Live preparing for that inevitable meeting.",
      french: "Sachez qu'Allah rassemblera tous pour le jugement final. Vivez en vous préparant pour cette rencontre inévitable."
    }
  },
  {
    id: 89,
    arabic: "الْغَنِيّ",
    transliteration: "Al-Ghani",
    english: "The Rich One",
    french: "Celui qui se suffit à Lui-même",
    verse: {
      arabic: "وَاللَّهُ غَنِيٌّ وَأَنتُمُ الْفُقَرَاءُ",
      english: "And Allah is the Free of need, while you are the needy",
      french: "Et Allah est le Riche alors que vous êtes les indigents",
      reference: "Quran 47:38"
    },
    meditation: {
      english: "Recognize your complete dependence on Allah, who needs nothing but gives everything.",
      french: "Reconnaissez votre dépendance complète envers Allah, qui n'a besoin de rien mais donne tout."
    }
  },
  {
    id: 90,
    arabic: "الْمُغْنِي",
    transliteration: "Al-Mughni",
    english: "The Enricher",
    french: "Celui qui enrichit",
    verse: {
      arabic: "وَأَنَّهُ هُوَ أَغْنَىٰ وَأَقْنَىٰ",
      english: "And that it is He who enriches and suffices",
      french: "et que c'est Lui qui enrichit et qui fait acquérir",
      reference: "Quran 53:48"
    },
    meditation: {
      english: "Ask Allah to enrich your heart with contentment. True wealth comes from Him alone.",
      french: "Demandez à Allah d'enrichir votre cœur de contentement. La vraie richesse ne vient que de Lui seul."
    }
  },
  {
    id: 91,
    arabic: "الْمَانِع",
    transliteration: "Al-Mani",
    english: "The Preventer of Harm",
    french: "Celui qui empêche",
    verse: {
      arabic: "وَمَا أَنتُم بِمُعْجِزِينَ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ",
      english: "And you will not cause failure [to Allah ] upon the earth or in the heaven",
      french: "Vous n'êtes pas à l'abri [du châtiment d'Allah] sur la terre ni dans le ciel",
      reference: "Quran 29:22"
    },
    meditation: {
      english: "Trust Allah to prevent what would harm you. His protection shields you from seen and unseen dangers.",
      french: "Faites confiance à Allah pour empêcher ce qui vous ferait du mal. Sa protection vous protège des dangers visibles et invisibles."
    }
  },
  {
    id: 92,
    arabic: "الضَّارّ",
    transliteration: "Ad-Darr",
    english: "The Creator of the Harmful",
    french: "Celui qui peut nuire",
    verse: {
      arabic: "وَإِن يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ",
      english: "And if Allah should touch you with adversity, there is no remover of it except Him",
      french: "Et si Allah fait qu'un mal te touche, nul ne peut l'écarter en dehors de Lui",
      reference: "Quran 6:17"
    },
    meditation: {
      english: "Accept that both ease and hardship come from Allah. Even difficulties contain hidden wisdom and blessings.",
      french: "Acceptez que la facilité et la difficulté viennent d'Allah. Même les difficultés contiennent une sagesse et des bénédictions cachées."
    }
  },
  {
    id: 93,
    arabic: "النَّافِع",
    transliteration: "An-Nafi",
    english: "The Creator of Good",
    french: "Celui qui accorde le profit",
    verse: {
      arabic: "وَإِن يَمْسَسْكَ اللَّهُ بِخَيْرٍ فَلَا رَادَّ لِفَضْلِهِ",
      english: "But if Allah touches you with good - then no repeller of His bounty",
      french: "Et s'Il te fait du bien, nul ne peut repousser Sa grâce",
      reference: "Quran 10:107"
    },
    meditation: {
      english: "Appreciate every benefit as coming from Allah. He is the source of all that is good and beneficial in your life.",
      french: "Appréciez chaque bienfait comme venant d'Allah. Il est la source de tout ce qui est bon et bénéfique dans votre vie."
    }
  },
  {
    id: 94,
    arabic: "النُّور",
    transliteration: "An-Nur",
    english: "The Light",
    french: "La Lumière",
    verse: {
      arabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
      english: "Allah is the light of the heavens and the earth",
      french: "Allah est la Lumière des cieux et de la terre",
      reference: "Quran 24:35"
    },
    meditation: {
      english: "Seek Allah's light to illuminate your path. His guidance dispels the darkness of confusion and doubt.",
      french: "Cherchez la lumière d'Allah pour illuminer votre chemin. Sa guidance dissipe les ténèbres de la confusion et du doute."
    }
  },
  {
    id: 95,
    arabic: "الْهَادِي",
    transliteration: "Al-Hadi",
    english: "The Guide",
    french: "Le Guide",
    verse: {
      arabic: "وَإِنَّ اللَّهَ لَهَادِ الَّذِينَ آمَنُوا إِلَىٰ صِرَاطٍ مُّسْتَقِيمٍ",
      english: "And indeed, Allah is the Guide of those who have believed to a straight path",
      french: "Et Allah guide certes ceux qui ont cru vers un droit chemin",
      reference: "Quran 22:54"
    },
    meditation: {
      english: "Follow Allah's guidance in all matters. He leads those who sincerely seek Him to the straight path.",
      french: "Suivez la guidance d'Allah en toutes choses. Il conduit ceux qui Le cherchent sincèrement vers le droit chemin."
    }
  },
  {
    id: 96,
    arabic: "الْبَدِيع",
    transliteration: "Al-Badi",
    english: "The Originator",
    french: "Le Créateur primordial",
    verse: {
      arabic: "بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ",
      english: "Originator of the heavens and the earth",
      french: "Créateur des cieux et de la terre",
      reference: "Quran 2:117"
    },
    meditation: {
      english: "Marvel at Allah's original creativity. He creates without precedent, bringing into existence what never was.",
      french: "Émerveillez-vous de la créativité originale d'Allah. Il crée sans précédent, faisant exister ce qui n'était jamais."
    }
  },
  {
    id: 97,
    arabic: "الْبَاقِي",
    transliteration: "Al-Baqi",
    english: "The Everlasting One",
    french: "Le Subsistant",
    verse: {
      arabic: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ",
      english: "And there will remain the Face of your Lord, Owner of Majesty and Honor",
      french: "Seule subsistera La Face de ton Seigneur, plein de majesté et de noblesse",
      reference: "Quran 55:27"
    },
    meditation: {
      english: "Find peace in Allah's eternal permanence. While everything changes and passes away, He remains forever.",
      french: "Trouvez la paix dans la permanence éternelle d'Allah. Tandis que tout change et passe, Il demeure à jamais."
    }
  },
  {
    id: 98,
    arabic: "الْوَارِث",
    transliteration: "Al-Warith",
    english: "The Inheritor of All",
    french: "L'Héritier",
    verse: {
      arabic: "وَإِنَّا لَنَحْنُ نُحْيِي وَنُمِيتُ وَنَحْنُ الْوَارِثُونَ",
      english: "And indeed, it is We who give life and cause death, and We are the Inheritor",
      french: "Et c'est Nous qui donnons la vie et donnons la mort ; et c'est Nous qui sommes l'Héritier [de tout]",
      reference: "Quran 15:23"
    },
    meditation: {
      english: "Remember that everything ultimately returns to Allah. Use His gifts wisely while they are in your care.",
      french: "Souvenez-vous que tout retourne finalement à Allah. Utilisez Ses dons avec sagesse tant qu'ils sont sous votre garde."
    }
  },
  {
    id: 99,
    arabic: "الرَّشِيد",
    transliteration: "Ar-Rashid",
    english: "The Righteous Teacher",
    french: "Le Guide vers la droiture",
    verse: {
      arabic: "وَأَنَّ اللَّهَ قَدْ أَحَاطَ بِكُلِّ شَيْءٍ عِلْمًا",
      english: "And that Allah has encompassed all things in knowledge",
      french: "et qu'Allah embrasse toute chose de Sa science",
      reference: "Quran 65:12"
    },
    meditation: {
      english: "Seek Allah's guidance toward righteousness. He teaches wisdom and leads to what is right and beneficial.",
      french: "Cherchez la guidance d'Allah vers la droiture. Il enseigne la sagesse et mène vers ce qui est juste et bénéfique."
    }
  },
  {
  id: 100,
  arabic: "الصَّبُور",
  transliteration: "As-Sabur",
  english: "The Patient",
  french: "Le Patient",
  verse: {
    arabic: "وَاللَّهُ غَفُورٌ حَلِيمٌ",
    english: "And Allah is Forgiving and Forbearing",
    french: "Et Allah est Pardonneur et Plein de mansuétude",
    reference: "Quran 64:17"
  },
  meditation: {
    english: "Reflect on Allah’s infinite patience. Just as He delays punishment and gives countless chances, strive to cultivate patience in your own life.",
    french: "Réfléchissez à l’infinie patience d’Allah. De même qu’Il retarde le châtiment et accorde d’innombrables occasions, efforcez-vous de cultiver la patience dans votre propre vie."
  }
}

];

// Helper function to get a specific name
export const getNameById = (id: number): AsmaAlHusnaItem | undefined => {
  return asmaAlHusna.find(name => name.id === id);
};

// Helper function to get total count
export const getTotalNames = (): number => {
  return asmaAlHusna.length;
};