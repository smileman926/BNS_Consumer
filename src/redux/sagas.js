import { all } from "redux-saga/effects";
import authSagas from "./auth/Saga";
import productSagas from "./product/Saga";
import commentSagas from "./comment/Saga";
import userSaga from "./user/Saga";
import updateUserSaga from "./updateUser/Saga";
import myCommentsSagas from "./myComments/Saga";
import purchaseSagas from "./purchase/Saga";
import settingsSaga from "./settings/Saga";
import rootFAQsSaga from "@redux/faq/Saga";
import saga from "./rewards/Saga";

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    productSagas(),
    commentSagas(),
    userSaga(),
    updateUserSaga(),
    myCommentsSagas(),
    purchaseSagas(),
    settingsSaga(),
    rootFAQsSaga(),
    saga()
  ]);
}
