package com.example.helpdesk.service;

import com.example.helpdesk.controller.ChangePasswordRequest;
import com.example.helpdesk.entite.Role;
import com.example.helpdesk.entite.User;
import com.example.helpdesk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String changePassword(ChangePasswordRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifie ancien mot de passe (encodé ou en clair)
        boolean matches = user.getPassword().equals(request.getOldPassword())
                || passwordEncoder.matches(request.getOldPassword(), user.getPassword());

        if (!matches) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }

        // Encode le nouveau mot de passe
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setFirstLogin(false);

        userRepository.save(user);
        return "Mot de passe changé avec succès";
    }
    public User  getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public User createUser(User user) {
        // Encodage du mot de passe au moment de la création
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        user.setPrenom(userDetails.getPrenom());
        user.setNom(userDetails.getNom());
        user.setUsername(userDetails.getUsername());
        user.setMatricule(userDetails.getMatricule());
        user.setRole(userDetails.getRole());

        user.setDepartment(userDetails.getDepartment());
        user.setService(userDetails.getService());
        user.setBureau(userDetails.getBureau());


        // Encodage si mot de passe changé
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            if (!userDetails.getPassword().startsWith("$2a$")) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            } else {
                user.setPassword(userDetails.getPassword());
            }
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }
}
