import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { settingsSelector } from "@redux/settings/Selector";
import moment from "moment";
import * as style from "./TermsAndConditions.module.scss";
import { Helmet } from "react-helmet";

function TermsAndConditions(props) {
  const settings = useSelector(settingsSelector);
  const revisitDate = useMemo(() => {
    return settings.updatedAt ? moment(settings.updatedAt).format("MMMM DD, YYYY") : "";
  }, [settings]);
  return (
    <>
      <Helmet>
          {/* <!-- HTML Meta Tags --> */}
          <title>Terms and Conditions</title>
          <link rel="canonical" href={window.location.href} />
          <meta
          name="description"
          content="Terms and Conditions of The BM Revolution"
          />

          {/* <!-- Google / Search Engine Tags --> */}
          <meta itemprop="name" content="Terms and Conditions" />
          <meta
          itemprop="description"
          content="Terms and Conditions of The BM Revolution"
          />
      
          {/* <!-- Facebook Meta Tags --> */}
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Terms and Conditions" />
          <meta
          property="og:description"
          content="Terms and Conditions of The BM Revolution"
          />

          {/* <!-- Twitter Meta Tags --> */}
          {/* <meta name="twitter:card" content="summary_large_image" /> */}
          <meta name="twitter:title" content="Terms and Conditions" />
          <meta
          name="twitter:description"
          content="Terms and Conditions of The BM Revolution"
          />
      </Helmet>
      
      <Container className="terms-and-conditions">
        <div className={style.header}>
          <div className="h2 font-weight-bold ">Terms & Conditions</div>
          <div className="font-weight-bold subtitle">
            Last Revised: <span className="color-dark-grey font-weight-normal">{revisitDate}</span>
          </div>
        </div>
        <hr />
        <div className={style.span}>{settings.terms}</div>
      </Container>
    </>
  );
}

TermsAndConditions.propTypes = {};

export default TermsAndConditions;
