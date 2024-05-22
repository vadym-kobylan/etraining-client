import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import '../styles/Trining.css';

const getAllMuscleGroups = (data) => {
  return data.map((item) => item.groupName);
};

const TrainingList = () => {
  const [trainings, setTrainings] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');

  const { token } = useSelector((state) => state.user);

  const muscleGroups = getAllMuscleGroups(trainings);

  const handleChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  const filteredData = selectedGroup
    ? trainings.filter((item) => item.groupName === selectedGroup)
    : trainings;

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/v1/train', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTrainings(response.data.filteredGroups);
        console.log(response.data.filteredGroups);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="main-container flex-start">
      <h1>Choose Training</h1>
      <select value={selectedGroup} onChange={handleChange}>
        <option value="">All</option>
        {muscleGroups.map((group, index) => (
          <option key={index} value={group}>
            {group}
          </option>
        ))}
      </select>
      <div className="exercise-card-wrp">
        {filteredData.map((item) => (
          <div key={item.id} className="exercise-card">
            <div className="exercise-details">
              <h2>{item.groupName}</h2>
              <p>
                <strong>Exercises:</strong>
              </p>
              <ol>
                {item.exercises.map((exercise) => (
                  <li key={exercise.id}>{exercise.exerciseName}</li>
                ))}
              </ol>
            </div>
            <div className="training-card-right">
              <div className="video">
                <ReactPlayer url={item.youtube[0].exLink} width="100%" height="100%" />
              </div>
              <Link to={`/training/${item.id}`}>Start training</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingList;
