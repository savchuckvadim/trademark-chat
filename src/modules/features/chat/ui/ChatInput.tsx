import { useState, type FormEvent } from 'react'
import { Button } from '@components/ui/button'
import { SendIcon } from 'lucide-react'


export const ChatInput = () => {
  const [input, setInput] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [isSending, setIsSending] = useState(false)


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setInput('')

  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border rounded-md"
        disabled={disabled}
      />
      <Button
        type="submit"
        disabled={disabled || !input.trim()}
        onClick={() => setIsSending(!isSending)}
        variant={isSending ? 'destructive' : 'default'}
      >
        <SendIcon className="w-4 h-4" />
        {isSending ? 'Sending...' : 'Send'}
      </Button>
    </form>
  )
}
