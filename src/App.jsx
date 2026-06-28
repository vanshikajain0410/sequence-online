import Board from "./components/Board";

function App() {
  return (
    <div className="min-h-screen bg-[#1C1B22] flex flex-col items-center py-10 px-2">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1
          className="text-5xl font-bold text-yellow-400 tracking-wide"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Sequence
        </h1>
        <p className="text-stone-400 text-sm mt-1 tracking-widest uppercase">
          Online
        </p>
      </div>

      {/* Board container */}
      <div className="bg-[#2A2A35] rounded-2xl p-4 shadow-2xl border border-stone-700">
        <Board />
      </div>

      {/* Footer button — placeholder for now */}
      <button
        className="mt-8 bg-yellow-400 hover:bg-yellow-300 text-gray-900
        font-semibold px-8 py-3 rounded-xl shadow-lg transition-colors text-sm tracking-wide"
      >
        Create Room
      </button>
    </div>
  );
}

export default App;
