import {
    Controller,
    Post,
    Body,
    UseResponseInterceptor
} from '../../../lib/core/decorators'
import { RestController } from '../../../lib/core/rest-controller'
import { SampleDto } from '../dto/sample'
import { ResponseInterceptor } from '../../../lib'

export class CustomResponseInterceptor implements ResponseInterceptor {

    intercept(response: any, errors?: Error[]) {
        if (errors) {
            return { errors }
        }

        return { data: response }
    }

}

@UseResponseInterceptor(CustomResponseInterceptor)
@Controller('/response-interceptor')
export default class ResponseInterceptorController
    extends RestController {

    @Post('/')
    usingCustomInterceptor(@Body(SampleDto) sampleDto: SampleDto) {
        return sampleDto
    }

}
