import { faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fb_link, insta_link } from "@redux/settings/Selector";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import routers from "router";
import { getAllSettings } from '../../utils/services/api';
import "./Footer.scss";

function Footer(props) {

  const [menuBackColor, setMenuBackColor] = useState("#000");

  useEffect(() => {

    getAllSettings()
    .then( result => {
      if (result.data && result.data.footer_background_color) {
        const backColor = JSON.parse(result.data.footer_background_color);
        setMenuBackColor(`rgba(${backColor.r }, ${backColor.g }, ${backColor.b }, ${backColor.a })`);
      }      
    })
    .catch((err) => {
      err.response && console.log(err.response.data.message);
    });
  }, []);

  return (
    <div className="footer d-flex justify-content-between" style={{backgroundColor: menuBackColor}}>
      <div>&copy; The BM Revolution</div>
      <div className="social-link">
        <a href={props.fb} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a href={props.insta} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      </div>
      <div>
        <Link to={routers.policies.path}>Policies</Link> |&nbsp;
        <Link to={routers.termsAndConditions.path}>Terms and Conditions</Link> |{" "}
        <Link to={routers.contactUs.path}>Contact Us</Link>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  fb: fb_link(state),
  insta: insta_link(state),
});

export default connect(mapStateToProps)(Footer);
