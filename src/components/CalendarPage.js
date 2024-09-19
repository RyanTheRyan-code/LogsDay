import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
import './Calendar.css';
import { isSameDay } from 'date-fns';
import NavBar from '../NavBar';

function CalendarPage() {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/home');
  };

  return (
    
    <div className="Calendar">
      <NavBar />
      <header className="App-header">
        <h1>Calendar Page</h1>
        <div>
          <h2>Today's Date: {date.toDateString()}</h2>
          <Calendar
            onChange={handleDateChange}
            value={date}
            tileClassName={({ date }) => {
              console.log(date.toDateString());
              return isSameDay(date, new Date()) ? 'highlighted' : null;
            }}
            />
        </div>
      </header>
    </div>
  );
}

export default CalendarPage;
