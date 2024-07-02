export namespace ImageLoader {
  export function avatars({ src }: any) {
    return `/avatars/${src}`
  }

  export function flags({ src }: any) {
    return `/flags/${src}`
  }
}
