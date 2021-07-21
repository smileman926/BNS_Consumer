import { connect } from "react-redux";
import MyComments from "./MyComments";
import myCommentsActions from "@redux/myComments/Actions";
import withAuth from "utils/HOC/withAuth";

const mapStateToProps = (state) => ({
  id: state.auth.user ? state.auth.user.id : "",
  comments: state.myComments.list,
});

const mapDispatchToProps = (dispatch) => ({
  getComments: (id) => dispatch(myCommentsActions.myCommentsRequest(id)),
});

export default withAuth(
  connect(mapStateToProps, mapDispatchToProps)(MyComments)
);
