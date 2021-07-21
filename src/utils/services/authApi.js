import authActions from "@redux/auth/Actions";
import { store } from "@redux/store";
import Amplify, { API, Auth } from "aws-amplify";

export const apiSignUp = (body) => API.post("general", "/users", { body });
export const apiLogIn = async (body) => {
  try {
    return await API.post("consumer", "/users/login", { body });
  } catch (error) {
    if (error?.response?.status)
      if ((error.response.status === 401) || (error.response.status === 403)) {
        const email = store.getState()?.auth?.user?.email;
        store.dispatch(authActions.logoutRequest({ email }));
        return Auth.signOut();
      }
  }  
}
export const setVerifyStatus = (body) =>
  API.put("general", `/users/verifiedstatus/${body.email}`, { body });
const options = {
  Auth: {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_CLIENT_ID,
  },
};
Amplify.configure(options);

class AuthService {
  constructor() {
    this.user = null;
  }
  signUp({ email, password, phone_number, isPhone }) {
    return Auth.signUp({
      username: email,
      password,
      attributes: isPhone ? { phone_number } : null,
    });
  }

  logIn({ email, password }) {
    return Auth.signIn(email, password);
  }

  logOut() {
    const email = store.getState()?.auth?.user?.email;
    store.dispatch(authActions.logoutRequest({ email }));
    return Auth.signOut();
  }

  confirmSignUp({ email, code }) {
    return Auth.confirmSignUp(email, code);
  }

  resendConfirmationCode(email) {
    return Auth.resendSignUp(email);
  }

  forgotPassword(email) {
    return Auth.forgotPassword(email);
  }

  confirmNewPassword({ email, code, newPassword }) {
    return Auth.forgotPasswordSubmit(email, code, newPassword);
  }

  autoLogOut() {
    const time = 60000 * 15;

    const logOutUser = () => {
      this.logOut();
      observer.disconnect();
    };

    let withActive = setTimeout(logOutUser, time);

    const config = { attributes: true, childList: true, subtree: true };

    const callback = function (mutationsList, observer) {
      clearTimeout(withActive);
      withActive = setTimeout(logOutUser, time);
    };

    const observer = new MutationObserver(callback);
    observer.observe(document, config);
  }

  async isAuthUser() {
    try {
      const user = await Auth.currentUserInfo();
      console.log("user", user);
      return !!Object.keys(user).length;
    } catch (err) {
      return false;
    }
  }
}

export default new AuthService();
