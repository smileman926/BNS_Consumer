import * as types from "./Types";

/*
{
    id: "",
    quantity: 1,
    price: 123,
}
*/

const cartReducer = (state = [], { type, payload }) => {
  switch (type) {
    case types.ADD_ITEM:
      payload.key = Math.random();
      return [...state, payload];
    case types.REMOVE_ITEM:
      return state.filter((item) => item.id !== payload.id);
    case types.CHANGE_ITEM:
      const { key, quantity } = payload;
      return state.map((item) => (item.key === key ? { ...item, quantity } : item));
    case types.CLEAR_CART:
      return [];
    default:
      return state;
  }
};

export default cartReducer;
