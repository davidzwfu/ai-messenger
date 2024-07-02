import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const conversationsAtom = atomWithStorage<Record<string, any>>('conversations', {})

export const incomingMessagesAtom = atom<any[]>([])

export const showProfileAtom = atom<boolean>(false)

export const deleteChatAtom = atom<string|null>(null)
