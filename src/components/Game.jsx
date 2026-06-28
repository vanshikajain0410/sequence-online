import { useState } from "react";
import { createShuffledDeck } from "../constants/deck";
import Board from "./Board";
import { BOARD_LAYOUT } from "../constants/board";

const PLAYERS = [
  { id: "p1", name: "Player 1", colour: "blue" },
  { id: "p2", name: "Player 2", colour: "green" },
];
const HAND_SIZE = 7; // 2 players get 7 cards each

function dealHands(deck, numPlayers, handSize) {
  const hands = {};
  const remaining = [...deck];
  for (const player of PLAYERS.slice(0, numPlayers)) {
    hands[player.id] = remaining.splice(0, handSize);
  }
  return { hands, remaining };
}

function initGameState() {
  const deck = createShuffledDeck();
  const { hands, remaining } = dealHands(deck, 2, HAND_SIZE);
  return {
    deck: remaining,
    hands,
    currentPlayerId: "p1",
    selectedCard: null, // { id, card } — card active player has tapped
    board: Array(10)
      .fill(null)
      .map(() => Array(10).fill(null)),
    // board[row][col] = null | 'blue' | 'green' | 'red'
    sequences: [], // completed sequences, added later
  };
}

const TWO_EYED_JACKS = ["J♣", "J♦"];
const ONE_EYED_JACKS = ["J♥", "J♠"];

function getHighlightedCells(cardValue, board, currentColour) {
  const highlighted = new Set();

  if (TWO_EYED_JACKS.includes(cardValue)) {
    // Can place on any empty non-joker cell
    BOARD_LAYOUT.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell !== "JOKER" && board[r][c] === null) {
          highlighted.add(`${r}-${c}`);
        }
      });
    });
  } else if (ONE_EYED_JACKS.includes(cardValue)) {
    // Can remove any opponent chip not in a completed sequence
    BOARD_LAYOUT.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (board[r][c] !== null && board[r][c] !== currentColour) {
          highlighted.add(`${r}-${c}`);
        }
      });
    });
  } else {
    // Normal card — highlight matching cells that are empty
    BOARD_LAYOUT.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === cardValue && board[r][c] === null) {
          highlighted.add(`${r}-${c}`);
        }
      });
    });
  }

  return highlighted;
}

function detectSequences(board) {
  const sequences = [];
  const colours = ["blue", "green", "red"];

  function isMatch(r, c, colour) {
    if (r < 0 || r > 9 || c < 0 || c > 9) return false;
    if (BOARD_LAYOUT[r][c] === "JOKER") return true; // corners are wild
    return board[r][c] === colour;
  }

  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal down-right
    [1, -1], // diagonal down-left
  ];

  for (const colour of colours) {
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        for (const [dr, dc] of directions) {
          const cells = [];

          const TEST_SEQUENCE_LENGTH = 5;
          for (let i = 0; i < TEST_SEQUENCE_LENGTH; i++) {
            const nr = r + dr * i;
            const nc = c + dc * i;
            if (isMatch(nr, nc, colour)) {
              cells.push([nr, nc]);
            } else {
              break;
            }
          }
          if (cells.length === TEST_SEQUENCE_LENGTH) {
            // Check it's not already counted
            const key = cells.map(([r, c]) => `${r}-${c}`).join("|");
            const alreadyFound = sequences.some(
              (seq) => seq.map(([r, c]) => `${r}-${c}`).join("|") === key,
            );
            if (!alreadyFound) sequences.push(cells);
          }
        }
      }
    }
  }

  return sequences;
}

function Game() {
  const [gameState, setGameState] = useState(initGameState);

  const currentPlayer = PLAYERS.find((p) => p.id === gameState.currentPlayerId);

  const highlightedCells = gameState.selectedCard
    ? getHighlightedCells(
        gameState.selectedCard.card,
        gameState.board,
        currentPlayer.colour,
      )
    : new Set();

  function handleCardSelect(cardObj, playerId) {
    if (playerId !== gameState.currentPlayerId) return;
    setGameState((prev) => ({
      ...prev,
      selectedCard: prev.selectedCard?.id === cardObj.id ? null : cardObj,
    }));
  }

  function handleCellClick(row, col, cellCard) {
    const { selectedCard, board, hands, deck, currentPlayerId } = gameState;
    if (!selectedCard) return;

    const isOneEyed = ONE_EYED_JACKS.includes(selectedCard.card);
    const isTwoEyed = TWO_EYED_JACKS.includes(selectedCard.card);
    const cellKey = `${row}-${col}`;

    if (!highlightedCells.has(cellKey)) return;

    const newBoard = board.map((r) => [...r]);

    if (isOneEyed) {
      newBoard[row][col] = null; // remove opponent chip
    } else {
      newBoard[row][col] = currentPlayer.colour;
    }

    // Remove played card from hand, draw new card
    const newDeck = [...deck];
    const drawnCard = newDeck.shift() ?? null;
    const newHand = hands[currentPlayerId].filter(
      (c) => c.id !== selectedCard.id,
    );
    if (drawnCard) newHand.push(drawnCard);

    // Switch turn
    const currentIndex = PLAYERS.findIndex((p) => p.id === currentPlayerId);
    const nextPlayer = PLAYERS[(currentIndex + 1) % PLAYERS.length];

    const newSequences = detectSequences(newBoard);

    // Check win: 2 players need 2 sequences each
    const seqByColour = {};
    for (const player of PLAYERS) {
      seqByColour[player.colour] = newSequences.filter((seq) =>
        seq.every(
          ([r, c]) =>
            BOARD_LAYOUT[r][c] === "JOKER" || newBoard[r][c] === player.colour,
        ),
      ).length;
    }
    const winner = PLAYERS.find((p) => seqByColour[p.colour] >= 2);
    if (winner) {
      setTimeout(() => alert(`🎉 ${winner.name} wins!`), 100);
    }

    setGameState((prev) => ({
      ...prev,
      board: newBoard,
      deck: newDeck,
      hands: { ...prev.hands, [currentPlayerId]: newHand },
      selectedCard: null,
      currentPlayerId: nextPlayer.id,
      sequences: newSequences,
    }));
  }

  function handleDeadDiscard(cardObj) {
    const { hands, deck, currentPlayerId } = gameState;
    const newDeck = [...deck];
    const drawnCard = newDeck.shift() ?? null;
    const newHand = hands[currentPlayerId].filter((c) => c.id !== cardObj.id);
    if (drawnCard) newHand.push(drawnCard);
    setGameState((prev) => ({
      ...prev,
      deck: newDeck,
      hands: { ...prev.hands, [currentPlayerId]: newHand },
    }));
  }

  return (
    <div className="min-h-screen bg-[#1C1B22] flex flex-col items-center py-10 px-2">
      <div className="mb-4 text-center">
        <h1
          className="text-4xl font-bold text-yellow-400"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Sequence
        </h1>
        <p className="text-stone-400 text-xs mt-1 tracking-widest uppercase">
          Online
        </p>
      </div>

      <div
        className={`mb-4 px-4 py-1.5 rounded-full text-sm font-semibold
        ${currentPlayer.colour === "blue" ? "bg-blue-500" : "bg-green-500"} text-white`}
      >
        {currentPlayer.name}'s Turn
      </div>

      <div className="bg-[#2A2A35] rounded-2xl p-4 shadow-2xl border border-stone-700">
        <Board
          board={gameState.board}
          selectedCard={gameState.selectedCard}
          highlightedCells={highlightedCells}
          sequences={gameState.sequences}
          onCellClick={handleCellClick}
        />
      </div>

      <div className="mt-6 w-full max-w-2xl flex flex-col gap-4">
        {PLAYERS.map((player) => (
          <div key={player.id}>
            <p className="text-stone-400 text-xs uppercase tracking-widest mb-2">
              {player.name}{" "}
              {player.id === gameState.currentPlayerId ? "← active" : ""}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {gameState.hands[player.id].map((cardObj) => {
                const { id, card } = cardObj;
                const isSelected = gameState.selectedCard?.id === id;
                const isActive = player.id === gameState.currentPlayerId;
                return (
                  <div
                    key={id}
                    onClick={() => handleCardSelect(cardObj, player.id)}
                    className={`min-w-[48px] h-16 bg-[#F5F0E8] rounded-lg border-2
                      flex flex-col items-center justify-center
                      text-xs font-bold shrink-0 transition-all
                      ${isActive ? "cursor-pointer hover:border-yellow-400" : "opacity-40 cursor-not-allowed"}
                      ${isSelected ? "border-yellow-400 scale-110 shadow-lg shadow-yellow-400/30" : "border-stone-300"}
                    `}
                  >
                    <span className="text-gray-900">{card.slice(0, -1)}</span>
                    <span
                      className={`text-base ${["♥", "♦"].includes(card.slice(-1)) ? "text-red-500" : "text-gray-900"}`}
                    >
                      {card.slice(-1)}
                    </span>
                    {isActive &&
                      (() => {
                        const positions = [];
                        BOARD_LAYOUT.forEach((row, r) => {
                          row.forEach((cell, c) => {
                            if (cell === card) positions.push([r, c]);
                          });
                        });
                        const isDead =
                          positions.length > 0 &&
                          positions.every(
                            ([r, c]) => gameState.board[r][c] !== null,
                          );
                        return isDead ? (
                          <div
                            className="text-yellow-400 text-xs text-center mt-1 cursor-pointer"
                            onClick={() => handleDeadDiscard(cardObj)}
                          >
                            discard
                          </div>
                        ) : null;
                      })()}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game;
