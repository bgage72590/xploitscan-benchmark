// ObjectInputStream.readObject() on bytes sourced from a request body
// is the classic Java deserialization RCE. VC083 must fire.

import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import javax.servlet.http.HttpServletRequest;

public class Deserializer {
    public Object fromRequest(HttpServletRequest req) throws Exception {
        byte[] bytes = req.getInputStream().readAllBytes();
        ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(bytes));
        return ois.readObject();
    }
}
