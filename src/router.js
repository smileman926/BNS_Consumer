import ForgotPassword from "@pages/ForgotPassword";
import Home from "@pages/Home";
import Login from "@pages/Login";
import SignUp from "@pages/SignUp";
import VerifyAccount from "@pages/VerifyAccount";
import Products from "@pages/Products";
import PurchaseHistory from "@pages/PurchaseHistory";
import ProductDetailPage from "@pages/ProductDetailPage";
import TermsAndConditions from "@pages/TermsAndConditions";
import ContactUs from "@pages/ContactUs";
import MyProfile from "./pages/MyProfile";
import MyComments from "@pages/MyComments";
import ConfirmNewPassword from "@pages/ConfirmNewPassword";
import BuyProduct from "@pages/BuyProduct";
import FAQ from "./pages/FAQ/index";
import ReservedSeats from "@pages/ReservedSeats";
import ResetPassword from "@pages/ResetPassword";
import Cart from "@pages/Cart/Cart";
import MyRewards from '@pages/MyRewards';
import Confirm from "@pages/Confirm";
import ChangePhone from "@pages/ChangePhone";
import PoliciesPage from "@pages/Policies";
import UnsubscribePage from "@pages/Unsubscribe";

const routers = {
  home: {
    path: "/",
    component: Home,
  },
  login: {
    path: "/login",
    component: Login,
  },
  product: {
    path: "/products/:type/:id",
    component: ProductDetailPage,
  },
  verifyAccount: {
    path: "/verify",
    component: VerifyAccount,
  },
  products: {
    path: "/product",
    component: Products,
  },
  purchaseHistory: {
    path: "/purchasehistory",
    component: PurchaseHistory,
  },
  signUp: {
    path: "/signup",
    component: SignUp,
  },
  forgotPass: {
    path: "/forgot",
    component: ForgotPassword,
  },
  myProfile: {
    path: "/myprofile",
    component: MyProfile,
  },
  termsAndConditions: {
    path: "/termsandconditions",
    component: TermsAndConditions,
  },
  contactUs: {
    path: "/contactus",
    component: ContactUs,
  },
  myComments: {
    path: "/mycomments",
    component: MyComments,
  },
  confirmPassword: {
    path: "/confirm-password",
    component: ConfirmNewPassword,
  },

  buyProduct: {
    path: "/checkout",
    component: BuyProduct,
  },

  faq: {
    path: "/faq",
    component: FAQ,
  },
  resetPassword: {
    path: "/resetpassword/:forgot_link/:id",
    component: ResetPassword,
  },

  reservedSeats: {
    path: "/reserved-seats/:id",
    component: ReservedSeats,
  },
  cart: {
    path: "/cart",
    component: Cart,
  },
  myRewards: {
    path: "/myrewards",
    component: MyRewards,
  },
  confirm: {
    path: "/confirm",
    component: Confirm,
  },
  changePhone: {
    path: "/change-phone",
    component: ChangePhone,
  },
  policies: {
    path: "/policies",
    component: PoliciesPage,
  },
  unsubscribe: {
    path: "/unsubscribe/:userID",
    component: UnsubscribePage,
  },
};

export default routers;
