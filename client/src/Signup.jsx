import React, {useState} from 'react';
import axios from 'axios';
import Home from './Home';

function Signup({liftToken, isLoggedIn, selectedLogin, selectedSignup}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  //const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleNameChange(e) {
    setName(e.target.value)
  }

  function handleEmailChange(e) {
    setEmail(e.target.value)
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    axios.post('/auth/signup', {
      name: name,
      email: email,
      password: password
    }).then(res => {
      if (res.data.type === 'error') {
        setName('');
        setEmail('');
        setPassword('');
        setMessage(res.data.message);
        console.log(message);
      } else {
        localStorage.setItem('mernToken', res.data.token);
        liftToken(res.data);
        //setIsLoggedIn(true);
      }
    }).catch(err => {
      setMessage("Maximum accounts exceeded. Please try again later.");
    })
  }

  if (isLoggedIn && selectedSignup && !selectedLogin) {
    return (
      <div>
        <Home />
      </div>
    )
  } else {
    return (
      <div className="row" style={{display: selectedLogin ? 'none' : 'inline-block'}}>
        <h4>Create a New Account:</h4>
        <form className='col s12' onSubmit={handleSubmit}>
          <div className='row'>
            <div className='input-field col s7' style={{marginBottom: '0'}}>
              <input onChange={handleNameChange}
                      id='first_name'
                      value={name} 
                      type="text"  
                      className="loginsignup"/>
              <label>Name</label>
            </div>
          <br />
            <div className='input-field col s7' style={{marginBottom: '0'}}>
              <input onChange={handleEmailChange}
                    id='email1'
                    value={email}
                    type="email"
                    className="loginsignup" />
              <label>Email</label>
            </div>
            <br />
            <div className='input-field col s7' style={{marginBottom: '0'}}>
              <input onChange={handlePasswordChange}
                    value={password}
                    type="password" 
                    className="loginsignup"/>
              <label>Choose Password</label>
            </div>
          </div>
          <br />
          <button className="btn waves-effect waves-light" type="submit" name="action">
            Sign Up
          </button>
        </form>
      </div>
      
    )
  }

  // return (
  //   <div className="signup">
  //     <h3>Create a New Account:</h3>
  //     <form className='signupform' onSubmit={handleSubmit}>
  //       <input onChange={handleNameChange}
  //               value={name} 
  //               type="text" 
  //               name="name"
  //               placeholder="Enter your name..." 
  //               className="loginsignup"/><br />
  //       <input onChange={handleEmailChange}
  //               value={email}
  //               type="email"
  //               name="email" 
  //               placeholder="Enter your email..."
  //               className="loginsignup" /><br />
  //       <input onChange={handlePasswordChange}
  //               value={password}
  //               type="password"
  //               name="password" 
  //               placeholder="Choose a password..." 
  //               className="loginsignup"/><br />
  //       <input type="submit" value="SIGN UP!" className='submit'/>
  //     </form>
  //   </div>
  // )

}

export default Signup;