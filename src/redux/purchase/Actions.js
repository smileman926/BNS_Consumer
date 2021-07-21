import purchaseActionsTypes from './Types'


const getPurchaseHistoryRequest = (payload) => ({ type: purchaseActionsTypes.PURCHASE_HISTORY_REQUEST, payload });
const getPurchaseHistorySuccess = (payload) => ({ type: purchaseActionsTypes.PURCHASE_HISTORY_SUCCESS, payload });
const getPurchaseHistoryFailed = (payload) => ({ type: purchaseActionsTypes.PURCHASE_HISTORY_FAILED, payload });

const getWebinarWinnerRequest = (payload) => ({ type: purchaseActionsTypes.WEBINAR_WINNER_HISTORY_REQUEST, payload });
const getWebinarWinnerSuccess = (payload) => ({ type: purchaseActionsTypes.WEBINAR_WINNER_HISTORY_SUCCESS, payload });
const getWebinarWinnerFailed = (payload) => ({ type: purchaseActionsTypes.WEBINAR_WINNER_HISTORY_FAILED, payload });


const purchaseActions = {
  getPurchaseHistoryRequest,
  getPurchaseHistorySuccess,
  getPurchaseHistoryFailed,

  getWebinarWinnerRequest,
  getWebinarWinnerSuccess,
  getWebinarWinnerFailed,
};

export default purchaseActions;
