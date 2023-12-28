Feature: Reusable Function

  @ExampleAPI3
  Scenario: verify current weather data reusability
    Given url 'http://api.openweathermap.org/data/2.5/weather?q=London&appid=7d4705c5848c7dcab889ed7b6310723d'
    When method get
    Then status 200
    And def des = response.weather[0].description
    * print des


  @ExampleAPI3a
  Scenario: get employee id's
    * configure ssl = true
    Given url 'https://gorest.co.in/public/v1/users'
    When method get
    Then status 200
    And def temp = response.data[0].name['Bhuvanesh Desai']
    * print temp

