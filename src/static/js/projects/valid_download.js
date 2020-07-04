var projectNames = ['luckyblock'];

if (document.referrer != null && document.referrer.indexOf('minecraftascending.com') == -1) {
    var documentName = location.pathname;
    var projectName = '';
    for (var i = 0; i < projectNames.length; i++) {
        if (documentName.indexOf(projectNames[i]) > -1) {
            projectName = projectNames[i];
            break;
        }
    }
    window.location.replace('/' + projectName + '/');
}
