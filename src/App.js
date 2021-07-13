import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import PieChart from './components/pieChart';
import './App.css';
function App() {
  const [currentDate, setCurrentDate] = useState(dayjs('2021-04-28')); // Current Date Fetch from current_date.json in public/data
  const [vaccineDates, setVaccineDates] = useState([]); // List Of Vaccine Dates Fetch from vaccine_dates.json in public/data
  const [err, setErr] = useState('');
  const [totalPeople, setTotalPeople] = useState(0);
  const [currentPeople, setCurrentPeople] = useState(0);

  useEffect(() => {
    const getVaccinationDatesArr = () => {
      fetch('/data/vaccine_dates.json')
        .then((response) => response.json())
        .then((data) => {
          const vaccinationDates = data.map(
            ({ vaccination_date }) => vaccination_date
          );
          setTotalPeople(data.length);
          setVaccineDates(vaccinationDates);
        })
        .catch((error) => setErr(error.message));
    };
    getVaccinationDatesArr();
    // Use fetch() to fetch requited data from public/data
  }, []);

  useEffect(() => {
    setCurrentPeople(
      vaccineDates.filter(
        (vaccinationDate) =>
          vaccinationDate === currentDate.format('YYYY-MM-DD')
      ).length
    );
  }, [currentDate, vaccineDates]);

  const incrementDate = () => {
    setCurrentDate((currentDate) => currentDate.add(1, 'day'));
  };

  const decrementDate = () => {
    setCurrentDate((currentDate) => currentDate.subtract(1, 'day'));
  };

  return (
    <div className="App">
      <div className="date">
        <button onClick={incrementDate}>+</button>{' '}
        {/* Set Current Date to next date on click  */}
        <div className="currentdate">{currentDate.format('DD-MMM-YYYY')}</div>
        <button onClick={decrementDate}>-</button>{' '}
        {/* Set Current Date to drevious date on click  */}
      </div>
      <div>{`${currentPeople} out of ${totalPeople} have been vaccinated`}</div>
      <div className="chart">
        {/* Update the following Component to display pie chart with proper data, alignment and colors */}
        <PieChart data={[60, 40]} />
      </div>
    </div>
  );
}

export default App;
