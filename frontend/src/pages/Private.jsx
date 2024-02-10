import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { privates } from '../api'

function Private() {
  const [privateInfo, setPrivateInfo] = useState('NOPE')
  const navigate = useNavigate()
  useEffect(() => {
    function getCookie(name) {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
    }

    const myCookieValue = getCookie('token')
    if (!myCookieValue) navigate('/')
  }, [])

  useEffect(() => {
    function getCookie(name) {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
    }

    const myCookieValue = getCookie('token')

    privates({ token: myCookieValue })
      .then((res) => {
        console.log('res:', res)
        if (res.status === 200) {
          setPrivateInfo(res.data)
        }
      })
      .catch((error) => {
        console.log('error-APP:', error)
      })
  }, [])
  return <div>{privateInfo}</div>
}

export default Private
