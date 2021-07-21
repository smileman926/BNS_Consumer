import Amplify, { Storage } from "aws-amplify";

Amplify.configure({
  Storage: {
    AWSS3: {
      bucket: process.env.REACT_APP_BUCKET_NAME,
      region: process.env.REACT_APP_REGION,
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    },
  },
});

export const uploadProfileImg = (data) =>
  Storage.put(`${data.name}`, data, {
    contentType: data.type,
  });

export const downloadImg = (url) => Storage.get(url);
export const imageUrl = ((url) => `https://${process.env.REACT_APP_BUCKET_NAME}.s3.amazonaws.com/public/${url}`);
