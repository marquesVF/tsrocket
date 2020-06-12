import { execSync } from 'child_process'

import PromptSync from 'prompt-sync'

import { Logger } from '../../logger'

const regex = /([0-9]+)/g

function checkPendingMigrations(): boolean {
    const cmd = 'npx ts-node node_modules/typeorm/cli schema:log'

    const bufferResponse = execSync(cmd)

    const response = bufferResponse.toString()
    const matches = response.match(regex)

    if (!matches) { return false }

    return Number(matches[0]) > 1
}

function createMigration(name: string) {
    // eslint-disable-next-line max-len
    const cmd = `npx ts-node node_modules/typeorm/cli migration:generate --name ${name}-migration`

    execSync(cmd, { stdio: 'inherit' })
}

export function generateMigration(name: string) {
    if (checkPendingMigrations()) {
        Logger.warn('There is at least one pending migration')

        const prompt = PromptSync({ sigint: true })

        const answer = prompt('Do you want to migrate it now? [y/n]: ')
        if (answer !== 'y') {
            // FIX-ME must be someway to fix it
            // eslint-disable-next-line max-len
            Logger.error(`It was not possible to generate a migration now. Please, run the pending migration and then 'npm run orm migration:generate --name <migration_name>'`)
            process.exit(1)
        }

        const cmd = `npx ts-node node_modules/typeorm/cli migration:run`

        execSync(cmd, { stdio: 'inherit' })

        createMigration(name)

        return
    }

    createMigration(name)
}
