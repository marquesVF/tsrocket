import fs from 'fs'
import child from 'child_process'

import promptSync from 'prompt-sync'

import { TEMPLATES_PATH, parse } from '../templates'
import { Logger } from '../../logger'
import { generateGitRepository } from '../integration/git'

type NewServerArguments = {
    name: string
    y: boolean
    v: boolean
}

function createDefaultFolders(name: string) {
    const rootPath = `${process.cwd()}/${name}`
    const createFolders = (domains: string[]) => {
        domains.forEach(domain => {
            fs.mkdirSync(`${rootPath}/src/${domain}`, { recursive: true })
            fs.writeFileSync(`${rootPath}/src/${domain}/.gitkeep`, {})
        })
    }

    try {
        fs.mkdirSync(rootPath)
        process.chdir(rootPath)

        createFolders([
            'services',
            'models',
            'repositories',
            'controllers',
            'migrations',
            'dtos'
        ])

        fs.mkdirSync(`${rootPath}/tests`)
        fs.writeFileSync(`${rootPath}/tests/.gitkeep`, {})
    } catch (err) {
        // TODO handle it properly
        Logger.error(err)
    }

    return rootPath
}

function copyDefaultFiles(rootPath: string) {
    fs.copyFileSync(
        `${TEMPLATES_PATH}/tsconfig.json.hbs`,
        `${rootPath}/tsconfig.json`
    )
    fs.copyFileSync(
        `${TEMPLATES_PATH}/tsconfig.ts-node.json.hbs`,
        `${rootPath}/tsconfig.ts-node.json`
    )
    fs.copyFileSync(
        `${TEMPLATES_PATH}/ormconfig.json.hbs`,
        `${rootPath}/ormconfig.json`
    )
    fs.copyFileSync(
        `${TEMPLATES_PATH}/server.ts.hbs`,
        `${rootPath}/src/server.ts`
    )
    fs.copyFileSync(
        `${TEMPLATES_PATH}/config.ts.hbs`,
        `${rootPath}/src/config.ts`
    )
    fs.copyFileSync(
        `${TEMPLATES_PATH}/jest.config.js.hbs`,
        `${rootPath}/jest.config.js`
    )
    fs.copyFileSync(
        `${TEMPLATES_PATH}/jest-config.json.hbs`,
        `${rootPath}/jest-config.json`
    )
}

function inquireAppContext(appName: string) {
    const prompt = promptSync({ sigint: true })
    Logger.debug('Inquirying project information')

    const appDescription = prompt('Project description: ')
    const appAuthor = prompt('Project author: ')
    const appLicence = 'MIT'

    return { appName, appDescription, appAuthor, appLicence }
}

export function generateBaseProject(args: NewServerArguments) {
    const { name, y: defaults, v: verbose } = args
    Logger.info(`setting up ${name}...`)

    const appRoot = createDefaultFolders(name)
    copyDefaultFiles(appRoot)

    const defaultContext = {
        appName: name,
        appLicence: 'MIT'
    }
    const context = defaults ? defaultContext : inquireAppContext(name)
    const packageJson = parse('package.json.hbs', context)

    const appPackage = `${appRoot}/package.json`
    fs.writeFileSync(appPackage, packageJson)

    Logger.info('installing dependencies...')

    const stdio = verbose ? 'inherit' : 'ignore'
    child.execSync('npm install', { stdio })

    generateGitRepository(appRoot, stdio)

    Logger.info('all done!')
}
