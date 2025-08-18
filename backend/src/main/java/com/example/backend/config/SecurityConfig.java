// src/main/java/com/example/backend/config/SecurityConfig.java
package com.example.backend.config;

import com.example.backend.common.security.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/api/register", "/api/login").permitAll()
                        .requestMatchers("/api/auth/user").authenticated()

                        // 🆕 REPORT GENERATION - Admin only (since it can access all system data)
                        .requestMatchers("/api/reports/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/chat").authenticated()


                        // Admin-only endpoints for courses
                        .requestMatchers(HttpMethod.POST, "/api/courses").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/courses/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/courses/*/enroll").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/courses/*/enrollments").hasAuthority("ROLE_ADMIN")

                        // Admin-only user and department management
                        .requestMatchers(HttpMethod.POST, "/api/users/admin-create").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users/**").hasAuthority("ROLE_ADMIN")

                        // 🔧 FIXED: Allow all authenticated users to fetch user lists by role
                        // This enables students to see admin/lecturer lists when sending messages
                        .requestMatchers(HttpMethod.GET, "/api/users/role/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/users/by-ids").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/departments/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/profile-analytics/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/exams/**").authenticated()

                        // Profile and search endpoints accessible to all authenticated users
                        .requestMatchers("/api/users/profile/**").authenticated()
                        .requestMatchers("/api/users/search").authenticated()

                        // Profile and search endpoints accessible to all authenticated users
                        .requestMatchers("/api/users/profile/**").authenticated() // Keep this if you have other profile endpoints
                        .requestMatchers("/api/users/search").authenticated() // Keep this if you have other search endpoints

                        // Add these new rules for the specific profile endpoints
                        .requestMatchers(HttpMethod.GET, "/api/students/**").authenticated() // Allow all authenticated users to view student profiles
                        .requestMatchers(HttpMethod.GET, "/api/lecturers/**").authenticated() // Allow all authenticated users to view lecturer profiles

                        // Read access to courses - allow all authenticated users, but admin operations are restricted above
                        .requestMatchers(HttpMethod.GET, "/api/courses/**").authenticated()
                        .requestMatchers("/api/messages/**").authenticated()
                        .requestMatchers("/api/calendar/**").authenticated()

                        .requestMatchers("/api/cv/**").authenticated()
                        .requestMatchers("/api/resources/**").authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/grades").hasAnyAuthority("ROLE_ADMIN", "ROLE_LECTURER")
                        .requestMatchers(HttpMethod.PUT, "/api/grades/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_LECTURER")
                        .requestMatchers(HttpMethod.DELETE, "/api/grades/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_LECTURER")
                        .requestMatchers(HttpMethod.GET, "/api/grades/**").authenticated()

                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http, BCryptPasswordEncoder bCryptPasswordEncoder)
            throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOrigin("http://13.49.225.86:3000");
        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}