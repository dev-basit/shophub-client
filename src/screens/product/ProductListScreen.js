import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useLocation, useHistory } from "react-router-dom";

import LoadingBox from "../../components/common/LoadingBox";
import MessageBox from "../../components/common/MessageBox";
import { getQueryParams, isSellerMode } from "../../utils/functions";
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
  createProduct,
  deleteProduct,
  listProducts,
} from "../../store/products";

export default function ProductListScreen(props) {
  const [filters, setFilters] = useState(() => getQueryParams(window.location.search.substring(1)));
  const [sellerMode, setSellerMode] = useState(isSellerMode(props));
  const { userInfo } = useSelector((state) => state.userSignin);
  const { loading, error, products, page, pages } = useSelector((state) => state.productList);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = useSelector((state) => state.productCreate);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.productDelete);

  const { pageNumber = 1, pageSize = 5 } = useParams();
  const location = useLocation();
  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageNumberParam = queryParams.get("pageNumber");
    const pageSizeParam = queryParams.get("pageSize");

    if (!pageNumberParam || !pageSizeParam) {
      queryParams.set("pageNumber", 1);
      queryParams.set("pageSize", 10);
      history.push({ search: queryParams.toString() });
    }
  }, [location, history]);

  useEffect(() => {
    // if (successCreate) {
    //   dispatch({ type: PRODUCT_CREATE_RESET });
    //   props.history.push(`/product/${createdProduct._id}/edit`);
    // }

    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }

    // const filters = { pageNumber, pageSize };
    if (sellerMode) filters["seller"] = userInfo._id;
    dispatch(listProducts(filters));
  }, [
    createdProduct,
    dispatch,
    props.history,
    sellerMode,
    successCreate,
    successDelete,
    userInfo._id,
    pageNumber,
    pageSize,
  ]);

  const deleteHandler = (product) => {
    if (window.confirm("Are you sure to delete?")) {
      dispatch(deleteProduct(product._id));
    }
  };

  const createHandler = () => {
    dispatch(createProduct());
  };

  return (
    <div>
      <div className="row">
        <h1>Products</h1>
        {/* <button type="button" className="primary" onClick={createHandler}> */}
        <button type="button" className="primary" onClick={() => props.history.push(`/create-product`)}>
          Create Product
        </button>
      </div>

      {loadingDelete && <LoadingBox />}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

      {loadingCreate && <LoadingBox />}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="tableContainer">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category.name}</td>
                    <td>{product.brand}</td>
                    <td>
                      <button
                        type="button"
                        className="small"
                        onClick={() => props.history.push(`/product/${product._id}/edit`)}
                      >
                        Edit
                      </button>
                      <button type="button" className="small" onClick={() => deleteHandler(product)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row center pagination">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? "active" : ""}
                key={x + 1}
                to={`/productlist/pageNumber/${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
