import { BOARD_LAYOUT } from "../constants/board";
import BoardCell from "./board_cell";

function Board() {
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
        {BOARD_LAYOUT.flat().map((card, index) => (
          <BoardCell key={index} card={card} />
        ))}
      </div>
    </div>
  );
}

export default Board;
