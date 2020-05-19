import { Service } from "../../../lib/core/decorators";

@Service()
export class SampleService {

    private readonly animalData: Record<string, string> = {
        zebra: 'zebra'
    }

    foo() {
        return 'response from foo'
    }

    find(id: string) {
        return this.animalData[id]
    }

}
