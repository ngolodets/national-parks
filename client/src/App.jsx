import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Login from './Login';
import Signup from './Signup';
import LandingPage from './LandingPage';
import ParksByState from './ParksByState';

import './index.css';

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  //const [apiData, setApiData] = useState(null);

  useEffect(() => {
    var token = localStorage.getItem('mernToken');

    if (!token || token === 'undefined') {
      localStorage.removeItem('mernToken');
      setToken('');
      setUser({});
    } else {
      axios.post('/auth/me/from/token', {token})
        .then((res) => {
          if (res.data.type === 'error') {
            localStorage.removeItem('mernToken')
            setToken('');
            setUser({});
            setErrorMessage(res.data.message);
            console.log(errorMessage);
          } else {
            localStorage.setItem('mernToken', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            setErrorMessage('');
          }
        })
    }
  }, [errorMessage, token]);

  function logout() {
    localStorage.removeItem('mernToken');
    setToken('');
    setUser({});
  }

  let content;

  if (Object.keys(user).length > 1) {
    content = (
      <>
        <p>Hello, {user.name}</p>
        <div onClick={logout}>LOGOUT</div>
        <ParksByState />
      </>
    )
  } else {
    content = (
      <>
        <p>Please sign up or login...</p>
        <Login liftToken={setToken} />
        <Signup liftToken={setToken} />
        <LandingPage />
      </>
    )
  }

  return (
    <div className="App">
      {content}
    </div>
  );
}

export default App;
