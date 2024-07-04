// 'system', 'light' или 'dark' или 'system', если 'null'
const getTheme = () => localStorage.getItem('theme') ?? 'system'

let prefersDark = matchMedia('(prefers-color-scheme: dark)')

prefersDark.addEventListener('change', () => {
    if (getTheme() === 'system') applyTheme('system')
})

function setTheme(theme) {
    // Установить тему в localStorage
    localStorage.setItem('theme', theme)

    // Применить тему
    applyTheme(theme)
}

function applyTheme(theme) {
    if (theme === 'system')
        theme = prefersDark.matches ? 'dark' : 'light'

    document.documentElement.className = theme
    document.querySelector('html').setAttribute('data-bs-theme', theme)
}

setTheme(getTheme())