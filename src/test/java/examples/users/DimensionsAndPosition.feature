Feature: Dimensions & Position

  @DimensionsAndPosition
  Scenario:
    Given driver 'https://www.amjmed.com/'
    And delay(300)
    And call read('JBSCookies.feature')
    And delay(300)
    When print(driver.dimensions)
    Then driver.dimensions = {x: 0, y: 0, width: 320, height: 480}
    And delay(3000)
    And print(driver.dimensions)
    Then driver.maximize()
    And delay(3000)
    And reload()
    And delay(300)
    Then def currIssueLink = position("div.current-issue__link > a[href='/current']")
    And print currIssueLink
    Then driver.dimensions = {x: 30, y: 30, width: 1024, height: 768}
    And delay(3000)
