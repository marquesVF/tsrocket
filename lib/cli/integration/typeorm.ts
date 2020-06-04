import { execSync } from 'child_process'

export function generateMigration(name: string) {
    // eslint-disable-next-line max-len
    const cmd = `npx ts-node node_modules/typeorm/cli migration:generate --name ${name}-migration`

    execSync(cmd, { stdio: 'inherit' })
}
