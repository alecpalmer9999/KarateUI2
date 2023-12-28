package examples.users.api;

import com.intuit.karate.junit5.Karate;

class APIRunner {
    
    @Karate.Test
    Karate testUsers() {
//        return Karate.run("JBSUIDemoStart").relativeTo(getClass());
        return Karate.run("classpath:examples/users/api")
//                .tags("@ExamplePost")
//                .tags("@ExampleGet")
                .tags("@ConditionalIfLoopAPI")
                .relativeTo(getClass());
    }
}
