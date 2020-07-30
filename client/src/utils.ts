const validateDownload = () => {
    const host = window.location.host;
    const referrer = document.referrer.split('//')[1];

    // make sure that other sites don't link directly to download pages
    if (!referrer.startsWith(host)) {
        window.location.replace('/');
    }
}
