Feature: Click Accept Cookies

  Scenario:
    Given driver 'https://www.cell.com/cell-genomics/home'
    Then delay(300)
    Then click("{}Accept all cookies")
    Then call read('JBSSearchSuggestion.feature')
    And delay(300)
    Then call read('JBSSearchByKeyword.feature') {strKeyword:'cancer'}
    And delay(3000)
