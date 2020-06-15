import { Service } from '../../../lib/core/decorators'

@Service()
export class SampleService {

    foo() {
        return 'response from foo'
    }

    find(id: string) {
        return `looking for this ${id}`
    }

}
