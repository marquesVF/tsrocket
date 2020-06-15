import {
    Controller,
    Post,
    Body
} from '../../../lib/core/decorators'
import { RestController } from '../../../lib/core/rest-controller'
import { SampleDto } from '../dto/sample'

@Controller('/complex')
export default class BodyValidationController extends RestController {

    @Post('/')
    create(@Body(SampleDto) sampleDto: SampleDto) {
        return sampleDto
    }

}
