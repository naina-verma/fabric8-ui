/**
 * POC test for automated UI tests for openshift.io
 *  
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 * 
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly. 
 * 
 * @author ldimaggi, nverma
 */

var until = protractor.ExpectedConditions;

var OpenShiftIoStartPage = require('../page-objects/openshift-io-start.page'),
    OpenShiftIoRHDLoginPage = require('../page-objects/openshift-io-RHD-login.page'),
    OpenShiftIoGithubLoginPage = require('../page-objects/openshift-io-github-login.page'),
    OpenShiftIoDashboardPage = require('../page-objects/openshift-io-dashboard.page'),
    OpenShiftIoSpaceHomePage = require('../page-objects/openshift-io-spacehome.page'),
    OpenShiftIoRegistrationPage = require('../page-objects/openshift-io-registration.page'),
    testSupport = require('../testSupport'),
    constants = require("../constants");

describe('openshift.io End-to-End POC test - Scenario - New user registers', function () {
  var page, items, browserMode;
  var EMAIL_ADDRESS = "badaddress@bad.com";
  var VOUCHER_CODE = "bad voucher code";

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    // Failed: Error while waiting for Protractor to sync with the page: "window.getAllAngularTestabilities is not a function"
    // http://stackoverflow.com/questions/38050626/angular-2-with-protractorjs-failed-error-while-waiting-for-protractor-to-sync-w 
    browser.ignoreSynchronization = true;
    page = new OpenShiftIoStartPage();  
  });

  /* Simple test for registered user */
  it('should enable a registered user to login', function() {
    
    /* Step 1 - on start page, login via github */
    console.log ('EE POC test - Navigate to RHD login page');
    OpenShiftIoRHDLoginPage = page.clickLoginButton();

    console.log ('EE POC test - Navigate to github login page');
    OpenShiftIoGithubLoginPage = OpenShiftIoRHDLoginPage.clickGithubLoginButton();
    //OpenShiftIoGithubLoginPage = page.clickLoginButton();  Added April 19, not needed as of April 24
    
    /* Step 2 - on github login page, login */
    OpenShiftIoGithubLoginPage.clickGithubLoginField();
    OpenShiftIoGithubLoginPage.typeGithubLoginField(browser.params.login.user); 

    OpenShiftIoGithubLoginPage.clickGithubPassword();
    OpenShiftIoGithubLoginPage.typeGithubPassword(browser.params.login.password);   

    OpenShiftIoDashboardPage = OpenShiftIoGithubLoginPage.clickGithubLoginButton();

    // ******************************************************************************************
    // April 24 - Workaround to bug:  https://github.com/fabric8io/fabric8-ui/issues/994
    //browser.get("https://prod-preview.openshift.io/");
    browser.get("https://prod-preview.openshift.io/");
    element(by.id("name")).isPresent().then(function(result) {
      if ( result ) {       
        browser.wait(until.elementToBeClickable(element(by.id("name")), constants.LONG_WAIT, 'Failed to find name/login name workaround')); 
        element(by.id("name")).click();    
        browser.wait(until.elementToBeClickable(element(by.xpath(".//*[@id='profilelink']/span")), constants.LONG_WAIT, 'Failed to find name/login profile workaround')); 
        element(by.xpath(".//*[@id='profilelink']/span")).click();
      } else {
        console.log ("ERROR - April 24 workaround has failed");
      }
    });
    // April 24 - Workaround to bug:  https://github.com/fabric8io/fabric8-ui/issues/994
    // ******************************************************************************************

    console.log ('EE POC test - Navigate to openshift.io home/dashboard page');

    /* Step 3 - on home page - create new space - embed time in space name to ensure unique space name */
    console.log ('EE POC test - Create a new space');
    OpenShiftIoDashboardPage.clickHeaderDropDownToggle();
    OpenShiftIoDashboardPage.clickCreateSpaceUnderLeftNavigationBar();  

    var spaceTime = returnTime();
    OpenShiftIoDashboardPage.typeNewSpaceName((spaceTime));
    OpenShiftIoDashboardPage.typeDevProcess("Scenario Driven Planning");
    OpenShiftIoDashboardPage.clickCreateSpaceButton();   

    /* For the purposes of this test - ignore all 'toast' popup warnings */
    OpenShiftIoDashboardPage.waitForToastToClose();
    OpenShiftIoSpaceHomePage = OpenShiftIoDashboardPage.clickNoThanksButton();

      /* Step 4 - Create a new project */
    console.log ('EE POC test - Navigate to space home page/dashboard for space: ' + spaceTime);

    /* Step - in the space home page, verify URL and end the test */
    browser.wait(until.urlContains('https://prod-preview.openshift.io/almusertest1/'+ spaceTime), constants.WAIT);
    browser.wait(until.urlIs('https://prod-preview.openshift.io/almusertest1/'+ spaceTime), constants.WAIT); 
    expect(browser.getCurrentUrl()).toEqual('https://prod-preview.openshift.io/almusertest1/'+ spaceTime);

    browser.getCurrentUrl().then(function (text) { 
       console.log ('EE POC test - new space URL = ' + text);
    });

    /* Add a project to the space */
    console.log ('EE POC test - add new project to space');
//    OpenShiftIoSpaceHomePage.clickPipelinesWidgetAddToSpaceButton();   //clickPipelinesWidgetAddToSpaceButton();
//    OpenShiftIoSpaceHomePage.clickTechnologyStack();
//    OpenShiftIoSpaceHomePage.clickQuickStartFinishButton();
//    OpenShiftIoSpaceHomePage.clickQuickStartCancelButton();

//    OpenShiftIoSpaceHomePage.clickOkButton();
//    OpenShiftIoSpaceHomePage.clickQuickStartCancelButton();
//    OpenShiftIoSpaceHomePage.clickNoThanksButton();

    /* Import the code base */
//    OpenShiftIoSpaceHomePage.clickImportCodebaseButton();
//    var targetURL = "https://github.com/almightytest/" + spaceTime + ".git";
//    OpenShiftIoSpaceHomePage.setGitHubRepo(targetURL);
//    OpenShiftIoSpaceHomePage.clickSyncButton();

    OpenShiftIoDashboardPage.clickNameUnderLeftNavigationBar (spaceTime);
    OpenShiftIoDashboardPage.clickAccountHomeUnderLeftNavigationBar();

    /* Step 5 - log out */

    /* For the purposes of this test - ignore all 'toast' popup warnings */
    OpenShiftIoDashboardPage.waitForToastToClose();

    OpenShiftIoDashboardPage.clickrightNavigationBar();
    OpenShiftIoDashboardPage.clickLogOut();
    console.log ('EE POC test - Log Out');

  });

});

  /* Get system time in seconds since 1970 */
  var returnTime = function () {
    var d = new Date();
    var n = d.getTime();
    console.log ("EE POC test - Creating space: " + n.toString());
    return "test" + n.toString();
  }
