package examples.users;

import com.intuit.karate.junit5.Karate;

public class CallJavaRunner {
    @Karate.Test
    Karate testUsers() {
        return Karate.run("classpath:examples/users")
                .tags("@CallJavaClass")
                .relativeTo(getClass());
    }
}
