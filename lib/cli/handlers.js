const fs = require('fs')
const child = require('child_process')
const handlebars = require('handlebars')
const logger = require('./logger')
const prompt = require('prompt-sync')({ sigint: true })

function createAppFolders(app) {
    const path = `${process.cwd()}/${app}`

    try {
        fs.mkdirSync(path)
        process.chdir(path)
    } catch (err) {
        // TODO handle it properly
        logger.error(err)
    }

    return path
}

function inquireAppContext(appName) {
    logger.debug('Inquirying project information')

    const appDescription = prompt('Project description: ')
    const appAuthor = prompt('Project author: ')
    // TODO sanitize licence
    const appLicence = prompt('Project license (MIT): ') || 'MIT'

    return { appName, appDescription, appAuthor, appLicence }
}

function newApp(argv) {
    logger.info('Setting up your awesome project...')

    const appRoot = createAppFolders(argv.app)

    const packageTemplate = `${__dirname}/templates/package.json.hbs`
    const content = fs.readFileSync(packageTemplate)
    const context = inquireAppContext(argv.app)

    const appPackage = `${appRoot}/package.json`
    const packageJson = handlebars.compile(content)(context)

    fs.writeFileSync(appPackage, packageJson)

    logger.info('Installing dependencies...')

    child.execSync('yarn')

    logger.info('All done!')
}

module.exports = {
    newApp
}
