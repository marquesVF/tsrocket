import { Field } from '../../../lib/core/decorators'

export class FindDto {

    @Field()
    id: string

}

export class SampleDto {

    @Field()
    name: string

}
