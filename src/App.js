import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState('Session');
  const alarmRef = useRef(new Audio('alarm-sound.mp3'));
  const timerIntervalRef = useRef();

  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }

    return () => clearInterval(timerIntervalRef.current);
  }, [timerRunning]);

  useEffect(() => {
    if (timeLeft === 0) {
      playAlarm();
      toggleTimer();
      switchTimer();
    }
  }, [timeLeft]);

  const playAlarm = () => {
    const alarm = alarmRef.current;
    alarm.play();
  };

  const toggleTimer = () => {
    setTimerRunning(prevTimerRunning => !prevTimerRunning);
  };

  const switchTimer = () => {
    setTimerLabel(prevTimerLabel =>
      prevTimerLabel === 'Session' ? 'Break' : 'Session'
    );
    setTimeLeft(prevTimerLabel =>
      timerLabel === 'Session' ? breakLength * 60 : sessionLength * 60
    );
  };

  const handleBreakIncrement = () => {
    setBreakLength(prevBreakLength => Math.min(60, prevBreakLength + 1));
  };

  const handleBreakDecrement = () => {
    setBreakLength(prevBreakLength => Math.max(1, prevBreakLength - 1));
  };

  const handleSessionIncrement = () => {
    setSessionLength(prevSessionLength =>
      Math.min(60, prevSessionLength + 1)
    );
    setTimeLeft(prevSessionLength =>
      Math.min(60, sessionLength + 1) * 60
    );
  };

  const handleSessionDecrement = () => {
    setSessionLength(prevSessionLength =>
      Math.max(1, prevSessionLength - 1)
    );
    setTimeLeft(prevSessionLength =>
      Math.max(1, sessionLength - 1) * 60
    );
  };

  const resetTimer = () => {
    const alarm = alarmRef.current;
    alarm.pause();
    alarm.currentTime = 0;
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerRunning(false);
    setTimerLabel('Session');
    clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => updateTimer(), 1000);
  };
  

  const updateTimer = () => {
    if (timerRunning) {
      setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
    }
  };

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="App">
      <div className="title">25 + 5 Clock</div>
      <div className="settings">
        <div className="setting">
          <div id="break-label">Break Length</div>
          <button id="break-increment" onClick={handleBreakIncrement}>+</button>
          <div id="break-length">{breakLength}</div>
          <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
        </div>
        <div className="setting">
          <div id="session-label">Session Length</div>
          <button id="session-increment" onClick={handleSessionIncrement}>+</button>
          <div id="session-length">{sessionLength}</div>
          <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
        </div>
      </div>
      <div className="timer">
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
        <button id="start_stop" onClick={toggleTimer}>
          {timerRunning ? 'Pause' : 'Start'}
        </button>
        <button id="reset" onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

export default App;
