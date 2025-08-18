package com.example.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootTest(properties = {
    // Application settings
    "spring.application.name=loginApp",
    "server.address=0.0.0.0",
    "spring.main.web-application-type=servlet",
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration",
    
    // Logging settings
    "logging.level.org.springframework.security=DEBUG",
    "logging.level.org.springframework.web=DEBUG",
    
    // Mail settings
    "spring.mail.host=smtp.gmail.com",
    "spring.mail.port=587",
    "spring.mail.username=test-email@gmail.com",
    "spring.mail.password=test-password",
    "spring.mail.properties.mail.smtp.auth=true",
    "spring.mail.properties.mail.smtp.starttls.enable=true",
    
    // OpenAI settings (using test values)
    "openai.api.key=test-api-key",
    "openai.api.url=https://api.openai.com/v1/chat/completions",
    
    // File upload settings
    "app.upload.dir=uploads",
    "app.base.url=http://localhost:8080",
    "spring.servlet.multipart.max-file-size=10MB",
    "spring.servlet.multipart.max-request-size=10MB",
    
    // MongoDB test configuration (using embedded or mock)
    "spring.data.mongodb.uri=mongodb://localhost/testdb"
})
class LoginAppApplicationTests {

    @MockBean
    private JavaMailSender javaMailSender;

    @MockBean
    private MongoTemplate mongoTemplate;

    @Test
    void contextLoads() {
        // This test will verify that the Spring application context loads successfully
        // with all the configured properties and mocked beans
    }
}