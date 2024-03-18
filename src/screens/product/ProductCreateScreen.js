import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createProduct } from "../../store/products";
import LoadingBox from "../../components/common/LoadingBox";
import MessageBox from "../../components/common/MessageBox";
import { uploadImage } from "../../services/imageService";

export default function ProductCreateScreen(props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState(""); // TODO: change catehroy to dropdown, hit request to get list of categories
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [uploadSameFileAgainHack, setUploadSameFileAgainHack] = useState(1);
  const [errorUpload, setErrorUpload] = useState("");

  const { loading, success, error, product } = useSelector((state) => state.productCreate);
  const { userInfo } = useSelector((state) => state.userSignin);

  const dispatch = useDispatch();

  const handleUploadImage = async (e) => {
    e.preventDefault();
    setUploadSameFileAgainHack((prev) => prev + 1);

    let file = e.target.files[0];
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", process.env.REACT_APP_CLOUDINARY_FOLDER);

    try {
      setLoadingUpload(true);
      let uploadedImageUrl = await uploadImage(formData);
      setImage(uploadedImageUrl);
      setLoadingUpload(false);
    } catch (error) {}
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // TODO: add schema validation here or in the start of createProduuct action creator
    dispatch(
      createProduct({
        name,
        price,
        image,
        // category, // TODO: change catehroy to dropdown, hit request to get list of categories
        category: "65f688831f54cd6ff986371f", // hat catehory , hardcoded // TODO: change catehroy to dropdown, hit request to get list of categories // hardcoding now
        brand,
        countInStock,
        description,
        seller: userInfo._id, // if you are creating from admin account, then this will not work. in that case create a dropdown and show all the seller, and select a sledt for whcih you want to create product.
      })
    );

    if (!error) window.location = "/";
  };

  // const uploadFileHandler = async (e) => {
  //   const file = e.target.files[0];
  //   const bodyFormData = new FormData();
  //   bodyFormData.append("image", file);
  //   setLoadingUpload(true);
  //   try {
  //     const { data } = await axios.post("/api/uploads", bodyFormData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${userInfo.token}`,
  //       },
  //     });
  // setImageUrl(data);
  //     setLoadingUpload(false);
  //   } catch (error) {
  //     setErrorUpload(error.message);
  //     setLoadingUpload(false);
  //   }
  // };

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Create Product</h1>
        </div>

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="text"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></input>
            </div>

            <div>
              <div>
                <div className="row">
                  <label htmlFor="imageFile">Image</label>
                  {loadingUpload && <LoadingBox />}
                  {errorUpload && <MessageBox variant="danger">{errorUpload}</MessageBox>}
                </div>
              </div>
              <input
                type="file"
                id="imageFile"
                label="Choose Image"
                accept="image/*"
                key={uploadSameFileAgainHack}
                // onChange={uploadFileHandler}
                onChange={handleUploadImage}
              ></input>
            </div>

            {/* // TODO: change catehroy to dropdown, hit request to get list of categories */}
            <div>
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="brand">Brand</label>
              <input
                id="brand"
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="countInStock">Count In Stock</label>
              <input
                id="countInStock"
                type="text"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="3"
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label></label>
              <button className="primary" type="submit">
                Create
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
