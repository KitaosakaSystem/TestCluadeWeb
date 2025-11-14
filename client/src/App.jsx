import { useState } from 'react'
import Chatbot from './components/Chatbot'
import AdminPanel from './components/AdminPanel'
import './App.css'

function App() {
  const [view, setView] = useState('chatbot') // 'chatbot' or 'admin'

  return (
    <div className="app">
      <nav className="app-nav">
        <button
          className={view === 'chatbot' ? 'active' : ''}
          onClick={() => setView('chatbot')}
        >
          💬 チャットボット
        </button>
        <button
          className={view === 'admin' ? 'active' : ''}
          onClick={() => setView('admin')}
        >
          ⚙️ 管理画面
        </button>
      </nav>

      <div className="app-content">
        {view === 'chatbot' ? <Chatbot /> : <AdminPanel />}
      </div>
    </div>
  )
}

export default App
