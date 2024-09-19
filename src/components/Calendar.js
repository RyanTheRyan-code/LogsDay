import React, { useState } from 'react';
import './Calendar.css';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/SwipeLeftAlt';
import ArrowForwardIosIcon from '@mui/icons-material/SwipeRightAlt';

import Button from '@mui/material/Button';

function Calendar() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Log', 'Thu', 'Fri', 'Sat'];

  const [clickedDay, setClickedDay] = useState(null);
  const [displayedMonth, setDisplayedMonth] = useState(currentMonth);
  const [displayedYear, setDisplayedYear] = useState(currentYear);

  const handleDayClick = (day) => {
    setClickedDay(day);
  };

  const goToPreviousMonth = () => {
    const newMonth = (displayedMonth === 0) ? 11 : displayedMonth - 1;
    const newYear = (displayedMonth === 0) ? displayedYear - 1 : displayedYear;
    setDisplayedMonth(newMonth);
    setDisplayedYear(newYear);
    setClickedDay(null);
  };

  const goToNextMonth = () => {
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
        <div className="calendar-navigation">
          <IconButton
            onClick={goToPreviousMonth}
            className="icon-button"
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={goToNextMonth}
            className="icon-button"
          > 
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
        <div className="calendar-header">
          <div className="button-container">
            <h2>{monthNames[displayedMonth]} {displayedYear}</h2>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              {weekDays.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeksArray.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const isCurrentDay = new Date(displayedYear, displayedMonth, day).toDateString() === currentDate.toDateString();
                  const isClickedDay = clickedDay === day;
                  let classNames = '';
                  if (isCurrentDay) classNames += ' current-day';
                  if (isClickedDay) classNames += ' clicked-day';
                  return (
                    <td
                    key={dayIndex}
                    className={classNames.trim()}
                    onClick={() => handleDayClick(day)}
                    >
                      {day}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}

export default Calendar;
