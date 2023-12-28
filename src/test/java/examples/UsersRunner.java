package examples.users.ui;

import com.intuit.karate.junit5.Karate;

class UsersRunner {
    
    @Karate.Test
    Karate testUsers() {
//        return Karate.run("JBSUIDemoStart").relativeTo(getClass());
        return Karate.run("classpath:examples/users/ui")
//                .tags("@HAArticleLinksOutline")
//                .tags("@ArticleOutline")
                .tags("@ArticleLinks")
                .relativeTo(getClass());
    }
}
