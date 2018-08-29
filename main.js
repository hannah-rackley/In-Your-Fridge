let token;

let getToken = () => {
    let checkToken = localStorage.getItem("token");
    if (checkToken !== null) {
        let loginModalWindow = document.querySelector('.login-modal-container');
        loginModalWindow.classList.add('hidden');
        return checkToken;
    } else {
        return null;
    }
}

token = getToken();


let closeLoginWindow = document.querySelector('.close-login-modal-button');
closeLoginWindow.addEventListener('click', () => {
    let loginModalWindow = document.querySelector('.login-modal-container');
    loginModalWindow.classList.add('hidden');
});

let postSignupInformation = (signupInformation) => {
    console.log(signupInformation);
    let fetchPost = fetch('/users', {
        method: 'POST',
        body: JSON.stringify(signupInformation),
        headers: {'Content-Type': 'application/json'}
    });
};

let captureUserCredentials = (prefix) => {
    let userCredentials = {};
    let userEmail = document.querySelector('.' + prefix + '-email-input');
    let userPassword = document.querySelector('.' + prefix + '-password-input');
    userCredentials.email = userEmail.value;
    userCredentials.password = userPassword.value;
    console.log(userCredentials);
    let loginModalWindow = document.querySelector('.login-modal-container');
    loginModalWindow.classList.add('hidden');
    return userCredentials;
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
    let userCredentials = captureUserCredentials('signup');
    postSignupInformation(userCredentials);
});

let submitLoginInformation = document.querySelector('.login-form');
submitLoginInformation.addEventListener('submit', (event) => {
    event.preventDefault();
    let credentials = captureUserCredentials('login');
    fetch('/tokens', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {'Content-Type': 'application/json'}
    }).then(results => {
        return results.text()})
        .then(text => {
            localStorage.setItem("token", JSON.stringify(text))
        });
});