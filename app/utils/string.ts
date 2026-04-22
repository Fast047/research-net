export const fileServer = (value: string | undefined| null = undefined) => {
    return value?`/FILE/${encodeURIComponent(value)}`: ''
}