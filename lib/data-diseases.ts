export interface DiseaseInfo {
  id: string;
  name: string;
  type: 'fungal' | 'bacterial' | 'pest' | 'environmental';
  symptoms: string[];
  causes: string;
  treatment: string;
  prevention: string;
}

export const diseases: DiseaseInfo[] = [
  {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    type: 'fungal',
    symptoms: [
      'White, flour-like spots on leaves and stems',
      'Curling or distorted leaves',
      'Premature leaf drop'
    ],
    causes: 'High humidity and poor air circulation. Warm days and cool nights favor spore production.',
    treatment: 'Apply a mixture of 1 tablespoon baking soda, 1/2 teaspoon liquid soap, and 1 gallon of water. Spray surfaces thoroughly.',
    prevention: 'Increase spacing between plants, avoid overhead watering, and select resistant varieties.'
  },
  {
    id: 'aphids',
    name: 'Aphids',
    type: 'pest',
    symptoms: [
      'Small, pear-shaped insects on undersides of leaves',
      'Sticky residue (honeydew) on foliage',
      'Yellowing or misshapen leaves'
    ],
    causes: 'Weakened plants or lack of natural predators like ladybugs.',
    treatment: 'Blast with a steady stream of water from a hose, or use organic Neem oil or insecticidal soap.',
    prevention: 'Encourage beneficial insects, avoid excessive nitrogen fertilizers which produce "soft" growth aphids love.'
  },
  {
    id: 'root-rot',
    name: 'Root Rot',
    type: 'fungal',
    symptoms: [
      'Yellowing leaves despite moist soil',
      'Wilting even after watering',
      'Dark, mushy, or foul-smelling roots'
    ],
    causes: 'Poorly draining soil or overwatering, creating an anaerobic environment for fungal pathogens.',
    treatment: 'Prune away affected roots, repot in sterile, well-draining soil, and reduce watering frequency.',
    prevention: 'Use appropriate pots with drainage holes and allow the top inch of soil to dry before watering.'
  },
  {
    id: 'spider-mites',
    name: 'Spider Mites',
    type: 'pest',
    symptoms: [
      'Fine webbing between leaves and stems',
      'Tiny yellow or white speckling on leaves',
      'Pale, washed-out appearance of foliage'
    ],
    causes: 'Hot, dry conditions and low humidity.',
    treatment: 'Increase humidity around the plant and spray with a mixture of water and rosemary oil, or use Neem oil.',
    prevention: 'Keep plants well-hydrated and wash foliage occasionally to remove dust where mites thrive.'
  },
  {
    id: 'rust',
    name: 'Rust',
    type: 'fungal',
    symptoms: [
      'Orange, red, or yellowish pustules on leaf undersides',
      'Pale spots on the upper leaf surface',
      'Defoliation in severe cases'
    ],
    causes: 'Long periods of leaf wetness and mild temperatures.',
    treatment: 'Remove and destroy infected leaves immediately. Apply a sulfur-based organic fungicide.',
    prevention: 'Avoid wetting foliage when watering and improve airflow.'
  },
  {
    id: 'leaf-spot',
    name: 'Bacterial Leaf Spot',
    type: 'bacterial',
    symptoms: [
      'Small, dark, water-soaked spots with yellow halos',
      'Spots may eventually dry out and fall out (shot-hole)',
      'Fruit may also develop lesions'
    ],
    causes: 'Splashing water from rain or irrigation spreading bacteria.',
    treatment: 'Remove infected plant debris. Copper-based organic sprays can help slow the spread if caught early.',
    prevention: 'Rotate crops annually and avoid working among plants while they are wet.'
  }
];
