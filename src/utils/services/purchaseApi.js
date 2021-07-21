import { API } from "aws-amplify";
import AuthService from './authApi';

export const getWebinarWinnerHistoryApi = async (body) => {
  try {
    return await API.get("consumer","/won-item");
  } catch (error) {
      if (error?.response?.status)
          ((error.response.status === 401) || (error.response.status === 403)) && AuthService.logOut()
  }
}  

export const getPurchaseHistoryApi = async (body) => {
  try {
    return await API.post("consumer", "/products/getpurchasehistory", { body });
  } catch (error) {
      if (error?.response?.status)
          ((error.response.status === 401) || (error.response.status === 403)) && AuthService.logOut()
  }
}
  
