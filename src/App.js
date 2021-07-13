import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import PieChart from './components/pieChart';
import './App.css';
function App() {
  const [currentDate, setCurrentDate] = useState(dayjs()); // Current Date Fetch from current_date.json in public/data
  const [vaccineDates, setVaccineDates] = useState([]); // List Of Vaccine Dates Fetch from vaccine_dates.json in public/data

  useEffect(() => {
    // Use fetch() to fetch requited data from public/data
    fetch('');
  }, []);

  const incrementDate = () => {
    setCurrentDate((currentDate) => currentDate.add(1, 'day'));
  };

  const decrementDate = () => {
    setCurrentDate((currentDate) => currentDate.subtract(1, 'day'));
  };

  useEffect(() => {
    console.log(currentDate);
    console.log(currentDate);
  }, [currentDate]);

  return (
    <div className="App">
      <div className="date">
        <button onClick={incrementDate}>+</button>{' '}
        {/* Set Current Date to next date on click  */}
        <div className="currentdate">{currentDate.format('DD-MMM-YYYY')}</div>
        <button onClick={decrementDate}>-</button>{' '}
        {/* Set Current Date to drevious date on click  */}
      </div>
      <div className="chart">
        {/* Update the following Component to display pie chart with proper data, alignment and colors */}
        <PieChart data={[60, 40]} />
      </div>
    </div>
  );
}

export default App;
