const signin = document.querySelector('#sign-in-btn')
const signup = document.querySelector('#sign-up-btn')
const container = document.querySelector('.container')

signup.addEventListener('click', () => {
  container.classList.add('sign-up-mode')
})

signin.addEventListener('click', () => {
  container.classList.remove('sign-up-mode')
})
