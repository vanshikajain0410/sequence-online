function BoardCell({ card }) {
  const isJoker = card === "JOKER";
  const suit = card.slice(-1);
  const isRed = suit === "♥" || suit === "♦";
  const rank = isJoker ? "" : card.slice(0, -1);

  return (
    <div
      className={`
      w-14 h-20 rounded-lg border-2 select-none
      flex flex-col items-center justify-center gap-0.5
      shadow-md transition-transform
      ${
        isJoker
          ? "bg-yellow-400 border-yellow-300 text-gray-900"
          : `bg-[#F5F0E8] border-stone-300 ${isRed ? "text-red-600" : "text-gray-900"}`
      }
    `}
    >
      {isJoker ? (
        <span className="text-2xl">★</span>
      ) : (
        <>
          <span className="text-sm font-bold leading-none">{rank}</span>
          <span className="text-base leading-none">{suit}</span>
        </>
      )}
    </div>
  );
}

export default BoardCell;
