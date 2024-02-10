import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api'

const INITIAL = {
  email: '',
  password: '',
}

function Login() {
  const [loginInfo, setLoginInfo] = useState(INITIAL)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleClick = () => {
    login({ email: loginInfo.email, password: loginInfo.password })
      .then((res) => {
        if (res.status === 200) {
          const now = new Date()
          const time = now.getTime()
          const expireTime = time +30 * 60 * 1000
          now.setTime(expireTime)
          document.cookie = `token=${
            res.data.message
          };expires=${now.toUTCString()};path=/`
          setLoginInfo(INITIAL)
          navigate('/private')
        }
      })
      .catch((error) => {
        console.log('error-APP:', error)
        if (error.name === 'AxiosError') {
          console.log('Server-res:', error.response.data.message)
          alert(error.response.data.message)
        } else {
          console.log('error-APP:', error.message)
        }
      })
  }
  return (
    <div className="row mt-5 px-4">
      <div className="col-md-5 mx-auto card">
        <div>
          <h4 className="mt-3 text-center">Login</h4>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              value={loginInfo.email}
              type="email"
              className="form-control"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              value={loginInfo.password}
              type="password"
              className="form-control"
              name="password"
              onChange={handleChange}
            />
          </div>

          <Link className="d-flex mb-3 flex-row-reverse" to="/forgot">
            Forgot Password?
          </Link>
          <button
            type="button"
            onClick={handleClick}
            className="btn btn-primary mb-4"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
