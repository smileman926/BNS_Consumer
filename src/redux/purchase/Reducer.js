import purchaseActionTypes from "./Types";

const initState = {
  purchaseHistory: [],
  purchaseHistoryFilter: {},
  purchaseHistoryCount: 0,
  webinarWinnerHistory: [],
  webinarWinnerHistoryFileter: [],
  webinarWinnerHistoryCount: 0,
  isHistoryLoading: false,
};

const purchaseReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case purchaseActionTypes.PURCHASE_HISTORY_REQUEST:
      return {
        ...state,
        isHistoryLoading: true,
        purchaseHistoryFilter: payload
      };
    case purchaseActionTypes.PURCHASE_HISTORY_SUCCESS:
      return {
        ...state,
        isHistoryLoading: false,
        purchaseHistory: payload.data,
        purchaseHistoryCount: payload.count,
      };
    case purchaseActionTypes.PURCHASE_HISTORY_FAILED:
      return {
        ...state,
        isHistoryLoading: false,
      };

    case purchaseActionTypes.WEBINAR_WINNER_HISTORY_REQUEST:
      return {
        ...state,
        isHistoryLoading: true,
        webinarWinnerHistoryFileter: payload
      };
    case purchaseActionTypes.WEBINAR_WINNER_HISTORY_SUCCESS:
      return {
        ...state,
        isHistoryLoading: false,
        webinarWinnerHistory: payload,
      };
    case purchaseActionTypes.WEBINAR_WINNER_HISTORY_FAILED:
      return {
        ...state,
        isHistoryLoading: false,
      };

    default:
      return state;
  }
};

export default purchaseReducer;
