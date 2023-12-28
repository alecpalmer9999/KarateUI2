package examples;

import com.intuit.karate.junit5.Karate;

class APIRunner {
    
    @Karate.Test
    Karate testUsers() {
//        return Karate.run("JBSUIDemoStart").relativeTo(getClass());
        return Karate.run("classpath:examples/users")
                .tags("@PostExample")
//                .tags("@GetJiraIssues")
//                .tags("@ConditionalIfLoopAPI")
//                .tags("@UsingJsonPath")
//                .tags("@PostScenarioOutline1")
//                 .tags("@PostExample, @PostScenarioOutline1, @PostFromCSVFile")
                .relativeTo(getClass());
    }
}
