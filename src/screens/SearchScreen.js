import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import LoadingBox from "../components/common/LoadingBox";
import MessageBox from "../components/common/MessageBox";
import Product from "../components/Product";
import { listProducts } from "../store/products";
import { getQueryParams } from "../utils/functions";
import Rating from "../components/Rating";
import { prices, ratings } from "../utils/constants";

export default function SearchScreen(props) {
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const productCategoryList = useSelector((state) => state.productCategoryList);
  const { loading: loadingCategories, error: errorCategories, categories } = productCategoryList;
  const [filters, setFilters] = useState(() => getQueryParams(window.location.search.substring(1)));
  const dispatch = useDispatch();

  useEffect(() => {
    // const productFilters = getQueryParams(window.location.search.substring(1));
    // dispatch(listProducts(productFilters));
    dispatch(listProducts(filters));
  }, [dispatch, window.location.search.substring(1)]);

  return (
    <div>
      <div className="row">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>{products.length} Results</div>
        )}
        <div>
          Sort by
          <select
            value={filters.order}
            onChange={(e) => {
              // props.history.push(getFilterUrl({ order: e.target.value }));
            }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
            <option value="toprated">Avg. Customer Reviews</option>
          </select>
        </div>
      </div>

      <div className="row top">
        <div className="col-1">
          {/* <h3>Department</h3> */}
          {/* {loadingCategories ? (
            <LoadingBox />
          ) : errorCategories ? (
            <MessageBox variant="danger">{errorCategories}</MessageBox>
          ) : ( */}
          <div>
            {loadingCategories ? (
              <LoadingBox></LoadingBox>
            ) : errorCategories ? (
              <MessageBox variant="danger">{errorCategories}</MessageBox>
            ) : (
              <ul>
                <li>
                  <Link
                  // className={"all" === category ? "active" : ""}
                  // to={getFilterUrl({ category: "all" })}
                  >
                    Any
                  </Link>
                </li>
                {prices.map((c) => (
                  <li key={c}>
                    <Link
                    // className={c === category ? "active" : ""}
                    // to={getFilterUrl({ category: c })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3>Price</h3>
            <ul>
              {prices.map((price) => (
                <li key={price._id}>
                  <Link
                    //  className={price === category ? "active" : ""}
                    to={`/search?category=${price.name}`}
                  >
                    {price.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                  // to={getFilterUrl({ rating: r.rating })}
                  // className={`${r.rating}` === `${rating}` ? "active" : ""}
                  >
                    <Rating caption={" & up"} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-3">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {products.length === 0 && <MessageBox>No Product Found</MessageBox>}
              <div className="row center">
                {products.map((product) => (
                  <Product key={product._id} product={product}></Product>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
