Feature: Calling a java method

  @CallJavaClass
  Scenario: Call two methods in java Reader class
    Then def callJavaClass = Java.type('examples.users.Reader')
    Then def myMsg = callJavaClass.returnMessage()
    Then def mySum = callJavaClass.returnsSum(4, 15)
    And print myMsg
    And print mySum
