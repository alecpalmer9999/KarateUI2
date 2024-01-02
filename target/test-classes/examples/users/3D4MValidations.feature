Feature: 3D4M Validations: C1393259 & C1393198

  @3D4M
  Scenario Outline: Verify 3D4M link on LHS, clicking it scrolls down, and verify widget displayed
    Given driver ArticleUrl
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    And delay(3000)
    # verify 3D4M link in left nav menu & click it
    Then def navLink = text("{span}3D Images")
    And match navLink == '3D Images'
    And click("{span}3D Images")
    And delay(3000)
#    Then scroll("//section[@data-widget-def='UX33D4Medical']") -> not using scroll, b/c clicking left nav link
    # verify the 3D4M widget is displayed -> locate section element
    Then def sectionWidget = locate("//section[@data-widget-def='UX33D4Medical']")
    # check the heading h2 element text matches expected text
    When def heading = text("//h2[@id='3dm']")
    Then match heading == '3D Images'
    And delay(3000)

    Examples:
      | ArticleUrl                                                    |
      | https://www.amjmed.com/article/S0002-9343(21)00224-2/fulltext |
      | https://www.amjmed.com/article/S0002-9343(97)00314-8/fulltext |


  @3D4M
  Scenario Outline: Scroll to 3D4M widget, click 3D thumbnail image
    Given driver ArticleUrl
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    And delay(3000)
    # Scroll down to first 3D4M item and click link -> <a> element
    Then scroll('.three-d-item').click()
    And delay(3000)

    Examples:
      | ArticleUrl                                                    |
      | https://www.amjmed.com/article/S0002-9343(21)00224-2/fulltext |
      | https://www.amjmed.com/article/S0002-9343(97)00314-8/fulltext |


  @3D4M
  Scenario Outline: Scroll to 3D4M widget, take screenshot of 3D thumbnail image
    Given driver ArticleUrl
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    And delay(3000)
    # Scroll down to first 3D4M item and take a screenshot -> <a> element
    Then scroll('.three-d-item')
    And screenshot()
    And screenshot('.three-d-item')
    And delay(3000)

    Examples:
      | ArticleUrl                                                    |
      | https://www.amjmed.com/article/S0002-9343(21)00224-2/fulltext |
      | https://www.amjmed.com/article/S0002-9343(97)00314-8/fulltext |

