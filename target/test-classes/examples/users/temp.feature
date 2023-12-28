Feature: sample feature

  @temp
  Scenario: sample scenario
    Given driver 'https://www.cell.com/cell-genomics/fulltext/S2666-979X(23)00273-2'
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    And driver 'https://www.cell.com/cell-genomics/home'
    And driver 'https://www.cell.com/immunity/home'
#    And delay(2000)
