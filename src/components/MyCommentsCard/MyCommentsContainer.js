import { connect } from "react-redux";
import MyCommentsCard from "./MyCommentsCard";
import commentActions from "@redux/comment/Actions";

const { postCommentRequest } = commentActions;

const mapStateToProps = (state) => ({
  isLogin: state.auth.isLoggedIn ? true : false,
  user_id: state.auth.user ? state.auth.user.id : false,
});

const mapDispatchToProps = {
  postCommentRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCommentsCard);
