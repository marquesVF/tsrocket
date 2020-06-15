import { IsString, IsNumber } from 'class-validator'

import { Field } from '../../../lib/core/decorators'

export class FindDto {

    @Field()
    @IsString()
    id: string

}

export class BaseDto {

    @Field()
    @IsString()
    something: string

}

export class SampleDto extends BaseDto {

    @Field()
    @IsString()
    name: string

    @Field()
    @IsNumber()
    amount: number

    // eslint-disable-next-line max-len
    @Field({ nullable: true, transform: (value: string) => value.split('-') })
    documentNumber?: string[]

}

export class SampleResponseDto {

    @Field()
    name: string

}
