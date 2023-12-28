Feature: Validating basic authorization

  @basicAuth1
  Scenario: validate basic auth for jira and get user details
    Given url 'https://elsevier.atlassian.net/rest/api/3/user?accountId=557058%3A43ffd961-6cdd-40f4-8458-dbe355513dbd'
    And header Authorization = call read('basic-auth.js') { username: 'a.palmer@elsevier.com', password: 'ATATT3xFfGF01ICKtoDOXHyrvnoTD8IbGN5ON58BFWG39MSVp6Vyb6FWhZh55k345psi-62P6bXXKD-1A5zF2wel4_ok0egKuX_mNgcjO-lMRjD11PD3UBH-oE-WS83uafyWDwcGOreoefSAPUpqwCRV-DUqOhZELB352uQ3zE4yLbFCpg54EcI=EB4CB774' }
    Then method get
    And status 200

  @GetJiraIssues
  Scenario: get list of jira issues using a jql/search query
    Given url 'https://elsevier.atlassian.net/rest/api/3/search?jql=project%20%3D%20JSA'
  # https://yoursitename.atlassian.net/rest/api/3/search?maxResults=10000&jql%3Dproject%3JSA
    And header Authorization = call read('basic-auth.js') { username: jiraUserName, password: jiraPassword }
    Then method get
    And status 200

  # SEE 'ELS Jira Info.txt' for above un/token info

  # curl --request GET \
  #  --url 'https://your-domain.atlassian.net/rest/api/3/search?jql=project%20%3D%20HSP' \
  #  --user 'email@example.com:<api_token>' \
  #  --header 'Accept: application/json'

