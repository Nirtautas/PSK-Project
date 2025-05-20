import { UserUpdateRequest } from "@/components/pages/ProfilePage/ProfilePage";
import { apiBaseUrl } from "@/constants/api";
import { FetchResponse, HTTPMethod } from "@/types/fetch";
import { User } from "@/types/types";
import { fetch, getAuthorizedHeaders } from "@/utils/fetch";

export default class UserApi {

    static async getById(userId: number | undefined): Promise<FetchResponse<User>> {
        return await fetch ({
            url: `${apiBaseUrl}/users/${userId}`,
            method: HTTPMethod.GET,
            headers: getAuthorizedHeaders()
        })
    }

    static async updateUser(userId: number, updatedUserData: UserUpdateRequest): Promise<FetchResponse<User>> {
        return await fetch({
            url: `${apiBaseUrl}/users/${userId}`,
            method: HTTPMethod.PUT,
            headers: getAuthorizedHeaders(),
            body: JSON.stringify(updatedUserData),
        });
    }
}