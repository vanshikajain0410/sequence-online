function BoardCell({ card, chip, isLocked, isHighlighted, onClick }) {
  const isJoker = card === "JOKER";
  const suit = isJoker ? "" : card.slice(-1);
  const rank = isJoker ? "" : card.slice(0, -1);
  const isRed = suit === "♥" || suit === "♦";

  const chipColours = {
    blue: "bg-blue-500 border-blue-300",
    green: "bg-green-500 border-green-300",
    red: "bg-red-500 border-red-300",
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative
        w-14 h-20
        rounded-lg
        border-2
        select-none
        cursor-pointer
        flex
        flex-col
        items-center
        justify-center
        gap-0.5
        shadow-md
        transition-all
        duration-200

        ${
          isHighlighted
            ? "border-yellow-400 bg-yellow-50 scale-105 shadow-yellow-300/50"
            : isJoker
              ? "bg-yellow-400 border-yellow-300 text-gray-900"
              : `bg-[#F5F0E8] border-stone-300 ${
                  isRed ? "text-red-600" : "text-gray-900"
                }`
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

      {/* Chip */}
      {chip && (
        <div
          className={`
            absolute
            w-10
            h-10
            rounded-full
            border-4
            ${chipColours[chip]}
            ${isLocked ? "ring-4 ring-yellow-300 ring-offset-1" : ""}
          `}
        />
      )}
    </div>
  );
}

export default BoardCell;
