function show(elem) {
    const launchEl = document.getElementById('launch_group')
    const mainEl = document.getElementById('main')

    if (elem === 'main') {
        launchEl.setAttribute('style', 'display:none !important')
        mainEl.setAttribute('style', 'display:block !important')
    } else {
        mainEl.setAttribute('style', 'display:none !important')
        launchEl.setAttribute('style', 'display:flex !important')
    }
}

const toastBootstrap = bootstrap.Toast.getOrCreateInstance(document.getElementById('liveToast'))

console.warn = () => {}