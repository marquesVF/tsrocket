const fs = require('fs')
const child = require('child_process')
const handlebars = require('handlebars')
const logger = require('./logger')
const prompt = require('prompt-sync')({ sigint: true })

function createAppFolders(app) {
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
    } catch (err) {
        // TODO handle it properly
        logger.error(err)
    }

    return rootPath
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

    const appRoot = createAppFolders(argv.app)

    const packageTemplate = `${__dirname}/templates/package.json.hbs`
    const content = fs.readFileSync(packageTemplate, 'utf8')
    const context = inquireAppContext(argv.app)

    const appPackage = `${appRoot}/package.json`
    const packageJson = handlebars.compile(content)(context)

    fs.writeFileSync(appPackage, packageJson)

    logger.info('Installing dependencies...')

    child.execSync('yarn', { stdio: 'inherit' })

    logger.info('All done!')
}

module.exports = {
    newApp
}
