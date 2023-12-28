Feature: JBS Search Suggestion

  @SearchSuggestion
  Scenario: JBS Choose from list of Search Suggestions
    Given driver 'https://www.cell.com/cell-genomics/home'
    And driver.maximize()
    And delay(300)
    And  call read('JBSCookies.feature')

    # call feature & get 2 values from 'something' & 'somethingElse' variables
    And def returnSomething = call read('returnSomething.feature')
    And print returnSomething.something
    And print returnSomething.somethingElse
    #########################

    When input("//input[@id='searchText']", 'blood')
    And delay(3000)
    Then click("//ul[contains(@id,'ui-id-')]/li[@class='ui-menu-item'][4]")
    And delay(3000)
