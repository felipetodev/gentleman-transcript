import Markdown from 'react-markdown'
import { toast } from "sonner"
import { ClipboardIcon } from 'lucide-react'
import { Loader } from '@/components/loader'
import { cn } from '@/lib/utils'

export function Message({ content, isLoading }: { content?: string, isLoading: boolean }) {

  function copyToClipboard() {
    if (content) {
      navigator.clipboard.writeText(content.replaceAll('.- ', '.\n- '))
      toast.success('Copied to clipboard')
    }
  }

  return (
    <div className='relative'>
      <div
        role="button"
        onClick={copyToClipboard}
        className={cn("relative p-4 bg-gray-800/30 rounded-lg h-[500px] border border-gray-500/50 text-white overflow-y-auto", {
          'cursor-not-allowed': !content,
          'cursor-copy': content,
        })}
      >
        {(!content && !isLoading) && <span className='grid place-items-center size-full opacity-80'>
          Not generated yet
        </span>}
        {content && (
          <Markdown>
            {content.replaceAll('.- ', '.\n- ')}
          </Markdown>
        )}
      </div>
      <ClipboardIcon
        onClick={copyToClipboard}
        aria-label='Copy to clipboard'
        className={cn("transition-opacity duration-300 cursor-pointer size-4 text-white absolute top-4 right-4 hover:opacity-80", {
          'invisible opacity-0': (!content || isLoading),
          'visible opacity-100': (content && !isLoading),
        })}
      />
      {isLoading && (
        <span className='absolute right-4 bottom-4'>
          <Loader />
        </span>
      )}
    </div>
  )
}
