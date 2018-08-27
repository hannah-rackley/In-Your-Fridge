var closeLoginWindow = document.querySelector('[class="close-login-modal-button"]');
closeLoginWindow.addEventListener('click', () => {
    var loginModalWindow = document.querySelector('[class="login-modal-container"]');
    loginModalWindow.classList.add('hidden');
});