import { User } from '../types/types';
export default class UserApi {
    public static async getUsersByTaskId(taskId: number): Promise<User[]> {
        return [
            {
                id: 1,
                name: 'User 1'
            },
            {
                id: 2,
                name: 'User 2'
            }
        ] satisfies User[]
    }
}