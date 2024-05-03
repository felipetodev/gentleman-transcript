import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const placeholder = `\
Fireship "Supabase in 100 Seconds" transcript example:

00:00:00:18 --> 00:00:04:98
Supabase a complete back end for web

00:00:02:82 --> 00:00:07:26
and mobile applications based entirely

00:00:04:98 --> 00:00:09:30
on free open source software the biggest

00:00:07:26 --> 00:00:11:52
challenge when building an app is not

00:00:09:30 --> 00:00:13:44
writing code but rather architecting a

00:00:11:52 --> 00:00:15:90
complete system that works at scale

00:00:13:44 --> 00:00:17:64
products like Firebase and amplify have

....
`
