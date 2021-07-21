/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "utils/services/authApi";
import routers from "./../../router";
import { useSelector } from "react-redux";

const withAuth = (WrappedComponent) => ({ ...props }) => {
  const [comp, setComp] = useState(null);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    AuthService.isAuthUser().then((res) => {
      if (user) {
        AuthService.autoLogOut();
      }
      setComp(
        user && res ? (
          <WrappedComponent {...props} />
        ) : (
          <Redirect to={routers.login.path} />
        )
      );
    });
  }, [user]);

  return comp;
};

export default withAuth;
