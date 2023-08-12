import { ClassValue, clsx as _clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const clsx = (...classes: ClassValue[]) => twMerge(_clsx(...classes));
