Feature: Browser Actions

  Background:
    * configure afterScenario =
    """
    function(){
      karate.log('PRINT SOMETHING');
    }
    """

  @BrowserActions
  Scenario: demo browser actions: back, forward, refresh, reload, minimize, maximize, full screen
    Given driver 'https://www.amjmed.com/'
    And delay(300)
    And call read('JBSCookies.feature')
    And delay(300)
    And fullscreen()
    And delay(3000)
    And driver.minimize()
    And delay(3000)
    And driver.maximize()
    And delay(3000)
    Then click("div.current-issue__link > a[href='/current']")
    And delay(3000)
    Then match driver.title == 'Current Issue Table of Contents: The American Journal of Medicine'
    Then back()
    And delay(3000)
    Then forward()
    And delay(3000)
    Then match driver.title == 'Current Issue Table of Contents: The American Journal of Medicine'
    # Hard page reload, which will clear the cache
    And reload()
    And delay(2000)
    # Normal page reload, does not clear cache
    And refresh()
    And delay(2000)
