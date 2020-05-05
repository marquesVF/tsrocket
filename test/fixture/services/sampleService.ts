import { Service } from "../../../lib/core/decorators";

@Service()
export class SampleService {

    foo() {
        return 'response from foo'
    }

}
