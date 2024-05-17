import Markdown from 'react-markdown'
import { toast } from "sonner"
import { ClipboardIcon } from 'lucide-react'
import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  content?: string;
  isLoading: boolean;
  onClick: () => void;
}

export function Message({ content, isLoading, onClick }: Props) {
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
        className={cn("relative p-4 bg-gray-800/30 rounded-lg h-[500px] border border-gray-500/50 text-white overflow-y-auto mb-4", {
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
      <Button
        size="lg"
        className="w-full font-semibold text-lg"
        disabled={(isLoading || !content)}
        onClick={onClick}
      >
        {isLoading
          ? <><Loader className="mr-2" /> Generating...</>
          : 'Regenerate ✨'}
      </Button>
    </div>
  )
}
