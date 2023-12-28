Feature: validate post request

  @ExamplePost @APIExamples
  Scenario Outline: verify dummy sample api post request
    Given url '<url>'
    And request {"name": "test","salary": "50,550","age": "39"}
    When method post
    Then status 200

    # call feature & get 2 values from 'something' & 'somethingElse' variables
    And def otherResponse = call read('ExampleAPI3.feature')
    Then print otherResponse.des
    #######################################

    Examples:
      | url                                           |
      | http://dummy.restapiexample.com/api/v1/create |

  Scenario: another verify dummy sample api post request

