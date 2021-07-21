import LogoImage from "@images/logo.png";
import PropTypes from "prop-types";
import React, {useMemo} from "react";
import { Link, useHistory } from "react-router-dom";
import "./ProductCardItem.style.scss";
import floatFormat from "../../utils/formats/float"

function ProductCardItem({ product, hasWebinar, showScrollPos }) {
  const { product_type, main_image, id, product_name, product_price, product_count } = product;
  let history = useHistory();
  const goDetailPage = () => {
    showScrollPos();
    history.push(`/products/${product_type}/${id}`);
  }
  const isPhysical = useMemo(()=> product_type === 'physical', [product_type]);
  const imageUrl = useMemo(() =>
      `https://${process.env.REACT_APP_BUCKET_NAME}.s3.amazonaws.com/public/${main_image.image_url}`, [main_image]);
  return (
    <div className="product-card">
      <div className="thumb-wrapper">
        <div className="thumb" onClick={goDetailPage}>
          <>
            <div className="webinar-wrapper"></div>
            <button className="webinar-button">{ hasWebinar ? "Webinar" : "Product"} </button>
          </>
          <img src={imageUrl} alt={`${product_name}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = LogoImage;
            }}
          />
        </div>
      </div>
      <div className="product-info">
        <div className="product-info-title">
          <Link to={`/products/${product_type}/${id}`} className="active">{product_name}</Link>
        </div>
        <div className="product-info-defail">
          <span className="color-green"> ${floatFormat(product_price)} </span>{" "}
          {isPhysical ? `each ` : `/seat `}|
          <span className="color-green"> {product_count} </span>{" "}
          {isPhysical ? `left in stock ` : `seats remaining `}
        </div>
      </div>
    </div>
  );
}

ProductCardItem.propTypes = {
  hasWebinar: PropTypes.bool,
  product: PropTypes.object,
};

export default ProductCardItem;
