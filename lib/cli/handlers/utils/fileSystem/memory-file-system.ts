import { FileSystem, SaveFileStatus } from './types'

export class MemoryFileSystem implements FileSystem {

    private readonly storage: Map<string, string> = new Map()

    saveFile(path: string, content: string): SaveFileStatus {
        const file = this.storage.get(path)

        if (file) {
            return 'duplicated'
        }

        this.storage.set(path, content)

        return 'success'
    }

    readFile(path: string): string {
        const file = this.storage.get(path)

        if (!file) {
            throw new Error(`File ${path} does not exist`)
        }

        return file
    }

    copyFile(originPath: string, destinationPath: string): boolean {
        throw new Error('Method not implemented.')
    }
    mkdir(path: string): void {
        throw new Error('Method not implemented.')
    }

}
