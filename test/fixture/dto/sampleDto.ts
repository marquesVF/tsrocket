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

}
