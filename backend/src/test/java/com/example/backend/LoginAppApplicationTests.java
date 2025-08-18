package com.example.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;

@SpringBootTest(properties = {
    "app.upload.dir=uploads",
    "app.base.url=http://localhost:8080",
    "spring.data.mongodb.uri=mongodb://test-uri",
    "spring.mail.host=smtp.gmail.com",
    "spring.mail.port=587",
    "spring.mail.username=zedanmhmd41@gmail.com",
    "spring.mail.password=felz toxt qesq qyiz"
})
class LoginAppApplicationTests {

    @MockBean
    private JavaMailSender javaMailSender;

    @Test
    void contextLoads() {
    }

}