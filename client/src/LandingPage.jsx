import dotenv from 'dotenv';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Loader from './Loader';


dotenv.config();

const headers = {
  'X-Api-Key': process.env.REACT_APP_API_KEY,
  'Accept': 'application/json',
}

console.log('Process.env: ', process.env);
console.log('API KEY: ', process.env.REACT_APP_API_KEY);

function LandingPage() {
  const [parks, setParks] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    let url = `https://developer.nps.gov/api/v1/parks?parkCode=&limit=5&api_key=${process.env.REACT_APP_API_KEY}`;
    console.log(headers);
    console.log(url);
    
    axios.get(url, headers)
      .then(response => {
        let allParks = response.data;
        console.log(allParks.data);
        setParks(allParks.data);
        setLoad(true);
      })
      .catch(err => {
        console.log(err);
        setLoad(true);
      })
  }, []);

  let content;

  if (load) {
    let allParks = Array.from(parks);
    //console.log(parks.data);
    //console.log(allParks);
    
    content = allParks.map((park, index) => {
      let images = park.images;
      let pic = images.map((image, indx) => {
        return (
          <div key={indx}>
            <img src={image.url}/>
          </div>
        )
      })
      return (
        <div key={index}>
          <p>{park.name}</p>
          <p>{park.states}</p>
          {pic}
        </div>
      )
    })
  } else {
    content = (
      <div>
        <p>Loading data...</p>
        <Loader />
      </div>
    ) 
  }

  return (
    <>
      {content}
    </>
  )

}

export default LandingPage;

