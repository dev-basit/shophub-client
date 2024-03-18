import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import LoadingBox from "./common/LoadingBox";
import MessageBox from "./common/MessageBox";
import Rating from "./Rating";
import { listProductCategories } from "../store/products";
import { getQueryParams } from "../utils/functions";
import { prices, ratings } from "../utils/constants";

function Sidebar({ showSidebar, setShowSidebar }) {
  const [filters, setFilters] = useState(() => getQueryParams(window.location.search.substring(1)));
  const { loading, error, products } = useSelector((state) => state.productList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = useSelector((state) => state.productCategoryList);
  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listProductCategories());
  }, [dispatch]);

  return (
    <aside className={showSidebar ? "open" : ""}>
      <div className="col-3">
        <ul className="categories">
          <li>
            <strong>Categories</strong>
            <button onClick={() => setShowSidebar(false)} className="close-sidebar" type="button">
              <i className="fa fa-close"></i>
            </button>
          </li>
          {loadingCategories ? (
            <LoadingBox />
          ) : errorCategories ? (
            <MessageBox variant="danger">{errorCategories}</MessageBox>
          ) : (
            categories.map((item) => (
              <li key={item._id} className="li-sidebar">
                <Link className="link" to={`?category=${item.name}`} onClick={() => setShowSidebar(false)}>
                  {item.name}
                </Link>
              </li>
            ))
          )}
        </ul>

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
              history.push(`?order=${e.target.value}`);
            }}
          >
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
            <option value="toprated">Avg. Customer Reviews</option>
          </select>
        </div>
      </div>

      <div className="col-1">
        <div>
          {loadingCategories ? (
            <LoadingBox />
          ) : errorCategories ? (
            <MessageBox variant="danger">{errorCategories}</MessageBox>
          ) : (
            <ul>
              <h3>Price</h3>
              {prices.map((item) => (
                <li key={item.name}>
                  <Link className="link" to={`?min=${item.min}&max=${item.max}`}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3>Avg. Customer Review</h3>
          <ul>
            {ratings.map((item) => (
              <li key={item.name}>
                <Link
                  to={`?rating=${item.rating}`}
                  //   className={`${item.rating}` === `${filters.rating}` ? "active" : ""}
                  className="link"
                >
                  <Rating caption=" & up" rating={item.rating}></Rating>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className="primary"
          onClick={() => {
            history.push("");
            setShowSidebar(false);
          }}
        >
          Clear Filters
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
