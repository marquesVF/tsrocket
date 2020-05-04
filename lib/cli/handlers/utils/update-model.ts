import fs from 'fs'

import { compile } from 'handlebars'

import { RelatedModelUpdate } from '../types'

const IMPORTS_REGEX = /^([\w*\W*]*)@Entity/
const MODEL_REGEX = /@Entity\([\w*|\W*]*}/g

export function updateModel(updateArguments: RelatedModelUpdate) {
    const { modelToUpdate } = updateArguments

    const modelPath = `${process.cwd()}/src/models/${modelToUpdate}.ts`
    const modelFile = fs.readFileSync(modelPath, 'utf8')
    const classImportGroups = RegExp(IMPORTS_REGEX).exec(modelFile)
    const classImports = classImportGroups
        ? classImportGroups[1].toString()
        : undefined
    const classContent = modelFile.match(MODEL_REGEX)?.toString()

    if (!classContent) {
        // TODO handle it properly
        throw new Error('Not a valid model class')
    }

    const processedClassContent = classContent
        .substring(0, classContent.length - 1)
    const content = `${processedClassContent}    {{> relations}}\n}\n`

    const updateModelTemplate = `${classImports}{{> imports}}\n\n${content}`

    // TODO type this
    const updateData = {
        imports: [updateArguments.relation],
        relations: [updateArguments]
    }
    const updatedModelContent = compile(updateModelTemplate)(updateData)

    fs.writeFileSync(modelPath, updatedModelContent)
}
