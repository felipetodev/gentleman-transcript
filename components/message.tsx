import Markdown from 'react-markdown'
import { toast } from "sonner"

export function Message({ content }: { content?: string }) {

  function copyToClipboard() {
    content && navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard')
  }

  return (
    <div
      role="button"
      onClick={copyToClipboard}
      className="p-4 bg-gray-800/30 rounded-lg cursor-copy h-[500px] border border-gray-500/50 overflow-y-auto"
    >
      {content && (
        <Markdown
          className="text-white"
        >
          {content}
        </Markdown>
      )}
    </div>
  )
}
