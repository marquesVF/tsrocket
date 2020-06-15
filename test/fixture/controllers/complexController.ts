import {
    Controller,
    Post,
    Body
} from '../../../lib/core/decorators'
import { RestController } from '../../../lib/core/rest-controller'
import { SampleDto } from '../dto/sampleDto'

@Controller('/complex')
export default class ComplexController extends RestController {

    @Post('/')
    create(@Body(SampleDto) sampleDto: SampleDto) {
        return sampleDto
    }

}
