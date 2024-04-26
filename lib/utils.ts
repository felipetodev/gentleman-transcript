import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const placeholder = `\
Example:

00:00:01:22 - 00:00:06:08
bueno gente Hello Hello Hello

00:00:04:13 - 00:00:08:04
Bienvenidos a otro Stream video

00:00:06:08 - 00:00:10:20
impresionante de G

00:00:08:04 - 00:00:12:11
programming en el día de hoy vamos a

00:00:10:20 - 00:00:14:21
estar viendo la primera parte de un

00:00:12:11 - 00:00:17:01
curso de dos partes y el día de hoy

....
`
