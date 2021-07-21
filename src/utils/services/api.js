import Amplify, { API, Auth } from 'aws-amplify';
import AuthService from './authApi';

const { REACT_APP_SERVER_URL, REACT_APP_REGION } = process.env;

const custom_header = async () => {
  const header = {};
  try {
    header.Authorization = (await Auth.currentSession()).idToken.jwtToken;
  } catch (e) {}
  return header;
};

Amplify.configure({
  API: {
    endpoints: [
      {
        name: 'dev',
        endpoint: REACT_APP_SERVER_URL,
        region: REACT_APP_REGION,
        custom_header,
      },
      {
        name: 'general',
        endpoint: `${REACT_APP_SERVER_URL}/general`,
        region: REACT_APP_REGION,
        custom_header,
      },
      {
        name: 'consumer',
        endpoint: `${REACT_APP_SERVER_URL}/consumer`,
        region: REACT_APP_REGION,
        custom_header,
      },
    ],
  },
});

export const updateUserFields = async (body) => {
  try {
    return await API.put("consumer", '/users/profile', { body });
  } catch (error) {
    if (error?.response?.status)
      ((error.response.status === 401) || (error.response.status === 403)) && AuthService.logOut()
  }  
}
export const getMyCommentsApi = async () => {
  try {
    return await API.get("consumer", `/comments/getusercomments`);
  } catch (error) {
    if (error?.response?.status)
      ((error.response.status === 401) || (error.response.status === 403)) && AuthService.logOut()
  }
} 

export const getWebinarSeats = (id) => API.get('consumer', `/products/webinarseats/${id}`);

export const isReservedUser = async (webinar_id) => {
  try {
    return await API.get('consumer', `/products/getwebinarreservedstatus/${webinar_id}`);
  } catch (error) {
    if (error?.response) {
      if ((error.response.status === 401) || (error.response.status === 403))
        AuthService.logOut()
      else
        return error.response.data;
    }      
  }
}

export const reservedSeats = (body) => API.post('consumer', '/products/reservewebinarticket', { body });

export const cancelReservedSeats = (body) => API.post('consumer', '/products/cancel', { body });

export const contactUs = (body) => API.post('general', '/support/contact ', { body });

export const apiGetFAQs = () => API.get('general', '/faq');

export const getAllSettings = () => API.get('general', '/support/sitesettings');

export const unsubscribeEmail = (user_id) => API.get('general', `/users/unsubscribe/${user_id}`);

export const buyGoods = async (body) => {
  try {
    return await API.post('consumer', '/checkout', { body });
  } catch (error) {
    if (error?.response) {
      if ((error.response.status === 401) || (error.response.status === 403))
        AuthService.logOut()
      else
        return error.response.data;
    }
  }
} 

export const forgotPassword = (body) => API.post('general', '/users/forgotpassword', { body });

export const resetPassword = (body) => API.put('general', '/users/resetpassword', { body });

export const apiRewards = async () => {
  try {
    return await API.get('consumer', '/rewards');
  } catch (error) {
    if (error?.response?.status)
      ((error.response.status === 401) || (error.response.status === 403)) && AuthService.logOut()
  }
}  

export const apiLogOut = (body) => API.put('general', '/users/signout', { body });

export const apiGetPromoCode = (queryStringParameters) => API.get('consumer', '/promo-code/find', { queryStringParameters });   

export const getCurrentBackImg = () => API.get('general', '/background/active');