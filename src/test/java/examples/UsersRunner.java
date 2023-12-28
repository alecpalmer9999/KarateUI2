package examples;

import com.intuit.karate.junit5.Karate;

class UsersRunner {
    
    @Karate.Test
    Karate testUsers() {
//        System.setProperty("karate.env", "Prod");  YOU CAN SET ENV HERE, OR BELOW....
//        return Karate.run("JBSUIDemoStart").relativeTo(getClass());
        return Karate.run("classpath:examples/users").karateEnv("Stag")
//                .tags("@HAArticleLinksOutline")
//                .tags("@ArticleOutline")
                .tags("@ArticleBundledTests")
//                .tags("@ValidateConfig")
                .relativeTo(getClass());
    }
}
