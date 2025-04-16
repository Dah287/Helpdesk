package com.example.helpdesk.controller;

import com.example.helpdesk.entite.*;
import com.example.helpdesk.repository.TicketRepository;
import com.example.helpdesk.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;
    @Autowired
    private TicketRepository ticketRepository;
    // Créer un nouveau ticket
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        Ticket savedTicket = ticketService.createTicket(ticket);
        return ResponseEntity.ok(savedTicket);
    }
    // Récupérer tous les tickets
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @PutMapping("/updateTicketStatus/{id}")
    public ResponseEntity<?> updateTicketStatus(@PathVariable Long id, @RequestBody Ticket ticketRequest) {
        try {
            Ticket updatedTicket = ticketService.updateTicketStatus(id, ticketRequest);
            return ResponseEntity.ok(updatedTicket);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Ticket not found");
        }
    }

    // Récupérer un ticket par ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Mettre à jour un ticket
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket ticketDetails) {
        try {
            Ticket updatedTicket = ticketService.updateTicket(id, ticketDetails);
            return ResponseEntity.ok(updatedTicket);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    // processus de validation
    @PutMapping("/{id}/validate-service")
    public ResponseEntity<Ticket> validateByServiceChief(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setStatus(TicketStatus.SERVICE_VALIDATED);
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    @PutMapping("/{id}/validate-dept")
    public ResponseEntity<Ticket> validateByDeptChief(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setStatus(TicketStatus.DEPT_VALIDATED);
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    @PutMapping("/{id}/assign-si")
    public ResponseEntity<Ticket> assignToSI(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setStatus(TicketStatus.SI_SERVICE);
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Ticket> resolveBySIAdmin(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setStatus(TicketStatus.RESOLU);
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }
    // Supprimer un ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        try {
            ticketService.deleteTicket(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoints spécifiques
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Ticket>> getTicketsByStatus(@PathVariable TicketStatus status) {
        return ResponseEntity.ok(ticketService.getTicketsByStatus(status));
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Ticket>> getTicketsByPriority(@PathVariable Priority priority) {
        return ResponseEntity.ok(ticketService.getTicketsByPriority(priority));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus newStatus) {
        try {
            Ticket updatedTicket = ticketService.changeTicketStatus(id, newStatus);
            return ResponseEntity.ok(updatedTicket);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }



        // processus de validation

    }


    // Récupérer les tickets assignés à un username
    @GetMapping("/assigned-to/{username}")
    public List<Ticket> getTicketsAssignedToUser(@PathVariable String username) {
        return ticketService.getTicketsAssignedToUser(username);
    }
//Récupère les tickets pour un département et statut donnés
    @GetMapping("/tickets-chef-service/{departmentId}")
    public List<Ticket> getTicketsByDeptAndStatus(
            @PathVariable Long departmentId) {
        return ticketService.getTicketsByDepartmentAndStatus(departmentId);
    }
    //Récupère les tickets pour un département et statut donnés
    @GetMapping("/tickets-chef-service-validation/{departmentId}/{userId}")
    public List<Ticket> getTicketsByDeptAndStatus_SV(
            @PathVariable Long departmentId,
            @PathVariable Long userId) {
        return ticketService.getTicketsByDepartmentAndStatus_SV(departmentId,userId);
    }
    //Récupère les tickets pour un département et statut donnés
    @GetMapping("/tickets-chef-Dep-validation/{departmentId}/{userId}")
    public List<Ticket> getTicketsByDeptAndStatus_DV(
            @PathVariable Long departmentId,
            @PathVariable Long userId) {
        return ticketService.getTicketsByDepartmentAndStatus_DV(departmentId,userId);
    }
    //Récupère les tickets pour un département et statut donnés
    @GetMapping("/tickets-chef-Dep-SI")
    public List<Ticket> getTicketsByDeptAndStatus_SI_DV() {
        return ticketService.getTicketsByDepartmentAndStatus_SI_DV();
    }


    // validation service
    @PutMapping("/{id}/v-service")
    public ResponseEntity<Ticket> validationService(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setStatus(TicketStatus.DEPT_VALIDATED);
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    // validation Dep
    @PutMapping("/{id}/v-dep")
    public ResponseEntity<Ticket> validationDep(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setStatus(TicketStatus.SI_SERVICE);
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    // validation Dep
    @PutMapping("/{id}/v-si-dep")
    public ResponseEntity<Ticket> validationDepSI(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setStatus(TicketStatus.SI_SERVICE);
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    // Endpoint pour récupérer les tickets avec statuts SI_SERVICE, EN_COURS, RESOLU
    @GetMapping("/by-status")
    public List<Ticket> getTicketsByStatus() {
        return ticketService.getTicketsByStatus();
    }

}