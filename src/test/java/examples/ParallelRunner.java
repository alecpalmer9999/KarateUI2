package examples;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import net.masterthought.cucumber.Configuration;
import net.masterthought.cucumber.ReportBuilder;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class ParallelRunner {

    @Test
    void testParallel() {
        Results results = Runner.path("classpath:examples/users")
                .outputCucumberJson(true)
                .karateEnv("Prod")
                .tags("@ArticleLinks")
                .parallel(1);
        generateReport(results.getReportDir());
        assertTrue(results.getFailCount() == 0, results.getErrorMessages());
    }

    public static void generateReport(String karateOutputPath) {
        Collection<File> jsonFiles = FileUtils.listFiles(new File(karateOutputPath), new String[] {"json"}, true);
        List<String> jsonPaths = new ArrayList<>(jsonFiles.size());
        jsonFiles.forEach(file -> jsonPaths.add(file.getAbsolutePath()));
        Configuration config = new Configuration(new File("target"), "demo");
        ReportBuilder reportBuilder = new ReportBuilder(jsonPaths, config);
        reportBuilder.generateReports();
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
