import { useState, useEffect, useRef } from 'react'
import './Chatbot.css'

const API_URL = 'http://localhost:3001/api'

function Chatbot() {
  const [messages, setMessages] = useState([])
  const [currentScenarioId, setCurrentScenarioId] = useState('start')
  const [scenarios, setScenarios] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const chatContainerRef = useRef(null)

  // シナリオデータの取得
  useEffect(() => {
    fetchScenarios()
  }, [])

  // 初期メッセージの表示
  useEffect(() => {
    if (Object.keys(scenarios).length > 0 && messages.length === 0) {
      setTimeout(() => {
        showScenario('start')
      }, 500)
    }
  }, [scenarios])

  // メッセージ追加時にスクロール
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const fetchScenarios = async () => {
    try {
      const response = await fetch(`${API_URL}/scenarios`)
      const data = await response.json()

      // シナリオをオブジェクトに変換
      const scenariosMap = {}
      data.forEach(scenario => {
        scenariosMap[scenario.id] = scenario
      })

      setScenarios(scenariosMap)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch scenarios:', error)
      setIsLoading(false)
    }
  }

  const showScenario = (scenarioId) => {
    const scenario = scenarios[scenarioId]
    if (!scenario) return

    setCurrentScenarioId(scenarioId)

    // ボットメッセージを追加
    const botMessage = {
      type: 'bot',
      text: scenario.message,
      html: scenario.html_content,
      options: scenario.options,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, botMessage])
  }

  const handleOptionClick = (optionText, nextScenarioId) => {
    // ユーザーの選択を追加
    const userMessage = {
      type: 'user',
      text: optionText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    // タイピングインジケーターを表示
    setIsTyping(true)

    // 少し遅延してボットの応答を表示
    setTimeout(() => {
      setIsTyping(false)
      showScenario(nextScenarioId)
    }, 800)
  }

  if (isLoading) {
    return (
      <div className="chatbot-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-content">
          <h1>サポートチャットボット</h1>
          <p>お困りの内容を選択してください。最適な解決方法をご案内いたします。</p>
        </div>
      </div>

      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.type === 'bot' && (
              <div className="bot-avatar">🏥</div>
            )}
            <div className="message-content">
              {message.text && <p>{message.text}</p>}
              {message.html && (
                <div
                  className="html-content"
                  dangerouslySetInnerHTML={{ __html: message.html }}
                />
              )}
              {message.options && message.options.length > 0 && index === messages.length - 1 && (
                <div className="options">
                  {message.options.map((option) => (
                    <button
                      key={option.id}
                      className="option-button"
                      onClick={() => handleOptionClick(option.text, option.next_scenario_id)}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message bot">
            <div className="bot-avatar">🏥</div>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className="chatbot-footer">
        <p>24時間いつでもご利用いただけます | お困りの際はお気軽にお問い合わせください</p>
      </div>
    </div>
  )
}

export default Chatbot
