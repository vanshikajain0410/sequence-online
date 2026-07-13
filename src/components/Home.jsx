import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Home({ onRoomCreated, onRoomJoined, prefillRoomCode = '' }) {
    const [name, setName] = useState('')
    const [joinCode, setJoinCode] = useState(prefillRoomCode)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function handleCreateRoom() {
        if (!name.trim()) return setError('Enter your name first')
        setLoading(true)
        setError(null)

        const browserId = crypto.randomUUID()

        const { data: room, error: roomError } = await supabase
            .from('rooms')
            .insert({ status: 'waiting', host_id: browserId })
            .select()
            .single()

        if (roomError) { setError(roomError.message); setLoading(false); return }

        const { error: playerError } = await supabase
            .from('players')
            .insert({
                room_id: room.id,
                name: name.trim(),
                colour: 'blue',
                seat_order: 0,
                is_host: true,
                browser_id: browserId,
            })

        if (playerError) { setError(playerError.message); setLoading(false); return }

        window.history.pushState({}, '', `?room=${room.id}`)
        onRoomCreated({ roomId: room.id, browserId, playerName: name.trim() })
    }

    async function handleJoinRoom() {
        if (!name.trim()) return setError('Enter your name first')
        if (!joinCode.trim()) return setError('Enter a room code')
        setLoading(true)
        setError(null)

        const browserId = crypto.randomUUID()

        const { data: room, error: roomError } = await supabase
            .from('rooms')
            .select()
            .eq('id', joinCode.trim())
            .single()

        if (roomError || !room) { setError('Room not found'); setLoading(false); return }
        if (room.status !== 'waiting') { setError('Game already started'); setLoading(false); return }

        const { data: existingPlayers } = await supabase
            .from('players')
            .select()
            .eq('room_id', room.id)

        const seatOrder = existingPlayers.length
        const colours = ['blue', 'green', 'red']
        const takenColours = existingPlayers.map(p => p.colour)
        const colour = colours.find(c => !takenColours.includes(c)) ?? 'green'

        const { error: playerError } = await supabase
            .from('players')
            .insert({
                room_id: room.id,
                name: name.trim(),
                colour,
                seat_order: seatOrder,
                is_host: false,
                browser_id: browserId,
            })

        if (playerError) { setError(playerError.message); setLoading(false); return }

        window.history.pushState({}, '', `?room=${room.id}`)
        onRoomJoined({ roomId: room.id, browserId, playerName: name.trim() })
    }

    return (
        <div className="min-h-screen bg-[#1C1B22] flex flex-col items-center justify-center px-4">
            <h1 className="text-5xl font-bold text-yellow-400 mb-2 font-serif">Sequence</h1>
            <p className="text-stone-400 text-xs tracking-widest uppercase mb-10">Online</p>

            <div className="bg-[#2A2A35] rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4 border border-stone-700">
                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="bg-[#1C1B22] text-white border border-stone-600 rounded-lg px-4 py-2.5 placeholder-stone-500 focus:outline-none focus:border-yellow-400"
                />
                <button
                    onClick={handleCreateRoom}
                    disabled={loading}
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {loading ? 'Creating...' : 'Create Room'}
                </button>

                <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-stone-700" />
                    <span className="text-stone-500 text-xsNDA">or join</span>
                    <div className="flex-1 h-px bg-stone-700" />
                </div>

                <input
                    type="text"
                    placeholder="Paste room code"
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value)}
                    className="bg-[#1C1B22] text-white border border-stone-600 rounded-lg px-4 py-2.5 placeholder-stone-500 focus:outline-none focus:border-yellow-400"
                />
                <button
                    onClick={handleJoinRoom}
                    disabled={loading}
                    className="bg-stone-700 hover:bg-stone-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {loading ? 'Joining...' : 'Join Room'}
                </button>

                {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
            </div>
        </div>
    )
}

export default Home