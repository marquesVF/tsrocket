import { ResponseInterceptor } from '../../types'

export class DefaultResponseInterceptor implements ResponseInterceptor {

    intercept(response?: any, error?: Error) {
        return { data: response, error: error?.message }
    }

}
