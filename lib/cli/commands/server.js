const fs = require('fs')
const child = require('child_process')
const templates = require('../templates')
const logger = require('../logger')('debug')
const prompt = require('prompt-sync')({ sigint: true })

function createDefaultFolders(name) {
    const rootPath = `${process.cwd()}/${name}`
    const createFolders = domains => {
        domains.forEach(domain => {
            fs.mkdirSync(`${rootPath}/src/${domain}`, { recursive: true })
            fs.writeFileSync(`${rootPath}/src/${domain}/.gitkeep`)
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
            'migrations'
        ])
    } catch (err) {
        // TODO handle it properly
        logger.error(err)
    }

    return rootPath
}

function copyDefaultFiles(rootPath) {
    fs.copyFileSync(
        `${templates.path}/tsconfig.json.hbs`,
        `${rootPath}/tsconfig.json`
    )
    fs.copyFileSync(
        `${templates.path}/tsconfig.ts-node.json.hbs`,
        `${rootPath}/tsconfig.ts-node.json`
    )
    fs.copyFileSync(
        `${templates.path}/ormconfig.json.hbs`,
        `${rootPath}/ormconfig.json`
    )
    fs.copyFileSync(
        `${templates.path}/server.ts.hbs`,
        `${rootPath}/src/server.ts`
    )
    fs.copyFileSync(
        `${templates.path}/config.ts.hbs`,
        `${rootPath}/src/config.ts`
    )
}

function inquireAppContext(appName) {
    logger.debug('Inquirying project information')

    const appDescription = prompt('Project description: ')
    const appAuthor = prompt('Project author: ')
    const appLicence = 'MIT'

    return { appName, appDescription, appAuthor, appLicence }
}

function newServer(argv) {
    logger.info('Setting up your awesome project...')

    const appRoot = createDefaultFolders(argv.name)
    copyDefaultFiles(appRoot)

    const defaultContext = {
        appName: argv.name,
        appLicence: 'MIT'
    }
    const context = argv.y ? defaultContext : inquireAppContext(argv.name)
    const packageJson = templates.parse('package.json.hbs', context)

    const appPackage = `${appRoot}/package.json`
    fs.writeFileSync(appPackage, packageJson)

    logger.info('Installing dependencies...')

    child.execSync('yarn', { stdio: 'inherit' })

    logger.info('All done!')
}

module.exports = newServer
