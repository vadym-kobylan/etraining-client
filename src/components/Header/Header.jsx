import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/userSlice';

const Header = () => {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <header>
      <div className="header_left">
        {token && (
          <div className="btn-wrapper">
            <Link to="/profile">Profile</Link>
            <Link to="/trainings-list">Trainings List</Link>
            <Link to="/my-trainings">My trainings</Link>
          </div>
        )}
      </div>

      <div className="header_right">
        <div className="btn-wrapper">
          {!token ? (
            <>
              <Link className="" to="/login">
                Log In
              </Link>
              <Link className="" to="/registration">
                Register
              </Link>
            </>
          ) : (
            <Link className="logout" to="/" onClick={() => dispatch(logoutUser())}>
              Log Out
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
