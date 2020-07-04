function download() {
    document.getElementById('projectDownloadButton').style.visibility = 'hidden';
    document.getElementById('projectDownloadButton').style.height = '0px';
    document.getElementById('projectDownloadLoading').style.visibility = 'visible';

    window.setInterval(function () {
        downloadTimer();
    }, 1000);
}

var secondsTimer = 4;

function downloadTimer() {
    if (secondsTimer >= 0) {
        //document.getElementById("projectDownloadLoadingText").innerHTML = "<p class=\"pageTextSmall\">Download in " + secondsTimer + " seconds</p>";

        secondsTimer -= 1;
        if (secondsTimer < 0) {
            document.getElementById('projectDownloadButton').style.visibility = 'visible';
            document.getElementById('projectDownloadButton').style.height = '40px';
            var element = document.getElementById('projectDownloadLoading');
            element.parentNode.removeChild(element);
        }
    }
}
