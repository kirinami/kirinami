import { ClassValue, clsx as baseClsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function clsx(...inputs: ClassValue[]) {
  return twMerge(baseClsx(...inputs));
}
