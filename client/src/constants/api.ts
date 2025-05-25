import { FileSize } from '@/utils/fileSize'

export const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json'
}

export const apiBaseUrl = 'http://localhost:5000/api'
export const authApiBaseUrl = 'http://localhost:5000'

export const MAX_IMAGE_SIZE_MB = 10
export const MAX_IMAGE_SIZE = FileSize.bytesFromMB(MAX_IMAGE_SIZE_MB);
export const ALLOWED_IMAGE_FORMATS = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"]
