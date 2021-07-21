import myCommentsTypes from "./Types.js";

const initState = {
  list: [],
  messageErr: null,
};

const myCommentsReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case myCommentsTypes.MYCOMMENTS_REQUEST:
      return state;
    case myCommentsTypes.MYCOMMENTS_SUCCESS:
      return {
        list: payload.list,
        messageErr: null,
      };
    case myCommentsTypes.MYCOMMENTS_FAILED:
      return {
        ...state,
        messageErr: payload.err,
      };
    default:
      return state;
  }
};

export default myCommentsReducer;
