import fs from 'fs'
import { execSync } from 'child_process'

import { Logger } from '../../logger'
import { TEMPLATES_PATH } from '../templates'

type Options = 'inherit' | 'ignore'

export function generateGitRepository(rootPath: string, stdio: Options) {
    Logger.info('generating git repository')

    fs.copyFileSync(
        `${TEMPLATES_PATH}/gitignore.hbs`,
        `${rootPath}/.gitignore`
    )

    execSync('git init', { stdio })
    execSync('git add .', { stdio })
}
