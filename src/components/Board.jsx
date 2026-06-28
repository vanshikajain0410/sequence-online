import { BOARD_LAYOUT } from "../constants/board";
import BoardCell from "./board_cell";

function Board() {
  return (
    <div className="overflow-x-auto w-full max-w-screen px-2">
      <div className="grid grid-cols-10 gap-1 min-w-max mx-auto">
        {BOARD_LAYOUT.flat().map((card, index) => (
          <BoardCell key={index} card={card} />
        ))}
      </div>
    </div>
  );
}

export default Board;
