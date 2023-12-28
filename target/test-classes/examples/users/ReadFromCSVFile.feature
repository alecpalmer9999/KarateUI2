Feature: read from csv file

  @ReadFromCSV1
  Scenario: read data from csv file
    Then eval data = read('Book2.csv')
    And print data
    * def myJson = karate.jsonPath(data, '$[*].mobilenumber')
    * print myJson
    * def myJson2 = karate.jsonPath(data, '$[?(@.lastname=="madhu sudhan")].address')
    * print myJson2
