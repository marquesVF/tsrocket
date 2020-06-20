import { ResponseInterceptor } from '../../types'

export class DefaultResponseInterceptor implements ResponseInterceptor {

    intercept(response?: any, errors?: Error[]) {
        const processedErrors = errors?.map(err => ({
            name: err.name,
            message: err.message
        }))

        return { data: response, errors: processedErrors }
    }

}
