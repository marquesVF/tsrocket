import fs from 'fs'

import handlebars from 'handlebars'

type ParseArgument = { [key: string]: any }

export const TEMPLATES_FOLDER = `${__dirname}/templates`

export function parse(template: string, args: ParseArgument) {
    const templatePath = `${TEMPLATES_FOLDER}/${template}`
    const templateFile = fs.readFileSync(templatePath, 'utf8')

    return handlebars.compile(templateFile)(args)
}
