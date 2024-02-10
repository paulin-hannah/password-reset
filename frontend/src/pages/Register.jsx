import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api'

const INITIAL = {
  email: '',
  password: '',
}

function Register() {
  const [registerInfo, setRegisterInfo] = useState(INITIAL)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setRegisterInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleClick = () => {
    register({ email: registerInfo.email, password: registerInfo.password })
      .then((res) => {
        if (res.status === 200) {
          alert(res.data.message)
          setRegisterInfo(INITIAL)
          navigate('/')
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
          <h4 className="mt-3 text-center">Register</h4>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              value={registerInfo.email}
              type="email"
              className="form-control"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              value={registerInfo.password}
              type="password"
              className="form-control"
              name="password"
              onChange={handleChange}
            />
          </div>

          <Link className="d-flex mb-3 flex-row-reverse" to="/">
            if you have account? Try login.
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

export default Register
