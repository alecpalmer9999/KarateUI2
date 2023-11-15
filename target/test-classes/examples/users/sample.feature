Feature: Sample feature file

  Background:
    * configure driver = { type: 'chrome' }

  Scenario: Go to google.com and send text to search box
    Given driver 'https://www.cell.com/action/doSearch?type=quicksearch&text1=cancer&field1=AllField'
 