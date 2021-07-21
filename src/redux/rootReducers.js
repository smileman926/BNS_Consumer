import {combineReducers} from "redux";
import authReducer from "./auth/Reducer";
import productReducer from "./product/Reducer";
import commentReducer from "./comment/Reducer";
import userReducer from "./user/Reducer";
import myCommentsReducer from "./myComments/Reducer";
import purchaseReducer from "./purchase/Reducer";
import updateUserReducer from "./updateUser/Reducer";
import settingsReducer from "./settings/Reducer";
import FAQsReducer from "@redux/faq/Reducer";
import cartReducer from "./cart/Reducers";
import rewardsReducer from "./rewards/Reducer";

export default combineReducers({
  auth: authReducer,
  product: productReducer,
  comment: commentReducer,
  user: userReducer,
  myComments: myCommentsReducer,
  purchase: purchaseReducer,
  updateUser: updateUserReducer,
  settings: settingsReducer,
  faqs: FAQsReducer,
  cart: cartReducer,
  rewards: rewardsReducer,
});
