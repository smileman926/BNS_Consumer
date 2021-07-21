import { combineReducers } from "redux";
import * as TYPES from "./Types";

const loading = (state = false, { type, payload }) => {
  switch (type) {
    case TYPES.GET_REWARDS_REQUEST:
      return true;
    case TYPES.GET_REWARDS_SUCCESS:
    case TYPES.GET_REWARDS_ERROR:
      return false;
    default:
      return state;
  }
};

const list = (state = [], { type, payload }) => {
  switch (type) {
    case TYPES.GET_REWARDS_REQUEST:
    case TYPES.GET_REWARDS_ERROR:
      return [];
    case TYPES.GET_REWARDS_SUCCESS:
      return payload;
    default:
      return state;
  }
};

const error = (state = null, { type, payload }) => {
  switch (type) {
    case TYPES.GET_REWARDS_ERROR:
      return payload;
    case TYPES.GET_REWARDS_REQUEST:
    case TYPES.GET_REWARDS_SUCCESS:
      return null;
    default:
      return state;
  }
};

const rewardsReducer = combineReducers({
  loading,
  list,
  error,
});

export default rewardsReducer;
