Feature: JBS Search By Keyword

  @SearchKeyword
  Scenario: JBS Search By Keyword
    Given driver 'https://www.cell.com/cell-genomics/home'
    And delay(300)
    And  call read('JBSCookies.feature')
    When input("//input[@id='searchText']", 'cancer')
    And delay(300)
    Then click("//button[@title='Search']")
    And delay(3000)
