import dotenv from 'dotenv';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Spinner from './Spinner';


dotenv.config();

const headers = {
  'X-Api-Key': process.env.REACT_APP_API_KEY,
  'Accept': 'application/json',
}

//response.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");

function LandingPage() {
  const [parks, setParks] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    let url = `https://developer.nps.gov/api/v1/parks?parkCode=&limit=9&api_key=${process.env.REACT_APP_API_KEY}`;

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const loadData = () => {
      axios.get(url, {cancelToken: source.token}, headers)
        .then((response) => {
          console.log(response.headers);
          let allParks = response.data;
          console.log(allParks.data);
          setParks(allParks.data);
          setLoad(true);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log('Request Cancelled ', err.message);
          } else {
            console.log('Something went wrong ', err.message);
          }
      })
    };

    loadData();
    return () => {
      source.cancel(); 
    }
  }, []);

  let content;

  if (load) {
    let allParks = Array.from(parks);
    
    content = allParks.map((park, index) => {
      let images = park.images;
      
      return (
          <div className="col 14 m4 s12" id='landing-page-card' key={index}>
            <div className="card hoverable" key={index}>
              <div className="card-image">
                <img className='materialboxed activator responsive-img medium' src={images[0].url} alt={images.url} style={{height: '175px', width: '100%'}}/>
              </div>
              <div className="card-content" style={{height: '110px'}}>
                <span className="card-title activator">{park.name}<i className="material-icons right">more_vert</i></span>
              </div>
              <div className="card-reveal teal lighten-1">
                <span className='card-title' style={{weight: 'bold', color: 'white'}}>About Park:<i className='material-icons right'>close</i></span>
                <p>{park.description}</p>
              </div>
              <div className="card-action" id='park-link-div'>
                <a href={park.url} target="_blank" rel="noopener noreferrer" id='park-link-text'>Click to Visit Park Homepage</a>
              </div>
            </div>
          </div>
      )
    })
  } else {
    content = (
      <div>
        <p>Loading data...</p>
        <Spinner />
      </div>
    ) 
  }

  return (
    <>
      <div className='container'>
        <div className="row text-center">
          {content}
        </div>
      </div>
    </>
  )

}

export default LandingPage;

