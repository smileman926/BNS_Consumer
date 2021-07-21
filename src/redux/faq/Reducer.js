import { combineReducers } from 'redux';
import * as TYPES from './Types';

const list = (state = [], { type, payload }) => {
  switch (type) {
    case TYPES.GET_FAQ_SUCCESS:
      return payload;
    default:
      return state;
  }
};

const errorMessage = (state = null, { type, payload }) => {
  switch (type) {
    case TYPES.GET_FAQ_ERROR:
      return payload;

    case TYPES.GET_FAQ_REQUEST:
    case TYPES.GET_FAQ_SUCCESS:
      return null;

    default:
      return state;
  }
};

const loading = (state = false, { type }) => {
  switch (type) {
    case TYPES.GET_FAQ_REQUEST:
      return true;
    case TYPES.GET_FAQ_ERROR:
      return false;

    default:
      return state;
  }
};

const FAQsReducer = combineReducers({
  list,
  errorMessage,
  loading,
});

export default FAQsReducer;
