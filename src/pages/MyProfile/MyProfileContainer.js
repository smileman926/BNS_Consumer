import { connect } from "react-redux";
import MyProfile from "./MyProfile";
import updateUserActions from "@redux/updateUser/Actions";
import withAuth from "utils/HOC/withAuth";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  userUpdating: state.updateUser
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (credentials) =>
    dispatch(updateUserActions.updateUserRequest(credentials)),
});

export default withAuth(
  connect(mapStateToProps, mapDispatchToProps)(MyProfile)
);
