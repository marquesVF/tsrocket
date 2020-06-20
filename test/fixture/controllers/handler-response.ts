import {
    Controller,
    Post,
    Body
} from '../../../lib/core/decorators'
import { RestController } from '../../../lib/core/rest-controller'
import { SampleDto } from '../dto/sample'

@Controller('/handler-responses')
export default class HandlerResponseController extends RestController {

    @Post('/')
    usingDefaultInterceptor(@Body(SampleDto) sampleDto: SampleDto) {
        return sampleDto
    }

}
