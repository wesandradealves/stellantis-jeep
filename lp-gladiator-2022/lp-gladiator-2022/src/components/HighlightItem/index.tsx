import React from "react";

import Image from "../Image";

import styles from "./styles.module.scss";

const HighlightItem = (props: { data: any }) => {
  const { data } = props;
  return (
    <div className={styles.container}>
      <div className={`wrapper-general ${styles.content}`}>
        <div className={styles.containerTitle}>
          <h2
            className={`desktop desktop-mobile ${styles.title}`}
            dangerouslySetInnerHTML={{ __html: data.title }}
          />
          <h2
            className={`mobile ${styles.title}`}
            dangerouslySetInnerHTML={{ __html: data.titleMobile }}
          />
        </div>
        <p dangerouslySetInnerHTML={{ __html: data.description }} />
      </div>
      <div className={styles.image}>
        <div className="desktop desktop-mobile">
          <Image
            src={data.image}
            alt={data.alt_seo}
            title={data.title_seo}
          />
        </div>
        <div className="mobile">
          <Image
            src={data.imageMobile}
            alt={data.alt_seo}
            title={data.title_seo}
          />
        </div>
      </div>
    </div>
  );
};

export default HighlightItem;
