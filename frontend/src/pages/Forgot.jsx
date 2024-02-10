import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgot } from '../api'

const INITIAL = {
  email: '',
}

function Register() {
  const [forgotInfo, setForgotInfo] = useState(INITIAL)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForgotInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleClick = () => {
    forgot({ email: forgotInfo.email })
      .then((res) => {
        if (res.status === 200) {
          alert(res.data.message)
          setForgotInfo(INITIAL)
        }
      })
      .catch((error) => {
        console.log('error-APP:', error)
        if (error.name === 'AxiosError') {
          console.log('Server-res:', error.response.data.message)
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
              value={forgotInfo.email}
              type="email"
              className="form-control"
              name="email"
              onChange={handleChange}
            />
          </div>

          <Link className="d-flex mb-3 flex-row-reverse" to="/">
            Do you remeber your credentials.
          </Link>
          <button
            type="button"
            onClick={handleClick}
            className="btn btn-primary mb-4"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register
