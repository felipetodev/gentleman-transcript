import Markdown from 'react-markdown'
import { toast } from "sonner"
import { cn } from '@/lib/utils'

export function Message({ content }: { content?: string }) {

  function copyToClipboard() {
    if (content) {
      navigator.clipboard.writeText(content)
      toast.success('Copied to clipboard')

    }
  }

  return (
    <div
      role="button"
      onClick={copyToClipboard}
      className={cn("p-4 bg-gray-800/30 rounded-lg h-[500px] border border-gray-500/50 text-white overflow-y-auto", {
        'cursor-not-allowed': !content,
        'cursor-copy': content,
      })}
    >
      {!content && <span className='grid place-items-center size-full opacity-80'>
        Not transcripted yet
      </span>}
      {content && (
        <Markdown>
          {content}
        </Markdown>
      )}
    </div>
  )
}
