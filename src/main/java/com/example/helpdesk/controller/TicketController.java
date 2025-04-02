package com.example.helpdesk.controller;

import com.example.helpdesk.entite.*;
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
    }
}