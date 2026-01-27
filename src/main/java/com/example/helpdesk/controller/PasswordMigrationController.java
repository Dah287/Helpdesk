package com.example.helpdesk.controller;

import com.example.helpdesk.entite.User;
import com.example.helpdesk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class PasswordMigrationController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/migrate-passwords")
    public String migratePasswords() {
        List<User> users = userRepository.findAll();
        int count = 0;

        for (User user : users) {
            String pwd = user.getPassword();

            // Vérifie si déjà encodé (BCrypt commence par $2a$ ou $2b$)
            if (!pwd.startsWith("$2a$") && !pwd.startsWith("$2b$")) {
                user.setPassword(passwordEncoder.encode(pwd));
                userRepository.save(user);
                count++;
            }
        }

        return count + " mots de passe encodés avec succès.";
    }
}

