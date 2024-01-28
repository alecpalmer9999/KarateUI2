Feature: Handle Alerts

  @Alerts
  Scenario: Close 3 types of JS Alerts
    Given driver 'https://the-internet.herokuapp.com/javascript_alerts'
    And driver.maximize()

    # click a JS Alert
    When click("{button}Click for JS Alert")
    And match driver.dialogText == 'I am a JS Alert'
    And print(driver.dialogText)
    And delay(2000)
    Then dialog(true)
    * def resultText = text('#result')
    And match resultText == 'You successfully clicked an alert'
    And print("The result label text is: " + resultText)
    And delay(1000)

    # click JS Confirm cancel button
    Then click("{button}Click for JS Confirm")
    And delay(2000)
    Then dialog(false)
    * def confirmText = text('#result')
    And match confirmText == 'You clicked: Cancel'
    And print(confirmText)
    And delay(1000)

    # click JS Prompt and submit text
    Then click("{button}Click for JS Prompt")
    And delay(2000)
    Then dialog(true, "Alec Palmer")
    * def promptText = text('#result')
    And match promptText == 'You entered: Alec Palmer'
    And print(promptText)
    And delay(1000)



