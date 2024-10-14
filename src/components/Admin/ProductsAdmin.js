"use client";
import React, { useState, useContext } from "react";
import { ProductContext } from "@/features/ProductContext";
import Image from "next/image";
import { UserContext } from "@/features/UserContext";
import "../../styles/Common.css";

const ProductsAdmin = () => {
  const { products } = useContext(ProductContext);
  const IMG_BASE_URL = process.env.NEXT_PUBLIC_BASE_IMG_URL;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { state } = useContext(UserContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: -1,
    name: "",
    description: "",
    priceUSD: "",
    priceUYU: "",
    productSizes: [],
    mainImage: null,
    images: [],
  });

  const myLoader = ({ src }) => {
    return src;
  };

  const editProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      priceUSD: product.priceUSD,
      priceUYU: product.priceUYU,
      productSizes: product.productSizes,
      mainImage: product.mainImage, 
      images: product.images,
    });
    setModalVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSizeChange = (index, value) => {
    const updatedSizes = formData.productSizes.map((size, i) =>
      i === index ? { ...size, stock: value } : size
    );
    setFormData({ ...formData, productSizes: updatedSizes });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (field === 'mainImage') {
      setFormData({ ...formData, mainImage: file });
    } else {
      setFormData({ ...formData, images: [...formData.images, file] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Agregar los datos del producto
    data.append('Id', formData.id);
    data.append('Name', formData.name);
    data.append('Description', formData.description);
    data.append('PriceUSD', formData.priceUSD);
    data.append('PriceUYU', formData.priceUYU);

    // Agregar imagen principal
    if (formData.mainImage) {
      data.append('MainImage', formData.mainImage);
    }

    // Agregar imágenes adicionales
    formData.images.forEach((image) => {
      data.append('Images', image);
    });


    formData.productSizes.forEach((size) => {
      let object = JSON.stringify({ SizeName: size.size.name, Stock: size.stock });
      console.log(object);
      data.append(`Size${size.size.name}`, object);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/product/update`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${state.user.token}`,
        },
        body: data,
      });

      if (response.ok) {
        console.log("Producto actualizado con éxito.");
        setModalVisible(false);
      } else {
        console.error("Error al actualizar el producto");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="products-admin">
      <h1 className="flex justify-between align-center">
        <span>Productos</span>
        <span>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            t="1551322312294"
            viewBox="0 0 1024 1024"
            version="1.1"
            pid="10297"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs></defs>
            <path
              d="M474 152m8 0l60 0q8 0 8 8l0 704q0 8-8 8l-60 0q-8 0-8-8l0-704q0-8 8-8Z"
              pid="10298"
            ></path>
            <path
              d="M168 474m8 0l672 0q8 0 8 8l0 60q0 8-8 8l-672 0q-8 0-8-8l0-60q0-8 8-8Z"
              pid="10299"
            ></path>
          </svg>
        </span>
      </h1>
      <div className="products-admin-container">
        {products.map((product, index) => (
          <div className="products-admin-item" key={index}>
            <div className="product-admin-item-details">
              <h1>
                #{product.id}
                <p style={{ fontSize: 14 }} dangerouslySetInnerHTML={{ __html: product.name }} />
              </h1>
              <button onClick={() => editProduct(product)}>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 16 16"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.293 1.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z"
                    clipRule="evenodd"
                  ></path>
                  <path
                    fillRule="evenodd"
                    d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 00.5.5H4v.5a.5.5 0 00.5.5H5v.5a.5.5 0 00.5.5H6v-1.5a.5.5 0 00-.5-.5H5v-.5a.5.5 0 00-.5-.5H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
        {modalVisible && (
          <>
            <div
              className="overlay"
              onClick={() => {
                setModalVisible(false);
                setSelectedProduct(null);
              }}
            ></div>
            <div className="modal-admin-content">
              <form className="modal-admin-form-editable" onSubmit={handleSubmit}>
                <div className="modal-admin-form-editable-product">
                  <div className="input-editable-container">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="input-editable-container">
                    <label>Descripci&oacute;n:</label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="d-flex input-editable-twice-container">
                    <div className="input-editable-container">
                      <label>Precio USD:</label>
                      <input
                        type="text"
                        name="priceUSD"
                        value={formData.priceUSD}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="input-editable-container">
                      <label>Precio UYU:</label>
                      <input
                        type="text"
                        name="priceUYU"
                        value={formData.priceUYU}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {formData.productSizes.map((productSize, index) => (
                  <div key={index} className="modal-admin-form-editable-product-stock">
                    <p>{productSize.size.name}</p>
                    <input
                      type="text"
                      name="stock"
                      value={productSize.stock}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                    />
                  </div>
                ))}

                <div className="input-editable-container">
                  <label>Imagen Principal:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'mainImage')}
                  />
                </div>

                <div className="input-editable-container">
                  <label>Otras Imágenes:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'images')}
                    multiple
                  />
                </div>

                <div className="modal-admin-form-buttons">
                  <button type="submit" className="btn-form">Actualizar Producto</button>
                  <button
                    type="button"
                    onClick={() => {
                      setModalVisible(false);
                      setSelectedProduct(null);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsAdmin;
