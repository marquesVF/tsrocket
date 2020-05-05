import { Controller, Inject, Get } from '../../../lib/core/decorators'
import { RestController } from '../../../lib/core/rest-controller'
import { SampleService } from '../services/sampleService'

@Controller()
export default class SampleController extends RestController {

    @Inject(SampleService)
    private readonly sampleService: SampleService

    @Get('/')
    getFoo() {
        return this.sampleService.foo()
    }

}