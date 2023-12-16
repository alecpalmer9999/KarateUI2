package examples.users;

import com.intuit.karate.junit5.Karate;

class UsersRunner {
    
    @Karate.Test
    Karate testUsers() {
//        return Karate.run("JBSUIDemoStart").relativeTo(getClass());
        return Karate.run("classpath:examples/users")
                .tags("@SearchKeyword, @SearchSuggestion, @TOC")
                .relativeTo(getClass());
    }
}
