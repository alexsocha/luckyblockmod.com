const validateDownload = () => {
    const host = window.location.host;
    const referrer = document.referrer;
    const referrerHost = document.referrer.split('/')[2] || '';
    console.log(referrerHost);

    // make sure that other sites don't link directly to download pages
    if (referrerHost !== host) {
        window.location.replace('/');
    }
};
