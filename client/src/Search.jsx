import dotenv from 'dotenv';
import React, {useState} from 'react';
import axios from 'axios';
import Spinner from './Spinner';

dotenv.config();

const headers = {
  'X-Api-Key': process.env.REACT_APP_API_KEY,
  'Accept': 'application/json',
}

function Search() {
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [message, setMessage] = useState('');

  function handleChange(e) {
    let phrase = e.target.value;
    let phraseArr = phrase.trim().split(' ');
    //console.log(phraseArr);
    if (phraseArr.length > 1) {
      setMessage('Please enter a valid search parameter');
    }
    setSearchPhrase(phrase.trim());
  }

  function handleSubmit(e, input) {
    e.preventDefault();
    setLoading(true);
    setParks([]);
    input = searchPhrase;
    input = input.toLowerCase();
    let url = `https://api.nps.gov/api/v1/parks?q=${input}%20&api_key=${process.env.REACT_APP_API_KEY}`;

    axios.get(url, headers)
      .then((response) => {
        let info = response.data;
        //console.log(info);
        setParks(info.data);
        setLoading(false);
        setSearchPhrase('');
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      })
  }

  let searchMessage;
  if (message) {
    searchMessage = (
      <div>
        {message};
      </div>
    )
  } else {
    searchMessage = (
      <p></p>
    )
  }

  let content;
  if (parks.length > 0) {
    let allParks = Array.from(parks);
    content = allParks.map((park, index) => {
      let images = park.images;
      return (
        <div className="col 14 m4 s12" id='landing-page-card' key={index}>
          <div className="card hoverable">
            <div className="card-image">
              <img className='materialboxed activator responsive-img medium' 
                    src={images.length ? images[0].url : '../bear.png'} 
                    alt={park.fullName} 
                    style={{height: '175px', width: '100%'}}
              />
            </div>
            <div className="card-content grey" style={{height: '125px'}}>
              <span className="card-title activator">{park.fullName}<i className="material-icons right">more_vert</i></span>
            </div>
            <div className="card-reveal teal lighten-1">
              <span className='card-title' style={{weight: 'bolder', color: 'white'}}>About Park<i className='material-icons right'>close</i></span>
              <p>{park.description}</p>
            </div>
            <div className="card-action grey lighten-2" id='park-link-div'>
              <a href={park.url} target="_blank" rel="noopener noreferrer" id='park-link-text'>Click to Visit Park Homepage</a>
            </div>
          </div>
        </div>
      )
    })
  } else if (loading) {
    content = (
      <div style={{textAlign: 'center'}}>
        <Spinner/>
      </div>
    )
  }
  
  return (
    <>
      <div className='container'>
        <div className="row text-center">
          <form className="col 14 m12 s12" onSubmit={handleSubmit}>
            <div className="row">
              <div className="input-field col 14 m12 s12">
                <input id="input_text" 
                      type="text" 
                      onChange={handleChange}
                      value={searchPhrase}
                >
                </input>
                <label>Search Parks</label>
                <button className="btn waves-effect waves-light" type="submit" name="action">
                  Submit
                </button>
              </div>
            </div>
          </form>
          {searchMessage}  
        </div>
      </div>

      <div className='container'>
        <div className="row text-center">
          {content}
        </div>
      </div>
    </>
  )
}

export default Search;