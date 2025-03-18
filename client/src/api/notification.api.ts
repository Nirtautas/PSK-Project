import { Notification } from '@/types/types'
import { Paginated } from '@/types/api'

export default class NotificationApi {
    public static async getNotifications(): Promise<Paginated<Notification>> {
        return {
            items: [
                {
                    id: 1,
                    title: 'test',
                    description: 'description',
                    date: new Date(),
                },
                {
                    id: 2,
                    title: 'test',
                    description: 'description',
                    date: new Date(),
                }
            ],
            pageNumber: 1,
            pageSize: 1,
            pageCount: 2
        }
    }
}
