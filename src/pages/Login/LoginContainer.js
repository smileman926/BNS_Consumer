import Login from "./Login";
import { connect } from "react-redux";
import authActions from "@redux/auth/Actions";
import {infiniteScrollAndOffset} from "@redux/product/Actions";
import withCheckAuth from "utils/HOC/withCheckAuth";

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  err: state.auth.errorMsg,
  loading: state.auth.loading,
});

const mapDispatchToProps = (dispatch) => ({
  requestLogin: (data) => dispatch(authActions.loginRequest(data)),
  infiniteScrollAndOffset: () => dispatch(infiniteScrollAndOffset())
});

export default withCheckAuth(
  connect(mapStateToProps, mapDispatchToProps)(Login)
);
