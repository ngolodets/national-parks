import React, {useState} from 'react';
import axios from 'axios';
import Home from './Home';

function Login({liftToken, isLoggedIn, selectedSignup, selectedLogin}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault()
    axios.post('/auth/login', {
      email: email,
      password: password
    }).then(res => {
      if (res.data.type === 'error') {
        setMessage(message)
      } else {
        localStorage.setItem('mernToken', res.data.token);
        liftToken(res.data);
      }
    }).catch(err => {
      setMessage("Maximum login attempts exceeded. Please try again later.")
    })
  }

  if (isLoggedIn && selectedLogin && !selectedSignup) {
    return (
      <>
        <Home />
      </>
    )
  } else {
    return ( 
      <div className='row' style={{display: selectedSignup ? 'none' : 'inline-block', marginLeft: '1.4em'}}> 
        <h4>Log into Your Account:</h4>
        <form className='col s12' onSubmit={handleSubmit}>
          <div className='row'>
            <div className='input-field col s7' style={{marginBottom: '0', backgroundColor: 'rgba(110, 108, 108)'}}>
              <input onChange={handleEmailChange}
                      id='email' 
                      value={email} 
                      type="email"
                      name="email"
                      className="loginsignup" />
              <label>Email</label>
            </div>
            <br />
            <div className='input-field col s7' style={{marginBottom: '0'}}>
              <input onChange={handlePasswordChange}
                    id='password'
                    value={password}
                    type="password" 
                    name="password" 
                    className="loginsignup" />
              <label>Password</label>
            </div>
          </div>
          <br />
          <button className="btn waves-effect waves-light" type="submit" name="action">
            Submit
          </button>  
        </form>
      </div>
    )
  }
  //return (
    // <>
    //   {content}
    // </>
    // <div className='login'> 
    //   <h3>Log into Your Account:</h3>
    //   <form onSubmit={handleSubmit}>
    //     <input onChange={handleEmailChange} 
    //             value={email} 
    //             type="email"
    //             name="email"
    //             placeholder="Enter your email..."
    //             className="loginsignup" /><br />
    //     <input onChange={handlePasswordChange}
    //             value={password}
    //             type="password" 
    //             name="password"
    //             placeholder="Enter your password..." 
    //             className="loginsignup" /><br />
    //     <input type="submit" value="LOG IN!" className='submit'/>
    //   </form>
    // </div>
  //);
}

export default Login;