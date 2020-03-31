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
import Search from './Search';
import Footer from './Footer';
import 'materialize-css/dist/css/materialize.min.css';

import './index.css';

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedLogin, setSelectedLogin] = useState(false);
  const [selectedSignup, setSelectedSignup] = useState(false);
  
  //const [apiData, setApiData] = useState(null);

  useEffect(() => {
    var token = localStorage.getItem('mernToken');

    const M = window.M;
    
    var sidenav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenav, {});

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

  //let content;

  // if (Object.keys(user).length > 1) {
  //   content = (
  //     <>
  //       {/* <NavComponent /> */}
  //       {/* <p>Hello, {user.name}</p>
  //       <div onClick={logout}>LOGOUT</div> */}
  //       {/* <Home /> */}
  //     </>
  //   )
  // } else {
  //   content = (
  //     <>
  //       {/* <Login liftToken={setToken} />
  //       <Signup liftToken={setToken} /> */}
  //       {/* <LandingPage /> */}
  //     </>
  //   )
  // }

  return (
    <Router>
      <div className="App">
        <div className='navbar-fixed'>
          <nav>
            <div className='nav-wrapper grey darken-3'>
              <Link to={'/logout'} 
                    className='brand-logo' 
                    style={{display: isLoggedIn ? 'inline' : 'none'}}
                    onClick={logout}
              >
                Hello, {user.name}
              </Link>
              <Link to={'#'} 
                    data-target='mobile-demo' 
                    className='sidenav-trigger'>
                <i className='material-icons'>menu</i>
              </Link>
              <ul id='nav-mobile' className='right hide-on-med-and-down'>
                <li className='active'>
                  <Link to={'/search'}>
                    <i className="material-icons left">search</i>
                    Search
                  </Link>
                </li>
                <li className='active'>
                  <Link to={'/home'}>Home</Link>
                </li>
                <li className='active' 
                    style={{display: isLoggedIn ? 'none' : 'inline'}}
                >
                  <Link to={'/login'}>
                    <i className="medium material-icons">account_circle</i>
                  </Link>
                </li>
                <li className='active' 
                    onClick={logout} 
                    style={{display: isLoggedIn ? 'inline' : 'none'}}
                >
                  <Link to='/logout' 
                        className='waves-effect waves-light btn'
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        
        <ul className='sidenav' 
          id='mobile-demo'
        >
          <li className='active'>
            <Link to={'/search'}>
              <i className="material-icons left">search</i>
              Search
            </Link>
          </li>       
          <li className='active'>
            <Link to={'/home'}>Home</Link>
          </li>
          <li className='active' style={{display: isLoggedIn ? 'none' : 'inline'}}>
            <Link to={'/login'}>
              <i className="small material-icons">account_circle</i>
            </Link>
          </li>
          <li className='active' onClick={logout} style={{display: isLoggedIn ? 'inline' : 'none'}}>
            <Link to='/logout' className='waves-effect waves-light btn'>Logout</Link>
          </li>
        </ul>

        <h3 id='app-title'>National Parks App</h3>

        <Switch>
          {/* <Route path='/login' component={Login} liftToken={setToken} setIsLoggedIn={setIsLoggedIn} /> */}
          <Route path='/login' 
              render={() => 
                <>
                  <div onClick={() => setSelectedLogin(true)} >
                    <Login liftToken={setToken} isLoggedIn={isLoggedIn} selectedSignup={selectedSignup} selectedLogin={selectedLogin}/>
                  </div>
                  <div onClick={() => setSelectedSignup(true)} >
                    <Signup liftToken={setToken} isLoggedIn={isLoggedIn} selectedSignup={selectedSignup} selectedLogin={selectedLogin}/>
                  </div>
                </>
              } 
          />
          {/* <Route path='/signup' render={() => <Signup liftToken={setToken} />} /> */}
          <Route exact path='/'>
            {isLoggedIn ? <Redirect to='/home' /> : <LandingPage />}
          </Route>
          <Route path='/search' component={Search}></Route>
          <Route path='/home' component={Home} isLoggedIn={isLoggedIn}>
            {!isLoggedIn ? <Redirect to='/' /> : <Home />}
          </Route>
          <Route path='/logout'>
            {!isLoggedIn ? <Redirect to='/' /> : <Home />}
          </Route>
        </Switch>
      </div>

      <Footer />

    </Router>
  );
}
/*
<Route path='/some-path' render={props =>
  <div>
    <FirstChild />
    <SecondChild />
  </div>
} />
*/
/*
<Route exact path="/">
  {loggedIn ? <Redirect to="/dashboard" /> : <PublicHomePage />}
</Route>
*/

export default App;
