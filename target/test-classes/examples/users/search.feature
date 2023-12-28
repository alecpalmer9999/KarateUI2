Feature: JBS Search Scenarios

  Background:
    * configure driver = { type: 'chrome' }

  @SearchText
  Scenario Outline: JBS SearchText By Keyword
    Given driver '<start_url>'
#    When click('a[id=ui-id-3]')
    And waitFor('#ui-id-3').click()
#  <button id="onetrust-accept-btn-handler">
#    When click('button[id=onetrust-accept-btn-handler]')
    Then print '<keyword>'
    And print '<results_page_title>'
#    Given I am on a JBS Journal '<start_url>'
#    And I accept cookies
#    When I enter a '<keyword>' into the searchText box
#    And I click submit searchText
#    Then I validate the page navigates to the search results page: '<results_page_title>'
#    And I validate that a list of Article results is displayed
    # If you have Special Characters in your table, use "\" to comment them out
    Examples:
      | start_url                                   | keyword   | results_page_title                               |
      | https://magento.softwaretestingboard.com/   | a keyword | some text                                        |
#      | https://www.cell.com/cell-genomics/home     | acute     | Cell Press - Search Results: Cell Genomics       |
#      | https://www.cell.com/cancer-cell/home       | cancer    | Cell Press - Search Results: Cancer Cell         |
#      | https://www.cell.com/cell-host-microbe/home | blood     | Cell Press - Search Results: Cell Host & Microbe |

#  Background:
#    * configure driver = { type: 'chrome' }
#
#  Scenario: google search, land on the YouTube, and search for knoldus.
#
#    Given driver 'https://google.com'
#    And input('input[name=q]', 'Youtube')
#    And click('input[name=btnK]')
#    When click("h3[class='LC20lb DKV0Md']")
#    Then waitForUrl('https://www.youtube.com/')
#    And click('input[id=search]')
#    And input('input[id=search]', 'knoldus')
#    And click('button[id=search-icon-legacy]')
#    And match driver.url == 'https://www.youtube.com/results?search_query=knoldus'