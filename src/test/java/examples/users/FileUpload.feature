Feature:

  @FileUpload
  Scenario:
    Given driver 'https://the-internet.herokuapp.com/upload'
    And driver.maximize()
    When driver.inputFile("#file-upload", "daisy and johnny.jpg")
    Then click("#file-submit")
    And delay(3000)
