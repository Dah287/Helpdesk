package com.example.helpdesk.service;

import com.example.helpdesk.entite.Role;
import com.example.helpdesk.entite.User;
import com.example.helpdesk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository  userRepository;

    public User  getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }



    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() ->
                new RuntimeException("User not found with id: " + id));
    }

    public User createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByMatricule(user.getMatricule())) {
            throw new RuntimeException("Matricule is already in use!");
        }

        // Encode password before saving
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id).orElseThrow(() ->
                new RuntimeException("User not found with id: " + id));

        if (!user.getUsername().equals(userDetails.getUsername())) {
            if (userRepository.existsByUsername(userDetails.getUsername())) {
                throw new RuntimeException("Username is already taken!");
            }
        }
        user.setPrenom(userDetails.getPrenom());
        user.setNom(userDetails.getNom());
        user.setUsername(userDetails.getUsername());
        user.setMatricule(userDetails.getMatricule());
        user.setRole(userDetails.getRole());
        user.setPassword(userDetails.getPassword());
        // Update password only if it's provided
//        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
//            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
//        }

        // Update relationships
        user.setBureau(userDetails.getBureau());
        user.setDepartment(userDetails.getDepartment());
        user.setService(userDetails.getService());

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() ->
                new RuntimeException("User not found with id: " + id));

        userRepository.delete(user);
    }

    public List <User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

}
