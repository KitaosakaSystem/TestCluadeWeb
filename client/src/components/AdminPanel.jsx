import { useState, useEffect } from 'react'
import './AdminPanel.css'

const API_URL = 'http://localhost:3001/api'

function AdminPanel() {
  const [scenarios, setScenarios] = useState([])
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // フォームの状態
  const [formData, setFormData] = useState({
    id: '',
    message: '',
    html_content: '',
    parent_id: '',
    order_index: 0,
    options: []
  })

  useEffect(() => {
    fetchScenarios()
  }, [])

  const fetchScenarios = async () => {
    try {
      const response = await fetch(`${API_URL}/scenarios`)
      const data = await response.json()
      setScenarios(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch scenarios:', error)
      setIsLoading(false)
    }
  }

  const handleEdit = (scenario) => {
    setSelectedScenario(scenario)
    setFormData({
      id: scenario.id,
      message: scenario.message,
      html_content: scenario.html_content || '',
      parent_id: scenario.parent_id || '',
      order_index: scenario.order_index || 0,
      options: scenario.options || []
    })
    setIsEditing(true)
  }

  const handleCreate = () => {
    setSelectedScenario(null)
    setFormData({
      id: '',
      message: '',
      html_content: '',
      parent_id: '',
      order_index: 0,
      options: []
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedScenario(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = selectedScenario
        ? `${API_URL}/scenarios/${selectedScenario.id}`
        : `${API_URL}/scenarios`

      const method = selectedScenario ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchScenarios()
        setIsEditing(false)
        setSelectedScenario(null)
        alert(selectedScenario ? 'シナリオを更新しました' : 'シナリオを作成しました')
      } else {
        alert('エラーが発生しました')
      }
    } catch (error) {
      console.error('Error saving scenario:', error)
      alert('エラーが発生しました')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('このシナリオを削除してもよろしいですか？')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/scenarios/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchScenarios()
        alert('シナリオを削除しました')
      } else {
        alert('エラーが発生しました')
      }
    } catch (error) {
      console.error('Error deleting scenario:', error)
      alert('エラーが発生しました')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [
        ...prev.options,
        { text: '', next_scenario_id: '', order_index: prev.options.length }
      ]
    }))
  }

  const handleRemoveOption = (index) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const handleOptionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      )
    }))
  }

  if (isLoading) {
    return (
      <div className="admin-panel">
        <div className="loading">
          <div className="spinner"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>⚙️ シナリオ管理画面</h1>
        <button className="btn-create" onClick={handleCreate}>
          ➕ 新規シナリオ作成
        </button>
      </div>

      <div className="admin-content">
        {!isEditing ? (
          <div className="scenarios-list">
            <h2>シナリオ一覧 ({scenarios.length}件)</h2>
            <div className="scenarios-grid">
              {scenarios.map(scenario => (
                <div key={scenario.id} className="scenario-card">
                  <div className="scenario-header">
                    <h3>{scenario.id}</h3>
                    <div className="scenario-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(scenario)}
                      >
                        編集
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(scenario.id)}
                      >
                        削除
                      </button>
                    </div>
                  </div>
                  <p className="scenario-message">{scenario.message}</p>
                  {scenario.options && scenario.options.length > 0 && (
                    <div className="scenario-options">
                      <small>選択肢: {scenario.options.length}件</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="scenario-form">
            <h2>{selectedScenario ? 'シナリオ編集' : '新規シナリオ作成'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>シナリオID *</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  disabled={!!selectedScenario}
                  required
                  placeholder="例: login_password"
                />
              </div>

              <div className="form-group">
                <label>メッセージ *</label>
                <input
                  type="text"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="例: パスワードをお忘れの場合"
                />
              </div>

              <div className="form-group">
                <label>HTML内容（詳細な説明）</label>
                <textarea
                  name="html_content"
                  value={formData.html_content}
                  onChange={handleInputChange}
                  rows="10"
                  placeholder="HTMLタグを使用できます。例: <h3>見出し</h3><p>本文</p><ul><li>項目1</li></ul>"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>親シナリオID</label>
                  <input
                    type="text"
                    name="parent_id"
                    value={formData.parent_id}
                    onChange={handleInputChange}
                    placeholder="例: start"
                  />
                </div>

                <div className="form-group">
                  <label>表示順序</label>
                  <input
                    type="number"
                    name="order_index"
                    value={formData.order_index}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>選択肢</label>
                <div className="options-editor">
                  {formData.options.map((option, index) => (
                    <div key={index} className="option-editor">
                      <div className="option-fields">
                        <input
                          type="text"
                          placeholder="選択肢のテキスト"
                          value={option.text}
                          onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="次のシナリオID"
                          value={option.next_scenario_id}
                          onChange={(e) => handleOptionChange(index, 'next_scenario_id', e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => handleRemoveOption(index)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-add-option"
                    onClick={handleAddOption}
                  >
                    ➕ 選択肢を追加
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                  キャンセル
                </button>
                <button type="submit" className="btn-submit">
                  {selectedScenario ? '更新' : '作成'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
