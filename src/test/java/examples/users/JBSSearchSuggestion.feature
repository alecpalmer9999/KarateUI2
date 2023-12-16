Feature: JBS Search Feature

#  Scenario: JBS Search By Keyword
#    Given driver 'https://www.cell.com/cell-genomics/home'
#    Then delay(300)
##    When click("#onetrust-accept-btn-handler")    css selector by id
##    When click("{button}Accept all cookies")    find first button element w/ exact text
##    When click("{}Accept all cookies")
#    When call read('DemoUICookie.feature')
#    Then delay(300)
#    And input("//input[@id='searchText']", 'blood')
#    And delay(300)
#    Then click("//button[@title='Search']")
#    And delay(3000)
##    And def page_title = driver.title
##    And print page_title
#    And call read('PrintPageTitle.feature')
#    And delay(5000)
#    And quit()

  Scenario Outline: JBS Choose from list of Search Suggestions
#    Given driver 'https://www.cell.com/cell-genomics/home'
#    Then delay(300)
#    When call read('DemoUICookie.feature')
#    Then delay(300)
    And def myKeyword = '<keyword>'
    And input("//input[@id='searchText']", myKeyword)
    And delay(3000)
    And click("//ul[contains(@id,'ui-id-')]/li[@class='ui-menu-item'][6]")
#    And delay(3000)

    Examples:
      | keyword | index |
      | covid   | 1     |