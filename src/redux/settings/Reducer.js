import * as settingsTypes from "./Types";

const initialState = {
  instagram_media_links: "https://www.instagram.com/bsfirearms",
  facebook_media_links: "https://www.facebook.com/bsfirearms",
  contact_us_page_info: "Example text",
  contact_us_email_address: "sdadasd@sadsd.ru",
  commentsOption: false,
  termsOption: false,
  backgroundOption: false,
  startFrom: null,
  endTo: null,
  headerColor: null,
  footerColor: null,
  backgroundID: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case settingsTypes.SETTINGS_SUCCESS:
      return payload;
    default:
      return state;
  }
};
