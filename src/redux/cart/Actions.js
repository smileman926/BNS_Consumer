import * as types from "./Types";

export const addItem = (payload) => ({
  type: types.ADD_ITEM,
  payload,
});

export const removeItem = (payload) => ({
  type: types.REMOVE_ITEM,
  payload,
});

export const changeItem = (payload) => ({
  type: types.CHANGE_ITEM,
  payload,
});
export const clearCart = (payload) => ({
  type: types.CLEAR_CART,
});
