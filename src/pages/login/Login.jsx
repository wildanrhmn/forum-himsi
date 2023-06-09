import React, { useEffect } from "react";
import { useState } from "react";
import { Form, FloatingLabel, Button, Image } from "react-bootstrap";
import Styles from "../../styles/Login.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AsyncLogin } from "../../state/auth/middleware";
import { useNavigate, Link } from 'react-router-dom';

import eye from '../../assets/images/view_light.png';


const Login = () => {
  const [email, setUsername] = useState("");
  // const [error, setError] = useState(false);
  const { auth } = useSelector(states => states);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(AsyncLogin({ email, password }));
  };

  useEffect(() => {
    if (auth.token) {
      /* eslint-disable */
      navigate('/')
    }
  }, [auth])
  return (
    <section className={Styles.loginWrapper}>
      <div className="container">
        <div className={Styles.loginForm}>
          <p
            className="mb-4 text-center"
            style={{ fontSize: "26px", fontWeight: "bold", color: '#444BF2' }}
          >
            Log In
          </p>
          <Form onSubmit={handleLogin}>
            <FloatingLabel
              controlId="floatingInput"
              label="Email"
              className="mb-3"
              style={{ fontSize: "15px", fontWeight: "600" }}
            >
              <Form.Control
                type="email"
                placeholder="Email"
                style={{ height: "50px", fontSize: "14px" }}
                className={Styles.loginFormControl}
                value={email}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingPassword"
              label="Password"
              style={{ fontSize: "15px", fontWeight: "600", position: "relative" }}
            >
              <Form.Control
                type={  showPassword ? "text" : "password"}
                placeholder="Password"
                style={{ height: "50px", fontSize: "14px" }}
                className={Styles.loginFormControl}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
          <Image src={eye} className={Styles.eye} alt="eye" onClick={() => setShowPassword(!showPassword)} />
            </FloatingLabel>
            <Form.Group
              className={`${Styles.checkbox} ms-1 mb-4 mt-3`}
              controlId="rememberMeCheck"
            >
              <Form.Check
                type="checkbox"
                label="Remember me"
                className={`${Styles.checkbox}`}
              />
            </Form.Group>
            <div className={`${Styles.buttonWrapper} d-flex flex-column gap-3`}>
              <Button
                className={`${Styles.btnInLogin} ${Styles.btnLogin}`}
                type="submit"
              >
                Log in
              </Button>
              <Button
                className={`${Styles.btnInLogin} ${Styles.btnDaftar}`}
                type="button"
              >
                <Link to={`/register`} className="text-decoration-none" style={{color: '#1e1e1e'}}>Sign Up</Link>
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Login;
