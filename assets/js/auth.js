/**
 * Tutorly — Auth page behaviour
 * Auth-only extras; the shared theme / RTL toggles come from main.js.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Show / hide password
  document.querySelectorAll('[data-toggle-password]').forEach(toggle => {
    const input = document.getElementById(toggle.dataset.togglePassword);
    if (!input) return;

    toggle.addEventListener('click', () => {
      const revealed = input.type === 'text';
      input.type = revealed ? 'password' : 'text';
      toggle.innerHTML = revealed
        ? '<i class="ph ph-eye"></i>'
        : '<i class="ph ph-eye-slash"></i>';
      toggle.setAttribute('aria-label', revealed ? 'Show password' : 'Hide password');
      toggle.setAttribute('aria-pressed', String(!revealed));
      input.focus();
    });
  });

  // Confirm password must match before the form will submit
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirm-password');

  if (password && confirm) {
    const checkMatch = () => {
      confirm.setCustomValidity(
        confirm.value && confirm.value !== password.value ? 'Passwords do not match.' : ''
      );
    };
    password.addEventListener('input', checkMatch);
    confirm.addEventListener('input', checkMatch);
  }
});
