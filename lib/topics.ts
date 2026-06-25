// Per-subject topic lists — ported from the mobile app (subject_data.dart).
export interface TopicInfo { name: string; lessons: number; hours: number; progress: number; }

export const TOPICS: Record<string, TopicInfo[]> = {
  "English Language": [
    {
      "name": "Comprehension & Summary",
      "lessons": 15,
      "hours": 6,
      "progress": 1
    },
    {
      "name": "Narrative Essay Writing",
      "lessons": 8,
      "hours": 3,
      "progress": 0.95
    },
    {
      "name": "Argumentative Essay",
      "lessons": 8,
      "hours": 3,
      "progress": 0.95
    },
    {
      "name": "Expository Essay",
      "lessons": 7,
      "hours": 3,
      "progress": 0.9
    },
    {
      "name": "Descriptive Essay",
      "lessons": 7,
      "hours": 3,
      "progress": 0.9
    },
    {
      "name": "Formal Letter Writing",
      "lessons": 6,
      "hours": 2,
      "progress": 1
    },
    {
      "name": "Informal Letter Writing",
      "lessons": 5,
      "hours": 2,
      "progress": 1
    },
    {
      "name": "Report Writing",
      "lessons": 6,
      "hours": 2,
      "progress": 0.95
    },
    {
      "name": "Speech Writing",
      "lessons": 5,
      "hours": 2,
      "progress": 0.85
    },
    {
      "name": "Parts of Speech (Nouns, Verbs, Adj…)",
      "lessons": 10,
      "hours": 4,
      "progress": 1
    },
    {
      "name": "Concord & Subject-Verb Agreement",
      "lessons": 8,
      "hours": 3,
      "progress": 0.95
    },
    {
      "name": "Tenses & Aspect",
      "lessons": 8,
      "hours": 3,
      "progress": 0.92
    },
    {
      "name": "Sentence Types & Clauses",
      "lessons": 8,
      "hours": 3,
      "progress": 0.9
    },
    {
      "name": "Antonyms & Synonyms",
      "lessons": 6,
      "hours": 2,
      "progress": 1
    },
    {
      "name": "Idioms & Phrases",
      "lessons": 8,
      "hours": 3,
      "progress": 0.95
    },
    {
      "name": "Figures of Speech",
      "lessons": 10,
      "hours": 4,
      "progress": 0.92
    },
    {
      "name": "Vowel Sounds (Phonetics)",
      "lessons": 8,
      "hours": 3,
      "progress": 0.88
    },
    {
      "name": "Consonant Sounds",
      "lessons": 8,
      "hours": 3,
      "progress": 0.85
    },
    {
      "name": "Word Stress & Intonation",
      "lessons": 8,
      "hours": 3,
      "progress": 0.8
    },
    {
      "name": "Phonemic Transcription",
      "lessons": 6,
      "hours": 2,
      "progress": 0.75
    }
  ],
  "Mathematics": [
    {
      "name": "Number Bases",
      "lessons": 8,
      "hours": 3,
      "progress": 1
    },
    {
      "name": "Fractions, Decimals & Approximations",
      "lessons": 8,
      "hours": 3,
      "progress": 1
    },
    {
      "name": "Indices & Standard Form",
      "lessons": 8,
      "hours": 3,
      "progress": 0.95
    },
    {
      "name": "Logarithms",
      "lessons": 8,
      "hours": 3,
      "progress": 0.9
    },
    {
      "name": "Surds",
      "lessons": 6,
      "hours": 2,
      "progress": 0.85
    },
    {
      "name": "Simple & Compound Interest",
      "lessons": 6,
      "hours": 2,
      "progress": 0.9
    },
    {
      "name": "Profit, Loss & Percentages",
      "lessons": 6,
      "hours": 2,
      "progress": 0.95
    },
    {
      "name": "Ratio, Proportion & Variation",
      "lessons": 8,
      "hours": 3,
      "progress": 0.85
    },
    {
      "name": "Algebraic Expressions & Factorization",
      "lessons": 10,
      "hours": 4,
      "progress": 0.88
    },
    {
      "name": "Linear Equations & Inequalities",
      "lessons": 8,
      "hours": 3,
      "progress": 0.85
    },
    {
      "name": "Quadratic Equations",
      "lessons": 10,
      "hours": 4,
      "progress": 0.8
    },
    {
      "name": "Linear & Quadratic Graphs",
      "lessons": 8,
      "hours": 3,
      "progress": 0.75
    },
    {
      "name": "Simultaneous Equations",
      "lessons": 8,
      "hours": 3,
      "progress": 0.78
    },
    {
      "name": "Sequences & Series (AP & GP)",
      "lessons": 8,
      "hours": 3,
      "progress": 0.72
    },
    {
      "name": "Matrices & Determinants",
      "lessons": 8,
      "hours": 3,
      "progress": 0.68
    },
    {
      "name": "Sets & Venn Diagrams",
      "lessons": 8,
      "hours": 3,
      "progress": 0.88
    },
    {
      "name": "Plane Geometry — Lines & Angles",
      "lessons": 8,
      "hours": 3,
      "progress": 0.75
    },
    {
      "name": "Triangles & Congruence",
      "lessons": 8,
      "hours": 3,
      "progress": 0.7
    },
    {
      "name": "Circles & Circle Theorems",
      "lessons": 10,
      "hours": 4,
      "progress": 0.65
    },
    {
      "name": "Mensuration — Areas & Perimeters",
      "lessons": 8,
      "hours": 3,
      "progress": 0.78
    },
    {
      "name": "Mensuration — Volumes & Surface Area",
      "lessons": 8,
      "hours": 3,
      "progress": 0.72
    },
    {
      "name": "Trigonometry — Ratios & Identities",
      "lessons": 10,
      "hours": 4,
      "progress": 0.68
    },
    {
      "name": "Angles of Elevation & Depression",
      "lessons": 6,
      "hours": 2,
      "progress": 0.7
    },
    {
      "name": "Coordinate Geometry — Straight Lines",
      "lessons": 8,
      "hours": 3,
      "progress": 0.65
    },
    {
      "name": "Locus",
      "lessons": 6,
      "hours": 2,
      "progress": 0.6
    },
    {
      "name": "Statistics — Mean, Mode & Median",
      "lessons": 8,
      "hours": 3,
      "progress": 0.8
    },
    {
      "name": "Frequency Distribution & Histograms",
      "lessons": 8,
      "hours": 3,
      "progress": 0.75
    },
    {
      "name": "Probability",
      "lessons": 8,
      "hours": 3,
      "progress": 0.7
    },
    {
      "name": "Differentiation (Calculus)",
      "lessons": 10,
      "hours": 4,
      "progress": 0.62
    },
    {
      "name": "Integration (Calculus)",
      "lessons": 10,
      "hours": 4,
      "progress": 0.55
    },
    {
      "name": "Vectors",
      "lessons": 8,
      "hours": 3,
      "progress": 0.5
    }
  ],
  "Physics": [
    {
      "name": "Measurements & Units",
      "lessons": 8,
      "hours": 3,
      "progress": 1
    },
    {
      "name": "Scalars & Vectors",
      "lessons": 6,
      "hours": 2,
      "progress": 1
    },
    {
      "name": "Kinematics — Linear Motion",
      "lessons": 7,
      "hours": 4,
      "progress": 1
    },
    {
      "name": "Kinematics — Projectile Motion",
      "lessons": 6,
      "hours": 3,
      "progress": 0.92
    },
    {
      "name": "Newton",
      "lessons": 6,
      "hours": 4,
      "progress": 1
    },
    {
      "name": "Friction",
      "lessons": 6,
      "hours": 2,
      "progress": 0.95
    },
    {
      "name": "Work, Energy & Power",
      "lessons": 10,
      "hours": 4,
      "progress": 0.9
    },
    {
      "name": "Conservation of Energy & Momentum",
      "lessons": 8,
      "hours": 3,
      "progress": 0.88
    },
    {
      "name": "Circular Motion",
      "lessons": 4,
      "hours": 3,
      "progress": 0.82
    },
    {
      "name": "Simple Harmonic Motion",
      "lessons": 5,
      "hours": 3,
      "progress": 0.8
    },
    {
      "name": "Gravitational Field",
      "lessons": 8,
      "hours": 3,
      "progress": 0.85
    },
    {
      "name": "Elasticity & Hooke\\",
      "lessons": 6,
      "hours": 2,
      "progress": 0.88
    },
    {
      "name": "Pressure in Fluids",
      "lessons": 8,
      "hours": 3,
      "progress": 0.85
    },
    {
      "name": "Archimedes\\",
      "lessons": 6,
      "hours": 2,
      "progress": 0.82
    },
    {
      "name": "Temperature & Thermometry",
      "lessons": 6,
      "hours": 2,
      "progress": 0.8
    },
    {
      "name": "Heat Capacity & Specific Heat",
      "lessons": 8,
      "hours": 3,
      "progress": 0.78
    },
    {
      "name": "Latent Heat & Change of State",
      "lessons": 6,
      "hours": 2,
      "progress": 0.75
    },
    {
      "name": "Thermal Expansion",
      "lessons": 6,
      "hours": 2,
      "progress": 0.75
    },
    {
      "name": "Gas Laws & Kinetic Theory",
      "lessons": 8,
      "hours": 3,
      "progress": 0.72
    },
    {
      "name": "Wave Properties & Types",
      "lessons": 8,
      "hours": 3,
      "progress": 0.88
    },
    {
      "name": "Sound Waves",
      "lessons": 8,
      "hours": 3,
      "progress": 0.85
    },
    {
      "name": "Light — Reflection",
      "lessons": 8,
      "hours": 3,
      "progress": 0.82
    },
    {
      "name": "Light — Refraction & Lenses",
      "lessons": 8,
      "hours": 3,
      "progress": 0.8
    },
    {
      "name": "Colour, Dispersion & Spectra",
      "lessons": 6,
      "hours": 2,
      "progress": 0.78
    },
    {
      "name": "Electric Fields & Charge",
      "lessons": 8,
      "hours": 3,
      "progress": 0.75
    },
    {
      "name": "Current Electricity & Ohm\\",
      "lessons": 10,
      "hours": 4,
      "progress": 0.8
    },
    {
      "name": "Electric Circuits & Power",
      "lessons": 8,
      "hours": 3,
      "progress": 0.75
    },
    {
      "name": "Magnetism",
      "lessons": 8,
      "hours": 3,
      "progress": 0.7
    },
    {
      "name": "Electromagnetic Induction",
      "lessons": 8,
      "hours": 3,
      "progress": 0.65
    },
    {
      "name": "Electronics — Semiconductors & Diodes",
      "lessons": 8,
      "hours": 3,
      "progress": 0.6
    },
    {
      "name": "Radioactivity & Nuclear Reactions",
      "lessons": 8,
      "hours": 3,
      "progress": 0.65
    },
    {
      "name": "Atomic Structure & Spectra",
      "lessons": 6,
      "hours": 2,
      "progress": 0.6
    }
  ],
  "Chemistry": [
    {
      "name": "Introduction to Chemistry & Lab Safety",
      "lessons": 6,
      "hours": 2,
      "progress": 1
    },
    {
      "name": "Separation Techniques",
      "lessons": 6,
      "hours": 2,
      "progress": 1
    },
    {
      "name": "Atomic Structure",
      "lessons": 10,
      "hours": 4,
      "progress": 1
    },
    {
      "name": "Periodic Table & Periodicity",
      "lessons": 10,
      "hours": 4,
      "progress": 0.95
    },
    {
      "name": "Chemical Bonding — Ionic & Covalent",
      "lessons": 10,
      "hours": 4,
      "progress": 1
    },
    {
      "name": "Shapes of Molecules & Hybridization",
      "lessons": 8,
      "hours": 3,
      "progress": 0.9
    },
    {
      "name": "States of Matter & Kinetic Theory",
      "lessons": 8,
      "hours": 3,
      "progress": 0.95
    },
    {
      "name": "Gas Laws",
      "lessons": 8,
      "hours": 3,
      "progress": 0.92
    },
    {
      "name": "Chemical Equations & Mole Concept",
      "lessons": 10,
      "hours": 4,
      "progress": 1
    },
    {
      "name": "Stoichiometry & Calculations",
      "lessons": 10,
      "hours": 4,
      "progress": 0.95
    },
    {
      "name": "Acids, Bases & Salts",
      "lessons": 12,
      "hours": 5,
      "progress": 0.9
    },
    {
      "name": "Oxidation & Reduction (Redox)",
      "lessons": 10,
      "hours": 4,
      "progress": 0.88
    },
    {
      "name": "Electrochemistry",
      "lessons": 8,
      "hours": 3,
      "progress": 0.85
    },
    {
      "name": "Water & Solutions",
      "lessons": 8,
      "hours": 3,
      "progress": 0.9
    },
    {
      "name": "Solubility & Solubility Curves",
      "lessons": 6,
      "hours": 2,
      "progress": 0.88
    },
    {
      "name": "Metals & Extraction of Metals",
      "lessons": 10,
      "hours": 4,
      "progress": 0.85
    },
    {
      "name": "Non-metals (Carbon, Nitrogen, Halogens)",
      "lessons": 8,
      "hours": 3,
      "progress": 0.82
    },
    {
      "name": "Rates of Reaction & Catalysis",
      "lessons": 8,
      "hours": 3,
      "progress": 0.8
    },
    {
      "name": "Chemical Equilibrium",
      "lessons": 8,
      "hours": 3,
      "progress": 0.78
    },
    {
      "name": "Organic Chemistry — Hydrocarbons",
      "lessons": 10,
      "hours": 4,
      "progress": 0.85
    },
    {
      "name": "Organic Chemistry — Functional Groups",
      "lessons": 12,
      "hours": 5,
      "progress": 0.8
    },
    {
      "name": "Organic Chemistry — Polymers",
      "lessons": 6,
      "hours": 2,
      "progress": 0.75
    },
    {
      "name": "Industrial Chemistry",
      "lessons": 8,
      "hours": 3,
      "progress": 0.72
    },
    {
      "name": "Environmental Chemistry & Pollution",
      "lessons": 6,
      "hours": 2,
      "progress": 0.7
    },
    {
      "name": "Nuclear Chemistry",
      "lessons": 6,
      "hours": 2,
      "progress": 0.65
    },
    {
      "name": "Qualitative Analysis",
      "lessons": 8,
      "hours": 3,
      "progress": 0.68
    }
  ],
  "Biology": [
    {
      "name": "Cell Structure & Function",
      "lessons": 12,
      "hours": 5,
      "progress": 1
    },
    {
      "name": "Cell Division — Mitosis & Meiosis",
      "lessons": 10,
      "hours": 4,
      "progress": 1
    },
    {
      "name": "Biological Molecules",
      "lessons": 10,
      "hours": 4,
      "progress": 1
    },
    {
      "name": "Enzymes",
      "lessons": 8,
      "hours": 3,
      "progress": 0.95
    },
    {
      "name": "Photosynthesis",
      "lessons": 10,
      "hours": 4,
      "progress": 1
    },
    {
      "name": "Nutrition in Animals (Feeding Types)",
      "lessons": 8,
      "hours": 3,
      "progress": 0.98
    },
    {
      "name": "Digestion & Absorption",
      "lessons": 10,
      "hours": 4,
      "progress": 0.95
    },
    {
      "name": "Transport in Plants (Osmosis, Xylem)",
      "lessons": 10,
      "hours": 4,
      "progress": 0.95
    },
    {
      "name": "Circulatory System & Blood",
      "lessons": 10,
      "hours": 4,
      "progress": 1
    },
    {
      "name": "Respiratory System",
      "lessons": 10,
      "hours": 4,
      "progress": 0.98
    },
    {
      "name": "Aerobic & Anaerobic Respiration",
      "lessons": 8,
      "hours": 3,
      "progress": 0.95
    },
    {
      "name": "Excretion — Kidney, Liver & Skin",
      "lessons": 10,
      "hours": 4,
      "progress": 0.92
    },
    {
      "name": "Homeostasis & Osmoregulation",
      "lessons": 8,
      "hours": 3,
      "progress": 0.9
    },
    {
      "name": "Nervous System & Sense Organs",
      "lessons": 10,
      "hours": 4,
      "progress": 0.95
    },
    {
      "name": "Hormones & Endocrine System",
      "lessons": 8,
      "hours": 3,
      "progress": 0.92
    },
    {
      "name": "Support & Locomotion",
      "lessons": 8,
      "hours": 3,
      "progress": 0.9
    },
    {
      "name": "Reproduction in Plants",
      "lessons": 10,
      "hours": 4,
      "progress": 0.95
    },
    {
      "name": "Reproduction in Animals",
      "lessons": 10,
      "hours": 4,
      "progress": 0.95
    },
    {
      "name": "Genetics — Mendelian Inheritance",
      "lessons": 12,
      "hours": 5,
      "progress": 0.95
    },
    {
      "name": "DNA, RNA & Protein Synthesis",
      "lessons": 10,
      "hours": 4,
      "progress": 0.9
    },
    {
      "name": "Mutations & Variation",
      "lessons": 8,
      "hours": 3,
      "progress": 0.88
    },
    {
      "name": "Evolution & Natural Selection",
      "lessons": 8,
      "hours": 3,
      "progress": 0.9
    },
    {
      "name": "Classification of Living Things",
      "lessons": 10,
      "hours": 4,
      "progress": 0.98
    },
    {
      "name": "Viruses, Bacteria & Fungi",
      "lessons": 8,
      "hours": 3,
      "progress": 0.95
    },
    {
      "name": "Ecology — Biomes & Habitats",
      "lessons": 8,
      "hours": 3,
      "progress": 0.9
    },
    {
      "name": "Food Chains, Webs & Energy Flow",
      "lessons": 8,
      "hours": 3,
      "progress": 0.92
    },
    {
      "name": "Population & Community Ecology",
      "lessons": 6,
      "hours": 2,
      "progress": 0.88
    }
  ],
  "Literature in English": [
    {
      "name": "Introduction to Literature",
      "lessons": 5,
      "hours": 2,
      "progress": 1
    },
    {
      "name": "Poetry — Figurative Language & Devices",
      "lessons": 10,
      "hours": 4,
      "progress": 0.9
    },
    {
      "name": "Poetry Analysis — African Poets",
      "lessons": 10,
      "hours": 4,
      "progress": 0.85
    },
    {
      "name": "Poetry Analysis — Non-African Poets",
      "lessons": 10,
      "hours": 4,
      "progress": 0.8
    },
    {
      "name": "Imagery & Symbolism in Poetry",
      "lessons": 8,
      "hours": 3,
      "progress": 0.78
    },
    {
      "name": "Tone, Mood & Voice in Poetry",
      "lessons": 6,
      "hours": 2,
      "progress": 0.75
    },
    {
      "name": "Prose — Narrative Techniques",
      "lessons": 8,
      "hours": 3,
      "progress": 0.72
    },
    {
      "name": "Prose — Character & Characterization",
      "lessons": 8,
      "hours": 3,
      "progress": 0.7
    },
    {
      "name": "Prose — Theme, Setting & Plot",
      "lessons": 8,
      "hours": 3,
      "progress": 0.68
    },
    {
      "name": "Prose — Point of View & Style",
      "lessons": 6,
      "hours": 2,
      "progress": 0.65
    },
    {
      "name": "Prose — African Novels (set texts)",
      "lessons": 10,
      "hours": 4,
      "progress": 0.62
    },
    {
      "name": "Drama — Structure & Elements",
      "lessons": 8,
      "hours": 3,
      "progress": 0.6
    },
    {
      "name": "Drama — Tragedy & Comedy",
      "lessons": 8,
      "hours": 3,
      "progress": 0.55
    },
    {
      "name": "Drama — Conflict & Resolution",
      "lessons": 6,
      "hours": 2,
      "progress": 0.52
    },
    {
      "name": "African Plays (set texts)",
      "lessons": 10,
      "hours": 4,
      "progress": 0.5
    },
    {
      "name": "Oral Literature — Folktales & Myths",
      "lessons": 6,
      "hours": 2,
      "progress": 0.48
    },
    {
      "name": "Oral Literature — Proverbs & Riddles",
      "lessons": 5,
      "hours": 2,
      "progress": 0.45
    },
    {
      "name": "Literary Terms & Glossary",
      "lessons": 8,
      "hours": 3,
      "progress": 0.4
    }
  ],
  "Economics": [
    {
      "name": "Intro to Economics & Economic Systems",
      "lessons": 6,
      "hours": 2,
      "progress": 1
    },
    {
      "name": "Scarcity, Choice & Opportunity Cost",
      "lessons": 6,
      "hours": 2,
      "progress": 0.95
    },
    {
      "name": "Theory of Demand",
      "lessons": 10,
      "hours": 4,
      "progress": 0.9
    },
    {
      "name": "Theory of Supply",
      "lessons": 10,
      "hours": 4,
      "progress": 0.88
    },
    {
      "name": "Price Determination & Equilibrium",
      "lessons": 8,
      "hours": 3,
      "progress": 0.85
    },
    {
      "name": "Elasticity of Demand & Supply",
      "lessons": 8,
      "hours": 3,
      "progress": 0.8
    },
    {
      "name": "Consumer Theory & Utility",
      "lessons": 8,
      "hours": 3,
      "progress": 0.75
    },
    {
      "name": "Factors of Production",
      "lessons": 8,
      "hours": 3,
      "progress": 0.72
    },
    {
      "name": "Theory of Costs (Short & Long Run)",
      "lessons": 8,
      "hours": 3,
      "progress": 0.68
    },
    {
      "name": "Market Structures",
      "lessons": 10,
      "hours": 4,
      "progress": 0.65
    },
    {
      "name": "National Income Accounting",
      "lessons": 8,
      "hours": 3,
      "progress": 0.62
    },
    {
      "name": "Money & Banking",
      "lessons": 10,
      "hours": 4,
      "progress": 0.6
    },
    {
      "name": "Monetary Policy & Central Banking",
      "lessons": 8,
      "hours": 3,
      "progress": 0.55
    },
    {
      "name": "Fiscal Policy & Taxation",
      "lessons": 8,
      "hours": 3,
      "progress": 0.52
    },
    {
      "name": "Public Finance & Government Expenditure",
      "lessons": 6,
      "hours": 2,
      "progress": 0.5
    },
    {
      "name": "International Trade",
      "lessons": 8,
      "hours": 3,
      "progress": 0.48
    },
    {
      "name": "Balance of Payments & Exchange Rates",
      "lessons": 6,
      "hours": 2,
      "progress": 0.45
    },
    {
      "name": "Economic Development & Growth",
      "lessons": 8,
      "hours": 3,
      "progress": 0.42
    },
    {
      "name": "Population & Labour Economics",
      "lessons": 6,
      "hours": 2,
      "progress": 0.4
    },
    {
      "name": "Inflation & Unemployment",
      "lessons": 8,
      "hours": 3,
      "progress": 0.38
    },
    {
      "name": "Agriculture in the Nigerian Economy",
      "lessons": 6,
      "hours": 2,
      "progress": 0.35
    },
    {
      "name": "Industrialisation & Economic Planning",
      "lessons": 6,
      "hours": 2,
      "progress": 0.3
    }
  ],
  "Government": [
    {
      "name": "Basic Concepts — State, Power & Authority",
      "lessons": 8,
      "hours": 3,
      "progress": 0.9
    },
    {
      "name": "Political Ideologies",
      "lessons": 8,
      "hours": 3,
      "progress": 0.85
    },
    {
      "name": "Forms of Government (Presidential, Parliamentary)",
      "lessons": 8,
      "hours": 3,
      "progress": 0.88
    },
    {
      "name": "Federalism — Features, Merits & Demerits",
      "lessons": 8,
      "hours": 3,
      "progress": 0.75
    },
    {
      "name": "Separation of Powers & Checks & Balances",
      "lessons": 6,
      "hours": 2,
      "progress": 0.72
    },
    {
      "name": "The Legislature",
      "lessons": 8,
      "hours": 3,
      "progress": 0.7
    },
    {
      "name": "The Executive",
      "lessons": 8,
      "hours": 3,
      "progress": 0.65
    },
    {
      "name": "The Judiciary",
      "lessons": 8,
      "hours": 3,
      "progress": 0.62
    },
    {
      "name": "Civil Service & Bureaucracy",
      "lessons": 6,
      "hours": 2,
      "progress": 0.58
    },
    {
      "name": "Constitution — Types & Features",
      "lessons": 8,
      "hours": 3,
      "progress": 0.55
    },
    {
      "name": "Nigerian Constitutional History",
      "lessons": 10,
      "hours": 4,
      "progress": 0.52
    },
    {
      "name": "Nigerian Federal System",
      "lessons": 8,
      "hours": 3,
      "progress": 0.48
    },
    {
      "name": "Local Government Administration",
      "lessons": 6,
      "hours": 2,
      "progress": 0.45
    },
    {
      "name": "Political Parties & Party Systems",
      "lessons": 6,
      "hours": 2,
      "progress": 0.42
    },
    {
      "name": "Pressure Groups & Interest Groups",
      "lessons": 6,
      "hours": 2,
      "progress": 0.4
    },
    {
      "name": "Electoral Systems & Voting",
      "lessons": 8,
      "hours": 3,
      "progress": 0.38
    },
    {
      "name": "Public Administration & Finance",
      "lessons": 6,
      "hours": 2,
      "progress": 0.35
    },
    {
      "name": "International Organizations (UN, AU, ECOWAS)",
      "lessons": 8,
      "hours": 3,
      "progress": 0.32
    },
    {
      "name": "Nigeria",
      "lessons": 6,
      "hours": 2,
      "progress": 0.3
    },
    {
      "name": "Human Rights & Civil Liberties",
      "lessons": 6,
      "hours": 2,
      "progress": 0.28
    },
    {
      "name": "Military Rule in Nigeria",
      "lessons": 6,
      "hours": 2,
      "progress": 0.25
    },
    {
      "name": "Citizenship & Civic Education",
      "lessons": 6,
      "hours": 2,
      "progress": 0.22
    }
  ],
  "Agricultural Science": [
    {
      "name": "Introduction to Agriculture",
      "lessons": 6,
      "hours": 2,
      "progress": 0.9
    },
    {
      "name": "Agricultural Ecology & Climate",
      "lessons": 6,
      "hours": 2,
      "progress": 0.85
    },
    {
      "name": "Soil Formation & Profile",
      "lessons": 8,
      "hours": 3,
      "progress": 0.8
    },
    {
      "name": "Soil Composition & Texture",
      "lessons": 8,
      "hours": 3,
      "progress": 0.75
    },
    {
      "name": "Soil Water & Air",
      "lessons": 6,
      "hours": 2,
      "progress": 0.7
    },
    {
      "name": "Soil Fertility & Crop Nutrition",
      "lessons": 8,
      "hours": 3,
      "progress": 0.65
    },
    {
      "name": "Fertilizers & Manures",
      "lessons": 8,
      "hours": 3,
      "progress": 0.6
    },
    {
      "name": "Crop Classification",
      "lessons": 6,
      "hours": 2,
      "progress": 0.68
    },
    {
      "name": "Land Preparation & Tillage",
      "lessons": 8,
      "hours": 3,
      "progress": 0.58
    },
    {
      "name": "Planting & Cultivation Practices",
      "lessons": 8,
      "hours": 3,
      "progress": 0.55
    },
    {
      "name": "Crop Improvement & Plant Breeding",
      "lessons": 6,
      "hours": 2,
      "progress": 0.5
    },
    {
      "name": "Pest Management & Control",
      "lessons": 8,
      "hours": 3,
      "progress": 0.48
    },
    {
      "name": "Plant Diseases & Control",
      "lessons": 8,
      "hours": 3,
      "progress": 0.45
    },
    {
      "name": "Harvesting, Storage & Processing",
      "lessons": 8,
      "hours": 3,
      "progress": 0.42
    },
    {
      "name": "Animal Classification & Breeds",
      "lessons": 6,
      "hours": 2,
      "progress": 0.5
    },
    {
      "name": "Animal Nutrition & Feeding",
      "lessons": 8,
      "hours": 3,
      "progress": 0.45
    },
    {
      "name": "Animal Health & Diseases",
      "lessons": 8,
      "hours": 3,
      "progress": 0.4
    },
    {
      "name": "Animal Reproduction & Breeding",
      "lessons": 6,
      "hours": 2,
      "progress": 0.38
    },
    {
      "name": "Fishery & Aquaculture",
      "lessons": 6,
      "hours": 2,
      "progress": 0.35
    },
    {
      "name": "Forestry & Wildlife Management",
      "lessons": 6,
      "hours": 2,
      "progress": 0.32
    },
    {
      "name": "Farm Mechanization & Tools",
      "lessons": 8,
      "hours": 3,
      "progress": 0.4
    },
    {
      "name": "Agricultural Economics & Marketing",
      "lessons": 6,
      "hours": 2,
      "progress": 0.3
    },
    {
      "name": "Irrigation & Water Management",
      "lessons": 6,
      "hours": 2,
      "progress": 0.28
    },
    {
      "name": "Soil Conservation & Land Use",
      "lessons": 6,
      "hours": 2,
      "progress": 0.25
    }
  ],
  "Further Mathematics": [
    {
      "name": "Surds, Indices & Logarithms",
      "lessons": 8,
      "hours": 3,
      "progress": 0.75
    },
    {
      "name": "Polynomials & Polynomial Equations",
      "lessons": 8,
      "hours": 3,
      "progress": 0.68
    },
    {
      "name": "Rational Functions & Partial Fractions",
      "lessons": 8,
      "hours": 3,
      "progress": 0.6
    },
    {
      "name": "Sequences & Series (AP, GP, AGP)",
      "lessons": 8,
      "hours": 3,
      "progress": 0.62
    },
    {
      "name": "Binomial Theorem",
      "lessons": 6,
      "hours": 2,
      "progress": 0.55
    },
    {
      "name": "Inequalities & Linear Programming",
      "lessons": 8,
      "hours": 3,
      "progress": 0.52
    },
    {
      "name": "Matrices & Determinants",
      "lessons": 10,
      "hours": 4,
      "progress": 0.5
    },
    {
      "name": "Complex Numbers",
      "lessons": 10,
      "hours": 4,
      "progress": 0.48
    },
    {
      "name": "Vectors in 2D & 3D",
      "lessons": 10,
      "hours": 4,
      "progress": 0.52
    },
    {
      "name": "Coordinate Geometry — Circles",
      "lessons": 8,
      "hours": 3,
      "progress": 0.45
    },
    {
      "name": "Conic Sections (Parabola, Ellipse, Hyperbola)",
      "lessons": 8,
      "hours": 3,
      "progress": 0.4
    },
    {
      "name": "Transformations (Translation, Rotation)",
      "lessons": 6,
      "hours": 2,
      "progress": 0.42
    },
    {
      "name": "Trigonometric Identities & Equations",
      "lessons": 10,
      "hours": 4,
      "progress": 0.45
    },
    {
      "name": "Sine Rule, Cosine Rule & Area Formula",
      "lessons": 8,
      "hours": 3,
      "progress": 0.48
    },
    {
      "name": "Differentiation — Rules & Techniques",
      "lessons": 12,
      "hours": 5,
      "progress": 0.42
    },
    {
      "name": "Differentiation — Maxima & Minima",
      "lessons": 8,
      "hours": 3,
      "progress": 0.38
    },
    {
      "name": "Differentiation — Kinematics (Motion)",
      "lessons": 6,
      "hours": 2,
      "progress": 0.35
    },
    {
      "name": "Integration — Indefinite & Definite",
      "lessons": 12,
      "hours": 5,
      "progress": 0.35
    },
    {
      "name": "Integration — Areas & Volumes of Revolution",
      "lessons": 8,
      "hours": 3,
      "progress": 0.3
    },
    {
      "name": "Differential Equations",
      "lessons": 8,
      "hours": 3,
      "progress": 0.28
    },
    {
      "name": "Statistics — Variance & Standard Deviation",
      "lessons": 8,
      "hours": 3,
      "progress": 0.3
    },
    {
      "name": "Statistics — Normal Distribution",
      "lessons": 6,
      "hours": 2,
      "progress": 0.25
    },
    {
      "name": "Probability — Discrete Distributions",
      "lessons": 8,
      "hours": 3,
      "progress": 0.22
    },
    {
      "name": "Mechanics — Kinematics in 2D",
      "lessons": 8,
      "hours": 3,
      "progress": 0.2
    },
    {
      "name": "Mechanics — Newton",
      "lessons": 8,
      "hours": 3,
      "progress": 0.18
    }
  ]
};
