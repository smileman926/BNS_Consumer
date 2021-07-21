import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "utils/services/authApi";
import routers from "./../../router";
import { useSelector } from "react-redux";

const withCheckAuth = (WrappedComponent) => ({ ...props }) => {
  const [comp, setComp] = useState(null);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    AuthService.isAuthUser().then((res) =>
      setComp(
        user && res ? (
          <Redirect to={routers.home.path} />
        ) : (
          <WrappedComponent {...props} />
        )
      )
    );
  }, [user]);

  return comp;
};

export default withCheckAuth;
