import fs from 'fs'

import { FileSystem, SaveFileStatus } from './types'

export class OSFileSystem implements FileSystem {

    copyFile(originPath: string, destinationPath: string): boolean {
        if (!fs.existsSync(originPath)) {
            return false
        }

        fs.copyFileSync(originPath, destinationPath)

        return true
    }

    saveFile(path: string, content: string): SaveFileStatus {
        if (fs.existsSync(path)) {
            return 'duplicated'
        }

        try {
            fs.writeFileSync(path, content)

            return 'success'
        } catch (_) {
            return 'error'
        }
    }

    readFile(path: string): string {
        if (!fs.existsSync(path)) {
            throw new Error(`File ${path} does not exist`)
        }

        return fs.readFileSync(path, 'utf8').toString()
    }

    mkdir(path: string): void {
        fs.mkdirSync(path)
    }

}
