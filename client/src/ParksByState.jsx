import dotenv from 'dotenv';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Loader from './Loader';

dotenv.config();

const headers = {
  'X-Api-Key': process.env.REACT_APP_API_KEY,
  'Accept': 'application/json',
}

function ParksByState() {
  const[allParks, setAllParks] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    let url = `https://developer.nps.gov/api/v1/parks?stateCode=ca&api_key=${process.env.REACT_APP_API_KEY}`;
    
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const loadData = () => {
      try {
        axios.get(url, {cancelToken: source.token}, headers)
          .then(response => {
            let parks = response.data;
            console.log(parks.data);
            setAllParks(parks.data);
            setLoad(true);
          });
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Cancelled', err);
        } else {
          throw err;
        }
      }
    };

    loadData();
    return () => {
      source.cancel();
    }
  }, []);

  let content;

  if (load) {
    let parks = Array.from(allParks);

    content = parks.map((park, index) => {
      return (
        <div>
          <p>{park.name}</p>
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

export default ParksByState;