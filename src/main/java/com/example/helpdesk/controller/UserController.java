package com.example.helpdesk.controller;


import com.example.helpdesk.entite.*;
import com.example.helpdesk.repository.BureauRepository;
import com.example.helpdesk.repository.DepartmentRepository;
import com.example.helpdesk.repository.ServiceRepository;
import com.example.helpdesk.repository.UserRepository;
import com.example.helpdesk.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.1.34:3000"}, maxAge = 3600, allowCredentials = "true")
public class UserController {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BureauRepository bureauRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private DepartmentRepository departmentRepository;


    @Autowired
    private UserService userService;
    // Récupérer tous les tickets


    @GetMapping("/bureaux")
    public List <Bureau> getAllB() {
        return bureauRepository.findAll();
    }

    @GetMapping("/services")
    public List <Service> getAllS() {
        return serviceRepository.findAll();
    }
    @GetMapping("/departments")
    public List <Department> getAllD() {
        return departmentRepository.findAll();
    }
    @GetMapping
    public List <User> getAllUser() {
        return userRepository.findAll();
    }
//    @GetMapping
//    public ResponseEntity <List<User>> getAllUsers() {
//        return ResponseEntity.ok(userService.getAllUsers());
//    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable  Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return ResponseEntity.ok(userService.updateUser(id, userDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable Role  role) {
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }

}
