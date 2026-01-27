package com.example.helpdesk.controller;

import com.example.helpdesk.entite.SolutionTechnique;
import com.example.helpdesk.service.SolutionTechniqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/config")
public class SolutionTechniqueController {

    @Autowired
    private SolutionTechniqueService service;

    // Obtenir toutes les solutions actives
    @GetMapping("/solutions")
    public ResponseEntity<List<String>> getSolutions() {
        List<String> solutions = service.findAllActiveLabels();
        return ResponseEntity.ok(solutions);
    }

    @PostMapping("/add-solutions")
    public ResponseEntity<List<String>> addSolution(@RequestBody Map<String, String> payload) {
        String libelle = payload.get("text");

        if (libelle == null || libelle.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        service.save(libelle.trim());
        return ResponseEntity.ok(service.findAllActiveLabels());
    }


    // Supprimer (désactiver) une solution
    @DeleteMapping("/solutions/{libelle}")
    public ResponseEntity<List<String>> deleteSolution(@PathVariable String libelle) {
        try {
            service.deactivateByLibelle(libelle);
            return ResponseEntity.ok(service.findAllActiveLabels());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}