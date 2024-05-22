import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Home from './pages/Home';
import ChangeUserInfo from './pages/ChangeUserInfo';
import NotFound from './pages/NotFound';
import TrainingList from './pages/TrainingList';
import Training from './pages/Training';
import Header from './components/Header/Header';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './redux/userSlice';
import MyTrainings from './pages/MyTrainings';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('id');
    dispatch(setUser({ id, role, token }));
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/profile" element={token ? <ChangeUserInfo /> : <NotFound />} />
        <Route path="/trainings-list" element={token ? <TrainingList /> : <NotFound />} />
        <Route path="/my-trainings" element={token ? <MyTrainings /> : <NotFound />} />
        <Route path="/training/:training_id" element={token ? <Training /> : <NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
