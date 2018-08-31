let token;

let closeLogin = () => {
    let loginModalWindow = document.querySelector('.login-modal-container');
    loginModalWindow.classList.add('hidden');
}

let displayUserEmail = () => {
    let localStorageToken = localStorage.getItem("token");
    let parseToken = JSON.parse(localStorageToken);
    let userEmailContainer = document.querySelector('.navigation-user-email-container');
    let userEmail = document.createElement('p');
    userEmail.classList.add('navigation-user-email')
    let fetchGet = fetch('/retrieveemail', {
        method: 'GET',
        headers: {'authorization': parseToken}
    }).then(contents => {
        return contents.text()})
        .then(text => {
            let parsedText = JSON.parse(text);
            userEmail.textContent = parsedText;
            userEmailContainer.appendChild(userEmail);
        })
        .catch(err => console.log(err));
};

let getStaples = () => {
    let localStorageToken = localStorage.getItem("token");
    let parseToken = JSON.parse(localStorageToken);
    let fetchGet = fetch('/retrieveingredients', {
        method: 'GET',
        headers: {'authorization': parseToken}
    }).then(contents => {
        return contents.text()})
        .then(text => {
            let ingredientsArray = JSON.parse(text);
            ingredientsArray.forEach(item => {
                displayIngredient('staples', item);
            })
        });
};

let getToken = () => {
    let checkToken = localStorage.getItem("token");
    if (checkToken !== null) {
        displayUserEmail();
        closeLogin();
        getStaples();
        return checkToken;
    } else {
        return null;
    }
}

token = getToken();
                                      
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
    let logoutButton = document.querySelector('.logout-button');
    let staplesOutput = document.querySelector('.staples-output');
    let userEmailContainer = document.querySelector('.navigation-user-email-container');
    let userEmail = document.querySelector('.navigation-user-email')
    if (logoutButton.textContent === 'Log Out') {
        userEmailContainer.removeChild(userEmail);
        localStorage.removeItem("token");
        while (staplesOutput.firstChild) {
            staplesOutput.removeChild(staplesOutput.firstChild);
        }
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
    let deleteButtons;
    if (event.target.value === 'extras') {
        deleteButtons = document.querySelectorAll('.extras-delete-button');
    } else if (event.target.value === 'staples') {
        deleteButtons = document.querySelectorAll('.staples-delete-button');
    }
    deleteButtons.forEach((button) => {
        button.classList.toggle('hidden');
    });
    if (event.target.textContent === 'Edit') {
        event.target.textContent = 'Done!';
    } else if (event.target.textContent === 'Done!') {
        event.target.textContent = 'Edit';
    }
}

let deleteStaple = (event) => {
    var deleteButton = event.target;
    var parent = deleteButton.parentElement;
    parent.parentNode.removeChild(parent);
}

let displayIngredient = function(prefix, input) {
    let output = document.querySelector('.' + prefix + '-output');
    let item = document.createElement('div');
    let deleteButton = document.createElement('input');
    deleteButton.setAttribute('type', 'submit');
    deleteButton.setAttribute('value', 'Remove');
    deleteButton.classList.add(prefix +'-delete-button');
    deleteButton.classList.add('hidden');
    deleteButton.addEventListener('click', deleteStaple);
    item.textContent = input;
    item.appendChild(deleteButton);
    item.classList.add(prefix + '-item-output');
    output.appendChild(item);
}

let getStapleInput = (event) => {
    event.preventDefault();
    let staplesInput = document.querySelector('.staples-input');
    displayIngredient('staples', staplesInput.value);
    staplesInput.value = "";
};

let getExtraInput = (event) => {
    event.preventDefault();
    let extraInput = document.querySelector('.extras-input');
    displayIngredient('extras', extraInput.value);
    extraInput.value = "";
};

let postStaples = (staples) => {
    let localStorageToken = localStorage.getItem("token");
    let parseToken = JSON.parse(localStorageToken);
    let fetchPost = fetch('/staples', {
        method: 'POST',
        body: JSON.stringify(staples),
        headers: {'Content-Type': 'application/json', 
        'authorization': parseToken}
    });
}

let getConfirmedIngredients = (event) => {
    event.preventDefault();
    let stapleValues = [];
    let staples = document.querySelectorAll('.staples-item-output');
    staples.forEach(staple => {
        stapleValues.push(staple.firstChild.textContent);
    });
    postStaples(stapleValues);
    console.log(stapleValues);
    let extraValues = [];
    let extras = document.querySelectorAll('.extras-item-output');
    extras.forEach(extra => {
        extraValues.push(extra.firstChild.textContent);
    });
    console.log(extraValues);
    console.log(stapleValues.concat(extraValues));
    return stapleValues.concat(extraValues);
}

let displayRecipes = (recipes) => {
    recipes.forEach(item => {
        let recipesContainer = document.querySelector('.recipes-container');
        let recipe = document.createElement('div');
        let recipeName = document.createElement('p');
        let recipeURL = document.createElement('a');
        let recipePhoto = document.createElement('img');
        recipe.classList.add('recipe');
        recipeName.classList.add('recipe-name');
        recipePhoto.classList.add('recipe-photo');
        recipeURL.classList.add('recipe-url');
        console.log(item);
        recipeName.textContent = item[0];
        recipePhoto.setAttribute('src', item[2]);
        recipeURL.setAttribute('href', item[1]);
        recipeURL.setAttribute('target', '_blank');
        recipeURL.setAttribute('rel', 'noopener noreferrer');
        recipeURL.appendChild(recipeName);
        recipeURL.appendChild(recipePhoto);
        recipe.appendChild(recipeURL);
        recipesContainer.appendChild(recipe);
    });
};

let recipeExamples = [
    ["Apple Fritters", "https://spoonacular.com/apple-fritters-556470", "https://spoonacular.com/recipeImages/556470-556x370.jpg"], 
    ["Cinnamon Apple Crisp", "https://spoonacular.com/cinnamon-apple-crisp-47950", "https://spoonacular.com/recipeImages/47950-556x730.jpg"], 
    ["Brown Butter Apple Crumble", "https://spoonacular.com/brown-butter-apple-crumble-534573", "https://spoonacular.com/recipeImages/534573-556x370.jpg"], 
    ["Apple Tart", "https://spoonacular.com/apple-tart-47732", "https://spoonacular.com/recipeImages/47732-556x370.jpg"], 
    ["Apple Tart", "https://spoonacular.com/apple-tart-47891", "https://spoonacular.com/recipeImages/47891-556x370.jpg"]
];
displayRecipes(recipeExamples);

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
    captureUserCredentials('login');
    let credentials = captureUserCredentials('login');
    let userEmail = document.querySelector('.login-email-input');
    let userPassword = document.querySelector('.login-password-input');
    userEmail.value = '';
    userPassword.value = '';
    fetch('/tokens', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {'Content-Type': 'application/json'}
    }).then(results => {
        return results.text()})
        .then(text => {
            localStorage.setItem("token", JSON.stringify(text))
            getStaples();
            displayUserEmail(credentials.email);
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

    let confirmIngredients = document.querySelector('.confirm-ingredients');
    confirmIngredients.addEventListener('click', getConfirmedIngredients)

    let extrasBtn = document.querySelector(".extras-submit");
    extrasBtn.addEventListener("click", getExtraInput);

    let editExtras = document.querySelector('.edit-extras');
    editExtras.addEventListener('click', showDeleteButtons);

    let logoutButton = document.querySelector('.logout-button');
    logoutButton.addEventListener('click', loginLogout);
}

setupEventListeners();
