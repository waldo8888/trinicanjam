import type { MenuItem, MenuCategory } from '@/types'

export const MENU_CATEGORIES: MenuCategory[] = [
  'starters',
  'mains',
  'sides',
  'drinks',
]

export const MENU_ITEMS: MenuItem[] = [
  // ── STARTERS ──────────────────────────────────────────────────
  {
    id: 'doubles',
    name: 'Doubles',
    description:
      "Two bara (fried dough) loaded with curried channa, tamarind, pepper and shadow beni — Trinidad's most iconic street food, morning through midnight.",
    price: '$9',
    category: 'starters',
  },
  {
    id: 'ackee-saltfish-fritters',
    name: 'Ackee & Saltfish Fritters',
    description:
      "Jamaica's national dish reimagined as crispy golden fritters — sautéed ackee and salt cod bound in a light batter with scotch bonnet and thyme.",
    price: '$14',
    category: 'starters',
  },
  {
    id: 'corn-soup',
    name: 'Trini Corn Soup',
    description:
      'A thick, warming Trinidadian street-food classic: split peas, corn, dasheen and pumpkin simmered with geera-spiced dumplings in a fragrant golden broth.',
    price: '$12',
    category: 'starters',
  },
  {
    id: 'roti-choka',
    name: 'Sada Roti & Tomato Choka',
    description:
      'Pillowy Trinidadian flatbread served warm alongside fire-roasted tomato choka seasoned with chadon beni — pure comfort in every tear.',
    price: '$10',
    category: 'starters',
  },

  // ── MAINS ─────────────────────────────────────────────────────
  {
    id: 'jerk-chicken',
    name: 'Jerk Chicken',
    description:
      'Whole chicken quarters marinated overnight in scotch bonnet, allspice and thyme, slow-smoked over pimento wood — bold, smoky and impossibly juicy.',
    price: '$28',
    category: 'mains',
    featured: true,
  },
  {
    id: 'oxtail-stew',
    name: 'Oxtail Stew',
    description:
      'Slow-braised Jamaican oxtail with butter beans, reduced to a deeply savoury, gelatinous glory — served with coconut rice and peas. Sunday in a bowl.',
    price: '$32',
    category: 'mains',
    featured: true,
  },
  {
    id: 'pelau',
    name: 'Chicken Pelau',
    description:
      "Trinidad's comforting one-pot: caramel-browned chicken slow-cooked with pigeon peas, coconut milk and fresh herbs until every grain of rice sings.",
    price: '$26',
    category: 'mains',
  },
  {
    id: 'curry-goat',
    name: 'Curry Goat',
    description:
      'Trinidadian-style bone-in goat braised with Madras curry, roasted geera and scotch bonnet — served with paratha roti for proper soaking.',
    price: '$30',
    category: 'mains',
  },

  // ── SIDES ─────────────────────────────────────────────────────
  {
    id: 'coconut-rice-peas',
    name: 'Coconut Rice & Peas',
    description:
      'Jamaican red kidney beans simmered in coconut milk with thyme and scallion, then folded through fragrant long-grain rice — the essential pairing.',
    price: '$7',
    category: 'sides',
  },
  {
    id: 'sweet-plantains',
    name: 'Fried Sweet Plantains',
    description:
      'Ripe plantains pan-fried to a caramelised golden finish — sweet, soft and exactly the balance every jerk or stew plate needs.',
    price: '$6',
    category: 'sides',
  },
  {
    id: 'callaloo',
    name: 'Callaloo',
    description:
      'Dasheen bush leaves slow-stewed with okra, coconut milk, crab meat and fresh herbs — a silky Trinidadian staple that doubles as a sauce.',
    price: '$8',
    category: 'sides',
  },

  // ── DRINKS ────────────────────────────────────────────────────
  {
    id: 'rum-punch',
    name: 'Caribbean Rum Punch',
    description:
      "The bartender's mantra: one sour, two sweet, three strong, four weak — fresh lime, cane syrup, aged rum and a pinch of Angostura bitters, served over ice.",
    price: '$14',
    category: 'drinks',
  },
  {
    id: 'sorrel-drink',
    name: 'Sorrel Cooler',
    description:
      'Steeped dried hibiscus flowers with fresh ginger and cloves, sweetened lightly and poured over crushed ice — bright, tart and unmistakably Caribbean.',
    price: '$7',
    category: 'drinks',
  },
  {
    id: 'mauby',
    name: 'Mauby',
    description:
      'A Trinidadian heritage drink brewed from mauby bark with cinnamon, anise and brown sugar — pleasantly bitter-sweet and utterly refreshing over ice.',
    price: '$6',
    category: 'drinks',
  },
]
