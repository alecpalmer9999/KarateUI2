Feature: JBS Table of Contents (TOC)

  @TOC
  Scenario: Check the TOC page title
#    Given driver 'https://www.cell.com/immunity/current'
#    Given driver 'https://www.ajkd.org/current'
    Giver driver _currIssueUrl
#    And print _currIssueUrl
    And delay(300)
    And call read('JBSCookies.feature')
#    And def firstArticle = text('//h3/a')
    And def firstArticle = text("h1[class^='article-header__title']")
    And print firstArticle
