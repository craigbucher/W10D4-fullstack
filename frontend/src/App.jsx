import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import axios from 'axios'
// import {whoAmI} from 'utils'  <=== if using separate file


// Outside of 'App' component because it really has nothing to do with react; it' just parsing strings
const getCSRFToken = () => {
  let csrfToken

  // the browser's cookies for this page are all in one string, separated by semi-colons
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    // individual cookies have their key and value separated by an equal sign
    const crumbs = cookie.split('=')
    if (crumbs[0].trim() === 'csrftoken') {
      csrfToken = crumbs[1]
    }
  }
  return csrfToken
}
console.log('token? ', getCSRFToken())
// by setting as default, any axios request will have CSRF token included as a header
// axios code for this is at docs.djangoproject.com/en/4.0/ref/csrf/
axios.defaults.headers.common['X-CSRFToken'] = getCSRFToken()

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null)  // <== user login state; inital = null, because no one logged in


  const submitSignupForm = function (event) {
    // this isn't actually necessary, since this isn't in a form. but if it WAS a form, we'd need to prevent default.
    event.preventDefault()
    axios.post('/signup', { email: 'jeff@amazon.com', password: 'dragons' }).then((response) => {
      console.log('response from server: ', response)
    })
  }

  const submitLoginForm = function (event) {
    // this isn't actually necessary, since this isn't in a form. but if it WAS a form, we'd need to prevent default.
    event.preventDefault()
    axios.post('/login', { email: 'jeff@amazon.com', password: 'dragons' }).then((response) => {
      console.log('response from server: ', response)
      window.location.reload()  // forces hard reload - don't get django token unless logged-in when page loads
    })
  }

  const logOut = function (event) {
    // this isn't actually necessary, since this isn't in a form. but if it WAS a form, we'd need to prevent default.
    event.preventDefault()
    axios.post('/logout').then((response) => {
      console.log('response from server: ', response)
      whoAmI()
    })
  }

  const whoAmI = async () => {    // in real project, should go in separate file (say, 'utils.js')
    const response = await axios.get('/whoami')
    // Below is primitive error checking - 'response.data' and 'response.data[0] must exist
    // otherwise just returns 'undefined'; If both exist, returns 'response.data[0].fields'
    const user = response.data && response.data[0] && response.data[0].fields
    console.log('user from whoami? ', user, response)
    setUser(user)
  }

  useEffect(() => {  // on page load, runs 'whoAmI', which sets 'user' 
    whoAmI()
  }, [])

  return (
    <div className="App">
      <div>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Welcome to our Restaurant!!</h1>
      {/* Prior to user login, 'user' is null; after login, will display user email */}
      {user && <p>Welcome, {user.email}</p>}
      <button onClick={submitSignupForm}>Sign up</button>
      <button onClick={submitLoginForm}>Log in</button>
      <button onClick={logOut}>Log out</button>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
