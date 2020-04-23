import fs from 'fs'

import { plural } from 'pluralize'

import logger from '../../../logger'
import { parse } from '../../templates'
import { Domain , TemplateData } from '../types'

export function generateFile(
    name: string,
    domain: Domain,
    templateData: TemplateData
) {
    const rootPath = `${process.cwd()}/src/${plural(domain)}`
    const filePath = `${rootPath}/${name}.ts`

    if (fs.existsSync(filePath)) {
        logger.warn(`${domain} ${name} already exists at ${filePath}`)

        return
    }

    const compiledTemplate = parse(`${domain}.ts.hbs`, templateData)

    fs.writeFileSync(filePath, compiledTemplate)
    logger.info(`new ${domain} at ${filePath}`)
}
