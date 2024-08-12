import { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  const [alarmTime, setAlarmTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const audioRef = useRef(null); // Use a ref to manage the audio element

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); 
  }, []);

  useEffect(() => {
    if (!alarmTime) return;

    const alarmDate = new Date();
    const [alarmHours, alarmMinutes] = alarmTime.split(':').map(Number);
    alarmDate.setHours(alarmHours, alarmMinutes, 0);

    const checkAlarm = () => {
      if (currentTime.getHours() === alarmDate.getHours() &&
        currentTime.getMinutes() === alarmDate.getMinutes()) {
        ringAlarm();
        setAlarmTime(null); 
      }
    };

    const alarmIntervalId = setInterval(checkAlarm, 1000);
    return () => clearInterval(alarmIntervalId); 
  }, [currentTime, alarmTime]);

  const ringAlarm = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error('Audio playback error:', err));
    }
  };

  const handleTimeChange = (event) => {
    setAlarmTime(event.target.value);
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; 
    }
  };

  return (
    <div className="card">
    <h1 className="time-display">{currentTime.toLocaleTimeString()}</h1>
    <input 
      type="time" 
      onChange={handleTimeChange} 
      className="time-input" 
    />
    <h3 className="alarm-info">Alarm Set for - {alarmTime}</h3>
    <button 
      onClick={stopAlarm} 
      className="stop-button"
    >
      Stop Alarm
    </button>
    <audio ref={audioRef} src='/alarm.mp3'></audio>
  </div>
  );
}
