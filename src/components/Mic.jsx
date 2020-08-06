import React, { useState } from 'react';
import axios from 'axios'
import styles from './Mic.module.css'
import { ReactMic } from 'react-mic';
import {
   Link
} from "react-router-dom";

const Mic = () => {
   const [recording, setRecording] = useState(false)
   const [status, setStatus] = useState('Play')
   const [message, setMessage] = useState('Record Melody')

   const play_stop = () => {
      if (status === 'Play') {
         setStatus('Stop')
         setRecording(true)
      } else if (status === 'Stop') {
         setStatus('Play')
         setRecording(false)
      }
   }

   const onStop = (rec) => {
      let data = new FormData()

      let config = {
         headers: {
            'content-type': 'multipart/form-data'
         }
      }

      console.log(rec.valueOf())
      rec.blob.arrayBuffer().then((res) => {
         data.append('audio', btoa(String.fromCharCode(...new Uint8Array(res))))
      }).then(axios.post('/soundlogin', data, config).then((res) => {
         console.log(res.data.result)
         setMessage(res.data.result)
      }))


   }


   return (
      <div className={styles.sound_page}>
         <div className={styles.microphone}>
            <ReactMic
               record={recording}
               visualSetting="frequencyBars"
               className={styles.mc}
               channelCount={1}
               onStop={onStop}
               strokeColor="#000000"
               backgroundColor="#FFFFFF"
            />
            <button onClick={play_stop} className={styles.button}>{status}</button>
            <div className={styles.link}>
               <Link to='/' className={styles.ref}>Use Melodic Password</Link>
            </div>

            <h2 className={styles.confirm}>
               {message}
            </h2>
         </div>
      </div>






   )
}

export default Mic