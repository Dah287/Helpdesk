package com.example.helpdesk.service;

import com.example.helpdesk.entite.*;
import com.example.helpdesk.exception.TicketNotFoundException;
import com.example.helpdesk.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
@Service
@Transactional
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    // Créer un nouveau ticket
    public Ticket createTicket(Ticket ticket) {
        // Vous pouvez ajouter une logique métier ici avant la sauvegarde
        return ticketRepository.save(ticket);
    }

    // Récupérer tous les tickets
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Récupérer un ticket par son ID
    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    // Mettre à jour un ticket
    public Ticket updateTicket(Long id, Ticket ticketDetails) {
        Ticket existingTicket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé avec l'ID: " + id));

        // Mise à jour des champs
        existingTicket.setSerialNumber(ticketDetails.getSerialNumber());
        existingTicket.setEquipmentType(ticketDetails.getEquipmentType());
        existingTicket.setBrand(ticketDetails.getBrand());
        existingTicket.setProblemDescription(ticketDetails.getProblemDescription());
        existingTicket.setStatus(ticketDetails.getStatus());
        existingTicket.setPriority(ticketDetails.getPriority());
        existingTicket.setBureau(ticketDetails.getBureau());
        existingTicket.setDepartment(ticketDetails.getDepartment());
        existingTicket.setService(ticketDetails.getService());

        return ticketRepository.save(existingTicket);
    }

    // Supprimer un ticket
    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new RuntimeException("Ticket non trouvé avec l'ID: " + id);
        }
        ticketRepository.deleteById(id);
    }

    // Méthodes spécifiques
    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }

    public List<Ticket> getTicketsByPriority(Priority priority) {
        return ticketRepository.findByPriority(priority);
    }

    public List<Ticket> getTicketsByCreator(User createdBy) {
        return ticketRepository.findByCreatedBy(createdBy);
    }

    // Méthode pour changer le statut d'un ticket
    public Ticket changeTicketStatus(Long id, TicketStatus newStatus) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        ticket.setStatus(newStatus);
        return ticketRepository.save(ticket);
    }
}