export function sanitizePath(path: string) {
    return path === '/' ? '' : path
}
