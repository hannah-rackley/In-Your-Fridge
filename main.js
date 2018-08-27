let closeLoginWindow = document.querySelector('.close-login-modal-button');
closeLoginWindow.addEventListener('click', () => {
    let loginModalWindow = document.querySelector('.login-modal-container');
    loginModalWindow.classList.add('hidden');
});
