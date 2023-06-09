import React, { useState, useRef, useEffect } from "react";
import { Nav, Navbar, Form, Button, InputGroup } from "react-bootstrap";
import Loading from "../tools/Loading";

import { ReactComponent as Logo } from "../../assets/logo/Logo.svg";
import { ReactComponent as Search } from "../../assets/icons/Search.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/Expand_left_stop.svg";
import { ReactComponent as Banned } from "../../assets/icons/Banned.svg";
import { ReactComponent as Home } from "../../assets/icons/Home.svg";
import { ReactComponent as Notification } from "../../assets/icons/notification-on.svg";
import { ReactComponent as AddSquare } from "../../assets/icons/Add_square.svg";
import { ReactComponent as Person } from "../../assets/icons/profile-2.svg";
import { ReactComponent as Trash } from "../../assets/icons/Trash.svg";
import { ReactComponent as Submission } from "../../assets/icons/Submission.svg";
import { ReactComponent as Reports } from "../../assets/icons/Reports.svg";
import { BiLogOut } from "react-icons/bi";

import { useSelector, useDispatch } from "react-redux";
import { AsyncGetPosts } from "../../state/posts/middleware";
import { AsyncCheckLogin } from "../../state/auth/middleware";

import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Styles from "../../styles/headerfooter/Navbar.module.css";

import { animated as a, useSpring } from "@react-spring/web";
import cookies from "../../utils/cookie";
import { AsyncGetOrganizationsWithQuery } from "../../state/organization/middleware";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { auth = {} } = useSelector((states) => states);
  const loginForumInfo = JSON.parse(sessionStorage.getItem("login_forum_info"));
  const { role } = loginForumInfo || {}; // Add null check here
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    cookies.remove("refreshToken");

    navigate("/login");
    window.location.reload();
  };

  const navAnimation = useSpring({
    to: {
      maxWidth: sidebarToggle ? "220px" : "83px",
    },
    config: {
      tension: 250,
      friction: 20,
      duration: sidebarToggle ? 200 : 200,
    },
  });

  useEffect(() => {
    dispatch(AsyncGetPosts());
    dispatch(AsyncCheckLogin());
  }, [dispatch]);

  const handleNavigate = () => {
    if (auth.role) {
      navigate(`/profile/${auth.id_user}`);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setSidebarToggle(false);
      }
    }
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);

  const closeExpandedAnimation = useSpring({
    to: {
      transform: sidebarToggle ? "translateX(0)" : "translateX(-10px)",
      display: sidebarToggle ? "block" : "none",
      visibility: "visible",
      opacity: sidebarToggle ? 1 : 0,
    },
    config: {
      tension: 250,
      friction: 20,
      duration: sidebarToggle ? 200 : 200,
    },
  });

  const springProps = useSpring({
    to: {
      opacity: sidebarToggle ? 1 : 0,
      transform: sidebarToggle ? "translateX(0)" : "translateX(-20px)",
    },
    config: {
      tension: 250,
      friction: 20,
      duration: sidebarToggle ? 200 : 200,
    },
  });

  function handleSearchQuery(query){
    if(query === null){
      return;
    }
    if(location.pathname.includes('/organization-list')){
        try{
          dispatch(AsyncGetOrganizationsWithQuery(1, query));
        }
        catch(err){
          console.log(err);
        }
    } else {
        try{
          dispatch(AsyncGetPosts(1, query));
        }
        catch(err){
          console.log(err);
        }
    }
  }

  /* ====================== If SysAdmin Login ====================================*/

  if (auth.role === "SysAdmin" || role === "SysAdmin") {
    return (
      <header>
        <Loading />
        <div className={Styles.navContainer}>
          <a.div
            className={Styles.verticalNav}
            style={
              (auth.role || role === "SysAdmin")
                ? { ...navAnimation, width: "220px" }
                : { ...navAnimation }
            }
            ref={ref}
          >
            <div
              className={`${Styles.logoContainer} ${sidebarToggle ? Styles.expanded : ""
                }`}
              style={{ cursor: "pointer" }}
            >
              <Logo
                className={Styles.logo}
                onClick={() => setSidebarToggle(true)}
              />
              <a.div
                style={closeExpandedAnimation}
                className={Styles.closeExpanded}
                onClick={() => setSidebarToggle(false)}
              >
                <CloseIcon />
              </a.div>
            </div>
            <div className={Styles.iconContainer}>
              <div
                className={`${Styles.sideIcon} ${sidebarToggle ? Styles.expanded : ""
                  } ${location.pathname === "/deleted-posts" ? Styles.active : ""
                  }`}
                onClick={() => navigate('/deleted-posts')}
              >
                <Trash
                  className={`${Styles.sideLink} ${location.pathname === "/deleted-posts" ? Styles.active : ""
                    }`}
                />
                {sidebarToggle && (
                  <a.span style={{ ...springProps, whiteSpace: "nowrap" }}>
                    Deleted Posts
                  </a.span>
                )}
              </div>

              <div
                className={`${Styles.sideIcon} ${sidebarToggle ? Styles.expanded : ""
                  } ${(location.pathname === "/banned-accounts" || location.pathname === "/detail-banned") 
                  ? Styles.active : ""
                  }`}
                  onClick={() => navigate('/banned-accounts')}
              >
                <Banned
                  className={`${Styles.sideLink} 
                  ${(location.pathname === "/banned-accounts" || location.pathname === "/detail-banned" ) 
                  ? Styles.active : ""
                    }`}
                />
                {sidebarToggle && (
                  <a.span style={{ ...springProps, whiteSpace: "nowrap" }}>
                    Banned Accounts
                  </a.span>
                )}
              </div>

              <div
                className={`${Styles.sideIcon} ${sidebarToggle ? Styles.expanded : ""
                  } ${(location.pathname === "/reported-accounts" || location.pathname === "/detail-report") 
                  ? Styles.active : ""
                  }`}
                  onClick={() => navigate('/reported-accounts')}
              >
                <Reports
                  className={`${Styles.sideLink} 
                  ${(location.pathname === "/reported-accounts" || location.pathname === "/detail-report") 
                  ? Styles.active : ""
                    }`}
                />
                {sidebarToggle && (
                  <a.span style={{ ...springProps, whiteSpace: "nowrap" }}>
                    Reported Accounts
                  </a.span>
                )}
              </div>
              <div
                className={`${Styles.sideIcon} ${sidebarToggle ? Styles.expanded : ""
                  } ${(location.pathname === "/account-submissions" || location.pathname === '/detail-submission') 
                  ? Styles.active : ""
                  }`}
                  onClick={() => navigate('/account-submissions')}
              >
                <Submission
                  className={`${Styles.sideLink}
                   ${(location.pathname === "/account-submissions" || location.pathname === '/detail-submission')
                    ? Styles.active
                    : ""
                    }`}
                />
                {sidebarToggle && (
                  <a.span style={{ ...springProps, whiteSpace: "nowrap" }}>
                    Submission Form
                  </a.span>
                )}
              </div>

              {(auth && role) && (
                <>
                  <hr />
                  <div
                    className={`${Styles.sideIcon} ${sidebarToggle ? Styles.expanded : ""
                      }`}
                    onClick={handleLogout}
                  >
                    <BiLogOut
                      className={`${Styles.sideLink}`}
                    />
                    {sidebarToggle && (
                      <a.span
                        style={{
                          ...springProps,
                          whiteSpace: "nowrap",
                          fontSize: "16px",
                        }}
                      >
                        Keluar
                      </a.span>
                    )}
                  </div>
                </>
              )}
            </div>
          </a.div>
          <Navbar className={Styles.horizontalNav}>
            <Nav className={`mr-auto ${Styles.navLinks}`}>
              <Nav.Link
                as={NavLink}
                to="/"
                style={location.pathname === "/" ? { color: "#444BF2" } : {}}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/organization-list"
                style={
                  location.pathname === "/organization-list"
                    ? { color: "#444BF2" }
                    : {}
                }
              >
                Organization
              </Nav.Link>
              <Nav.Link as={NavLink} className={Styles.hasSubMenu}>
                Topic
                <ul className={Styles.subMenu}>
                  <li>
                    <Nav.Link as={NavLink} to="" onClick={() => handleSearchQuery("Info Kampus")}>
                      Info Kampus
                    </Nav.Link>
                  </li>
                  <li>
                    <Nav.Link as={NavLink} to="" onClick={() => handleSearchQuery("Magang")}>
                      Magang
                    </Nav.Link>
                  </li>
                  <li>
                    <Nav.Link as={NavLink} to="" onClick={() => handleSearchQuery("Lomba")}>
                      Lomba
                    </Nav.Link>
                  </li>
                  <li>
                    <Nav.Link as={NavLink} to="" onClick={() => handleSearchQuery("Penelitian")}>
                      Penelitian
                    </Nav.Link>
                  </li>
                  <li>
                    <Nav.Link as={NavLink} to="" onClick={() => handleSearchQuery("Seminar")}>
                      Seminar
                    </Nav.Link>
                  </li>
                  <li>
                    <Nav.Link as={NavLink} to="" onClick={() => handleSearchQuery("Olahraga")}>
                      Olahraga
                    </Nav.Link>
                  </li>
                </ul>
              </Nav.Link>
            </Nav>

            <InputGroup className={Styles.inputGroup}>
              <Form.Control
                placeholder="Cari"
                aria-label="Cari"
                className={Styles.myFormControl}
              />
              <Button className={Styles.buttonForm}>
                <Search />
              </Button>
            </InputGroup>
          </Navbar>
        </div>
      </header>
    );
  }

  /* ====================== If User/Organization ====================================*/

  return (
    <header>
      <Loading />
      <div className={Styles.navContainer}>
        <a.div className={Styles.verticalNav} style={navAnimation} ref={ref}>
          <div
            className={`${Styles.logoContainer} ${sidebarToggle ? Styles.expanded : ""
              }`}
            style={{ cursor: "pointer" }}
          >
            <Logo
              className={Styles.logo}
              onClick={() => setSidebarToggle(true)}
            />
            <a.div
              style={closeExpandedAnimation}
              className={Styles.closeExpanded}
              onClick={() => setSidebarToggle(false)}
            >
              <CloseIcon />
            </a.div>
          </div>
          <div className={Styles.iconContainer}>
            <div
              className={`${Styles.sideIcon} ${sidebarToggle ? Styles.expanded : ""
                } ${location.pathname === "/" ? Styles.active : ""}`}
              onClick={() => navigate("/")}
            >
              <Home
                className={`${Styles.sideLink} ${location.pathname === "/" ? Styles.active : ""
                  }`}
              />
              {sidebarToggle && (
                <a.span
                  style={{
                    ...springProps,
                    whiteSpace: "nowrap",
                    fontSize: "16px",
                  }}
                >
                  Beranda
                </a.span>
              )}
            </div>
            <div
              className={`${Styles.sideIcon} ${sidebarToggle ? Styles.expanded : ""
                } 
                ${location.pathname === "/login" ||
                  location.pathname === `/profile/${auth.id_user}` ||
                  location.pathname === "/register"
                  ? Styles.active
                  : ""
                }`}
              onClick={handleNavigate}
            >
              <Person
                className={`${Styles.sideLink} ${
                  location.pathname === "/login" ||
                  location.pathname === `/profile/${auth.id_user}` ||
                  location.pathname === "/register"
                  ? Styles.active
                  : ""
                  }`}
              />
              {sidebarToggle && (
                <a.span
                  style={{
                    ...springProps,
                    whiteSpace: "nowrap",
                    fontSize: "16px",
                  }}
                >
                  Profile
                </a.span>
              )}
            </div>
            {(auth && role) && (
              <div
                className={`${Styles.sideIcon} ${sidebarToggle ? Styles.expanded : ""
                  } ${location.pathname === "/notification" ? Styles.active : ""}`}
              >
                <Notification
                  className={`${Styles.sideLink} ${location.pathname === "/notification" ? Styles.active : ""
                    }`}
                />
                {sidebarToggle && (
                  <a.span
                    style={{
                      ...springProps,
                      whiteSpace: "nowrap",
                      fontSize: "16px",
                    }}
                  >
                    Notifikasi
                  </a.span>
                )}
              </div>
            )}
            {(auth.role === 'Verified' || role === 'Verified') && (

              <div
                className={`${Styles.sideIcon} ${sidebarToggle ? Styles.expanded : ""
                  } ${location.pathname === "/create-post" ? Styles.active : ""}`}
                onClick={() => navigate("/create-post")}
              >
                <AddSquare
                  className={`${Styles.sideLink} ${location.pathname === "/create-post" ? Styles.active : ""
                    }`}
                />
                {sidebarToggle && (
                  <a.span
                    style={{
                      ...springProps,
                      whiteSpace: "nowrap",
                      fontSize: "16px",
                    }}
                  >
                    Buat Posting
                  </a.span>
                )}
              </div>
            )}
            {(auth && role) && (
              <>
                <hr />
                <div
                  className={`${Styles.sideIcon} ${sidebarToggle ? Styles.expanded : ""
                    }`}
                  onClick={handleLogout}
                >
                  <BiLogOut
                    className={`${Styles.sideLink}`}
                  />
                  {sidebarToggle && (
                    <a.span
                      style={{
                        ...springProps,
                        whiteSpace: "nowrap",
                        fontSize: "16px",
                      }}
                    >
                      Keluar
                    </a.span>
                  )}
                </div>
              </>
            )}
          </div>
        </a.div>

        <Navbar className={Styles.horizontalNav}>
          <Nav className={`mr-auto ${Styles.navLinks}`}>
            <Nav.Link
              as={NavLink}
              to="/"
              onClick={() => handleSearchQuery("")}
              style={location.pathname === "/" ? { color: "#444BF2" } : {}}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/organization-list"
              style={
                location.pathname === "/organization-list"
                  ? { color: "#444BF2" }
                  : {}
              }
            >
              Organization
            </Nav.Link>
            <Nav.Link as={NavLink} className={Styles.hasSubMenu}>
              Topic
              <ul className={Styles.subMenu}>
                  <li>
                    <Nav.Link as={NavLink} to="" onClick={() => handleSearchQuery("Info Kampus")}>
                      Info Kampus
                    </Nav.Link>
                  </li>
                  <li>
                    <Nav.Link as={NavLink} to="" onClick={() => handleSearchQuery("Magang")}>
                      Magang
                    </Nav.Link>
                  </li>
                  <li>
                    <Nav.Link as={NavLink} to="" onClick={() => handleSearchQuery("Lomba")}>
                      Lomba
                    </Nav.Link>
                  </li>
                  <li>
                    <Nav.Link as={NavLink} to="" onClick={() => handleSearchQuery("Penelitian")}>
                      Penelitian
                    </Nav.Link>
                  </li>
                  <li>
                    <Nav.Link as={NavLink} to="" onClick={() => handleSearchQuery("Seminar")}>
                      Seminar
                    </Nav.Link>
                  </li>
                  <li>
                    <Nav.Link as={NavLink} to="" onClick={() => handleSearchQuery("Olahraga")}>
                      Olahraga
                    </Nav.Link>
                  </li>
                </ul>
            </Nav.Link>
          </Nav>

          <InputGroup className={Styles.inputGroup}>
            <Form.Control
              placeholder="Cari"
              aria-label="Cari"
              className={Styles.myFormControl}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearchQuery(query)}
              value={query}
            />
            <Button className={Styles.buttonForm} onClick={() => handleSearchQuery(query)}>
              <Search />
            </Button>
          </InputGroup>
        </Navbar>
      </div>
    </header>
  );
}

export default Navigation;
