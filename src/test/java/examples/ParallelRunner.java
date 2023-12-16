package examples.users;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import com.intuit.karate.junit5.Karate;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ParallelRunner {

    @Karate.Test
    public void testParallel() {
        Results results = Runner.path("classpath:examples")
                .tags("~@ignore")
                .parallel(5);
        assertEquals(0, results.getFailCount(), results.getErrorMessages());
    }
}
/*
public class TestParallel {
  @Test
  public void testParallel() {
   Results results =Runner.path("classpath:some/package")
                          .tags("~@ignore")
                          .parallel(5);
   assertTrue(results.getErrorMessages(),
              results.getFailCount() == 0);
  }
}
*/
