function BoardCell({ card }) {
  const isJoker = card === "JOKER";

  const suit = card.slice(-1);
  const isRed = suit === "♥" || suit === "♦";

  return (
    <div
      className={`
      w-12 h-16 border border-gray-600 rounded
      flex flex-col items-center justify-center
      text-xs font-semibold select-none
      ${
        isJoker
          ? "bg-yellow-400 text-gray-900"
          : "bg-stone-100 " + (isRed ? "text-red-600" : "text-gray-900")
      }
    `}
    >
      {isJoker ? "★" : card}
    </div>
  );
}

export default BoardCell;
