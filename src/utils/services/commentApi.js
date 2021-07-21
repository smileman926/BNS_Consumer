import { API } from "aws-amplify";
import AuthService from './authApi';

export const postCommentApi = async (body) => {
    try {
        return await API.post("consumer","/comments", {body});
    } catch (error) {
        if (error?.response?.status)
            ((error.response.status === 401) || (error.response.status === 403)) && AuthService.logOut()
    }
}
    
export const getCommentsWithProductApi = async (product_id) => {
    try {
        return await API.get("consumer",`/comments/getproductcomments/${product_id}`);
    } catch (error) {
        if (error?.response?.status)
            ((error.response.status === 401) || (error.response.status === 403)) && AuthService.logOut()
    }
}
export const getCommentsWithUserApi = async (body) => {
    try {
        return await API.get("consumer","/comments/getusercomments");
    } catch (error) {
        if (error?.response?.status)
            ((error.response.status === 401) || (error.response.status === 403)) && AuthService.logOut()
    }
} 