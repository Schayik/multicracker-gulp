const toggleButton = document.querySelector('.hamburger button');
const menu = document.querySelector('.hamburger ul');

function toggle() {
  const open = JSON.parse(toggleButton.getAttribute('aria-expanded'));
  toggleButton.setAttribute('aria-expanded', !open);
  menu.hidden = !menu.hidden;
}

toggleButton.addEventListener('click', toggle)

// toggle()