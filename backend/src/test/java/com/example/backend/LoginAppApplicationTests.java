import com.example.backend.LoginAppApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
@SpringBootTest(classes = LoginAppApplication.class, properties = {
    "app.upload.dir=uploads",
    "app.base.url=http://localhost:8080",
    "spring.data.mongodb.uri=mongodb://test-uri/testdb",
    "spring.mail.host=smtp.gmail.com",
    "spring.mail.port=587",
    "spring.mail.username=your-email@gmail.com",
    "spring.mail.password=your-app-password",
    "openai.api.key=sk-proj-...",
    "openai.api.url=https://api.openai.com/v1/chat/completions"
})
class LoginAppApplicationTests {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:4.4.2");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
        registry.add("app.upload.dir", () -> "uploads");
        registry.add("app.base.url", () -> "http://localhost:8080");
        registry.add("openai.api.key", () -> "test-api-key");
        registry.add("openai.api.url", () -> "https://api.openai.com/v1/chat/completions");
    }

    @Test
    void contextLoads() {
    }
}