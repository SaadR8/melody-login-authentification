import React, { useState } from 'react';
import axios from 'axios'
import styles from './Form.module.css'
import {
   Link
} from "react-router-dom";

const bcrypt = require('bcryptjs')

axios.defaults.baseURL = "http://localhost:5000";

const Form = () => {
   const [user, setUser] = useState('')
   const [passwd, setPasswd] = useState('')
   const [timing, setTiming] = useState([])
   const [delta, setDelta] = useState(0)
   const [delta2, setDelta2] = useState(0)
   //const [loggedin, setLoggedin] = useState(false)
   const [conpasswd, setConpasswd] = useState('')
   const [contiming, setContiming] = useState([])
   const [register, setRegister] = useState(false)
   const [message, setMessage] = useState('Please Login')

   const onChange = (e) => {
      if (delta === 0) {
         setDelta(Date.now())
      } else if (e.target.value === "") {
         setDelta(0)
      } else if (e.target.value.length < passwd.length) {
         setTiming(timing.slice(0, e.target.value.length - passwd.length))
         setDelta(Date.now())
      } else {
         setTiming([...timing, Math.floor((Date.now() - delta) / 200)])
         setDelta(Date.now())
      }
      setPasswd(e.target.value)
   }

   const onChange2 = (e) => {
      setUser(e.target.value)
   }

   const signin = (e) => {
      setRegister(!register)
      setTiming([])
      setContiming([])
      setTiming([])
      setDelta(0)
      setPasswd('');
      setUser('');
      setConpasswd('')
   }

   const registered = (e) => {
      setRegister(!register)
      setTiming([])
      setContiming([])
      setTiming([])
      setDelta(0)
      setPasswd('');
      setUser('');
      setConpasswd('')
   }

   const onChange3 = (e) => {
      if (delta2 === 0) {
         setDelta2(Date.now())
      } else if (e.target.value === "") {
         setDelta2(0)
      } else if (e.target.value.length < conpasswd.length) {
         setContiming(contiming.slice(0, e.target.value.length - conpasswd.length))
         setDelta2(Date.now())
      } else {
         setContiming([...contiming, Math.floor((Date.now() - delta2) / 200)])
         setDelta2(Date.now())
      }
      setConpasswd(e.target.value)
   }

   const onSubmit = (e) => {
      e.preventDefault();
      console.log(timing)

      //bcrypt.hash(passwd, 10).then(hash => {   console.log(`Hash: ${hash}`);})
      axios.get('/prelogin', { params: { user: user } }).then(res => {
         bcrypt.hash(passwd + timing.join(','), res.data.result, (err, hash) => {
            axios.post('/login', { user: user, passwd: hash, timing: timing }).then((res) => {
               console.log(res.data.result)
               setTiming([])
               setDelta(0)
               setPasswd('');
               console.log(hash)
               if (res.data.result === true) {
                  setMessage('Congratulations.')
               }
            }
            )
         })
      })
   }

   const onSubmit2 = (e) => {
      console.log(timing.join(','))
      console.log(contiming.join(','))
      if (timing.join(',') === contiming.join(',')) {
         bcrypt.hash(passwd + timing.join(','), 10).then(hash => {
            axios.post('/register', { user: user, passwd: hash, timing: 'void' }).then((res) => {
               console.log(res.data.result)
               setContiming([])
               setTiming([])
               setDelta(0)
               setDelta2(0)
               setPasswd('');
               setConpasswd('')
               setUser('');
               setMessage(res.data.result)
               setRegister(true)
            })
         })

      } else {
         setContiming([])
         setTiming([])
         setDelta(0)
         setDelta2(0)
         setPasswd('');
         setConpasswd('')
         setMessage('Timings do not match please try again')
         setRegister(true)
      }
   }

   return (
      <div className={styles.login_page}>
         <div className={styles.form}>
            {register === false && <form onSubmit={onSubmit} className={styles.login_form}>
               <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={user}
                  onChange={onChange2}
               />
               <input
                  type="text"
                  name="passwd"
                  placeholder="Password"
                  value={passwd}
                  onChange={onChange}
               />
               <button type="submit">Login</button>
               <div className={styles.link}>
                  <Link className={styles.ref} to="/audio">Use Voice Instead</Link>
               </div>
               <p className={styles.message}>Not registered? <a href="#" onClick={registered}>Create an account</a></p>
            </form>}

            {register === true && <form onSubmit={onSubmit2} className={styles.register_form}>
               <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={user}
                  onChange={onChange2}
               />
               <input
                  type="text"
                  name="passwd"
                  placeholder="Password"
                  value={passwd}
                  onChange={onChange}
               />
               <input
                  type="text"
                  name="conpasswd"
                  placeholder="Re-type Password"
                  value={conpasswd}
                  onChange={onChange3}
               />
               <button type="submit">Register</button>

               <p className={styles.message}>Already registered? <a href="#" onClick={signin}>Sign In</a></p>
            </form>}

            <h2 className={styles.confirm}>
               {message}
            </h2>

         </div>
      </div>
   );
}


export default Form