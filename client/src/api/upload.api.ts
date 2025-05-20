import { apiBaseUrl } from '@/constants/api'
import { HTTPMethod } from '@/types/fetch'
import { fetch, getAuthorizedHeaders } from '@/utils/fetch'

export default class UploadApi {
    static async uploadImage(image: File) {
        const formData = new FormData()
        formData.append('image', image)

        return fetch<string>({
            method: HTTPMethod.POST,
            url: `${apiBaseUrl}/upload/image`,
            body: formData,
            headers: getAuthorizedHeaders('multipart/form-data')
        })
    }
}