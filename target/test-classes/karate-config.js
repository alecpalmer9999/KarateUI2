function fn() {

      var env = karate.env; // get system property 'karate.env'
      karate.log('karate.env system property is:', env);

    var config = {
     env: env,
     articleUrl : 'https://www.cell.com/immunity/fulltext/S1074-7613(23)00443-0',
     dummyPostCreateUrl: 'http://dummy.restapiexample.com/api/v1/create',
     baseUrl: 'http://localhost:8081'
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