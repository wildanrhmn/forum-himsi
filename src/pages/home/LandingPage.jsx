import React, { useEffect } from "react";
import Posts from "../../components/posts/Posts";

import Styles from "../../styles/landingpage/LandingPage.module.css";
import { useMediaQuery } from "react-responsive";
import { useSelector, useDispatch } from "react-redux";
import AsideBarOrganisasi from "../../components/landingpage/AsideBarOrganisasi";
import AsideBarTopik from './../../components/landingpage/AsideBarTopik';
import { AsyncGetAllOrganizations } from "../../state/users/middleware";
import { AsyncGetAllCategory } from "../../state/category/middleware";

import {ReactComponent as Pinned } from '../../assets/icons/pinned.svg';

const LandingPage = () => {
  const isLarge = useMediaQuery({
    query: "(max-width: 1400px)",
  });
  const dispatch = useDispatch();

  const { posts = [] } = useSelector(states => states);
  const { users = [] } = useSelector(states => states);
  const {category = [] } = useSelector(states => states);
  const { flaging = { status: false } } = useSelector(states => states);

  useEffect(() => {
    dispatch(AsyncGetAllOrganizations());
    dispatch(AsyncGetAllCategory());
  }, [dispatch])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className={`${isLarge ? "col-lg-9" : "col-lg-9"}`}>
          {flaging.status && (
            <div style={{padding: '25px'}}>
              <Pinned />
              <span style={{color: '#616569', fontSize: '14px'}}>Now displaying category {flaging.value}</span>
            </div>
          )}
          {posts && posts?.map(post => (
            <>
              <Posts
                _id={post.id}
                id_user={post.created_by}
                profilePic={post.profile_picture?.url}
                name={post.display_name}
                username={post.username}
                imageSrc={post.attachments}
                description={post.body}
                category={post.category}
                totalLikes={post.likes.length}
                totalComments={post.discussion.length}
                likes={post.likes}
              />
            </>
          ))}
        </div>
  <div className={`${isLarge ? "col-lg-3" : "col-lg-3"}`} 
       style={{ position: 'sticky',
                paddingLeft: '25px'
        }}>
      <div className={Styles.containerRightBar}>
            <AsideBarOrganisasi data={users} />
            <AsideBarTopik data={category} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
