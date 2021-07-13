import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import PieChart from './components/pieChart';
import './App.css';
import Table from './components/table';
import { Grid, Typography } from '@material-ui/core';

function App() {
  const [currentDate, setCurrentDate] = useState(dayjs()); // Current Date Fetch from current_date.json in public/data
  const [vaccineDates, setVaccineDates] = useState([]); // List Of Vaccine Dates Fetch from vaccine_dates.json in public/data
  const [err, setErr] = useState('');
  const [totalPeople, setTotalPeople] = useState(0);
  const [vaccinatedPeople, setVaccinatedPeople] = useState(0);
  const [data, setData] = useState([]);

  const columns = [
    {
      header: 'Name',
      id: 'person_name',
      isSortable: true,
    },
    {
      header: 'Vacination Status',
      cell: ({ vaccination_date }) =>
        vaccination_date <= currentDate.format('YYYY-MM-DD') ? (
          <Typography style={{ color: 'green' }}>vaccinated</Typography>
        ) : (
          <Typography color="error">Not Vaccinated</Typography>
        ),
    },
  ];

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
          setData(data);
        })
        .catch((error) => setErr(error.message));
    };
    getVaccinationDatesArr();
    // Use fetch() to fetch requited data from public/data
  }, []);

  useEffect(() => {
    setVaccinatedPeople(
      vaccineDates.filter(
        (vaccinationDate) => vaccinationDate <= currentDate.format('YYYY-MM-DD')
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
    <Grid
      className="App"
      container
      justify="center"
      alignItems="center"
      direction="column"
      spacing={4}
    >
      <Grid item className="date" xs="2">
        <button onClick={incrementDate}>+</button>{' '}
        {/* Set Current Date to next date on click  */}
        <div className="currentdate">{currentDate.format('DD-MMM-YYYY')}</div>
        <button onClick={decrementDate}>-</button>{' '}
        {/* Set Current Date to drevious date on click  */}
      </Grid>
      <Grid
        item
        xs="2"
      >{`${vaccinatedPeople} out of ${totalPeople} have been vaccinated`}</Grid>
      <Grid item container xs="8" spacing={4}>
        <Grid item className="chart" xs="6">
          {/* Update the following Component to display pie chart with proper data, alignment and colors */}
          <PieChart data={[vaccinatedPeople, totalPeople - vaccinatedPeople]} />
        </Grid>
        <Grid item xs="6" className="tableWrapper">
          <Table columns={columns} rows={data} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
