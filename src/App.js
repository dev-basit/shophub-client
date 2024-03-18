import React, { useState } from "react";
import { BrowserRouter, Link, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CartScreen from "./screens/order/CartScreen";
import HomeScreen from "./screens/HomeScreen";
import PaymentMethodScreen from "./screens/order/PaymentMethodScreen";
import ProductScreen from "./screens/product/ProductScreen";
import ProfileScreen from "./screens/user/ProfileScreen";
import SigninScreen from "./screens/authentication/SigninScreen";
import RegisterScreen from "./screens/authentication/RegisterScreen";
import ShippingAddressScreen from "./screens/order/ShippingAddressScreen";
import PlaceOrderScreen from "./screens/order/PlaceOrderScreen";
import ProductListScreen from "./screens/product/ProductListScreen";
import ProductEditScreen from "./screens/product/ProductEditScreen";
import ProductCreateScreen from "./screens/product/ProductCreateScreen";
import OrderScreen from "./screens/order/OrderScreen";
import OrderListScreen from "./screens/order/OrderListScreen";
import OrderHistoryScreen from "./screens/order/OrderHistoryScreen";
import UserListScreen from "./screens/user/UserListScreen";
import UserEditScreen from "./screens/user/UserEditScreen";
import SellerScreen from "./screens/user/SellerScreen";
import SearchScreen from "./screens/SearchScreen";
import MapScreen from "./screens/MapScreen";

import PrivateRoute from "./components/routes/PrivateRoute";
import AdminRoute from "./components/routes/AdminRoute";
import SellerRoute from "./components/routes/SellerRoute";
import SearchBox from "./components/common/SearchBox";
import Sidebar from "./components/Sidebar";
import { signout } from "./store/user";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.userSignin);

  const dispatch = useDispatch();

  const signoutHandler = () => {
    dispatch(signout());
  };

  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <button type="button" className="open-sidebar" onClick={() => setShowSidebar(true)}>
              <i className="fa fa-bars"></i>
            </button>

            <Link className="brand" to="/">
              shophub
            </Link>
          </div>
          <Route render={({ history }) => <SearchBox history={history}></SearchBox>}></Route>
          <div>
            <Link to="/cart">
              Cart
              {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
            </Link>
            {userInfo ? (
              <div className="dropdown">
                <Link to="#">
                  {userInfo.name} <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/profile">User Profile</Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">Order History</Link>
                  </li>
                  <li>
                    <Link to="#signout" onClick={signoutHandler}>
                      Sign Out
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}

            {/* Seller  */}
            {userInfo && userInfo.isSeller && (
              <div className="dropdown">
                <Link to="#admin">
                  Seller <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/product-list/seller">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist/seller">Orders</Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Admin */}
            {userInfo && userInfo.isAdmin && (
              <div className="dropdown">
                <Link to="#admin">
                  Admin <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/product-list">Products</Link>
                  </li>
                  <li>
                    <Link to="/order-list">Orders</Link>
                  </li>
                  <li>
                    <Link to="/userlist">Users</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        <main>
          <Route path="/seller/:id" component={SellerScreen}></Route>
          <Route path="/" component={HomeScreen} exact></Route>
          <Route path="/signin" component={SigninScreen}></Route>
          <Route path="/register" component={RegisterScreen}></Route>
          <Route path="/search" component={SearchScreen} exact></Route>
          <Route path="/product/:id" component={ProductScreen} exact></Route>
          <Route path="/cart/:id?" component={CartScreen}></Route>
          <Route path="/shipping" component={ShippingAddressScreen}></Route>
          <Route path="/payment" component={PaymentMethodScreen}></Route>
          <Route path="/placeorder" component={PlaceOrderScreen}></Route>

          <PrivateRoute path="/profile" component={ProfileScreen}></PrivateRoute>
          <PrivateRoute path="/map" component={MapScreen}></PrivateRoute>
          <AdminRoute path="/product-list" component={ProductListScreen} exact></AdminRoute>
          <PrivateRoute path="/product/:id/edit" component={ProductEditScreen} exact></PrivateRoute>
          <PrivateRoute path="/create-product" component={ProductCreateScreen} exact></PrivateRoute>

          <Route path="/order/:id" component={OrderScreen}></Route>
          <Route path="/orderhistory" component={OrderHistoryScreen}></Route>
          <AdminRoute path="/order-list" component={OrderListScreen} exact></AdminRoute>
          <AdminRoute path="/userlist" component={UserListScreen}></AdminRoute>
          <AdminRoute path="/user/edit/:id" component={UserEditScreen}></AdminRoute>

          <SellerRoute path="/product-list/seller" component={ProductListScreen}></SellerRoute>
          <SellerRoute path="/orderlist/seller" component={OrderListScreen}></SellerRoute>
        </main>
        <footer className="row center">All rights reserved!</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
