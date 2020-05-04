import { pascalCase } from 'change-case'
import pluralize from 'pluralize'

import { ModelRelation, Relation, RelatedModelUpdate } from '../types'

export type HandledRelations = {
    modelRelations: ModelRelation
    relatedModelUpdate?: RelatedModelUpdate
}

function _handleRelation(
    model: string,
    relatedModel: string,
    relation: Relation
): ModelRelation {
    const modelClass = pascalCase(model)
    const join = relation === 'ManyToMany' || relation === 'OneToOne'

    const modelRelation = { model, modelClass, relation, join }
    const relationOption = () => {
        if (relation === 'OneToOne') {
            return undefined
        }

        return relation === 'OneToMany'
            ? relatedModel
            : pluralize(relatedModel)
    }
    const variable = () => relation === 'OneToMany' || relation === 'ManyToMany'
        ? pluralize(model)
        : model

    return {
        ...modelRelation,
        variable: variable(),
        relationOption: relationOption()
    }
}

const InverseRelation: Record<Relation, Relation | undefined> = {
    ManyToOne: 'OneToMany',
    OneToMany: 'ManyToOne',
    ManyToMany: 'ManyToMany',
    OneToOne: undefined
}

export function handleRelation(
    model: string,
    relatedModel: string,
    relation: Relation
): HandledRelations {
    const modelRelations = _handleRelation(relatedModel, model, relation)
    const inverseRelation = InverseRelation[relation]
    const relatedModelUpdate: RelatedModelUpdate | undefined = inverseRelation
        ? {
            ..._handleRelation(model, relatedModel, inverseRelation),
            modelToUpdate: relatedModel
        }
        : undefined

    return { modelRelations, relatedModelUpdate }
}
