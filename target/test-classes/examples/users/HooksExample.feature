Feature: Hooks

  Background:
    And configure afterScenario =
    """
    function(){
      karate.log('something, anything, for chrissakes')
      karate.log(karate.info)
      if(karate.info.errorMessage){
      karate.log('error encountered');
      karate.write(driver.screenshot(false), 'demo1.png')
      }
    }
    """

  @HooksExample
  Scenario: example of before and after scenario
    Given driver 'https://www.gastrojournal.org/'
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    And delay(3000)
    # Scroll down to first 3D4M item and take a screenshot -> <a> element
    Then click(.yabbadabba)
#    And screenshot()


