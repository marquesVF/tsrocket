import { MemoryFileSystem } from './memory-file-system'
import { OSFileSystem } from './os-file-system'
import { FileSystem } from './types'

export function getFileSystem(): FileSystem {
    return process.env.ENV === 'test'
        ? new MemoryFileSystem()
        : new OSFileSystem()
}
