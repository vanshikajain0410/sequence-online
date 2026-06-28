const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "A",
  "K",
  "Q",
  "J",
];

function buildDeck() {
  const deck = [];
  for (let i = 0; i < 2; i++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({ id: `${rank}${suit}-${i}`, card: `${rank}${suit}` });
      }
    }
  }
  return deck;
}
//Fisher–Yates Shuffle
function shuffle(deck) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

export function createShuffledDeck() {
  return shuffle(buildDeck());
}
