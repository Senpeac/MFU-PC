document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const message = document.getElementById('login-message');
      message.textContent = '';
      try {
        const result = await loginUser({ email, password });
        setCurrentUser(result.user, result.token);
        window.location.href = '/';
      } catch (error) {
        message.textContent = error.message;
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const address = document.getElementById('register-address').value;
      const message = document.getElementById('register-message');
      message.textContent = '';
      try {
        const result = await registerUser({ name, email, password, address });
        setCurrentUser(result.user, result.token);
        window.location.href = '/';
      } catch (error) {
        message.textContent = error.message;
      }
    });
  }
});
