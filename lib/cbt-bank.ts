// CBT question bank — questions tagged by topic so students can pick which
// topics to be tested on. Kept in sync with the mobile app (cbt_practice_screen).
export interface CbtQuestion { q: string; opts: string[]; ans: number; topic: string }

export const CBT_BANK: Record<string, CbtQuestion[]> = {
  'Physics': [
    { q: 'What is the SI unit of electric current?', opts: ['Volt', 'Watt', 'Ampere', 'Ohm'], ans: 2, topic: 'Electricity' },
    { q: 'An object travels 60 m in 3 seconds. What is its average speed?', opts: ['10 m/s', '15 m/s', '20 m/s', '25 m/s'], ans: 2, topic: 'Motion & Forces' },
    { q: "Which of Newton's laws states F = ma?", opts: ['First law', 'Second law', 'Third law', 'Law of gravitation'], ans: 1, topic: 'Motion & Forces' },
    { q: 'What type of wave is sound?', opts: ['Transverse', 'Electromagnetic', 'Longitudinal', 'Surface'], ans: 2, topic: 'Waves & Sound' },
    { q: 'What is the speed of light in vacuum?', opts: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], ans: 1, topic: 'Light & Optics' },
    { q: "Ohm's Law states that V = ?", opts: ['I/R', 'IR', 'I²R', 'R/I'], ans: 1, topic: 'Electricity' },
    { q: 'Which colour of light has the highest frequency?', opts: ['Red', 'Green', 'Yellow', 'Violet'], ans: 3, topic: 'Light & Optics' },
    { q: 'A body at rest has zero:', opts: ['Mass', 'Weight', 'Kinetic energy', 'Potential energy'], ans: 2, topic: 'Energy' },
    { q: 'The unit of pressure is:', opts: ['Newton', 'Joule', 'Pascal', 'Watt'], ans: 2, topic: 'Heat & Matter' },
    { q: 'A solid changing directly to gas is called:', opts: ['Evaporation', 'Condensation', 'Sublimation', 'Fusion'], ans: 2, topic: 'Heat & Matter' },
    { q: 'What is the formula for kinetic energy?', opts: ['mgh', '½mv²', 'mv', 'Fd'], ans: 1, topic: 'Energy' },
    { q: 'The bending of light as it passes from one medium to another is:', opts: ['Reflection', 'Diffraction', 'Refraction', 'Dispersion'], ans: 2, topic: 'Light & Optics' },
    { q: 'Which device converts mechanical energy to electrical energy?', opts: ['Motor', 'Generator', 'Transformer', 'Capacitor'], ans: 1, topic: 'Electricity' },
    { q: 'What is the half-life of a radioactive element?', opts: ['Time for all atoms to decay', 'Time for half the atoms to decay', 'Time for one atom to decay', 'Total decay time'], ans: 1, topic: 'Modern Physics' },
    { q: 'In which medium does sound travel fastest?', opts: ['Air', 'Water', 'Vacuum', 'Steel'], ans: 3, topic: 'Waves & Sound' },
    { q: 'What type of lens is used to correct short-sightedness?', opts: ['Convex', 'Concave', 'Bifocal', 'Plane'], ans: 1, topic: 'Light & Optics' },
    { q: 'The force that opposes relative motion between surfaces is:', opts: ['Gravity', 'Normal force', 'Friction', 'Tension'], ans: 2, topic: 'Motion & Forces' },
    { q: 'What is the unit of electrical resistance?', opts: ['Volt', 'Ampere', 'Watt', 'Ohm'], ans: 3, topic: 'Electricity' },
    { q: 'Which phenomenon explains why the sky is blue?', opts: ['Reflection', 'Refraction', 'Scattering', 'Diffraction'], ans: 2, topic: 'Light & Optics' },
    { q: 'What is the relationship between frequency and wavelength?', opts: ['Direct', 'Inverse', 'Exponential', 'No relation'], ans: 1, topic: 'Waves & Sound' },
  ],
  'Chemistry': [
    { q: 'What is the chemical symbol for Gold?', opts: ['Go', 'Gd', 'Au', 'Ag'], ans: 2, topic: 'Atomic Structure' },
    { q: 'What is the pH of pure water?', opts: ['0', '7', '14', '10'], ans: 1, topic: 'Acids, Bases & Salts' },
    { q: 'How many electrons does Carbon have?', opts: ['4', '6', '8', '12'], ans: 1, topic: 'Atomic Structure' },
    { q: 'What type of bond is formed between Na and Cl?', opts: ['Covalent', 'Metallic', 'Ionic', 'Hydrogen'], ans: 2, topic: 'Chemical Bonding' },
    { q: 'Which gas is produced when zinc reacts with dilute HCl?', opts: ['Oxygen', 'Chlorine', 'Carbon dioxide', 'Hydrogen'], ans: 3, topic: 'Reactions & Energetics' },
    { q: "Avogadro's number is approximately:", opts: ['6.02×10²³', '6.02×10²²', '3.01×10²³', '1.02×10²³'], ans: 0, topic: 'Mole Concept' },
    { q: 'Which of these is a noble gas?', opts: ['Nitrogen', 'Oxygen', 'Argon', 'Fluorine'], ans: 2, topic: 'Periodic Table' },
    { q: 'What is the functional group in alcohols?', opts: ['-COOH', '-OH', '-CHO', '-NH₂'], ans: 1, topic: 'Organic Chemistry' },
    { q: 'Which acid is found in the stomach?', opts: ['H₂SO₄', 'HNO₃', 'HCl', 'H₃PO₄'], ans: 2, topic: 'Acids, Bases & Salts' },
    { q: 'A liquid turning to vapour at its surface is:', opts: ['Boiling', 'Evaporation', 'Sublimation', 'Condensation'], ans: 1, topic: 'States of Matter' },
    { q: 'What is the valency of Oxygen?', opts: ['1', '2', '3', '4'], ans: 1, topic: 'Chemical Bonding' },
    { q: 'Which of these is an alkali metal?', opts: ['Calcium', 'Magnesium', 'Potassium', 'Aluminium'], ans: 2, topic: 'Periodic Table' },
    { q: 'The molar mass of water (H₂O) is:', opts: ['16 g/mol', '18 g/mol', '20 g/mol', '22 g/mol'], ans: 1, topic: 'Mole Concept' },
    { q: 'What colour does litmus turn in acid?', opts: ['Blue', 'Green', 'Red', 'Yellow'], ans: 2, topic: 'Acids, Bases & Salts' },
    { q: 'Which gas is produced in photosynthesis?', opts: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], ans: 2, topic: 'Reactions & Energetics' },
    { q: 'The atomic number of Carbon is:', opts: ['4', '6', '8', '12'], ans: 1, topic: 'Atomic Structure' },
    { q: 'Which type of reaction releases heat?', opts: ['Endothermic', 'Exothermic', 'Isothermal', 'Adiabatic'], ans: 1, topic: 'Reactions & Energetics' },
    { q: 'What is the chemical formula for common salt?', opts: ['KCl', 'NaOH', 'NaCl', 'CaCl₂'], ans: 2, topic: 'Acids, Bases & Salts' },
    { q: 'The process of separating oil from water using density is:', opts: ['Filtration', 'Distillation', 'Decantation', 'Chromatography'], ans: 2, topic: 'Separation Techniques' },
    { q: 'Which element has the symbol Fe?', opts: ['Fluorine', 'Iron', 'Francium', 'Fermium'], ans: 1, topic: 'Atomic Structure' },
  ],
  'Biology': [
    { q: 'The powerhouse of the cell is the:', opts: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'], ans: 2, topic: 'Cell Biology' },
    { q: 'Which blood group is the universal donor?', opts: ['A', 'B', 'AB', 'O'], ans: 3, topic: 'Blood & Circulation' },
    { q: 'Photosynthesis takes place in the:', opts: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Ribosome'], ans: 1, topic: 'Plant Biology' },
    { q: 'DNA stands for:', opts: ['Deoxyribonucleic Acid', 'Deoxyribonitric Acid', 'Diribonucleic Acid', 'Dinucleic Acid'], ans: 0, topic: 'Genetics' },
    { q: 'Which organ produces insulin?', opts: ['Liver', 'Kidney', 'Pancreas', 'Stomach'], ans: 2, topic: 'Human Physiology' },
    { q: 'Plants losing water through leaves is called:', opts: ['Respiration', 'Transpiration', 'Osmosis', 'Diffusion'], ans: 1, topic: 'Plant Biology' },
    { q: 'How many chromosomes do humans normally have?', opts: ['23', '44', '46', '48'], ans: 2, topic: 'Genetics' },
    { q: 'Which vitamin is produced by the skin in sunlight?', opts: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], ans: 3, topic: 'Nutrition & Health' },
    { q: 'The basic unit of life is the:', opts: ['Tissue', 'Organ', 'Cell', 'Atom'], ans: 2, topic: 'Cell Biology' },
    { q: 'Which part of the brain controls balance?', opts: ['Cerebrum', 'Cerebellum', 'Medulla', 'Hypothalamus'], ans: 1, topic: 'Human Physiology' },
    { q: 'The process of cell division is called:', opts: ['Meiosis only', 'Mitosis only', 'Mitosis and Meiosis', 'Budding'], ans: 2, topic: 'Cell Biology' },
    { q: 'Which organ filters the blood?', opts: ['Liver', 'Kidney', 'Spleen', 'Heart'], ans: 1, topic: 'Human Physiology' },
    { q: 'What type of blood vessel carries blood away from the heart?', opts: ['Vein', 'Capillary', 'Artery', 'Venule'], ans: 2, topic: 'Blood & Circulation' },
    { q: 'The green pigment in plants is called:', opts: ['Carotene', 'Xanthophyll', 'Chlorophyll', 'Anthocyanin'], ans: 2, topic: 'Plant Biology' },
    { q: 'Which part of the flower produces pollen?', opts: ['Stigma', 'Ovary', 'Anther', 'Style'], ans: 2, topic: 'Plant Biology' },
    { q: 'Anaerobic respiration produces:', opts: ['CO₂ and H₂O', 'CO₂ and ethanol', 'O₂ and glucose', 'ATP only'], ans: 1, topic: 'Respiration' },
    { q: 'The study of heredity is called:', opts: ['Ecology', 'Cytology', 'Genetics', 'Taxonomy'], ans: 2, topic: 'Genetics' },
    { q: 'Which disease is caused by a deficiency of Vitamin C?', opts: ['Rickets', 'Scurvy', 'Pellagra', 'Beri-beri'], ans: 1, topic: 'Nutrition & Health' },
    { q: 'The functional unit of the kidney is the:', opts: ['Glomerulus', 'Nephron', 'Tubule', 'Ureter'], ans: 1, topic: 'Human Physiology' },
    { q: 'Which gas do plants absorb during photosynthesis?', opts: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], ans: 2, topic: 'Plant Biology' },
  ],
  'Mathematics': [
    { q: 'If x² − 5x + 6 = 0, what are the values of x?', opts: ['x = 1 and 6', 'x = 2 and 3', 'x = −2 and −3', 'x = 5 and 1'], ans: 1, topic: 'Quadratic Equations' },
    { q: 'What is the value of sin 30° + cos 60°?', opts: ['0.5', '1', '√3/2', '√2/2'], ans: 1, topic: 'Trigonometry' },
    { q: 'Find the gradient of the line joining (2, 3) and (6, 11).', opts: ['1', '2', '3', '4'], ans: 1, topic: 'Coordinate Geometry' },
    { q: 'If log₂ 8 = x, find x.', opts: ['2', '3', '4', '6'], ans: 1, topic: 'Indices & Logarithms' },
    { q: 'A circle has radius 7 cm. Find its area. (π = 22/7)', opts: ['154 cm²', '44 cm²', '22 cm²', '308 cm²'], ans: 0, topic: 'Mensuration' },
    { q: 'Evaluate: ∫(2x + 3) dx', opts: ['x² + 3x + C', '2x² + 3 + C', 'x² + C', '2x + C'], ans: 0, topic: 'Calculus' },
    { q: 'What is 15% of 240?', opts: ['30', '36', '42', '48'], ans: 1, topic: 'Percentages' },
    { q: 'Simplify: (3x² + 2x − 1) ÷ (x + 1)', opts: ['3x + 1', '3x − 1', '3x − 5', '3x + 5'], ans: 1, topic: 'Algebra' },
    { q: 'Sum of first 20 terms of AP is 400, first term is 2. Find common difference.', opts: ['2', '3', '4', '5'], ans: 0, topic: 'Sequences & Series' },
    { q: 'In a class of 40, 25 study French, 20 Spanish, 10 both. How many study neither?', opts: ['5', '10', '15', '20'], ans: 0, topic: 'Sets' },
    { q: 'Factorize: 2x² + 7x + 3', opts: ['(2x + 1)(x + 3)', '(2x + 3)(x + 1)', '(x + 3)(2x − 1)', '(2x − 3)(x − 1)'], ans: 0, topic: 'Algebra' },
    { q: 'Find the sum of the first 10 natural numbers.', opts: ['45', '50', '55', '60'], ans: 2, topic: 'Sequences & Series' },
    { q: 'If P(A) = 0.4 and P(B) = 0.3 and A,B are independent, find P(A∩B).', opts: ['0.7', '0.1', '0.12', '0.34'], ans: 2, topic: 'Probability' },
    { q: 'What is the value of (−3)³?', opts: ['9', '−9', '27', '−27'], ans: 3, topic: 'Indices & Logarithms' },
    { q: 'The interior angles of a polygon sum to 1080°. How many sides does it have?', opts: ['6', '7', '8', '9'], ans: 2, topic: 'Geometry' },
    { q: 'Differentiate y = 3x⁴ + 2x² − 5 with respect to x.', opts: ['12x³ + 4x', '12x³ + 2x', '3x³ + 2x', '12x⁴ + 4x'], ans: 0, topic: 'Calculus' },
    { q: 'Find the 10th term of the AP: 3, 7, 11, ...', opts: ['37', '39', '41', '43'], ans: 1, topic: 'Sequences & Series' },
    { q: 'Solve for x: 3x + 7 = 22', opts: ['4', '5', '6', '7'], ans: 1, topic: 'Algebra' },
    { q: 'What is the HCF of 36 and 48?', opts: ['6', '9', '12', '18'], ans: 2, topic: 'Number Theory' },
    { q: 'Convert 45° to radians.', opts: ['π/2', 'π/3', 'π/4', 'π/6'], ans: 2, topic: 'Trigonometry' },
  ],
};

export interface CbtExam { qs: number; mins: number; color: string; }
export const CBT_EXAMS: Record<string, CbtExam> = {
  JAMB: { qs: 20, mins: 25, color: "#0D6E6E" },
  WAEC: { qs: 20, mins: 30, color: "#1D4ED8" },
  NECO: { qs: 20, mins: 28, color: "#059669" },
  Nursing: { qs: 20, mins: 30, color: "#BE185D" },
};

/// Distinct topics available for a subject, in first-seen order.
export function cbtTopics(subject: string): string[] {
  const seen: string[] = [];
  for (const q of CBT_BANK[subject] || []) {
    if (!seen.includes(q.topic)) seen.push(q.topic);
  }
  return seen;
}
