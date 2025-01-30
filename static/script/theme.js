const themes = {
  dark: '/static/styling/dark.css',
  light: '/static/styling/light.css',
};

const toggleButton = document.getElementById('toggle-theme');
const themeLink = document.getElementById('theme');

function setTheme(theme) {
  themeLink.setAttribute('href', themes[theme]);
  localStorage.setItem('theme', theme);
}

const currentTheme = localStorage.getItem('theme') || 'light';
setTheme(currentTheme);

toggleButton.addEventListener('click', () => {
  const nextThemes = {
    dark: 'light',
    light: 'dark',
  };
  const currentTheme = localStorage.getItem('theme');
  const nextTheme = nextThemes[currentTheme];
  setTheme(nextTheme);
});