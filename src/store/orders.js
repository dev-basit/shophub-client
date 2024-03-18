import Axios from "axios";
import { CART_EMPTY } from "../store/cart";
import { backend_url } from "../constants/constants";
import { handleQueryParams } from "../utils/functions";

const ORDER_CREATE_REQUEST = "ORDER_CREATE_REQUEST";
const ORDER_CREATE_SUCCESS = "ORDER_CREATE_SUCCESS";
const ORDER_CREATE_FAIL = "ORDER_CREATE_FAIL";
const ORDER_CREATE_RESET = "ORDER_CREATE_RESET";

const ORDER_DETAILS_REQUEST = "ORDER_DETAILS_REQUEST";
const ORDER_DETAILS_SUCCESS = "ORDER_DETAILS_SUCCESS";
const ORDER_DETAILS_FAIL = "ORDER_DETAILS_FAIL";

const ORDER_MINE_LIST_REQUEST = "ORDER_MINE_LIST_REQUEST";
const ORDER_MINE_LIST_FAIL = "ORDER_MINE_LIST_FAIL";
const ORDER_MINE_LIST_SUCCESS = "ORDER_MINE_LIST_SUCCESS";

const ORDER_PAY_REQUEST = "ORDER_PAY_REQUEST";
const ORDER_PAY_SUCCESS = "ORDER_PAY_SUCCESS";
const ORDER_PAY_FAIL = "ORDER_PAY_FAIL";
export const ORDER_PAY_RESET = "ORDER_PAY_RESET";

const ORDER_LIST_REQUEST = "ORDER_LIST_REQUEST";
const ORDER_LIST_SUCCESS = "ORDER_LIST_SUCCESS";
const ORDER_LIST_FAIL = "ORDER_LIST_FAIL";

const ORDER_DELETE_REQUEST = "ORDER_DELETE_REQUEST";
const ORDER_DELETE_SUCCESS = "ORDER_DELETE_SUCCESS";
const ORDER_DELETE_FAIL = "ORDER_DELETE_FAIL";
export const ORDER_DELETE_RESET = "ORDER_DELETE_RESET";

const ORDER_DELIVER_REQUEST = "ORDER_DELIVER_REQUEST";
const ORDER_DELIVER_SUCCESS = "ORDER_DELIVER_SUCCESS";
const ORDER_DELIVER_FAIL = "ORDER_DELIVER_FAIL";
export const ORDER_DELIVER_RESET = "ORDER_DELIVER_RESET";

// Reducer
export const orderReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return { loading: true };

    case ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };

    case ORDER_CREATE_FAIL:
      return { loading: false, error: action.payload };

    case ORDER_CREATE_RESET:
      return {};

    default:
      return state;
  }
};

export const orderDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return { loading: true };

    case ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload };

    case ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const orderPayReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_PAY_REQUEST:
      return { loading: true };

    case ORDER_PAY_SUCCESS:
      return { loading: false, success: true };

    case ORDER_PAY_FAIL:
      return { loading: false, error: action.payload };

    case ORDER_PAY_RESET:
      return {};

    default:
      return state;
  }
};

export const orderMineListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_MINE_LIST_REQUEST:
      return { loading: true };

    case ORDER_MINE_LIST_SUCCESS:
      return { loading: false, orders: action.payload };

    case ORDER_MINE_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const orderListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return { loading: true };

    case ORDER_LIST_SUCCESS:
      return { loading: false, orders: action.payload };

    case ORDER_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const orderDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_DELETE_REQUEST:
      return { loading: true };

    case ORDER_DELETE_SUCCESS:
      return { loading: false, success: true };

    case ORDER_DELETE_FAIL:
      return { loading: false, error: action.payload };

    case ORDER_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const orderDeliverReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_DELIVER_REQUEST:
      return { loading: true };

    case ORDER_DELIVER_SUCCESS:
      return { loading: false, success: true };

    case ORDER_DELIVER_FAIL:
      return { loading: false, error: action.payload };

    case ORDER_DELIVER_RESET:
      return {};
    default:
      return state;
  }
};

// Action Creator
export const createOrder = (order) => async (dispatch, getState) => {
  dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
  try {
    const {
      userSignin: { userInfo },
    } = getState();

    const { data } = await Axios.post(backend_url + "/api/orders", order, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
    dispatch({ type: CART_EMPTY });
    localStorage.removeItem("cartItems");
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const resetOrders = () => async (dispatch) => {
  dispatch({ type: ORDER_CREATE_RESET });
};

export const detailsOrder = (orderId) => async (dispatch, getState) => {
  dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(backend_url + `/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: ORDER_DETAILS_FAIL, payload: message });
  }
};

export const payOrder = (order, paymentResult) => async (dispatch, getState) => {
  dispatch({ type: ORDER_PAY_REQUEST, payload: { order, paymentResult } });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = Axios.put(backend_url + `/api/orders/${order._id}/pay`, paymentResult, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: ORDER_PAY_FAIL, payload: message });
  }
};

export const listOrderMine = () => async (dispatch, getState) => {
  dispatch({ type: ORDER_MINE_LIST_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();

  try {
    const { data } = await Axios.get(backend_url + "/api/orders/mine", {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    dispatch({ type: ORDER_MINE_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: ORDER_MINE_LIST_FAIL, payload: message });
  }
};

export const orderPayReset = () => async (dispatch) => {
  dispatch({ type: ORDER_PAY_RESET });
};

export const listOrders =
  (queryParams = {}) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_LIST_REQUEST });
      const {
        userSignin: { userInfo },
      } = getState();

      let filters = handleQueryParams(queryParams);
      const { data } = await Axios.get(backend_url + "/api/orders?" + filters, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      console.log(data);
      dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message;
      dispatch({ type: ORDER_LIST_FAIL, payload: message });
    }
  };

export const deleteOrder = (orderId) => async (dispatch, getState) => {
  dispatch({ type: ORDER_DELETE_REQUEST, payload: orderId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = Axios.delete(backend_url + `/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: ORDER_DELETE_FAIL, payload: message });
  }
};

export const deliverOrder = (orderId) => async (dispatch, getState) => {
  dispatch({ type: ORDER_DELIVER_REQUEST, payload: orderId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(
      backend_url + `/api/orders/deliver-order/${orderId}`,
      {},
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: ORDER_DELIVER_FAIL, payload: message });
  }
};
