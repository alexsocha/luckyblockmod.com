function resize() {
    var w = window.innerWidth;

    if (w < 1200) {
        document.getElementById('projectInfoSideWrapper').style.visibility = 'hidden';
        document.getElementById('projectInfoSideWrapper').style.width = '0%';
        document.getElementById('projectInfoTextWrapper').style.width = '100%';
        document.getElementById('projectInfoTextWrapperInner').style.marginRight = '-50px';
        document.getElementById('projectInfoTextWrapperInner').style.maxWidth = '100%';
        document.getElementById('projectInfoPage').style.paddingLeft = '50%';
        document.getElementById('projectInfoPage').style.marginLeft = '-425px';
    } else {
        document.getElementById('projectInfoSideWrapper').style.visibility = 'visible';
        document.getElementById('projectInfoSideWrapper').style.width = '40%';
        document.getElementById('projectInfoTextWrapper').style.width = '60%';
        document.getElementById('projectInfoTextWrapperInner').style.marginRight = '0px';
        document.getElementById('projectInfoTextWrapperInner').style.maxWidth = '800px';
        document.getElementById('projectInfoPage').style.paddingLeft = '0%';
        document.getElementById('projectInfoPage').style.marginLeft = '0px';
    }
}
