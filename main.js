let closeLoginWindow = document.querySelector('.close-login-modal-button');
closeLoginWindow.addEventListener('click', () => {
    let loginModalWindow = document.querySelector('.login-modal-container');
    loginModalWindow.classList.add('hidden');
});

let captureUserCredentials = (prefix) => {
    let userEmail = document.querySelector('.' + prefix + '-email-input');
    let userPassword = document.querySelector('.' + prefix + '-password-input');
    console.log(userEmail.value);
    console.log(userPassword.value);
    let loginModalWindow = document.querySelector('.login-modal-container');
    loginModalWindow.classList.add('hidden');
};

let signupAnchor = document.querySelector('.signup-anchor');
signupAnchor.addEventListener('click', () => {
    let signupContainer = document.querySelector('.signup-input-container');
    let loginContainer = document.querySelector('.login-input-container');
    signupContainer.classList.remove('hidden');
    loginContainer.classList.add('hidden');
});

let submitSignupInformation = document.querySelector('.signup-form');
submitSignupInformation.addEventListener('submit', (event) => {
    event.preventDefault();
    captureUserCredentials('signup');
});

let submitLoginInformation = document.querySelector('.login-form');
submitLoginInformation.addEventListener('submit', (event) => {
    event.preventDefault();
    captureUserCredentials('login');
});