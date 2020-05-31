import fs from 'fs'

import { compile, registerPartial } from 'handlebars'

type ParseArgument = { [key: string]: any }

export const TEMPLATES_PATH = `${__dirname}/templates`

function compileTemplate(template: string) {
    return compile(
        fs.readFileSync(`${TEMPLATES_PATH}/${template}`, 'utf8')
    )
}

registerPartial('relations', compileTemplate('partials/model-relations.hbs'))
registerPartial('imports', compileTemplate('partials/model-imports.hbs'))

export function parse(template: string, args: ParseArgument) {
    return compileTemplate(template)(args)
}
