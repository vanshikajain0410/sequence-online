import { BOARD_LAYOUT } from "../constants/board";
import BoardCell from "./board_cell";

function Board({
  board,
  selectedCard,
  highlightedCells = new Set(),
  sequences,
  onCellClick,
}) {
  const lockedCells = new Set(
    sequences.flatMap((seq) => seq.map(([r, c]) => `${r}-${c}`)),
  );

  return (
    <div className="overflow-x-auto w-full px-4">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, auto)",
          gap: "6px",
        }}
        className="mx-auto w-fit"
      >
        {BOARD_LAYOUT.flat().map((card, index) => {
          const row = Math.floor(index / 10);
          const col = index % 10;
          const chip = board[row][col];
          const isLocked = lockedCells.has(`${row}-${col}`);
          const isHighlighted = highlightedCells.has(`${row}-${col}`);

          return (
            <BoardCell
              key={index}
              card={card}
              chip={chip}
              isLocked={isLocked}
              isHighlighted={isHighlighted}
              onClick={() => onCellClick(row, col, card)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Board;
