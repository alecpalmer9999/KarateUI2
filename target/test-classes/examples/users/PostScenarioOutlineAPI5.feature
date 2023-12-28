Feature: Post examples, including scenario outline

  @PostExample
  Scenario: post example
    Given url dummyPostCreateUrl
    Then request  {"name": "alec1","salary":"98765","age":"50"}
    When method post
    Then status 200


  @PostScenarioOutline1
  Scenario Outline: post scenario outline example
    Given url 'http://dummy.restapiexample.com/api/v1/create'
    Then request  {"name": <name>,"salary":<salary>,"age":<age>}
    When method post
    Then status 200

    Examples:
      | name  | salary | age |
      | Frank | 23456  | 45  |
      | Joe   | 83373  | 67  |
      | Sally | 67288  | 56  |

  @PostFromCSVFile
  Scenario Outline: post scenario reading from csv file
    Given url 'http://dummy.restapiexample.com/api/v1/create'
    Then request  {"name": <name>,"salary":<salary>,"age":<age>}
    When method post
    Then status 200
    Examples:
      |read('Book1.csv')  |

  # AN EXAMPLE USING INSTRUCTOR'S JIRA DEMO ACCOUNT -> WILL NOT WORK IF YOU RUN IT
  # SEE 'BasicAuthExample.feature' FOR WORKING EXAMPLE USING 'header Authorization = ....'
  @basicAuthPost1
  Scenario Outline: POST with basic auth
    Given url 'https://surenqa.atlassian.net/rest/api/3/user'
    And header Authorization = call read('basic-auth.js') { username: 'surendrappium@mailinator.com', password: 'PkB8431QTfcF5ZN7fxwX7C19' }
    Then request {"emailAddress": <emailAddress>,"displayName": <displayName>,"name": <name>}
    And method post
    Then status 201

    Examples:
      |read('Book4.csv')|
