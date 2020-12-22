import {MenuItem,FormControl,Select, Card, CardContent} from "@material-ui/core";
import React, { useEffect, useState } from 'react';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import './App.css';
import { sortData,prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";


function App() {
  const [country, setCountry] = useState("worldwide");
  const [countries,setCountries] = useState([]);
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  let [mapCenter, setMapCenter] = useState([34.80746,-40.4796 ]);
  const [mapZoom , setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

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
            setTableData(sortedData);
            setMapCountries(data);
            setCountries(countries);

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
        if(countryCode==="worldwide"){
          setMapCenter([34.80746,-40.4796 ])
          setMapZoom(1)
        }
        else{
          setMapCenter([data.countryInfo.lat,data.countryInfo['long']]);
          setMapZoom(4);
        }
        
       
      });
  };

  console.log("countryinfoooo",countryInfo);

  return (
    <div className="app">
      <div className = "app__left">
      <div className = "app__header">
      <h1>COVID TRACKER</h1>
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
        <InfoBox
        isRed
        active= {casesType==="cases"}
        onClick={(e) => setCasesType("cases")}
         title = "Coronavirus Cases" 
         cases= {prettyPrintStat(countryInfo.todayCases)} 
         total  = {prettyPrintStat(countryInfo.cases)}
         />

        <InfoBox
         active= {casesType==="recovered"}
        onClick={(e) => setCasesType("recovered")}
         title = "Recovered" 
         cases= {prettyPrintStat(countryInfo.todayRecovered)} 
         total = {prettyPrintStat(countryInfo.recovered)}
         />

        <InfoBox 
        isRed
         active= {casesType==="deaths"}
        onClick={(e) => setCasesType("deaths")}
        title = "Deaths" 
        cases= {prettyPrintStat(countryInfo.deaths)}
         total = {prettyPrintStat(countryInfo.deaths)}
         />
         
      </div>
     


          {/*map*/}
          <Map 
          casesType={casesType}
          countries = {mapCountries}
          center= {mapCenter}
          zoom = {mapZoom}
          />

      </div>


      <Card className = "app__right">
         <CardContent>
           <h3>live cases by country</h3>
           <Table countries = {tableData}/>
           <h3>worldwide new {casesType}</h3>
           <LineGraph casesType={casesType}/>
           {/*graph*/}

         </CardContent>
          
         
      </Card>
     
    </div>
  );
}

export default App;
