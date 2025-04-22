package com.example.helpdesk.controller;


import com.example.helpdesk.entite.User;
import com.example.helpdesk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {


    @Autowired
    private UserRepository userRepository;


    // Récupérer tous les tickets
    @GetMapping
    public List <User> getAllUser() {
        return userRepository.findAll();
    }
}
