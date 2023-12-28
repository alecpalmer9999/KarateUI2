Feature: validate get request

  @ExampleGet @APIExamples
  Scenario Outline: verify current weather or get an employee
    Given url '<url>'
    When method get
    Then status 200
    And print response
    And print response.message
    And match each response.data ==
    """
    {
      "id": "#number",
      "employee_name": "#string",
      "employee_salary": "#number",
      "employee_age": "#number",
      "profile_image": "##string"
    }
    """
    Examples:
      | url                                                                                            |
      |http://dummy.restapiexample.com/api/v1/employees                                                                                                |
#      | http://api.openweathermap.org/data/2.5/weather?q=London&appid=7d4705c5848c7dcab889ed7b6310723d |
