import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import FAQItem from "../../components/FAQItem";
import styles from "./index.module.scss";
import { faqsSelector } from "@redux/faq/Selectors";
import { getFAQs } from "../../redux/faq/Actions";
import { Helmet } from "react-helmet";

function FAQ() {
  const dispatch = useDispatch();
  const faqs = useSelector(faqsSelector)?.list?.data;

  useEffect(() => {
    dispatch(getFAQs());
  }, []);

  const renderFAQs = useMemo(() => {
    if (faqs?.length > 0) {
      return faqs.map((faq) => <FAQItem key={faq.id} faq={faq} />);
    }
    return <div className={styles.noFaqsCont}> There is no FAQs </div>;
  }, [faqs]);

  return (
    <>
      <Helmet>
          {/* <!-- HTML Meta Tags --> */}
          <title>List of FAQs</title>
          <link rel="canonical" href={window.location.href} />
          <meta
          name="description"
          content="FAQ List of The BM Revolution"
          />

          {/* <!-- Google / Search Engine Tags --> */}
          <meta itemprop="name" content="List of FAQs" />
          <meta
          itemprop="description"
          content="FAQ List of The BM Revolution"
          />
       
          {/* <!-- Facebook Meta Tags --> */}
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="List of FAQs" />
          <meta
          property="og:description"
          content="FAQ List of The BM Revolution"
          />

          {/* <!-- Twitter Meta Tags --> */}
          {/* <meta name="twitter:card" content="summary_large_image" /> */}
          <meta name="twitter:title" content="List of FAQs" />
          <meta
          name="twitter:description"
          content="FAQ List of The BM Revolution"
          />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.titleCont}>
          <span className={styles.title}>Frequently Asked Questions</span>
        </div>
        <div className={styles.questCont}>{renderFAQs}</div>
      </div>
    </>
  );
}

export default FAQ;
