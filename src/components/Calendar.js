import React, { useState } from 'react';
import './Calendar.css';
import Button from '@mui/material/Button';

function Calendar() {
  // grab today's date stuff
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  
  // keep track of what month we're showing
  const [displayedMonth, setDisplayedMonth] = useState(todayMonth);
  const [displayedYear, setDisplayedYear] = useState(todayYear);
  const [clickedDay, setClickedDay] = useState(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDayClick = (day) => {
    setClickedDay(day);
    // temp alert for testing
    alert(`Clicked: ${day}, Today is: ${todayDay}`);
  };

  const goToPreviousMonth = () => {
    if (displayedMonth === 0) {
      setDisplayedMonth(11);
      setDisplayedYear(displayedYear - 1);
    } else {
      setDisplayedMonth(displayedMonth - 1);
    }
    setClickedDay(null);
  };

  const goToNextMonth = () => {
    if (displayedMonth === 11) {
      setDisplayedMonth(0);
      setDisplayedYear(displayedYear + 1);
    } else {
      setDisplayedMonth(displayedMonth + 1);
    }
    setClickedDay(null);
  };

  // starting point for our calendar math
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
        <div className="calendar-navigation">
          <Button onClick={goToPreviousMonth}>
            Previous Month
          </Button>
          <h2>{monthNames[displayedMonth]} {displayedYear}</h2>
          <Button onClick={goToNextMonth}>
            Next Month
          </Button>
        </div>
        <div className="debug-info">
          Today is: {todayDay} {monthNames[todayMonth]} {todayYear}
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
                      `.trim()}
                      onClick={() => day && handleDayClick(day)}
                    >
                      <div>
                        {day}
                        {isCurrentDay && ' (Today)'}
                      </div>
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

export default Calendar;
