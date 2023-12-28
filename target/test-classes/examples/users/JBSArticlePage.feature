Feature: JBS Article Page

  Background:
#    * def articleUrl = 'https://www.cell.com/immunity/fulltext/S1074-7613(23)00443-0'\
    * configure ssl = { trustAll: true }

  @Article
  Scenario: JBS Article Title matches Title from TOC Page
    Given driver articleUrl
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    When def articleTitle = text("//h1[@class='article-header__title']")
    And def firstArticleTitle = call read('JBSTOC.feature')
    Then match articleTitle == firstArticleTitle.firstArticle
    And print articleTitle
    And print firstArticleTitle.firstArticle

  @HAArticleLinksOutline
  Scenario Outline: JBS HA Article Titles matches Titles from TOC Pages
    Given driver HAArticleUrl
    And print HAArticleUrl
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
#    When def articleTitle = text("//h1[@class='article-header__title']")
    When def articleTitle = text("h1.article-header__title")
    And def firstArticleTitle = call read('JBSTOC.feature') {_currIssueUrl:'#(currIssueUrl)'}
    Then match articleTitle == firstArticleTitle.firstArticle
    And print articleTitle
    And print firstArticleTitle.firstArticle
    Examples:
      | HAArticleUrl                                                            | currIssueUrl                             |
      | https://www.ajconline.org/article/S0002-9149(23)01355-3/fulltext        | https://www.ajconline.org/current        |
      | https://www.ibroneuroscience.org/article/S0306-4522(23)00527-4/fulltext | https://www.ibroneuroscience.org/current |
      | https://www.womenandbirth.org/article/S1871-5192(23)00274-3/fulltext    | https://www.womenandbirth.org/current    |

  @Article
  Scenario: Check Author Link on JBS Article Page
    Given driver articleUrl
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    When click("//a[contains(@title, 'Correspondence information about the author')]")
    And match attribute("//div[@class='dropBlock__holder article-header__info__holder lefted js--open']", 'class') == 'dropBlock__holder article-header__info__holder lefted js--open'
    And delay(2000)

  @Article
  Scenario: Check PDF Link on JBS Article Page
    Given driver articleUrl
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    When click("//a[contains(@title,'Standard PDF')]")
    And match driver.Title == 'Albert Bendelac (1956-2023): Immunity'
    And delay(2000)

  @Article
  Scenario: Check Figures Link on JBS Article Page
    Given driver articleUrl
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    When click("//a[@title='open Figures menu']")
    And match attribute("//div[@class='dropBlock__holder article-tools__dropblock__holder js--open']", 'class') == 'dropBlock__holder article-tools__dropblock__holder js--open'
    And delay(2000)

  @Article
  Scenario: Check Save Link on JBS Article Page
    Given driver articleUrl
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    When click("//a[contains(@title, 'open Save menu')]")
    And match attribute("//div[@class='dropBlock__holder article-tools__dropblock__holder js--open']", 'class') == 'dropBlock__holder article-tools__dropblock__holder js--open'
    And delay(2000)

  @ArticleOutline
  Scenario Outline: Check Article Page Toolbar Links
    Given driver articleUrl
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    When click(toolbarLink)
    And delay(300)
    And match attribute(attributeToCheck, 'class') == attributeValue
    And print attribute(attributeToCheck, 'class')
    And print attributeValue
    And delay(300)
    Examples:
      | toolbarLink                                                          | attributeToCheck                                                               | attributeValue                                                 |
      | //a[contains(@title, 'Correspondence information about the author')] | //div[@class='dropBlock__holder article-header__info__holder lefted js--open'] | dropBlock__holder article-header__info__holder lefted js--open |
      | //a[@title='open Figures menu']                                      | //div[@class='dropBlock__holder article-tools__dropblock__holder js--open']    | dropBlock__holder article-tools__dropblock__holder js--open    |
      | //a[contains(@title, 'open Save menu')]                              | //div[@class='dropBlock__holder article-tools__dropblock__holder js--open']    | dropBlock__holder article-tools__dropblock__holder js--open    |

  @ArticleLinks @ArticleBundledTests
  Scenario: Check Article Page Author, Figures, Save and Share Links
    Given driver articleUrl
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    And delay(300)
    # Check Author Link
    When click("//a[contains(@title, 'Correspondence information about the author')]")
    And match attribute("//div[@class='dropBlock__holder article-header__info__holder lefted js--open']", 'class') == 'dropBlock__holder article-header__info__holder lefted js--open'
    And delay(3000)
    # Check Figures Link
    When click("//a[@title='open Figures menu']")
    And match attribute("//div[@class='dropBlock__holder article-tools__dropblock__holder js--open']", 'class') == 'dropBlock__holder article-tools__dropblock__holder js--open'
    And delay(3000)
    # Check Save Link
    When click("//a[contains(@title, 'open Save menu')]")
    And match attribute("//div[@class='dropBlock__holder article-tools__dropblock__holder js--open']", 'class') == 'dropBlock__holder article-tools__dropblock__holder js--open'
    And delay(3000)
    # Check Share Link
    When click("//a[contains(@title, 'open Share menu')]")
    And match attribute("//div[@class='share__block dropBlock__holder article-tools__dropblock__holder js--open']", 'class') == 'share__block dropBlock__holder article-tools__dropblock__holder js--open'
    And delay(3000)

  @ArticleLinks
  Scenario: Check Article Page Reprints and Request Links
    Given driver articleUrl
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    # Check Reprints Link
    When click("//a[contains(@title,'Reprints')]")
    And delay(3000)
    And match driver.Title == 'MedReprints | Elsevier’s Online Reprint Ordering Portal | MedReprints'
    And print(driver.Title)
    And driver articleUrl
    And delay(300)
    # Check Request Link
    When click("//a[contains(@title,'Request')]")
    And delay(6000)
    And match driver.Title == 'Rightslink® by Copyright Clearance Center'
    And print(driver.Title)
    And delay(300)


  @ArticleLinks
  Scenario: Check Article Page PDF Link
    Given driver articleUrl
    And delay(300)
    And driver.maximize()
    And call read('JBSCookies.feature')
    # Check PDF Link
    When click("//a[contains(@title,'Standard PDF')]")
    And match driver.Title == 'Albert Bendelac (1956-2023): Immunity'
    And delay(3000)
    And switchPage(articleUrl)
    And delay(300)

#   And match attribute('#eg01SubmitId', 'type') == 'submit'
#
#  GET ATTRIBUTE EXAMPLE.......
#  Scenario: Title of your scenario
#    Given driver 'https://training.rcvacademy.com/'
#    And delay(1000)
#    And def att_value = attribute("//id='cu-form-1657531827922']/div/div[3]/div/a","data-submithref")
#    And def att_uniqid = attribute("//id='cu-form-1657531827922']/div/div[3]/div/a","data-uniqid")
#    And match att_uniqid == "cu-form-1657531827922"
