Feature: Keyboard Actions

  @KeyboardActions
  Scenario: Enter term in search box, tab to hourglass button and press Enter
    Given driver 'https://www.cell.com/cell-genomics/home'
    And delay(300)
    And driver.maximize()
    And  call read('JBSCookies.feature')
    Then input("#searchText", "Colon Cancer" + Key.TAB + Key.ENTER)
    And delay(3000)
    Then screenshot()

  @KeyboardActions
  Scenario: Highlight all the li links
    Given driver 'https://www.cell.com/cell-genomics/home'
    And delay(300)
    And driver.maximize()
    And  call read('JBSCookies.feature')
#    Then highlight("//ul[@class='mega-menu rlist']/li[@role='presentation']")
    Then highlightAll('li')
    And delay(3000)

