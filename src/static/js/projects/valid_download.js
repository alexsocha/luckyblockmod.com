var projectNames = [
    'lucky_block',
    'instant_massive_structures',
    'cops_and_robbers',
    'minecraft_challenges',
];

if (document.referrer != null && document.referrer.indexOf('minecraftascending.com') == -1) {
    var documentName = location.pathname;
    var projectName = '';
    for (var i = 0; i < projectNames.length; i++) {
        if (documentName.indexOf(projectNames[i]) > -1) {
            projectName = projectNames[i];
            break;
        }
    }
    window.location.replace(
        'http://www.minecraftascending.com/projects/' + projectName + '/' + projectName + '.html'
    );
}
