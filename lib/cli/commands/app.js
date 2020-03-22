const fs = require('fs')
const child = require('child_process')
const templates = require('../templates')
const logger = require('../logger')('debug')
const prompt = require('prompt-sync')({ sigint: true })

function createDefaultFolders(app) {
    const rootPath = `${process.cwd()}/${app}`

    try {
        fs.mkdirSync(rootPath)
        process.chdir(rootPath)

        fs.mkdirSync(`${rootPath}/src/services`, { recursive: true })
        fs.writeFileSync(`${rootPath}/src/services/empty`)
        fs.mkdirSync(`${rootPath}/src/models`, { recursive: true })
        fs.writeFileSync(`${rootPath}/src/models/empty`)
        fs.mkdirSync(`${rootPath}/src/repositories`, { recursive: true })
        fs.writeFileSync(`${rootPath}/src/repositories/empty`)
        fs.mkdirSync(`${rootPath}/src/controllers`, { recursive: true })
        fs.writeFileSync(`${rootPath}/src/controllers/empty`)
    } catch (err) {
        // TODO handle it properly
        logger.error(err)
    }

    return rootPath
}

function copyDefaultFiles(rootPath, appName) {
    fs.copyFileSync(
        `${templates.path}/tsconfig.json.hbs`,
        `${rootPath}/tsconfig.json`
    )
    fs.copyFileSync(
        `${templates.path}/app.ts.hbs`,
        `${rootPath}/src/app.ts`
    )
}

function inquireAppContext(appName) {
    logger.debug('Inquirying project information')

    const appDescription = prompt('Project description: ')
    const appAuthor = prompt('Project author: ')
    const appLicence = 'MIT'

    return { appName, appDescription, appAuthor, appLicence }
}

function newApp(argv) {
    logger.info('Setting up your awesome project...')

    const appRoot = createDefaultFolders(argv.app)
    copyDefaultFiles(appRoot, argv.app)

    const defaultContext = {
        appName: argv.app,
        appLicence: 'MIT'
    }
    const context = argv.y ? defaultContext : inquireAppContext(argv.app)
    const packageJson = templates.parse('package.json.hbs', context)

    const appPackage = `${appRoot}/package.json`
    fs.writeFileSync(appPackage, packageJson)

    logger.info('Installing dependencies...')

    child.execSync('yarn', { stdio: 'inherit' })

    logger.info('All done!')
}

module.exports = newApp