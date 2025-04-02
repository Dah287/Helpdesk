package com.example.helpdesk.repository;

import com.example.helpdesk.entite.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByRole(String role); // Pour trouver les techniciens
}
