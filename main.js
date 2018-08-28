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
