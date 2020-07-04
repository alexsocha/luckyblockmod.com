function getScrollY() {
    if (typeof window.pageYOffset == 'number') {
        return window.pageYOffset;
    } else if (document.body && document.body.scrollTop) {
        return document.body.scrollTop;
    } else if (document.documentElement && document.documentElement.scrollTop) {
        return document.documentElement.scrollTop;
    }
    return 0;
}

function scroll() {
    var scrollY = getScrollY();
    if (scrollY >= 60) {
        document.getElementById('navBar').style.position = 'fixed';
        document.getElementById('navBar').style.marginTop = '-102px';
    } else {
        document.getElementById('navBar').style.position = 'static';
        document.getElementById('navBar').style.marginTop = '-42px';
    }
}
