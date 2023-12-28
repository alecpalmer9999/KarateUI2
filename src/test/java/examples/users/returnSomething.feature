Feature: Example of a feature called that returns something

  Scenario: Store a String and return it to calling feature
    Given def something = 'something returned as string!'
    And def somethingElse = 'something else returned as string!'
    Then delay(300)
