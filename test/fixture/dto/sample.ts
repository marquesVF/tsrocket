import { Property, BuildTransformation } from 'objectypes'

export class FindDto {

    @Property()
    id: string

}

export class BaseDto {

    @Property()
    something: string

}

export class SampleDto extends BaseDto {

    @Property()
    name: string

    @Property()
    amount: number

    @BuildTransformation({ transform: (value: string) => value.split('-') })
    @Property({ nullable: true })
    documentNumber?: string[]

}

export class SampleResponseDto {

    @Property()
    name: string

}
