import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Home() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    checkUser()
    fetchMessages()

    const channel = supabase.channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function signUp() {
    await supabase.auth.signUp({ email, password })
    checkUser()
  }

  async function signIn() {
    await supabase.auth.signInWithPassword({ email, password })
    checkUser()
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function fetchMessages() {
    let { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true })
    setMessages(data || [])
  }

  async function sendMessage() {
    if (newMessage.trim() === '') return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('messages').insert([{ content: newMessage, user_id: user.id }])
    setNewMessage('')
  }

  return (
    <div className="container">
      {!user ? (
        <div className="auth-box">
          <h2>Raymond Chats</h2>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={signUp}>Sign Up</button>
          <button onClick={signIn}>Log In</button>
        </div>
      ) : (
        <div className="chat-box">
          <h2>Welcome to Raymond Chats</h2>
          <button onClick={signOut}>Logout</button>
          <div className="messages">
            {messages.map((msg) => (
              <div key={msg.id} className="message">{msg.content}</div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  )
}
