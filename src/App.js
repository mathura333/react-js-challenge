import { useState, useEffect } from "react";
import PieChart from "./components/pieChart";
import "./App.css";
function App() {
  const [currentDate, setCurrentDate] = useState(new Date("2021-05-29")); // Current Date Fetch from current_date.json in public/data
  const [vaccineDates, setVaccineDates] = useState([]); // List Of Vaccine Dates Fetch from vaccine_dates.json in public/data
  useEffect(() => {
    // Use fetch() to fetch requited data from public/data
    fetch("");
  }, []);
  return (
    <div className="App">
      <div className="date">
        <button>+</button> {/* Set Current Date to next date on click  */}
        <div className="currentdate">{currentDate.toDateString()}</div>
        <button>-</button> {/* Set Current Date to drevious date on click  */}
      </div>
      <div className="chart">
        {/* Update the following Component to display pie chart with proper data, alignment and colors */}
        <PieChart data={[60, 40]} />
      </div>
    </div>
  );
}

export default App;
