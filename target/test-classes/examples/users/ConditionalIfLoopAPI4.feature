Feature: Conditional Statement Using If and Loop

  @ConditionalIfLoopAPI
  Scenario: Verify username info from response
    * configure ssl = true
    Given url 'https://gorest.co.in/public/v1/users'
    When method get
    Then status 200
    When def outputEmail = []
    And eval for(var i=0;i<response.data.length;i++) if(response.data[i].name.endsWith("Panicker")) print(response.data[i].name + "-->" + response.data[i].gender)
#    And eval for(var i=0;i<response.data.length;i++) if(response.data[i].name.endsWith("Panicker")) outputEmail.add(response.data[i].email)
#    And karate.write(response, "sampleOutput.txt")
#    And eval for(var i=0;i<response.data.length;i++) if(response.data[i].name.endsWith("Panicker")) karate.write(response.data[i].name, "nameOutput.txt")


  #  CAN'T GET ADD TO ARRAY TO WORK
  @karateVideoDemo
  Scenario: verify username info from the response
    * configure ssl = true
    Given url 'https://gorest.co.in/public/v1/users'
    When method get
    Then status 200
    When def outputEmail = []
    When def outputGender = []
    And eval for(var i=0;i<response.data.length;i++) if(response.data[i].name.endsWith("Panicker")) outputEmail.add(response.data[i].email),outputGender.add(response.data[i].gender)
    Then print outputEmail
    Then print outputGender


  @LoopThruResults
  Scenario: add results to an array
    * configure ssl = true
    * def ArrayList = Java.type('java.util.ArrayList')
    * def Collections = Java.type('java.util.Collections')

    Given url 'http://dummy.restapiexample.com/api/v1/employees'
    When method get
    Then status 200

    * def json = response.data
#    * def names = $json[*].employee_name
#    * def salaries = $json[*].employee_salary
    * def salaryList = new ArrayList()
    * def idList = new ArrayList()
    And eval for(var i=0;i<json.length;i++) print(json[i].employee_name + ": " + json[i].employee_salary)
    And eval for(var i=0;i<json.length;i++) print(json[i].employee_name + "'s id is: " + json[i].id)
#    * print json.length
#    * print names
#    * print salaries
#    And karate.write(someSalaries, "salariesOutput.txt")
#    And karate.write(someSalaries, "idsOutput.txt")

  @StuffWithArrays
  Scenario: doin' stuff with arrays
    * def myJson =
      """
        [
          {
              "id": "id_number_1",
              "name": "name"
          },
          {
              "id": "id_number_2",
              "name": "name 2",
              "nestedThing": {
                  "id": "another_id",
                  "name": "object2_name"
              }
          },
          {
              "id": "id_number_3",
              "name": "name 3"
          }
        ]
      """
    * def ids = myJson.filter(x => !x.nestedThing).map(x => x.id)
    * print ids


    @UsingJsonPath
    Scenario: doin' more array filtering stuff
      * configure ssl = true
      Given url 'https://gorest.co.in/public/v1/users'
      When method get
      Then status 200
#      * print karate.jsonPath(response.data, '$[*].id')
#      * def myJson = karate.jsonPath(response.data, '$[*].id')
#      * def myJson = karate.jsonPath(response.data, '$[:5]..name')
#      * def myJson = karate.jsonPath(response.data, '$[2:7]..name')
#      * def myJson = karate.jsonPath(response.data, '$[?(@.gender=="female")].name')
#      * def myJson = karate.jsonPath(response.data, '$[?(@.gender=="female")].id')
#      * def myJson = karate.jsonPath(response.data, '$[?(@.id==5816718)].name')
      * def myJson = karate.jsonPath(response.data, '$[?(@.gender=="female" && @.name=="Dwaipayana Chopra")].id')
      * print myJson
#      * karate.write(myJson, "idsOutput.txt")

