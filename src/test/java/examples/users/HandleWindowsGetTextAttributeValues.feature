Feature: Handling multiple windows, getting text, attribute and value

  @TextAndAttribute
  Scenario: Get text and attribute
    Given driver 'https://spring.academy/courses'
    And driver.maximize()

    When def classAttribute = attribute('.h5', 'class')
    Then match classAttribute == 'h5'
    And print("The H1 element class attribute value is: " + classAttribute)

    Then def elemText = text('.h5')
    And print("The H1 element text is: " + elemText)

    Then def classValue = value('.h5')
    And print(classValue)

  @FormValue
  Scenario: Get the value from an input field
    Given driver 'https://www.bing.com/'
    And driver.maximize()

    When input("#sb_form_q", "AFC Championship")
    Then print(value("#sb_form_q"))

  @SwitchWindows
  Scenario: Switch between browser tabs
    Given driver 'https://the-internet.herokuapp.com/windows'
    And driver.maximize()
    When click("{}Click Here")
    And delay(2000)
    Then switchPage("The Internet")
    And delay(2000)
    Then switchPage("the-internet.herokuapp.com/windows/new")
    And delay(2000)

