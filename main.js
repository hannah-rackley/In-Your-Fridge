let closeLoginWindow = document.querySelector('.close-login-modal-button');
closeLoginWindow.addEventListener('click', () => {
    let loginModalWindow = document.querySelector('.login-modal-container');
    loginModalWindow.classList.add('hidden');
});

let submitLoginInformation = document.querySelector('.login-form');
submitLoginInformation.addEventListener('submit', (event) => {
    event.preventDefault();
    let userEmail = document.querySelector('.email-input');
    let userPassword = document.querySelector('.password-input');
    console.log(userEmail.value);
    console.log(userPassword.value);
    let loginModalWindow = document.querySelector('.login-modal-container');
    loginModalWindow.classList.add('hidden');
});