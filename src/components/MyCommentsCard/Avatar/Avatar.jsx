import React, { useState, useEffect } from "react";
import ReactAvatar from "react-avatar";
import { downloadImg } from "utils/services/s3";

function Avatar(props) {
  const { src, ...args } = props;

  const [img, setImg] = useState(null);

  useEffect(() => {
    if (src) {
      downloadImg(src)
        .then((res) => setImg(res))
        .catch((err) => console.log("err", err));
    }
  }, [src]);

  return <ReactAvatar {...args} src={img} />;
}

export default Avatar;
