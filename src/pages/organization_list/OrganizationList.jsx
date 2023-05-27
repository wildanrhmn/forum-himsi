import React, { useEffect } from "react";

import Styles from "../../styles/landingpage/LandingPage.module.css";
import { useMediaQuery } from "react-responsive";

import AsideBarOrganisasi from "../../components/landingpage/AsideBarOrganisasi";
import AsideBarTopik from './../../components/landingpage/AsideBarTopik';
import OrganizationCard from "../../components/organization_list/OrganizationCard";

import { useDispatch, useSelector } from "react-redux";
import { AsyncGetAllOrganizations } from "../../state/users/middleware";
import { AsyncGetAllCategory } from "../../state/category/middleware";

const OrganizationList = () => {
  const dispatch = useDispatch();

  const { users = [] } = useSelector((states) => states);
  const {category = [] } = useSelector(states => states);

  useEffect(() => {
    dispatch(AsyncGetAllOrganizations());
    dispatch(AsyncGetAllCategory());
  }, [dispatch]);

  const isLarge = useMediaQuery({
    query: "(max-width: 1400px)",
  });
  return (
    <div className="container-fluid">
      <div className="row">
        <div className={`${isLarge ? "col-lg-9" : "col-lg-9"}`}>
          <OrganizationCard data={users} />
        </div>
        <div className={`${isLarge ? "col-lg-3" : "col-lg-3"}`}>
          <div className={Styles.containerRightBar}>
           <AsideBarOrganisasi data={users} />
           <AsideBarTopik data={category} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationList;
