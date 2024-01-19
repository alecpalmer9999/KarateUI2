Feature: Drop Down Scenarios

  @DropDown
  Scenario: Select from drop down menu
    Given driver 'https://www.ajconline.org/search/advanced?SeriesKey=ajc&ISSN=0002-9149&journalCode=ajc'
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    When select('#staticRangeSelect', '{}Last year')
    And screenshot()
    Then delay(300)
    And reload()
    And delay(300)
    And select('#staticRangeSelect', '{}Last month')
    And screenshot()
    Then delay(300)
    And select("#staticRangeSelect", 5)
    And screenshot()
    Then delay(300)
    And select("#staticRangeSelect", "20220115-20240115")
    And screenshot()
    Then delay(300)
    And select("#staticRangeSelect", "{^}week")
    And screenshot()

