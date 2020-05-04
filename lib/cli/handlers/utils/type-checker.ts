import { Relation } from '../types'

export function isRelation(key: string): key is Relation {
    return ['OneToMany', 'ManyToOne', 'OneToOne', 'ManyToMany'].includes(key)
}
