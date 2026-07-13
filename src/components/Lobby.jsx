import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function Lobby({ roomId, browserId, onGameStart }) {
    const [players, setPlayers] = useState([])
    const [isHost, setIsHost] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function loadPlayers() {
            const { data } = await supabase
                .from('players')
                .select()
                .eq('room_id', roomId)
                .order('seat_order')

            setPlayers(data ?? [])
            setIsHost(data?.some(p => p.browser_id === browserId && p.is_host) ?? false)
        }

        loadPlayers()
        const interval = setInterval(loadPlayers, 3000)
        return () => clearInterval(interval)
    }, [roomId, browserId])

    async function handleStartGame() {
        if (players.length < 2) return
        setLoading(true)

        await supabase
            .from('rooms')
            .update({ status: 'in_progress' })
            .eq('id', roomId)

        onGameStart({ players })
    }

    const colourDots = { blue: 'bg-blue-500', green: 'bg-green-500', red: 'bg-red-500' }

    return (
        <div className="min-h-screen bg-[#1C1B22] flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl font-bold text-yellow-400 mb-1 font-serif">Sequence</h1>
            <p className="text-stone-400 text-xs tracking-widest uppercase mb-8">Lobby</p>

            <div className="bg-[#2A2A35] rounded-2xl p-6 w-full max-w-sm border border-stone-700 mb-6">
                <p className="text-stone-400 text-xs uppercase tracking-widest mb-3">Room Code</p>
                <div className="flex items-center gap-3">
                    <p className="text-white font-mono text-xs break-all flex-1 select-all">{roomId}</p>
                    <button
                        onClick={() => navigator.clipboard.writeText(`${window.location.origin}?room=${roomId}`)}
                        className="text-yellow-400 text-xs border border-yellow-400 px-2 py-1 rounded hover:bg-yellow-400 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                        Copy Link
                    </button>
                </div>
            </div>

            <div className="bg-[#2A2A35] rounded-2xl p-6 w-full max-w-sm border border-stone-700 mb-6">
                <p className="text-stone-400 text-xs uppercase tracking-widest mb-4">
                    Players ({players.length}/6)
                </p>
                <div className="flex flex-col gap-3">
                    {players.map(player => (
                        <div key={player.id} className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${colourDots[player.colour] || 'bg-gray-400'}`} />
                            <span className="text-white text-sm">{player.name}</span>
                            {player.is_host && <span className="text-yellow-400 text-xs ml-auto font-medium">host</span>}
                            {player.browser_id === browserId && <span className="text-stone-500 text-xs ml-auto">you</span>}
                        </div>
                    ))}
                </div>
            </div>

            {isHost ? (
                <button
                    onClick={handleStartGame}
                    disabled={players.length < 2 || loading}
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                    {players.length < 2 ? 'Waiting for players...' : 'Start Game'}
                </button>
            ) : (
                <p className="text-stone-500 text-sm animate-pulse">Waiting for host to start...</p>
            )}
        </div>
    )
}

export default Lobby