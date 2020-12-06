import {MenuItem,FormControl,Select, Card, CardContent} from "@material-ui/core";
import React, { useEffect, useState } from 'react';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import './App.css';
import { sortData } from "./util";
import LineGraph from "./LineGraph";

function App() {
  const [country, setCountry] = useState("worldwide");
  const [countries,setCountries] = useState([]);
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  },[])
     
  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
           }));

           const sortedData =sortData(data);
            setTableData(sortedData)
            setCountries(countries)

        })
    };
      getCountriesData();
  }, []);


  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
       
      });
  };

  console.log("countryinfoooo",countryInfo);

  return (
    <div className="app">
      <div className = "app__left">
      <div className = "app__header">
      <h1>covid tracker</h1>
      <FormControl className = 'app__dropdown'>
      <Select variant = "outlined" onChange = {onCountryChange}
        value = {country}>
      <MenuItem value = "worldwide">Worldwide</MenuItem>
       

          {/*loop through all the countries andshow dropdown list of them*/}

          {
            countries.map(country => (
            <MenuItem value = {country.value}>{country.name}</MenuItem>
            ))
          }


        </Select>
      </FormControl>

      </div>
      <div className = "app__stats">
        <InfoBox title = "Coronavirus Cases" cases= {countryInfo.todayCases} total  = {countryInfo.cases}/>

        <InfoBox title = "Recovered" cases= {countryInfo.todayRecovered} total = {countryInfo.recovetred}/>

        <InfoBox title = "Deaths" cases= {countryInfo.todayDeaths} total = {countryInfo.deaths}/>
         
      </div>
     
    
          


          {/*map*/}
          <Map/>

      </div>


      <Card className = "app__right">
         <CardContent>
           <h3>live cases by country</h3>
           <Table countries = {tableData}/>
           <h3>worldwide new cases</h3>
           <LineGraph/>
           {/*graph*/}

         </CardContent>
          
         
      </Card>
     
    </div>
  );
}

export default App;
