package examples;

import com.intuit.karate.junit5.Karate;

class UsersRunner {
    
    @Karate.Test
    Karate testUsers() {
//        System.setProperty("karate.env", "Prod");  YOU CAN SET ENV HERE, OR BELOW....
//        return Karate.run("JBSUIDemoStart").relativeTo(getClass());
        return Karate.run("classpath:examples/users").karateEnv("Stag")
                .outputCucumberJson(true)
//                .tags("@3D4M")
//                .tags("@ArticleOutline")
//                .tags("@ArticleLinks")
//                .tags("@ValidateConfig")
//                .tags("@BrowserActions")
//                .tags("@DimensionsAndPosition")
//                .tags("@HooksExample")
//                .tags("@Shib")
//                .tags("@DropDown")
//                .tags("@Alerts")
//                .tags("@frames")
//                .tags("@TextAndAttribute")
//                .tags("@FormValue")
//                .tags("@SwitchWindows")
//                .tags("@FileUpload")
                .tags("@BackgroundExample")
                .relativeTo(getClass());
    }
}
