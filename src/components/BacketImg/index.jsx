import React, { useMemo } from "react";
import LogoImage from "@images/logo.png";
function BacketImg(props) {
  const { main_image, ...args } = props;
  const src = useMemo(
    () =>
      main_image
        ? `https://${process.env.REACT_APP_BUCKET_NAME}.s3.amazonaws.com/public/${main_image.image_url}`
        : LogoImage,
    [main_image]
  );

  return <img alt="bns-image" {...args} src={src} />;
}

export default BacketImg;
