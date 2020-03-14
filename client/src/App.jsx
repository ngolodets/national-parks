import React, {useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Signup from './Signup';
import LandingPage from './LandingPage';
import Home from './Home';
//import NavComponent from './NavComponent';
//import 'materialize-css/dist/css/materialize.min.css';

import './index.css';

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const [apiData, setApiData] = useState(null);

  useEffect(() => {
    var token = localStorage.getItem('mernToken');

    if (!token || token === 'undefined') {
      localStorage.removeItem('mernToken');
      setToken('');
      setUser({});
      setIsLoggedIn(false);
    } else {
      axios.post('/auth/me/from/token', {token})
        .then((res) => {
          if (res.data.type === 'error') {
            localStorage.removeItem('mernToken')
            setToken('');
            setUser({});
            setIsLoggedIn(false);
            setErrorMessage(res.data.message);
            console.log(errorMessage);
          } else {
            localStorage.setItem('mernToken', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            setIsLoggedIn(true);
            setErrorMessage('');
          }
        })
    }
  }, [errorMessage, token, isLoggedIn]);

  function logout() {
    localStorage.removeItem('mernToken');
    setToken('');
    setUser({});
    setIsLoggedIn(false);
  }

  let content;

  if (Object.keys(user).length > 1) {
    content = (
      <>
        {/* <NavComponent /> */}
        {/* <p>Hello, {user.name}</p>
        <div onClick={logout}>LOGOUT</div> */}
        {/* <Home /> */}
      </>
    )
  } else {
    content = (
      <>
        {/* <Login liftToken={setToken} />
        <Signup liftToken={setToken} /> */}
        {/* <LandingPage /> */}
      </>
    )
  }

  return (
    <Router>
      <div className="App">
        <h1>National Parks App</h1>
        <nav className='navbar navbar-expand-lg navbar-light bg-dark'>
          <ul className='navbar-nav mr-auto'>
            <li className='nav-link'>
              <p>Hello, {user.name}</p>
            </li>
            <li>
              <Link to={'/home'} className='nav-link'>Home</Link>
            </li>
            <li>
              <Link to={'/login'} className='nav-link'>Login</Link>
            </li>
            <li>
              <Link to={'/signup'} className='nav-link'>Signup</Link>
            </li>
            <li onClick={logout}>
              <Link to='/logout' className='nav-link'>
                Logout
              </Link>
              {/* <a href='#' style={{textDecoration: 'none', color: 'gray'}}>
                Logout
              </a> */}
            </li>
          </ul>
        </nav>

        <hr />

        <Switch>
          {/* <Route path='/login' component={Login} liftToken={setToken} setIsLoggedIn={setIsLoggedIn} /> */}
          <Route path='/login' render={() => <Login liftToken={setToken} />} />
          <Route path='/signup' render={() => <Signup liftToken={setToken} />} />
          <Route exact path='/'>
            {isLoggedIn ? <Redirect to='/home' /> : <LandingPage />}
          </Route>
          <Route path='/home' component={Home} isLoggedIn={isLoggedIn}>
            {!isLoggedIn ? <Redirect to='/' /> : <Home />}
          </Route>
          <Route path='/logout'>
            {!isLoggedIn ? <Redirect to='/' /> : <Home />}
          </Route>
        </Switch>
        {content}
      </div>
    </Router>
  );
}

/*
<Route exact path="/">
  {loggedIn ? <Redirect to="/dashboard" /> : <PublicHomePage />}
</Route>
*/

export default App;
