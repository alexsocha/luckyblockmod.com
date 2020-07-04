function get_browser_info() {
    var ua = navigator.userAgent,
        tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE ', version: tem[1] || '' };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem != null) {
            return { name: 'Opera', version: tem[1] };
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
    }
    return {
        name: M[0],
        version: M[1],
    };
}

function browserSupport() {
    //var browser = get_browser_info();
    //if (browser.name == "Firefox" && browser.version >= 37) enableColorBoxes();
    //if (browser.name == "Chrome" && browser.version >= 41) enableColorBoxes();
    //if (browser.name == "Opera" && browser.version >= 29) enableColorBoxes();
}

function enableColorBoxes() {
    document.getElementById('colorBox1').style.visibility = 'visible';
    document.getElementById('colorBox2').style.visibility = 'visible';
    document.getElementById('colorBox3').style.visibility = 'visible';
    document.getElementById('colorBox4').style.visibility = 'visible';
    document.getElementById('colorBox5').style.visibility = 'visible';
    document.getElementById('colorBox6').style.visibility = 'visible';
    document.getElementById('colorBox7').style.visibility = 'visible';
    document.getElementById('colorBox8').style.visibility = 'visible';
}
