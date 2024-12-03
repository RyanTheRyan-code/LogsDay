import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/SwipeLeftAlt';
import ArrowForwardIosIcon from '@mui/icons-material/SwipeRightAlt';
import { format } from 'date-fns';

function CalendarPage() {
  const navigate = useNavigate();
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  
  const [displayedMonth, setDisplayedMonth] = useState(todayMonth);
  const [displayedYear, setDisplayedYear] = useState(todayYear);
  const [clickedDay, setClickedDay] = useState(null);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Log', 'Thu', 'Fri', 'Sat'];

  const handleDayClick = (day) => {
    if (day) {
      setClickedDay(day);
      const date = new Date(displayedYear, displayedMonth, day);
      const formattedDate = date.toISOString().split('T')[0];
      navigate(`/?date=${formattedDate}`);
    }
  };

  const handlePrevMonth = () => {
    const newMonth = (displayedMonth === 0) ? 11 : displayedMonth - 1;
    const newYear = (displayedMonth === 0) ? displayedYear - 1 : displayedYear;
    setDisplayedMonth(newMonth);
    setDisplayedYear(newYear);
    setClickedDay(null);
  };

  const handleNextMonth = () => {
    const newMonth = (displayedMonth === 11) ? 0 : displayedMonth + 1;
    const newYear = (displayedMonth === 11) ? displayedYear + 1 : displayedYear;
    setDisplayedMonth(newMonth);
    setDisplayedYear(newYear);
    setClickedDay(null);
  };

  const septemberFirst2024 = new Date(2024, 8, 1);
  const referenceDay = septemberFirst2024.getDay();

  const calculateFirstDayOfMonth = (year, month) => {
    const referenceDate = new Date(2024, 8, 1);
    const targetDate = new Date(year, month, 1);
    
    const diffTime = targetDate.getTime() - referenceDate.getTime();
    const diffDays = Math.floor(diffTime / (86400000));
    
    const firstDay = (referenceDay + diffDays) % 8;
    
    return (firstDay + 8) % 8;
  };

  const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();
  const firstDayOfMonth = calculateFirstDayOfMonth(displayedYear, displayedMonth);
  
  const daysArray = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push('');
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  const weeksArray = [];
  while (daysArray.length > 0) {
    weeksArray.push(daysArray.splice(0, weekDays.length));
  }

  if (weeksArray.length > 0) {
    const lastWeek = weeksArray[weeksArray.length - 1];
    while (lastWeek.length < weekDays.length) {
      lastWeek.push('');
    }
  }

  while (weeksArray.length < 5) {
    weeksArray.push(Array(weekDays.length).fill(''));
  }

  return (
    <div className="calendar">
      <div className="wood"></div>
      <div className="calendar-content">
        <h1>Calendar</h1>
        <div className="calendar-navigation">
          <button 
            onClick={handlePrevMonth} 
            className="nav-button"
          >
            <ArrowBackIosIcon />
          </button>
          <h2>{monthNames[displayedMonth]} {displayedYear}</h2>
          <button 
            onClick={handleNextMonth} 
            className="nav-button"
          >
            <ArrowForwardIosIcon />
          </button>
        </div>
        <table>
          <thead>
            <tr>
              {weekDays.map((day, index) => (
                <th key={index}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeksArray.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const isCurrentDay = day === todayDay && 
                                     displayedMonth === todayMonth && 
                                     displayedYear === todayYear;
                  
                  return (
                    <td 
                      key={dayIndex} 
                      className={`
                        ${day ? '' : 'other-month'}
                        ${isCurrentDay ? 'today' : ''}
                        ${day === clickedDay ? 'clicked-day' : ''}
                      `.trim()}
                      onClick={() => day && handleDayClick(day)}
                    >
                      <div>{day}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CalendarPage;
