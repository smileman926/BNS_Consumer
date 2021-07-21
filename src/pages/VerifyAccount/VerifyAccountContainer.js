import { connect } from "react-redux";
import VerifyAccount from "./VerifyAccount";
import authActions from "@redux/auth/Actions";
import withCheckAuth from "utils/HOC/withCheckAuth";

const mapDispatchToProps = (dispatch) => ({
  apiReqSignUp: (data) => dispatch(authActions.registerRequest(data)),
});

export default withCheckAuth(connect(null, mapDispatchToProps)(VerifyAccount));
