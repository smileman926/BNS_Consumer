import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import ImageGallery from "react-image-gallery";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import routers from "router";
import { imageUrl } from "utils/services/s3";
import MyCommentsCard from "../../components/MyCommentsCard";
import CommentEditor from "../../components/Utilities/CommentEditor";
import cartIcon from "../../images/icons/cart.svg";
import { isLoggedSelector, userSelector } from "../../redux/auth/Selectors";
import { addItem, removeItem } from "../../redux/cart/Actions";
import commentActions from "../../redux/comment/Actions";
import { commentsSelector } from "../../redux/comment/Selectors";
import productActions from "../../redux/product/Actions";
import { productSelector } from "../../redux/product/Selectors";
import { settingsSelector } from "../../redux/settings/Selector";
import "./ProductDetailPage.style.scss";
import AuthService from "utils/services/authApi";
import { Helmet } from "react-helmet";
import floatFormat from "utils/formats/float"

const { getProductDetailRequest } = productActions;
const { postCommentRequest, getCommentsWithProductRequest } = commentActions;

function ProductDetailPage(props) {
  const history = useHistory();
  const settings = useSelector(settingsSelector);
  const [imgs, setImgs] = useState([]);
  const { id, type } = props?.match?.params;
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const product = useSelector(productSelector);
  const user = useSelector(userSelector);
  const isLoggedIn = useSelector(isLoggedSelector);
  const isLoading = product?.isLoading;
  const comment = useSelector(commentsSelector);
  const productDetail = product?.detail;
  const productConfig = {
    webinar: {
      btn_title: "purchase seats",
      btn_link: routers.reservedSeats.path.replace(":id", id),
      name_one_item: "/seat",
      balances: "seats remaining",
    },
    physical: {
      btn_title: "buy now",
      btn_link: routers.buyProduct.path,
      name_one_item: " each",
      balances: "left in stock",
    },
  };

  const currentQuantity =
    useSelector((state) => state.cart)?.find((el) => el.id === id)?.quantity || 1;

  useEffect(() => {
    dispatch(getProductDetailRequest({ id, product_type: type }));
    dispatch(getCommentsWithProductRequest(id));
    setQuantity(currentQuantity);
    // eslint-disable-next-line
  }, []);

  const postComment = (comment) => {
    if (user.id) {
      dispatch(
        postCommentRequest({
          user_id: user.id,
          product_id: id,
          comment_content: comment,
          product_type: type,
        })
      );
    }
  };

  const purchaseProduct = () => {
    if (!isLoggedIn) {
      history.push("/login", {link: `/products/${type}/${id}`});
      return;
    }
    switch (type) {
      case "physical":
        history.push(productConfig.physical.btn_link, {
          ...productDetail,
          quantity,
          price: productDetail.pricePerItem,
          productType: "physical",
        });
        return;
      case "webinar":
        history.push(productConfig.webinar.btn_link, productDetail);
        return;
      default:
        return;
    }
  };

  const renderCommentsForm = useMemo(() => {
    if (settings?.hide_comments) {
      return null;
    } else {
      return (
        <Col>
          <CommentEditor
            onPost={postComment}
            isPosting={comment.isPosting}
            total={comment?.productComments?.length || 0}
          />
        </Col>
      );
    }
  }, [postComment, comment.isPosting, settings]);

  const renderComments = useMemo(() => {
    if (settings?.hide_comments) {
      return null;
    } else {
      return comment?.productComments?.map((comment) => (
        <MyCommentsCard comment={comment} key={comment.message.id} hasProduct />
      ));
    }
  }, [settings, comment]);

  const renderCommentsTotal = useMemo(() => {
    if (settings?.hide_comments) {
    } else {
      return (
        <Row className="comment-post">
          {renderCommentsForm}
          {/* <p className={isLoggedIn ? "count-comments" : "count-comments-relative"}>
            {comment?.productComments?.length} Comments
          </p> */}
        </Row>
      );
    }
  }, [settings, isLoggedIn, comment, renderCommentsForm]);

  useEffect(() => {
    if (productDetail?.pictures?.length > 0) {
      const res = [
        {
          original: imageUrl(productDetail?.main_image?.image_url),
          thumbnail: imageUrl(productDetail?.main_image?.image_url),
        },
      ];
      productDetail.pictures.map((item) => {
        const original = imageUrl(item.image_url);
        const thumbnail = imageUrl(item.image_url);
        if (item.image_url === productDetail.main_image.image_url) {
          return;
        }
        res.push({
          original,
          thumbnail,
        });
      });
      setImgs(res);
    }
    // eslint-disable-next-line
  }, [productDetail]);

  const increment = () =>
    setQuantity(quantity + 1 <= productDetail.amount ? quantity + 1 : quantity);
  const decrement = () => setQuantity(quantity - 1 > 0 ? quantity - 1 : quantity);

  const addToCart = () => {
    const payload = {
      id: productDetail.id,
      category_id: productDetail.category_id,
      name: productDetail.productName,
      quantity,
      price: productDetail.pricePerItem || productDetail.seats,
      productType: "physical",
      shipping_price: productDetail.shipping_price,
      max: productDetail.amount || productDetail.remainingSeats,
    };
    dispatch(removeItem({ id }));
    dispatch(addItem(payload));
    history.push(routers.cart.path);
  };

  const renderContent = () => (
    <>
      <Helmet>
          {/* <!-- HTML Meta Tags --> */}
          <title>{productDetail?.productName || productDetail?.name}</title>
          <link rel="canonical" href={window.location.href} />
          <meta
          name="description"
          content={productDetail?.shortDescription}
          />

          {/* <!-- Google / Search Engine Tags --> */}
          <meta itemprop="name" content={productDetail?.productName || productDetail?.name} />
          <meta
          itemprop="description"
          content={productDetail?.shortDescription}
          />
          <meta
          itemprop="image"
          content={imgs[0]?.original}
          />

          {/* <!-- Facebook Meta Tags --> */}
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={productDetail?.productName || productDetail?.name} />
          <meta
          property="og:description"
          content={productDetail?.shortDescription}
          />
          <meta
          property="og:image"
          content={imgs[0]?.original}
          />

          {/* <!-- Twitter Meta Tags --> */}
          {/* <meta name="twitter:card" content="summary_large_image" /> */}
          <meta name="twitter:title" content={productDetail?.productName || productDetail?.name} />
          <meta
          name="twitter:description"
          content={productDetail?.shortDescription}
          />
          <meta
          name="twitter:image"
          content={imgs[0]?.original}
          />
      </Helmet>
      <div className="product-detail">
        {isLoading && (
          <FontAwesomeIcon icon={faSync} spin size="4x" className="mt-5 m-auto d-block" />
        )}
        {!isLoading && (
          <Container>
            <Row>
              <Col xs={12} md={6}>
                <ImageGallery items={imgs} showFullscreenButton={false} showPlayButton={false} />
              </Col>
              <Col xs={12} md={6}>
                <h2 className="mt-0">{productDetail?.productName || productDetail?.name}</h2>
                <div className="mt-4 mb-3 font-weight-bold">Description</div>
                <div className="space-keep">{productDetail?.shortDescription}</div>
                <div className="mb-4 mt-4">
                  <span className="font-weight-bold">Price:</span>
                  <span className="colorAccent pl-1 pr-1">
                    ${floatFormat(productDetail?.pricePerItem || productDetail?.price_per_seats)}
                  </span>
                  {productConfig[type].name_one_item}
                  <span> | </span>
                  <span className="colorAccent pl-1 pr-1">
                    {productDetail?.amount || productDetail?.remainingSeats}
                  </span>
                  {productConfig[type]?.balances}
                </div>
                {type === "physical" && (
                  <div className="quantity--wrp">
                    <div className="quantity--box">
                      <button type="button" className="button_change" onClick={decrement}>
                        -
                      </button>
                      <span className="quantity__count">{quantity}</span>
                      <button type="button" className="button_change" onClick={increment}>
                        +
                      </button>
                    </div>
                    <button type="button" className="button_addToCart" onClick={addToCart}>
                      <img src={cartIcon} alt="cart icon" />
                      add to cart
                    </button>
                  </div>
                )}
                <div className="btnBuyWrp">
                  <Button variant="bns" type="submit" onClick={purchaseProduct}>
                    {productConfig[type].btn_title}
                  </Button>
                </div>
              </Col>
            </Row>
            {isLoggedIn && (
              <Container>
                {renderCommentsTotal}
                <Row>
                  <Col>
                    {(!comment.productComments ||comment.productComments.length === 0) && (
                      <h2 className="text-center">No Comments</h2>
                    )}
                    {renderComments}
                  </Col>
                </Row>
              </Container>
            )}
          </Container>
        )}
      </div>
    </>
  )
  return (
    <>
    {
      productDetail ? renderContent()
      :
      <h1 className="text-center text-white">This product is not available now...</h1>
    }
    </>
  );
}

export default ProductDetailPage;
