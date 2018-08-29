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

let staplesBtn = document
  .querySelector(".staples-submit")
  .addEventListener("click", function(e) {
    e.preventDefault();
    let staplesInput = document.querySelector(".staples_input");
    displayStaple(staplesInput.value);
  });


let displayStaple = function(input) {
    let staplesOutput = document.querySelector(".staples_output");
    let stapleItem = document.createElement('div')
    stapleItem.classList.add('.staple-item-output');
    staplesOutput.appendChild(stapleItem);
}

let signupAnchor = document.querySelector('.signup-anchor');
signupAnchor.addEventListener('click', () => {
    let signupContainer = document.querySelector('.signup-modal-container');
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
    captureUserCredentials('login');
});

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


let backToLoginButton = document.querySelector('.back-to-login-button');
backToLoginButton.addEventListener('click', (event) => {
    event.preventDefault();
    let signupContainer = document.querySelector('.signup-modal-container');
    let loginContainer = document.querySelector('.login-input-container');
    signupContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});

