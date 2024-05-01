'use client'

import { Loader } from '@/components/loader'
import { Button, type ButtonProps } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'

export function SubmitButton({ children, ...props }: ButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      {...props}
    >
      {pending ? <Loader /> : children}
    </Button>
  )
}
