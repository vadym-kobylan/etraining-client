import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const validateEmail = (_email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(_email);
  };

  const checkLogin = () => {
    if (email.length <= 0 || password.length <= 0 || repeatPassword.length <= 0) {
      setError('Please, enter all fields');
      return;
    } else if (!validateEmail(email)) {
      setError('Email is incorrect');
      return;
    } else if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    } else {
      setError('');
    }

    const userdata = { email, password };

    axios
      .post(`http://localhost:8080/api/v1/auth/register`, userdata)
      .then((res) => {
        console.log('reg');

        const { access_token, id, role } = res.data;

        localStorage.setItem('token', access_token);
        localStorage.setItem('role', role);
        localStorage.setItem('id', id);

        dispatch(setUser({ id, role, token: access_token }));
        navigateTo('/profile');
      })
      .catch((error) => {
        console.error(error);
        setError('User with such email exists');
      });
  };

  return (
    <div className="main-container">
      <h2 className="mb-20px">Registration</h2>

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
        <input
          type="password"
          placeholder="Repeat password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />

        <p className="formError">{error}</p>

        <button className="main-button" onClick={checkLogin}>
          Register
        </button>
      </div>
      <p>
        Already have account?{' '}
        <Link className="" to="/login">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Registration;
