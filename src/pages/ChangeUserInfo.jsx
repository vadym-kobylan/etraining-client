import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ChangeUserInfo = () => {
  const { token, id } = useSelector((state) => state.user);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [kcal, setKcal] = useState('');

  const onSave = () => {
    if (
      weight.length == '' ||
      height.length == '' ||
      age.length == '' ||
      gender.length == '' ||
      lastname.length == '' ||
      firstname.length == ''
    ) {
      setError('Please, enter all fields');
      return;
    } else if (age < 10 || age > 100) {
      setError('Please, enter correct age');
      return;
    } else {
      setError('');
    }

    setKcal(
      Math.round(
        gender === 'male'
          ? 66 + 13.7 * weight + 5 * height - 6.8 * age
          : 655 + 9.6 * weight + 1.8 * height - 4.7 * age,
      ),
    );

    const data = {
      firstname,
      lastname,
      age,
      weight,
      height,
      sex: gender,
    };

    console.log(data);

    axios
      .patch(`http://localhost:8080/api/v1/profile/${id}/edit`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log('edited');
      })
      .catch((error) => {
        console.error(error);
        setError('Email or password are incorrect');
      });
  };

  const setAllData = (data) => {
    if (data.firstname && data.lastname && data.sex && data.age && data.weight && data.height) {
      setFirstname(data.firstname);
      setLastname(data.lastname);
      setGender(data.sex);
      setAge(data.age);
      setWeight(data.weight);
      setHeight(data.height);

      setKcal(
        Math.round(
          gender === 'male'
            ? 66 + 13.7 * data.weight + 5 * data.height - 6.8 * data.age
            : 655 + 9.6 * data.weight + 1.8 * data.height - 4.7 * data.age,
        ),
      );
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAllData(response.data.details);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [id]);

  return (
    <div className="main-container">
      <h2 className="mb-20px">Please, enter your parameters</h2>
      <div className="loginForm textCenter">
        <div className="fullnameWrp">
          <div className="enterUserInfo">
            <p>First Name:</p>
            <input type="plain" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
          </div>

          <div className="enterUserInfo">
            <p>Last Name:</p>
            <input type="plain" value={lastname} onChange={(e) => setLastname(e.target.value)} />
          </div>
        </div>

        <div className="enterUserInfo">
          <p>Age (10-100):</p>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>

        <div className="enterUserInfo">
          <p>Weight (kg):</p>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>

        <div className="enterUserInfo">
          <p>Height (cm):</p>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>

        <div className="enterUserInfo">
          <input
            type="radio"
            checked={gender === 'MALE'}
            onChange={(e) => setGender(e.target.value)}
            value="MALE"
            name="gender"
          />{' '}
          Male
          <input
            type="radio"
            checked={gender === 'FEMALE'}
            onChange={(e) => setGender(e.target.value)}
            value="FEMALE"
            name="gender"
          />{' '}
          Female
        </div>

        <p className="formError">{error}</p>

        <p className="ccal">{kcal && 'Kilocalories: ' + kcal}</p>

        <div className="btn-wrapper vertical">
          <button className="main-button" onClick={onSave}>
            Save information
          </button>
          <Link className="main-button" to="/">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChangeUserInfo;
