const btn = document.getElementById('submitBtn')

btn.addEventListener('click', checkingPassword)

function checkingPassword() {
  const new_password = document.getElementById('new_password')
  const confirm_password = document.getElementById('confirm_password')

  if (new_password.value.length < 7)
    return alert('Password length must be 8 characters')
  if (new_password.value !== confirm_password.value)
    return alert("Password doesn't match")

  const payLoad = {
    newPassword: new_password.value,
    confirmPassword: confirm_password.value,
    userId,
  }
  axios
    .post(`${url}/update`, payLoad)
    .then((res) => {
      if (res.data.message === 'Password updated successfully') {
        showAlert({ message: res.data.message, status: true })
      } else {
        showAlert({ message: res.data.message, status: false })
      }
    })
    .catch((err) => showAlert({ message: err, status: false }))
}

function showAlert({ message, status = false }) {
  const color = status ? 'green' : 'red'
  const alertMe = document.getElementById('alertMe')
  alertMe.innerHTML = ''
  alertMe.classList.remove('hideMe')
  alertMe.classList.add(color)
  alertMe.innerHTML = message
  setTimeout(() => {
    alertMe.innerHTML = ''
    alertMe.classList.add('hideMe')
    alertMe.classList.remove(color)
  }, 4000)
}
