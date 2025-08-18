package com.example.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@TestPropertySource(properties = "app.upload.dir=uploads")

class LoginAppApplicationTests {

	@Test
	void contextLoads() {
	}

}
