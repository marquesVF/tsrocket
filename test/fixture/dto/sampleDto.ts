import { InputField } from "../../../lib/core/decorators"

export class FindDto {

    @InputField()
    id: string

}

export class SampleDto {

    @InputField()
    name: string

}
