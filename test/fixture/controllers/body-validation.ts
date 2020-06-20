import {
    Controller,
    Post,
    Body,
    Query,
    Get
} from '../../../lib/core/decorators'
import { RestController } from '../../../lib/core/rest-controller'
import { SampleDto, SampleResponseDto, FindDto } from '../dto/sample'

@Controller('/complex')
export default class BodyValidationController extends RestController {

    @Post('/')
    create(@Body(SampleDto) sampleDto: SampleDto) {
        return sampleDto
    }

    @Get('/')
    queryTest(@Query(FindDto) findDto: FindDto) {
        return findDto
    }

    @Post('/decorated', SampleResponseDto)
    createDecorated(@Body(SampleDto) sampleDto: SampleDto) {
        return sampleDto
    }

    @Post('/decorated-array', SampleResponseDto)
    decoratedArray(@Body(SampleDto) sampleDto: SampleDto) {
        return [sampleDto]
    }

}
