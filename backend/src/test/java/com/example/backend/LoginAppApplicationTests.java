package com.example.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "app.upload.dir=uploads",
    "app.base.url=http://localhost:8080"
})
class LoginAppApplicationTests {

	@Test
	void contextLoads() {
	}

}
