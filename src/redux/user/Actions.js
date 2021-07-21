import types from './Types'

const getNotificationsRequest = (payload) => ({ type: types.NOTIFICATION_GET_REQUEST, payload });
const getNotificationsSuccess = (payload) => ({ type: types.NOTIFICATION_GET_SUCCESS, payload });
const getNotificationsFailed = (payload) => ({ type: types.NOTIFICATION_GET_FAILED, payload });

const setReadNotificationRequest = (payload) => ({ type: types.NOTIFICATION_READ_REQUEST, payload });
const setReadNotificationSuccess = (payload) => ({ type: types.NOTIFICATION_READ_SUCCESS, payload });
const setReadNotificationFailed = (payload) => ({ type: types.NOTIFICATION_READ_FAILED, payload });

const actions = {
  getNotificationsRequest,
  getNotificationsSuccess,
  getNotificationsFailed,

  setReadNotificationRequest,
  setReadNotificationSuccess,
  setReadNotificationFailed,
};

export default actions;
