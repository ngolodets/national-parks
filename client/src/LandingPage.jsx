import dotenv from 'dotenv';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Loader from './Loader';


dotenv.config();

const headers = {
  'X-Api-Key': process.env.REACT_APP_API_KEY,
  'Accept': 'application/json',
}

function LandingPage() {
  const [parks, setParks] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    let url = `https://developer.nps.gov/api/v1/parks?parkCode=&limit=5&api_key=${process.env.REACT_APP_API_KEY}`;

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const loadData = () => {
      try {
        axios.get(url, {cancelToken: source.token}, headers)
          .then(response => {
            let allParks = response.data;
            console.log(allParks.data);
            setParks(allParks.data);
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
    let allParks = Array.from(parks);
    
    content = allParks.map((park, index) => {
      let images = park.images;
      
      // let pic = images.map((image, indx) => {
      //   return (
      //     <div key={indx}>
      //       <img src={image.url} alt={image.alt}/>
      //     </div>
      //   )
      // })
      return (
        <div key={index}>
          <p>{park.name}</p>
          <p>{park.states}</p>
          <img className='landingPagePics' src={images[0].url} alt={images.url}/>
          {/* {pic} */}
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

