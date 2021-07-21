import { API } from "aws-amplify";
import AuthService from './authApi';

export const readNotificationApi = async (notification_id) => {
    try {
        return await API.put("consumer",`/notification/read/${notification_id}`);
    } catch (error) {
        if (error?.response?.status)
            ((error.response.status === 401) || (error.response.status === 403)) && AuthService.logOut()
    }
} 
export const getNotificationApi = async () => {
    try {
        return await API.get("consumer",`/notification`);
    } catch (error) {
        if (error?.response?.status)
            ((error.response.status === 401) || (error.response.status === 403)) && AuthService.logOut()
    }
} 