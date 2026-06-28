import Board from "./components/Board";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Sequence Online</h1>
      <Board />
    </div>
  );
}

export default App;
