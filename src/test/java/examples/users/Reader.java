package examples.users;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;

public class Reader {

    public static String returnMessage() {

        return "This is a message returned from the Reader java class";
    }
    public static int returnsSum(int x, int y) {
        return x + y;
    }

    public static void writeToFIle(String fileName, String fileContent) {
        File file = new File(fileName);
        try {
            Writer fileWriter = new FileWriter(file); {
                fileWriter.write(fileContent);
            }
        } catch (IOException e) {
//            throw new RuntimeException(e);
            e.printStackTrace();
        }
    }
}
