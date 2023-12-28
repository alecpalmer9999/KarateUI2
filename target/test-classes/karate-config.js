function fn() {

      var env = karate.env; // get system property 'karate.env'
      karate.log('karate.env system property is:', env);

    var config = {
     env: env,
     articleUrl : 'https://www.cell.com/immunity/fulltext/S1074-7613(23)00443-0',
     dummyPostCreateUrl: 'http://dummy.restapiexample.com/api/v1/create',
     baseUrl: 'http://localhost:8081',
     jiraUserName: 'a.palmer@elsevier.com',
     jiraPassword: 'ATATT3xFfGF01ICKtoDOXHyrvnoTD8IbGN5ON58BFWG39MSVp6Vyb6FWhZh55k345psi-62P6bXXKD-1A5zF2wel4_ok0egKuX_mNgcjO-lMRjD11PD3UBH-oE-WS83uafyWDwcGOreoefSAPUpqwCRV-DUqOhZELB352uQ3zE4yLbFCpg54EcI=EB4CB774'
    }

      if (env == 'stag') {
        config.myVarName = 'https://www-cell-com.marlin-stag.literatumonline.com/';
        config.baseUrl = 'http://localhost:8081/api'
      } else if (env == 'prod') {
        config.myVarName = 'https://www.cell.com';
        config.baseUrl = 'http://api.ipify.org/'
      }

      return config;
}