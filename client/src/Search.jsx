import React, {useState} from 'react';

function Search() {
  const [parks, setParks] = useState([]);


  
  return (
    <div className='container'>
      <div className="row text-center">
        <form className="col 14 m12 s12">
          <div className="row">
            <div className="input-field col 14 m12 s12">
              <textarea id="textarea1" className="materialize-textarea"></textarea>
              <label>Search Parks</label>
              <button className="btn waves-effect waves-light" type="submit" name="action">
                Submit
              </button>
            </div>
            {/* <button className="btn waves-effect waves-light" type="submit" name="action">
              Submit
            </button> */}
          </div>
        </form>
    </div>
  </div>
  )

}

export default Search;