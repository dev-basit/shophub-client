import axios from "axios";
import { backend_url } from "../constants/constants";
import { handleQueryParams } from "../utils/functions";

const PRODUCT_LIST_REQUEST = "PRODUCT_LIST_REQUEST";
const PRODUCT_LIST_SUCCESS = "PRODUCT_LIST_SUCCESS";
const PRODUCT_LIST_FAIL = "PRODUCT_LIST_FAIL";

const PRODUCT_CREATE_REQUEST = "PRODUCT_CREATE_REQUEST";
const PRODUCT_CREATE_SUCCESS = "PRODUCT_CREATE_SUCCESS";
const PRODUCT_CREATE_FAIL = "PRODUCT_CREATE_FAIL";
export const PRODUCT_CREATE_RESET = "PRODUCT_CREATE_RESET";

const PRODUCT_DELETE_REQUEST = "PRODUCT_DELETE_REQUEST";
const PRODUCT_DELETE_SUCCESS = "PRODUCT_DELETE_SUCCESS";
const PRODUCT_DELETE_FAIL = "PRODUCT_DELETE_FAIL";
export const PRODUCT_DELETE_RESET = "PRODUCT_DELETE_RESET";

const PRODUCT_UPDATE_REQUEST = "PRODUCT_UPDATE_REQUEST";
const PRODUCT_UPDATE_SUCCESS = "PRODUCT_UPDATE_SUCCESS";
const PRODUCT_UPDATE_FAIL = "PRODUCT_UPDATE_FAIL";
export const PRODUCT_UPDATE_RESET = "PRODUCT_UPDATE_RESET";

const PRODUCT_DETAILS_REQUEST = "PRODUCT_DETAILS_REQUEST";
const PRODUCT_DETAILS_SUCCESS = "PRODUCT_DETAILS_SUCCESS";
const PRODUCT_DETAILS_FAIL = "PRODUCT_DETAILS_FAIL";

const PRODUCT_CATEGORY_LIST_REQUEST = "PRODUCT_CATEGORY_LIST_REQUEST";
const PRODUCT_CATEGORY_LIST_SUCCESS = "PRODUCT_CATEGORY_LIST_SUCCESS";
const PRODUCT_CATEGORY_LIST_FAIL = "PRODUCT_CATEGORY_LIST_FAIL";

const PRODUCT_REVIEW_CREATE_REQUEST = "PRODUCT_REVIEW_CREATE_REQUEST";
const PRODUCT_REVIEW_CREATE_SUCCESS = "PRODUCT_REVIEW_CREATE_SUCCESS";
const PRODUCT_REVIEW_CREATE_FAIL = "PRODUCT_REVIEW_CREATE_FAIL";
export const PRODUCT_REVIEW_CREATE_RESET = "PRODUCT_REVIEW_CREATE_RESET";

// Reducers
export const productListReducer = (state = { loading: true, product: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true };

    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: action.payload,
        // pages: action.payload.pages,
        // page: action.payload.page, // TODO: check what is this
      };

    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const productCategoryListReducer = (state = { loading: true, products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_CATEGORY_LIST_REQUEST:
      return { loading: true };

    case PRODUCT_CATEGORY_LIST_SUCCESS:
      return { loading: false, categories: action.payload };

    case PRODUCT_CATEGORY_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true };

    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };

    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_CREATE_RESET:
      return {};

    default:
      return state;
  }
};

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true };

    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true };

    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_DELETE_RESET:
      return {};

    default:
      return state;
  }
};

export const productUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true };

    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true };

    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_UPDATE_RESET:
      return {};

    default:
      return state;
  }
};

export const productDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true };

    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };

    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const productReviewCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_REVIEW_CREATE_REQUEST:
      return { loading: true };

    case PRODUCT_REVIEW_CREATE_SUCCESS:
      return { loading: false, success: true, review: action.payload };

    case PRODUCT_REVIEW_CREATE_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_REVIEW_CREATE_RESET:
      return {};

    default:
      return state;
  }
};

// Action  Creators
export const listProducts =
  (queryParams = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_LIST_REQUEST });

      let filters = handleQueryParams(queryParams);
      const { data } = await axios.get(backend_url + "/api/products?" + filters);

      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
    }
  };

export const listProductCategories = () => async (dispatch) => {
  dispatch({
    type: PRODUCT_CATEGORY_LIST_REQUEST,
  });
  try {
    const { data } = await axios.get(backend_url + `/api/products-categories`);
    dispatch({ type: PRODUCT_CATEGORY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_CATEGORY_LIST_FAIL, payload: error.message });
  }
};

export const createProduct = (payload) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST });
    const {
      userSignin: { userInfo },
    } = getState();

    const { data } = await axios.post(backend_url + "/api/products", payload, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data.product });
  } catch (error) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PRODUCT_CREATE_FAIL, payload: message });
  }
};

export const deleteProduct = (productId) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_DELETE_REQUEST, payload: productId });
  const {
    userSignin: { userInfo },
  } = getState();

  try {
    await axios.delete(backend_url + `/api/products/${productId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_DELETE_SUCCESS });
  } catch (error) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PRODUCT_DELETE_FAIL, payload: message });
  }
};

export const updateProduct = (product) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_UPDATE_REQUEST, payload: product });
  const {
    userSignin: { userInfo },
  } = getState();

  try {
    const { data } = await axios.put(backend_url + `/api/products/${product._id}`, product, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PRODUCT_UPDATE_FAIL, error: message });
  }
};

export const detailsProduct = (productId) => async (dispatch) => {
  dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });

  try {
    const { data } = await axios.get(`/api/products/${productId}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const createReview = (productId, review) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_REVIEW_CREATE_REQUEST });
    const {
      userSignin: { userInfo },
    } = getState();

    const { data } = await axios.post(backend_url + `/api/products/reviews/${productId}`, review, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    dispatch({
      type: PRODUCT_REVIEW_CREATE_SUCCESS,
      payload: data.review,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PRODUCT_REVIEW_CREATE_FAIL, payload: message });
  }
};
