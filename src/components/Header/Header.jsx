import Logo from "@components/Logo";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Bell from "@images/icons/bell.svg";
import actions from "@redux/user/Actions";
import React, { useEffect, useRef, useState } from "react";
import { Nav, Navbar, NavDropdown, OverlayTrigger, Popover } from "react-bootstrap";
import { connect } from "react-redux";
import { Link, useHistory} from "react-router-dom";
import routers from "router";
import AuthService from "utils/services/authApi";
import { getAllSettings } from '../../utils/services/api';
// import originBackImage from '../../images/header.png';
import "./Header.scss";

const { getNotificationsRequest, setReadNotificationRequest } = actions;
function Header(props) {
  const collapseRef = useRef(null);

  const logout = () => {
    AuthService.logOut({})
      .then(() => {})
      .catch((err) => {});
  };

  const [menuBackColor, setMenuBackColor] = useState(null);

  useEffect(() => {
    console.log(menuBackColor)
  }, [menuBackColor]);

  useEffect(() => {

    getAllSettings()
    .then( result => {
      if (result.data && result.data.header_background_color) {
        const backColor = JSON.parse(result.data.header_background_color);
        backColor && setMenuBackColor(`rgba(${backColor.r }, ${backColor.g }, ${backColor.b }, ${backColor.a })`)
      }      
    })
    .catch((err) => {
      if (err.response)
        console.log(err.response.data.message);
    });

    // props.auth && props.auth.user && props.auth.user.id && props.getNotificationsRequest(props.auth.user.id)

  }, []);

  useEffect(() => {
   props.auth.user && props.getNotificationsRequest(props.auth.user.id)
  }, [props.auth.user]);

  let history = useHistory();

  const readNotification = async (target, id, product_type, product_id) => {
    props.setReadNotificationRequest(id);
    history.push(`/products/${product_type}/${product_id}`);

  };

  const notificationPopover = (
    <Popover id="notification-popover">
      <Popover.Title as="h3">Notifications</Popover.Title>
      <Popover.Content>
        {props.isLoading && (
          <div className="notify-loading">
            <FontAwesomeIcon icon={faSync} spin size="2x" className="mt-5 m-auto d-block" />
          </div>
        )}
        {!props.isLoading && (
          <div className="notify-scroll">
            {props.notifications.map((item) => {
              let title = "";
              switch (item.service_type) {
                case "won":
                  title = "You win.";
                  break;
                case "webinar_start":
                  title = "Webinar started.";
                  break;
                case "new_product":
                  title = " New product is added.";
                  break;
                case "":
                  break;
              }
              return (
                <div
                  className="whitspace-nowrap pb-2 b-1 notification-item"
                  key={item.id}
                  data-id={item.id}
                  onClick={({ target }) => readNotification(target, item.id, item.product_type, item.product_id)}
                >
                  {title}
                  <br />
                  <strong>{item.product_name}</strong>
                </div>
              );
            })}
          </div>
        )}
      </Popover.Content>
    </Popover>
  );

  const [hideAlert, setHideAlert] = useState(true);

  return (
    <div>
      {!hideAlert && <div className='webSiteDownAlert' onClick= {(e) => setHideAlert(!hideAlert)}>
      <p>We’re sorry but there is a temporary issue with the website. We will be back soon! </p>
    </div>}
    <Navbar expand="lg" className="header" style={ menuBackColor && {backgroundColor: menuBackColor, backgroundImage: 'none'}}>

      <Navbar.Brand as="div">
        <Link to={routers.home.path}>
          <Logo />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle ref={collapseRef} aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="nav-menu">
        <Nav className="mr-auto">
          {props.auth.isLoggedIn && props.notifications.length > 0 && (
            <OverlayTrigger trigger="click" placement="bottom-start" overlay={notificationPopover}>
              <Nav.Link>
                <img src={Bell} width="20" />
                <span className="notification-badge">{props.notifications.length > 99 ? '99+' : props.notifications.length  }</span>
              </Nav.Link>
            </OverlayTrigger>
          )}
          {props.auth.isLoggedIn && props.notifications.length === 0 && (
            <Nav.Link>
              <img src={Bell} width="20" />
              <span className="notification-badge">{props.notifications.length}</span>
            </Nav.Link>
          )}
          <Link
            to={routers.products.path}
            className="nav-link "
            onClick={() => (window.innerWidth <= 990 ? collapseRef.current.click() : null)}
          >
            Products
          </Link>
          {props.auth.isLoggedIn && (
            <Link
              to={routers.cart.path}
              className="nav-link"
              onClick={() => (window.innerWidth < 990 ? collapseRef.current.click() : null)}
            >
              Cart
            </Link>
          )}
          {props.auth.isLoggedIn && (
            <NavDropdown title="My Account" id="basic-nav-dropdown">
              <NavDropdown.Item as="div">
                <Link
                  to={routers.purchaseHistory.path}
                  className="nav-link p-0"
                  onClick={() => (window.innerWidth < 990 ? collapseRef.current.click() : null)}
                >
                  Purchase history
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item as="div">
                <Link
                  to={routers.myProfile.path}
                  className="nav-link p-0"
                  onClick={() => (window.innerWidth <= 990 ? collapseRef.current.click() : null)}
                >
                  My profile
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item as="div">
                <Link
                  to={routers.myComments.path}
                  className="nav-link p-0"
                  onClick={() => (window.innerWidth <= 990 ? collapseRef.current.click() : null)}
                >
                  My comments
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item as="div">
                <Link
                  to={routers.myRewards.path}
                  className="nav-link p-0"
                  onClick={() => (window.innerWidth <= 990 ? collapseRef.current.click() : null)}
                >
                  My rewards
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item onClick={logout}>Log out</NavDropdown.Item>
            </NavDropdown>
          )}
          {!props.auth.isLoggedIn && (
            <Link
              to={routers.login.path}
              className="nav-link "
              onClick={() => (window.innerWidth <= 990 ? collapseRef.current.click() : null)}
            >
              My Account
            </Link>
          )}
          <Link
            to={routers.faq.path}
            className="nav-link "
            onClick={() => (window.innerWidth <= 990 ? collapseRef.current.click() : null)}
          >
            FAQs
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    </div>
  );
}

Header.propTypes = {};

const mapStateToProps = (state) => ({
  auth: state.auth,
  notifications: state.user.notifications,
  isLoading: state.user.isLoading,
});

const mapDispatchToProps = {
  getNotificationsRequest,
  setReadNotificationRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
