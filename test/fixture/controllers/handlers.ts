import {
    Controller,
    Inject,
    Get,
    Params,
    Put,
    Delete,
    Post,
    Body
} from '../../../lib/core/decorators'
import { RestController } from '../../../lib/core/rest-controller'
import { SampleService } from '../services/sample'
import { FindDto, SampleDto } from '../dto/sample'

@Controller()
export default class HandlersController extends RestController {

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
    update(@Params() id: string) {
        return `put method with ${id}`
    }

    @Post('/')
    create(@Body(SampleDto) sampleDto: SampleDto) {
        return sampleDto
    }

    @Delete('/:id')
    delete() { return }

}
