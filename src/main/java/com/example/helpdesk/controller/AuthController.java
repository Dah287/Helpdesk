package com.example.helpdesk.controller;

import com.example.helpdesk.entite.User;
import com.example.helpdesk.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByMatricule(request.getMatricule());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401).body(new ErrorResponse("Matricule ou mot de passe incorrect"));
        }

        User user = optionalUser.get();

        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(401).body(new ErrorResponse("Matricule ou mot de passe incorrect"));
        }

//        // Retourner l'objet utilisateur avec les informations du département, service, et bureau
//        user.setDepartment(new SimpleId(user.getDepartment().getId()));
//        user.setService(new SimpleId(user.getService().getId()));
//        user.setBureau(new SimpleId(user.getBureau().getId()));

        return ResponseEntity.ok(user);
    }

    @Data
    public static class LoginRequest {
        private String matricule;
        private String password;

        // Getter pour matricule
        public String getMatricule() {
            return matricule;
        }

        // Setter pour matricule
        public void setMatricule(String matricule) {
            this.matricule = matricule;
        }

        // Getter pour password
        public String getPassword() {
            return password;
        }

        // Setter pour password
        public void setPassword(String password) {
            this.password = password;
        }
    }


    @Data

    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }
}
