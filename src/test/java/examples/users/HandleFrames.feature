Feature: Handle Frames

  @frames
  Scenario: Handling iframes
    Given driver 'https://chercher.tech/practice/frames'
    And driver.maximize()
    When switchFrame("//iframe[@id='frame1']")
    And def inputText = text("//b[@id='topic']")
    Then match inputText == 'Topic :'
    And print(inputText)
    And delay(2000)
    And switchFrame(null)
    And click("//a[@class='navbar-brand']")
    And delay(2000)
