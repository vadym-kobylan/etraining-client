import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import '../styles/Trining.css';
import Timer from '../components/StopWatch/Timer';

const MyTrainings = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [training, setTraining] = useState(null);
  const [trainingData, setTrainingData] = useState(null);
  const { token, id } = useSelector((state) => state.user);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toLocaleDateString('en-CA'); // Format date as 'YYYY-MM-DD'
    const trainingForDate = trainingData.find((t) => t.date === formattedDate);
    setTraining(trainingForDate || null);
  };

  useEffect(() => {
    if (trainingData) {
      handleDateClick(new Date());
    }
  }, [trainingData]);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = date.toLocaleDateString('en-CA');
      if (trainingData.some((training) => training.date === formattedDate)) {
        return <div className="highlight"></div>;
      }
    }
    return null;
  };

  const groupSetsByExercise = (sets) => {
    return sets.reduce((acc, set) => {
      const exerciseName = set.exercise.exerciseName;
      if (!acc[exerciseName]) {
        acc[exerciseName] = [];
      }
      acc[exerciseName].push(set);
      return acc;
    }, {});
  };

  function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = milliseconds % 1000;
    return `${minutes}:${seconds}:${ms}`;
  }

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/train/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.day;

        setTrainingData(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [token]);

  return (
    trainingData && (
      <div className="main-container flex-start flex-row">
        {selectedDate && (
          <div>
            <h2>Training for {selectedDate.toDateString()}</h2>
            {training ? (
              <div >
                <h2 className="underlined">{training.title}</h2>
                <h3 className='my-trainings-title'>Training time:</h3>
                <Timer time={training.timeForTraining} className='jcc'/>
                {Object.entries(groupSetsByExercise(training.sets)).map(([exerciseName, sets]) => (
                  <div key={exerciseName} className="center">
                    <h4>{exerciseName}</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Set</th>
                          <th>Reps</th>
                          <th>Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sets.map((set, i) => (
                          <tr key={set.id}>
                            <td>{i + 1}</td>
                            <td>{set.setNum}</td>
                            <td>{set.setWeight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <p>No training scheduled for this day.</p>
            )}
          </div>
        )}
        <Calendar onClickDay={handleDateClick} tileContent={tileContent} value={selectedDate} />
      </div>
    )
  );
};

export default MyTrainings;
