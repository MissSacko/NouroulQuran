export const series = [
  {
    id: 1,
    slug: "sur-les-traces-des-sahabas",
    title: "Sur les traces des Sahabas",
    subtitle: "À la découverte des grandes figures de l'Islam",
    description:
      "Une série de rencontres consacrée à la découverte de la vie, de la foi, du caractère et des enseignements des Sahabas et des grandes figures de l'Islam.",
    category: "Sahabas & grandes figures",
    numberOfEpisodes: 9,
    episodes: [
      "musab-ibn-umayr",
      "abu-bakr-as-siddiq",
      "omar-ibn-al-khattab",
      "ousmane-ibn-affan",
      "ali-ibn-abi-talib",
      "assia-bint-muzahim",
      "maryam-bint-imran",
      "khadijah",
      "fatima-az-zahra",
    ],
  },
  {
    id: 2,
    slug: "preparation-ramadan",
    title: "Préparons le Ramadan",
    subtitle: "Préparer son cœur et son âme à accueillir Ramadan",
    description:
      "Une série de rencontres pour se préparer spirituellement au mois de Ramadan, purifier son cœur, renforcer sa relation avec le Coran et construire une routine spirituelle durable.",
    category: "Spiritualité & Ramadan",

    episodes: [
      "nettoyer-son-coeur-avant-ramadan",
      "coran-taddabur-ramadan",
      "jeune-cinq-sens",
      "architecture-ramadan",
      "reveiller-son-coeur-la-nuit",
    ],
  },
];

export const getSerieBySlug = (slug) =>
  series.find((serie) => serie.slug === slug);