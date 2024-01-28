Feature: Background Accept Cookies

  Background:
    * driver 'https://www.amjmed.com/article/S0002-9343(21)00224-2/fulltext'
    * delay(2000)
    * click("{button}Accept all cookies")
    * driver.maximize()
    * delay(2000)

  @BackgroundExample
  Scenario: Verify 3D4M link on LHS, clicking it scrolls down, and verify widget displayed
    # verify 3D4M link in left nav menu & click it
    Given def navLink = text("{span}3D Images")
    When match navLink == '3D Images'
    Then screenshot("{span}3D Images")
    And screenshot()
    And click("{span}3D Images")
    And delay(3000)
    Then def sectionWidget = locate("//section[@data-widget-def='UX33D4Medical']")
    # check the heading h2 element text matches expected text
    When def heading = text("//h2[@id='3dm']")
    Then match heading == '3D Images'
    And delay(3000)

  @BackgroundExample
  Scenario: Scroll to 3D4M widget, click 3D thumbnail image
    * delay(2000)
    # Scroll down to first 3D4M item and click link -> <a> element
    Given scroll('.three-d-item').click()
    Then delay(3000)

  @BackgroundExample
  Scenario: Scroll to 3D4M widget, take screenshot of 3D thumbnail image
    # Scroll down to first 3D4M item and take a screenshot -> <a> element
    Given scroll('.three-d-item')
    When screenshot()
    Then screenshot('.three-d-item')
    And delay(3000)

