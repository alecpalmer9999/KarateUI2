Feature: JBS Shib

  @Shib
  Scenario: I3 ID-15818 Entering an Shib-enabled and EIA-enabled institution on the WAYF screen takes user to SIGN IN WITH INSTITUTION screen
  Given driver 'https://www-cell-com-marlin-x3239.ciplit.com/'
  And delay(300)
  And driver.maximize()
  And call read('JBSCookies.feature')
  And delay(300)
  And screenshot()
  When click("//li[@class='profile-links__logIn']/a[@class='show-login']")
  And delay(300)
  And call read('JBSCookies.feature')
  And delay(300)
  And screenshot()
  Then click("//button[@id='bdd-elsSecondaryBtn']")
  And input("#bdd-email", "JBSTech")
  And delay(3000)
  And screenshot()

#  And that I have entered some text
#  And the text is a match for a Shib-enabled and EIA-enabled institution
#  When I submitted the form
#  Then the SIGN_IN_WITH_INSTITUTION screen is displayed



#    Given driver 'https://www.cell.com/cell-genomics/home'
#    And delay(300)
#    And driver.maximize()
#    And  call read('JBSCookies.feature')
  # https://www-cell-com-marlin-x3239.ciplit.com/
  # //li[@class='profile-links__logIn']/a[@class='show-login']