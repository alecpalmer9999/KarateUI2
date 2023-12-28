Feature: Validating UI browser launch

  Background:
    * configure driver = { type: 'chrome', addOptions: ["--remote-allow-origins=*"], port: 1234 }

#  Scenario: Demo login to saucedemo.com practice website
#    Given driver 'http://www.saucedemo.com'
##    Then input("#user-name",'visual_user')
#    Then input("//input[@id='user-name']", 'visual_user')
##    And input("#password",'secret_sauce')
#    And input("//input[@id='password']", 'secret_sauce')
#    Then delay(1000)
#    When waitFor("//input[@id='login-button']").click()
#    Then delay(3000)

    Scenario: Demo login to saucedemo.com practice website
    Given driver 'http://www.saucedemo.com'
#    Then input("#user-name",'visual_user')
#    Then below("//*[@id='login_button_container']/div/form/div[1]").find("input").input("visual_user")
      Then below("//*[@id='login_button_container']/div/form/div[1]").input("visual_user")
      # Friendly locators: above, below, leftOf, rightOf and near use same structure as above 2 examples.
      # Also notice how you can find input element, or let karate do it -> first example includes .find("input"), second does NOT.
#    And input("#password",'secret_sauce')
    And input("//input[@id='password']", 'secret_sauce')
    Then delay(1000)
    When waitFor("//input[@id='login-button']").click()
    Then delay(3000)

#  Scenario: Click Bing image button
#    Given driver 'https://www.bing.com'
#    Then delay(3000)
#    Then click("{a}Images")
#    Then delay(4000)