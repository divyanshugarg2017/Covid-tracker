import {MenuItem,FormControl,Select, Card, CardContent} from "@material-ui/core";
import React, { useEffect, useState } from 'react';
import InfoBox from "./InfoBox";
import Map from "./Map";
import './App.css';

function App() {
  const [countries,setCountries] = useState([]);
  const [country,setCountry] = useState('worldwide')
     
  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
           }));
            setCountries(countries)

        })
    };
      getCountriesData();
  }, []);


  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);
  };

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
        <InfoBox title = "Coronavirus Cases" cases= {1234} total  = {2000}/>

        <InfoBox title = "Recovered" cases= {3553} total = {3000}/>

        <InfoBox title = "Deaths" cases= {637} total = {4000}/>
         
      </div>
     
    
          


          {/*map*/}
          <Map/>

      </div>


      <Card className = "app__right">
         <CardContent>
           <h3>live cases by country</h3>
           {/*table*/}
           <h3>worldwide new cases</h3>
           {/*graph*/}

         </CardContent>
          
         
      </Card>
     
    </div>
  );
}

export default App;
