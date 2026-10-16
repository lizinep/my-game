export const THEMES = [
  {
    id: 'animals',
    name: '🐶 可愛萌寵',
    accentColor: '#3b82f6',
    items: [
      { id: 'dog', emoji: '🐶', label: '小狗', color: '#ffeedb' },
      { id: 'cat', emoji: '🐱', label: '小貓', color: '#fef3c7' },
      { id: 'panda', emoji: '🐼', label: '熊貓', color: '#f3f4f6' },
      { id: 'fox', emoji: '🦊', label: '狐狸', color: '#ffedd5' },
      { id: 'koala', emoji: '🐨', label: '無尾熊', color: '#e0e7ff' },
      { id: 'lion', emoji: '🦁', label: '獅子', color: '#fef08a' },
      { id: 'rabbit', emoji: '🐰', label: '兔子', color: '#fce7f3' },
      { id: 'penguin', emoji: '🐧', label: '企鵝', color: '#e0f2fe' },
    ],
  },
  {
    id: 'sweets',
    name: '🍰 甜蜜下午茶',
    accentColor: '#ec4899',
    items: [
      { id: 'cake', emoji: '🍰', label: '蛋糕', color: '#ffe4e6' },
      { id: 'donut', emoji: '🍩', label: '甜甜圈', color: '#fce7f3' },
      { id: 'icecream', emoji: '🍦', label: '冰淇淋', color: '#fef3c7' },
      { id: 'cookie', emoji: '🍪', label: '餅乾', color: '#ffedd5' },
      { id: 'pudding', emoji: '🍮', label: '布丁', color: '#fef9c3' },
      { id: 'strawberry', emoji: '🍓', label: '草莓', color: '#ffe4e6' },
      { id: 'candy', emoji: '🍬', label: '糖果', color: '#e0e7ff' },
      { id: 'boba', emoji: '🧋', label: '珍珠奶茶', color: '#ffedd5' },
    ],
  },
  {
    id: 'space',
    name: '🚀 宇宙探險',
    accentColor: '#8b5cf6',
    items: [
      { id: 'rocket', emoji: '🚀', label: '火箭', color: '#ede9fe' },
      { id: 'alien', emoji: '👾', label: '外星人', color: '#f3e8ff' },
      { id: 'planet', emoji: '🪐', label: '土星', color: '#fae8ff' },
      { id: 'telescope', emoji: '🔭', label: '望遠鏡', color: '#e0e7ff' },
      { id: 'astronaut', emoji: '👨‍🚀', label: '宇航員', color: '#ede9fe' },
      { id: 'star', emoji: '⭐', label: '恆星', color: '#fef08a' },
      { id: 'satellite', emoji: '🛰️', label: '人造衛星', color: '#e2e8f0' },
      { id: 'comet', emoji: '☄️', label: '彗星', color: '#ffedd5' },
    ],
  },
];

// Helper to generate a 16-card shuffled deck (8 pairs)
export function generateDeck(themeId = 'animals') {
  const selectedTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const items = selectedTheme.items; // exactly 8 unique items

  // Duplicate to make 16 cards (8 pairs)
  const deck = [];
  items.forEach((item, index) => {
    // First copy
    deck.push({
      uniqueId: `${item.id}-1`,
      pairId: item.id,
      emoji: item.emoji,
      label: item.label,
      bg: item.color,
    });
    // Second copy
    deck.push({
      uniqueId: `${item.id}-2`,
      pairId: item.id,
      emoji: item.emoji,
      label: item.label,
      bg: item.color,
    });
  });

  // Fisher-Yates shuffle algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}
