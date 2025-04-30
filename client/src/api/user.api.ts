import { apiBaseUrl } from '@/constants/api';
import { FetchResponse, HTTPMethod } from '@/types/fetch';
import { getAuthorizedHeaders } from '@/utils/fetch';
import { User } from '../types/types';

export default class UserApi {
    //TODO: i cant find a way to get user details by user id rn
    // public static async get(userId: User["id"]): Promise<User> {
    //     return await fetch({
    //         url: `${apiBaseUrl}/boards/${boardId}/tasks`,
    //         method: HTTPMethod.GET,
    //         headers: getAuthorizedHeaders()
    //     });
    // }
}