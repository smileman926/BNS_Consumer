/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import routers from "./../router";
import "./../style/index.scss";
import "./App.css";
import { connect, useSelector } from "react-redux";
import Footer from "@components/Footer";
import Header from "@components/Header";

import { settingsRequest } from "@redux/settings/Actions";
import { apiLogOut, getCurrentBackImg } from "utils/services/api";
import { useCallback } from "react";
import { Helmet } from "react-helmet";
import originBackImage from '../images/background.png';
// import { Storage } from 'aws-amplify';
import { imageUrl } from "utils/services/s3";

function App({ settingsRequest }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = process.env.REACT_APP_ACCEPT_JS_URL;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);
  const email = useSelector((state) => state.auth.user)?.email || null;
  window.onbeforeunload = useCallback(() => {
    if (email) {
      apiLogOut({email});
    }
  }, [email]);

  const [currentBackImg, setCurrentBackImg] = useState(null);
  useEffect(() => {
    settingsRequest();

    getCurrentBackImg()
      .then( async (result) => {
        console.log(result);
        if (result.data && result.data.image_url) {
          const imgUrl =  imageUrl(result.data.image_url);
          // const imgUrl = await Storage.get(result.data.image_url);
          console.log(imgUrl);
          setCurrentBackImg(imgUrl);
        }      
      })
      .catch((err) => {
        err.response && console.log(err.response.data.message);
      });
  }, []);

  return (
    <>
      <Helmet>
          {/* <!-- HTML Meta Tags --> */}
          <title>The BM Revolution</title>
          <link rel="canonical" href={window.location.href} />
          <meta
          name="description"
          content="The BM Revolution"
          />

          {/* <!-- Google / Search Engine Tags --> */}
          <meta itemprop="name" content="The BM Revolution" />
          <meta
          itemprop="description"
          content="The BM Revolution"
          />
       
          {/* <!-- Facebook Meta Tags --> */}
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="The BM Revolution" />
          <meta
          property="og:description"
          content="The BM Revolution"
          />

          {/* <!-- Twitter Meta Tags --> */}
          {/* <meta name="twitter:card" content="summary_large_image" /> */}
          <meta name="twitter:title" content="The BM Revolution" />
          <meta
          name="twitter:description"
          content="The BM Revolution"
          />
      </Helmet>
      <Header />
      <div className="bns-main-container" style={{backgroundImage:`url(${currentBackImg ? currentBackImg : originBackImage})`}}>
        <Switch>
          <Route path={routers.home.path} component={routers.products.component} exact />
          <Route path={routers.login.path} component={routers.login.component} />
          <Route exact path={routers.products.path} component={routers.products.component} />
          <Route exact path={routers.product.path} component={routers.product.component} />
          <Route path={routers.forgotPass.path} component={routers.forgotPass.component} />
          <Route path={routers.myProfile.path} component={routers.myProfile.component} />
          <Route
            path={routers.purchaseHistory.path}
            component={routers.purchaseHistory.component}
          />
          <Route path={routers.signUp.path} component={routers.signUp.component} />
          <Route path={routers.verifyAccount.path} component={routers.verifyAccount.component} />
          <Route
            path={routers.termsAndConditions.path}
            component={routers.termsAndConditions.component}
          />
          <Route
            path={routers.policies.path}
            component={routers.policies.component}
          />
          <Route path={routers.contactUs.path} component={routers.contactUs.component} />
          <Route path={routers.myComments.path} component={routers.myComments.component} />
          <Route
            path={routers.confirmPassword.path}
            component={routers.confirmPassword.component}
          />
          <Route path={routers.buyProduct.path} component={routers.buyProduct.component} />
          <Route path={routers.reservedSeats.path} component={routers.reservedSeats.component} />
          <Route path={routers.faq.path} component={routers.faq.component} />
          <Route path={routers.resetPassword.path} component={routers.resetPassword.component} />
          <Route path={routers.cart.path} component={routers.cart.component} />
          <Route path={routers.myRewards.path} component={routers.myRewards.component} />
          <Route path={routers.confirm.path} component={routers.confirm.component} />
          <Route path={routers.changePhone.path} component={routers.changePhone.component} />
          <Route path={routers.unsubscribe.path} component={routers.unsubscribe.component} />

          <Route path="/home" component={routers.home.component} />
          <Redirect to={routers.home.path} />
        </Switch>
      </div>
      <Footer />
    </>
  );
}

const mapDispatchToProps = {
  settingsRequest
};

export default connect(null, mapDispatchToProps)(App);
