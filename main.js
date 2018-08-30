let token;

let getToken = () => {
    let checkToken = localStorage.getItem("token");
    if (checkToken !== null) {
        closeLogin();
        return checkToken;
    } else {
        return null;
    }
}

token = getToken();

let closeLogin = () => {
    let closeLoginWindow = document.querySelector('.close-login-modal-button');
    closeLoginWindow.addEventListener('click', () => {
        let loginModalWindow = document.querySelector('.login-modal-container');
        loginModalWindow.classList.add('hidden');
    });
}
                                      
let loginButtonStatus = () => {
    let checkToken = localStorage.getItem("token");
    let logoutButton = document.querySelector('.logout-button');
    if (checkToken === null) {
        logoutButton.textContent = 'Log In';
    }
    else if (checkToken !== null) {
        logoutButton.textContent = 'Log Out';
    }
};

loginButtonStatus();

let loginLogout = () => {
    let loginModalWindow = document.querySelector('.login-modal-container');
    if (logoutButton.textContent === 'Log Out') {
        localStorage.removeItem("token");
        logoutButton.textContent = 'Log In';
    } else if (logoutButton.textContent === 'Log In') {
        console.log('log in');
        loginModalWindow.classList.remove('hidden');
    }
};

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

let showDeleteButtons = (event) => {
    event.preventDefault();
    if (event.target.textContent === 'Edit Staples') {
        event.target.textContent = 'Done Editing';
    } else {
        event.target.textContent = 'Edit Staples';
    };
    let deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((button) => {
        button.classList.toggle('hidden');
    });
}

let deleteStaple = (event) => {
    var deleteButton = event.target;
    var parent = deleteButton.parentElement;
    parent.parentNode.removeChild(parent);
}

let displayStaple = function(input) {
    let staplesOutput = document.querySelector(".staples-output");
    let stapleItem = document.createElement('div');
    let deleteButton = document.createElement('input');
    deleteButton.setAttribute('type', 'submit');
    deleteButton.setAttribute('value', 'Remove');
    deleteButton.classList.add('delete-button');
    deleteButton.classList.add('hidden');
    deleteButton.addEventListener('click', deleteStaple);
    stapleItem.textContent = input;
    stapleItem.appendChild(deleteButton);
    stapleItem.classList.add('staple-item-output');
    staplesOutput.appendChild(stapleItem);
}

let getStapleInput = (event) => {
    event.preventDefault();
    let staplesInput = document.querySelector(".staples-input");
    displayStaple(staplesInput.value);
    staplesInput.value = "";
};

let postStaples = (staples) => {
    let parseToken = JSON.parse(token);
    let fetchPost = fetch('/staples', {
        method: 'POST',
        body: JSON.stringify(staples),
        headers: {'Content-Type': 'application/json', 
        'authorization': parseToken}
    });
}

let getConfirmedStaples = (event) => {
    event.preventDefault();
    let stapleValues = [];
    let staples = document.querySelectorAll('.staple-item-output');
    staples.forEach(staple => {
        stapleValues.push(staple.firstChild.textContent);
    });
    postStaples(stapleValues);
    return stapleValues;
}

let showSignupContainer = () => {
    let signupContainer = document.querySelector('.signup-modal-container');
    let loginContainer = document.querySelector('.login-input-container');
    signupContainer.classList.remove('hidden');
    loginContainer.classList.add('hidden');
};

let submitSignupInfo = (event) => {
    event.preventDefault();
    let userCredentials = captureUserCredentials('signup');
    postSignupInformation(userCredentials);
};

let submitLoginInfo = (event) => {
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
            loginButtonStatus();
        });
};

let backToLogin = (event) => {
    event.preventDefault();
    let signupContainer = document.querySelector('.signup-modal-container');
    let loginContainer = document.querySelector('.login-input-container');
    signupContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
};

let setupEventListeners = () => {
    let backToLoginButton = document.querySelector('.back-to-login-button');
    backToLoginButton.addEventListener('click', backToLogin);

    let submitLoginInformation = document.querySelector('.login-form');
    submitLoginInformation.addEventListener('submit', submitLoginInfo);

    let submitSignupInformation = document.querySelector('.signup-form');
    submitSignupInformation.addEventListener('submit', submitSignupInfo);

    let signupAnchor = document.querySelector('.signup-anchor');
    signupAnchor.addEventListener('click', showSignupContainer);

    let closeLoginWindow = document.querySelector('.close-login-modal-button');
    closeLoginWindow.addEventListener('click', closeLogin);

    let staplesBtn = document.querySelector(".staples-submit");
    staplesBtn.addEventListener("click", getStapleInput);

    let editStaples = document.querySelector('.edit-staples');
    editStaples.addEventListener('click', showDeleteButtons);

    let confirmStaples = document.querySelector('.confirm-staples');
    confirmStaples.addEventListener('click', getConfirmedStaples)

    let logoutButton = document.querySelector('.logout-button');
    logoutButton.addEventListener('click', loginLogout);
}

setupEventListeners();