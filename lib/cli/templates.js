const fs = require('fs')
const handlebars = require('handlebars')

const path = `${__dirname}/templates`

function parse(template, arguments) {
    const templatePath = `${path}/${template}`
    const templateFile = fs.readFileSync(templatePath, 'utf8')

    return handlebars.compile(templateFile)(arguments)
}

module.exports = { parse, path }
