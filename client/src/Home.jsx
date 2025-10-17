import dotenv from 'dotenv';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
//import Loader from './Loader';
import Spinner from './Spinner';
import { getWithCache, API_HEADERS } from './utils/apiClient';

dotenv.config();

function Home({isLoggedIn}) {
  const [allParks, setAllParks] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    let url = `https://developer.nps.gov/api/v1/parks?stateCode=ca&api_key=${process.env.REACT_APP_API_KEY}`;
    
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const loadData = async () => {
      try {
        const response = await getWithCache(url, {
          cancelToken: source.token,
          headers: { ...API_HEADERS },
        });

        let parks = response.data;
        console.log(parks.data);
        setAllParks(parks.data);
        setLoad(true);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request Cancelled:', err.message);
        } else {
          console.log('Something went wrong ', err.message);
        }
      }
    };

    loadData();
    return () => {
      source.cancel();
    }
  }, [isLoggedIn]);

  let content;

  if (load) {
    let parks = Array.from(allParks);

    content = parks.map((park, index) => {
      return (
        <div key={index}>
          <p>{park.name}</p>
        </div>
      )
    })
  } else {
    content = (
      <div style={{textAlign: 'center'}}>
        {/* <p>Loading data...</p> */}
        {/* <Loader /> */}
        <Spinner />
      </div>
    )
  }

  return (
    <>
    {content}
    </>
  )

}

export default Home;
