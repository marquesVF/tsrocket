import {
    Controller,
    Inject,
    Get,
    Params,
    Put,
    Delete,
    Post
} from '../../../lib/core/decorators'
import { RestController } from '../../../lib/core/rest-controller'
import { SampleService } from '../services/sampleService'

import { FindDto } from '../dto/sampleDto'

@Controller()
export default class SampleController extends RestController {

    @Inject(SampleService)
    private readonly sampleService: SampleService

    @Get('/')
    getFoo() {
        return this.sampleService.foo()
    }

    @Get('/:id')
    find(@Params(FindDto) findDto: FindDto) {
        return this.sampleService.find(findDto.id)
    }

    @Put('/:id')
    update() { return 'Hello World' }

    @Post('/')
    create() { return 'Hello World' }

    @Delete('/:id')
    delete() { return 'Hello World' }

}