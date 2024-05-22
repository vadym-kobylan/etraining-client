import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import StopWatch from '../components/StopWatch/StopWatch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Training = () => {
  const { training_id } = useParams();
  const [training, setTraining] = useState(null);
  const [time, setTime] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [wasTodayTrain, setWasTodayTrain] = useState();
  const { token, id } = useSelector((state) => state.user);
  const navigagateTo = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/train/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.day;

        console.log(data);
        const today = new Date().toISOString().split('T')[0];

        data.forEach((entry) => {
          if (entry.date === today) {
            setWasTodayTrain(true);
            return;
          } else {
            setWasTodayTrain(false);
          }
        });
      })
      .catch((error) => console.error('Error fetching data:', error));

    axios
      .get('http://localhost:8080/api/v1/train', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.filteredGroups;
        const dataExercise = data.find((group) => group.id == training_id);
        setTraining(dataExercise);
        setAllExercises(dataExercise.exercises.map((ex) => ex.exerciseName));
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [training_id, token]);

  const addExercise = () => {
    if (selectedExercise) {
      setExercises([
        ...exercises,
        { exName: selectedExercise, sets: [], setNum: '', setWeight: '' },
      ]);
      setAllExercises(allExercises.filter((exercise) => exercise !== selectedExercise));
      setSelectedExercise('');
    }
  };

  const handleInputChange = (e, index, field) => {
    const value = e.target.value;
    const updatedExercises = exercises.map((exercise, i) =>
      i === index
        ? {
            ...exercise,
            [field]: value,
          }
        : exercise,
    );
    setExercises(updatedExercises);
  };

  const addApproach = (index) => {
    const updatedExercises = exercises.map((exercise, i) =>
      i === index
        ? {
            ...exercise,
            sets: [...exercise.sets, { setNum: exercise.setNum, setWeight: exercise.setWeight }],
            setNum: '',
            setWeight: '',
          }
        : exercise,
    );
    setExercises(updatedExercises);
  };

  const deleteApproach = (exerciseIndex, approachIndex) => {
    const updatedExercises = exercises.map((exercise, i) =>
      i === exerciseIndex
        ? {
            ...exercise,
            sets: exercise.sets.filter((_, j) => j !== approachIndex),
          }
        : exercise,
    );
    setExercises(updatedExercises);
  };

  const deleteExercise = (exerciseIndex) => {
    const exerciseToDelete = exercises[exerciseIndex];
    const updatedExercises = exercises.filter((_, i) => i !== exerciseIndex);
    setExercises(updatedExercises);
    setAllExercises([...allExercises, exerciseToDelete.exName]);
  };

  const handleSave = () => {
    const notEmptyEx = exercises.filter((exercise) => exercise.sets.length > 0);

    if (notEmptyEx.length < 1) {
      toast.warn('Complete at least 1 approach', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else {
      const savedExercise = notEmptyEx.map((item) => {
        const { exName, sets } = item;
        return {
          exName,
          sets,
        };
      });

      const trainingData = {
        title: training.groupName,
        exercises: savedExercise,
        timeForTraining: time,
        date: new Date(),
        youtubeLink: training.youtube[0]?.exLink,
      };
      console.log('Training data saved:', trainingData);

      // You can make an API call to save the data here
      axios
        .post(`http://localhost:8080/api/v1/train/${id}/add`, trainingData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log('Training data saved:', trainingData);
          navigagateTo('/my-trainings');
        })
        .catch((error) => {
          console.error('Error saving data:', error);
        });
    }
  };

  const isApproachFilled = (setNum, setWeight) => setNum !== '' && setWeight !== '';

  return wasTodayTrain ? (
    <div className="main-container ">
      <h2>Chill, you already had training today</h2>
      <Link to="/my-trainings" className="main-button">
        My trainings
      </Link>
    </div>
  ) : (
    training && (
      <div className="main-container flex-start">
        <ToastContainer />
        <h1>{training.groupName}</h1>

        <div key={training.id} className="exercise-card onePage">
          <div className="training-card-left">
            <div className="exercise-details">
              <p>
                <strong>Muscle Group:</strong> {training.groupName}
              </p>
              <p>
                <strong>Exercises:</strong>
              </p>
              <ol>
                {training.exercises.map((exercise, index) => (
                  <li key={index}>{exercise.exerciseName}</li>
                ))}
              </ol>
              <StopWatch time={time} setTime={setTime} />
            </div>

            <div className="addExerciseWrp">
              {exercises.map((exercise, index) => (
                <div className="fullExWrp" key={index}>
                  <div className="exTitleWrp">
                    <h2>{exercise.exName}</h2>

                    <button className="deleteButton" onClick={() => deleteExercise(index)}>
                      Delete Exercise
                    </button>
                  </div>

                  {exercise.sets.length > 0 && (
                    <table>
                      <thead>
                        <tr>
                          <th>Set</th>
                          <th>Reps</th>
                          <th>Weight</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exercise.sets.map((approach, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{approach.setNum}</td>
                            <td>{approach.setWeight}</td>
                            <td>
                              <button
                                className="deleteButton"
                                onClick={() => deleteApproach(index, i)}>
                                X
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <input
                    type="number"
                    placeholder="Repetition"
                    value={exercise.setNum}
                    onChange={(e) => handleInputChange(e, index, 'setNum')}
                  />
                  <input
                    type="number"
                    placeholder="Weight"
                    value={exercise.setWeight}
                    onChange={(e) => handleInputChange(e, index, 'setWeight')}
                  />
                  <button
                    onClick={() => addApproach(index)}
                    disabled={!isApproachFilled(exercise.setNum, exercise.setWeight)}>
                    Add Set
                  </button>
                </div>
              ))}

              {allExercises.length > 0 && (
                <div className="exercise-input">
                  <select
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}>
                    <option value="">Select an exercise</option>
                    {allExercises.map((exercise, index) => (
                      <option key={index} value={exercise}>
                        {exercise}
                      </option>
                    ))}
                  </select>
                  <button onClick={addExercise}>Add Exercise</button>
                </div>
              )}

              <button onClick={handleSave}>End Training</button>
            </div>
          </div>
          <div className="training-card-right">
            <div className="video">
              <ReactPlayer url={training.youtube[0]?.exLink} width="100%" height="100%" />
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Training;
