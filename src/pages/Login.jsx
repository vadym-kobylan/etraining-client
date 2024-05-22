import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const checkLogin = () => {
    if (email.length <= 0 || password.length <= 0) {
      setError('Please, enter all fields');
      return;
    }
    const userdata = { email, password };

    axios
      .post(`http://localhost:8080/api/v1/auth/login`, userdata)
      .then((res) => {
        console.log(res.data);
        const { access_token, id, role } = res.data;

        localStorage.setItem('token', access_token);
        localStorage.setItem('role', role);
        localStorage.setItem('id', id);

        console.log(access_token);

        dispatch(setUser({ id, role, token: access_token }));

        navigateTo(`/profile`);
      })
      .catch((error) => {
        console.error(error);
        setError('Email or password are incorrect');
      });
  };

  return (
    <div className="main-container">
      <h2 className="mb-20px">Log In</h2>
      <div className="loginForm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="formError">{error}</p>

        <button className="main-button" onClick={checkLogin}>
          Log In
        </button>
      </div>
      <p>
        Not a member?{' '}
        <Link className="" to="/registration">
          Register now
        </Link>
      </p>
    </div>
  );
};

export default Login;
