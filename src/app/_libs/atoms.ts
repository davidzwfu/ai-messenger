import { atom } from 'jotai'
import { atomFamily, atomWithStorage } from 'jotai/utils'
import { conversationsData } from '@/app/_data/conversations'

export const conversationsAtom = atom<Record<string, any>>(conversationsData)
