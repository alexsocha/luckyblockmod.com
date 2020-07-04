var projectIDs = [
    'lucky_block',
    'instant_massive_structures',
    'cops_and_robbers',
    'minecraft_challenges',
];
var projectImageIDs = ['lucky_block', 'imstructures', 'copsnrobbers', 'mc_challenges'];
var projectTitles = [
    'Lucky Block',
    'Instant Massive Structures',
    "Cops n' Robbers",
    'The Minecraft Challenges',
];
var projectDescriptions = [
    'A block that will decide your fortune.<br>Anything is possible with the Lucky Block.',
    'Blocks that will instantly create structures. Building has never been easier.',
    'Escape a high security prison while the guard watches, or be the guard yourself.',
    'Compete in fun minecraft challenges and view your scores on a global leaderboard.',
];
var projectURLs = [
    'Lucky Block',
    'http://www.planetminecraft.com/mod/11-instant-massive-structures-mod-v10/',
    'http://www.planetminecraft.com/project/cops-and-robbers/',
    'http://www.planetminecraft.com/mod/18-the-minecraft-challenges---minecraft-challenges-with-online-leaderbaord/',
];

var whiteBoxLeft =
    '<div class="projectBoxWrapper"><div class="projectBoxWhite"><div class="projectBoxContent"><div class="projectBoxTextLeft"><div class="projectBoxTitleLeft"><a href="PROJECT_URL"><p class="smallSubTitleFont">PROJECT_TITLE</p></a></div><div class="projectBoxHRLeft"> </div><div class="projectBoxInfoLeft"><p class="pageText">PROJECT_DESCRIPTION</p></div></div><div class="projectBoxIconRight"> <img src="../../../../images/projects/PROJECT_IMAGE/PROJECT_IMAGE_download.png"></img> </div></div></div><div class="projectBoxTrans"> <img src="../../../../images/projects/downloads/download_projects_trans_gray.png"></img> </div></div>';

var grayBoxRight =
    '<div class="projectBoxWrapper"><div class="projectBoxGray"><div class="projectBoxContent"><div class="projectBoxTextRight"><div class="projectBoxTitleRight"><a href="PROJECT_URL"><p class="smallSubTitleFont">PROJECT_TITLE</p></a></div><div class="projectBoxHRRight"> </div><div class="projectBoxInfoRight"><p class="pageText">PROJECT_DESCRIPTION</p></div></div><div class="projectBoxIconLeft"> <img src="../../../../images/projects/PROJECT_IMAGE/PROJECT_IMAGE_download.png"></img> </div></div></div><div class="projectBoxTrans"> <img src="../../../../images/projects/downloads/download_projects_trans_white.png"></img> </div></div>';

var documentName = location.pathname;
var curProjectID = '';
for (var i = 0; i < projectIDs.length; i++) {
    if (documentName.indexOf(projectIDs[i]) > -1) {
        curProjectID = projectIDs[i];
        break;
    }
}

var curInnerHTML = '';
var newProjectIDs = projectIDs.slice();

var projectCount = 0;
for (var i = 0; i < projectIDs.length; i++) {
    var projectID = newProjectIDs[Math.floor(Math.random() * newProjectIDs.length)];
    var projectIndex = projectIDs.indexOf(projectID);

    var boxString = '';
    switch (projectCount % 2) {
        case 0:
            boxString = whiteBoxLeft;
            break;
        case 1:
            boxString = grayBoxRight;
            break;
    }
    if (projectCount == projectIDs.length - 2) {
        boxString = boxString
            .replace(
                '<div class="projectBoxTrans"> <img src="../../../../images/projects/downloads/download_projects_trans_white.png"></img> </div>',
                ''
            )
            .replace(
                '<div class="projectBoxTrans"> <img src="../../../../images/projects/downloads/download_projects_trans_gray.png"></img> </div>',
                ''
            );
    }

    if (projectID != curProjectID) {
        curInnerHTML += boxString
            .replace(new RegExp('PROJECT_ID', 'g'), projectIDs[projectIndex])
            .replace(new RegExp('PROJECT_IMAGE', 'g'), projectImageIDs[projectIndex])
            .replace(new RegExp('PROJECT_TITLE', 'g'), projectTitles[projectIndex])
            .replace(new RegExp('PROJECT_DESCRIPTION', 'g'), projectDescriptions[projectIndex])
            .replace(new RegExp('PROJECT_URL', 'g'), projectURLs[projectIndex]);
        projectCount++;
    }

    newProjectIDs.splice(newProjectIDs.indexOf(projectID), 1);
}

document.getElementById('projectList').innerHTML = curInnerHTML;
