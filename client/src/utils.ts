const validateDownload = () => {
    const host = window.location.host;
    const referrer = document.referrer;
    const referrerHost = document.referrer.split('/')[2] || '';

    // make sure that other sites don't link directly to download pages
    if (referrerHost !== host) {
        window.location.replace('/');
    }
};

const openTab = (containerId: string, tabId: string) => {
    const container = document.getElementById(containerId)!!;
    const tabBar = container.getElementsByClassName('tab-bar')[0];
    const tabList = container.getElementsByClassName('tab-list')[0];

    for (let i = 0; i < tabBar.children.length; i++) {
        tabBar.children[i].classList.remove('current');
    }
    for (let i = 0; i < tabList.children.length; i++) {
        (tabList.children[i] as HTMLElement).style.display = 'none';
    }

    document.getElementById(`${tabId}-header`)!!.classList.add('current');
    document.getElementById(`${tabId}`)!!.style.display = 'block';
};

const getQueryParam = (location: Location, paramName: string, defaultValue: string): string => {
    const params = new URLSearchParams(location.search);
    return params.get(paramName) ?? defaultValue;
};
