package com.example.helpdesk.controller;

import com.example.helpdesk.config.JwtUtil;
import com.example.helpdesk.entite.User;
import com.example.helpdesk.repository.UserRepository;
import com.example.helpdesk.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.1.14:3000"},
        maxAge = 3600, allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 🔐 LOGIN sécurisé
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByMatricule(request.getMatricule());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(new ErrorResponse("Matricule ou mot de passe incorrect"));
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(new ErrorResponse("Matricule ou mot de passe incorrect"));
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    // 🔁 Changement de mot de passe
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            String message = userService.changePassword(request);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ================= CLASSES INTERNES =================

    @Data
    static class LoginRequest {
        private String matricule;
        private String password;

        public String getMatricule() {
            return matricule;
        }

        public void setMatricule(String matricule) {
            this.matricule = matricule;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    @Data
    static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }

    static class AuthResponse {
        private String token;
        private User user;

        public AuthResponse(String token, User user) {
            this.token = token;
            this.user = user;
        }

        public String getToken() {
            return token;
        }

        public User getUser() {
            return user;
        }
    }
}
