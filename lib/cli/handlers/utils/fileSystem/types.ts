export type SaveFileStatus = 'error' | 'duplicated' | 'success'

export interface FileSystem {
    saveFile(path: string, content: string): SaveFileStatus
    readFile(path: string): string
    copyFile(originPath: string, destinationPath: string): boolean
    mkdir(path: string): void
}
