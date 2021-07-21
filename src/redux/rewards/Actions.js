import * as type from "./Types";

export const getRewards = (payload) => ({
  type: type.GET_REWARDS_REQUEST,
  payload,
});

export const rewardsSuccess = (payload) => ({
  type: type.GET_REWARDS_SUCCESS,
  payload,
});

export const rewardsError = (payload) => ({
  type: type.GET_REWARDS_ERROR,
  payload,
});
