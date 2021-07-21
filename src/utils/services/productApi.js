import { API } from 'aws-amplify';

export const getAllProductsApi = (body) => API.post('general', '/products/getall', { body });
export const getProductDetailApi = (body) => API.post('general', '/products/getproduct', { body });
