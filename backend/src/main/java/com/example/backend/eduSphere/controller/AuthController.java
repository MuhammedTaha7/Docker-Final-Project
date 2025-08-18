package com.example.backend.eduSphere.controller;

import com.example.backend.eduSphere.dto.request.LoginRequest;
import com.example.backend.eduSphere.dto.request.RegisterRequest;
import com.example.backend.eduSphere.dto.response.AuthResponse;
import com.example.backend.eduSphere.dto.response.LoginResponse;
import com.example.backend.eduSphere.service.UserService;
import com.example.backend.common.security.JwtUtil;
import com.example.backend.eduSphere.entity.UserEntity;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        userService.registerUser(registerRequest);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {

        LoginResponse loginResponse = userService.authenticateUser(loginRequest);

        // ✅ Store JWT Token in HTTP-only Cookie
        Cookie jwtCookie = new Cookie("jwtToken", loginResponse.getToken());
        jwtCookie.setHttpOnly(true); // Prevent JavaScript access
        jwtCookie.setSecure(false);  // Allow use on localhost (should be true for production)
        jwtCookie.setPath("/");      // Available across the app
        jwtCookie.setMaxAge(7 * 24 * 60 * 60); // Expires in 7 days
        response.addCookie(jwtCookie);

        return ResponseEntity.ok("Login Successful");
    }

    @GetMapping("/auth/user")
    public ResponseEntity<AuthResponse> getUserData(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        try {
            // --- FIX: Get the full UserEntity object directly from the principal ---
            UserEntity user = (UserEntity) authentication.getPrincipal();

            return ResponseEntity.ok(
                    AuthResponse.builder()
                            .id(user.getId()) // Use the getter from the object
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .role(user.getRole())
                            .name(user.getName())
                            .profilePic(user.getProfilePic())
                            .build()
            );
        } catch (Exception e) {
            System.out.println("❌ Error getting user data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        // ✅ Remove JWT cookie
        Cookie jwtCookie = new Cookie("jwtToken", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false); // Allow localhost
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0); // Expire immediately
        response.addCookie(jwtCookie);

        return ResponseEntity.ok("Logged out successfully");
    }
}