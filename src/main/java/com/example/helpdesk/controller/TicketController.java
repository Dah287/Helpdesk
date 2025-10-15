package com.example.helpdesk.controller;

import com.example.helpdesk.entite.*;
import com.example.helpdesk.repository.TicketRepository;
import com.example.helpdesk.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.1.14:3000"}, maxAge = 3600, allowCredentials = "true")
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


    // Endpoints spécifiques et id
    @GetMapping("/status/{status}/{username}")
    public ResponseEntity<List<Ticket>> getTicketsByStatus1(@PathVariable TicketStatus status,@PathVariable String username) {
        return ResponseEntity.ok(ticketService.getTicketsByStatus1(status,username));
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


    @PutMapping("/{id}/date-validate-service")
    public ResponseEntity<Ticket> updateDateValidationService(@PathVariable Long id) {
        try {
            Ticket ticket = ticketService.updatedateValidationService(id, new Date());
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{id}/date-validate-bureau")
    public ResponseEntity<Ticket> updateDateValidationBureau(@PathVariable Long id) {
        try {
            Ticket ticket = ticketService.updatedateValidationBureau(id, new Date());
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{id}/date-validate-dep")
    public ResponseEntity<Ticket> updatedateValidationDep(@PathVariable Long id) {
        try {
            Ticket ticket = ticketService.updatedateValidationDep(id, new Date());
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{id}/date-validate-si")
    public ResponseEntity<Ticket> updatedateValidationSI(@PathVariable Long id) {
        try {
            Ticket ticket = ticketService.updatedateValidationSI(id, new Date());
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
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
    //2
    //Récupère2 les tickets pour un département et statut donnés
    @GetMapping("/tickets-chef-service-validation2/{departmentId}/{serviceId}")
    public List<Ticket> getTicketsByDeptAndStatus_SV2(
            @PathVariable Long departmentId,
            @PathVariable Long serviceId) {
        return ticketService.getTicketsByDepartmentAndStatus_SV2(departmentId,serviceId);
    }
    //Récupère2 les tickets pour un département et statut donnés
    @GetMapping("/tickets-chef-bureau-validation2/{departmentId}/{bureauId}")
    public List<Ticket> getTicketsByDeptAndStatus_BV2(
            @PathVariable Long departmentId,
            @PathVariable Long bureauId) {
        return ticketService.getTicketsByDepartmentAndStatus_BV2(departmentId,bureauId);
    }
    //Récupère les tickets pour un département et statut donnés
    @GetMapping("/tickets-chef-Dep-validation/{departmentId}/{userId}")
    public List<Ticket> getTicketsByDeptAndStatus_DV(
            @PathVariable Long departmentId,
            @PathVariable Long userId) {
        return ticketService.getTicketsByDepartmentAndStatus_DV(departmentId,userId);
    }
    //2
    //Récupère les tickets pour un département et statut donnés2
    @GetMapping("/tickets-chef-Dep-validation2/{departmentId}")
    public List<Ticket> getTicketsByDeptAndStatus_DV2(
            @PathVariable Long departmentId) {
        return ticketService.getTicketsByDepartmentAndStatus_DV2(departmentId);
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
        ticket.setStatus(TicketStatus.SI_SERVICE);
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    // validation service
    @PutMapping("/{id}/v-bureau")
    public ResponseEntity<Ticket> validationBureau(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setStatus(TicketStatus.SI_SERVICE);
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
    //rapport
    @GetMapping("/{ticketId}/rapport")
    public ResponseEntity<byte[]> generateTicketReport(@PathVariable Long ticketId) throws MalformedURLException {
        byte[] pdfBytes = ticketService.generatePdfReport(ticketId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "rapport-ticket-" + ticketId + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @PutMapping("/updateTicketFields/{id}")
    public ResponseEntity<Ticket> updateTicketFields(
            @PathVariable Long id,
            @RequestBody Ticket updatedFields) {

        Optional <Ticket> optionalTicket = ticketRepository.findById(id);
        if (optionalTicket.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Ticket ticket = optionalTicket.get();

        // Mise à jour uniquement des champs nécessaires
        ticket.setFoundProblem(updatedFields.getFoundProblem());
        ticket.setAppliedSolution(updatedFields.getAppliedSolution());
        Ticket savedTicket = ticketRepository.save(ticket);
        return ResponseEntity.ok(savedTicket);
    }




}