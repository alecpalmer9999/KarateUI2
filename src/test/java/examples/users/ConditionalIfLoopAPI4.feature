Feature: Conditional Statement Using If and Loop



  @ConditionalIfLoopAPI
  Scenario: Verify username info from response
    * configure ssl = true
    Given url 'https://gorest.co.in/public/v2/users'
    When method get
    Then status 200
#    When def outputData = []
    And match response.id == '#present'
#    And eval for(var i=0;i<10;i++) if(response.data[i].name.endsWith("Dhrutika")) outputData.add(response.data[i].email)
#    response.data.length
#    Then print outputData