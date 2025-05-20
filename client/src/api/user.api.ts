import { apiBaseUrl } from "@/constants/api";
import { FetchResponse, HTTPMethod } from "@/types/fetch";
import { User } from "@/types/types";
import { fetch, getAuthorizedHeaders } from "@/utils/fetch";

export default class UserApi {
<<<<<<< HEAD
    static async getById(userId: number): Promise<FetchResponse<User>> {
        return await fetch({
=======
    static async getById(userId: number | undefined): Promise<FetchResponse<User>> {
        return await fetch ({
>>>>>>> 4a46acb37cafdddb689b3f3183728d2872496ff0
            url: `${apiBaseUrl}/users/${userId}`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })
    }

    static async updateUser(userId: number, updatedUserData: User): Promise<FetchResponse<User>> {
        return await fetch({
            url: `${apiBaseUrl}/users/${userId}`,
            method: HTTPMethod.PUT,
            headers: {
                ...getAuthorizedHeaders(),
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(updatedUserData),
        });
    }
}