package com.example.helpdesk.service;

import com.example.helpdesk.entite.*;
import com.example.helpdesk.exception.TicketNotFoundException;
import com.example.helpdesk.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
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

    public Ticket updateTicketStatus(Long id, Ticket newStatus) throws Exception {
        Optional<Ticket> optionalTicket = ticketRepository.findById(id);

        if (optionalTicket.isPresent()) {
            Ticket ticket = optionalTicket.get();

            ticket.setStatus(newStatus.getStatus());
            return ticketRepository.save(ticket);
        } else {
            throw new Exception("Ticket not found");
        }
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
    @Autowired
    private UserService userService;


    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private UserRepository userRepository;

    // Récupérer les tickets assignés à un username
    public List<Ticket> getTicketsAssignedToUser(String username) {
        User user = userService.getUserByUsername(username);
        return ticketRepository.findByCreatedBy(user);
    }

    //Récupère les tickets pour"chef de service SI " un département et statut donnés
    public List<Ticket> getTicketsByDepartmentAndStatus(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Département non trouvé"));
        return ticketRepository.findByDepartmentAndStatus(department, TicketStatus.SI_SERVICE);
    }

    //Récupère les tickets pour"chef de service validation " un département et statut donnés
    public List<Ticket> getTicketsByDepartmentAndStatus_SV(Long departmentId,Long userId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Département non trouvé"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User non trouvé"));
        return ticketRepository.findByDepartmentAndStatusOrCreatedBy(department, TicketStatus.SERVICE_VALIDATED,user);
    }

    //Récupère les tickets pour"chef de service validation " un département et statut donnés
    public List<Ticket> getTicketsByDepartmentAndStatus_DV(Long departmentId,Long userId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Département non trouvé"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User non trouvé"));
        return ticketRepository.findByDepartmentAndStatusOrCreatedBy(department, TicketStatus.DEPT_VALIDATED,user);
    }

    //Récupère les tickets pour"chef de service validation " un département et statut donnés
    public List<Ticket> getTicketsByDepartmentAndStatus_SI_DV() {

        return ticketRepository.findByStatus(TicketStatus.SI_DEPT_VALIDATED);
    }
//récupérer tous les tickets ayant l'un des statuts SI_SERVICE, EN_COURS ou RESOLU
    public List<Ticket> getTicketsByStatus() {
        List<TicketStatus> desiredStatuses = Arrays.asList(
                TicketStatus.SI_SERVICE,
                TicketStatus.EN_COURS,
                TicketStatus.RESOLU
        );

        return ticketRepository.findByStatusIn(desiredStatuses);
    }



        //recupere par role
    // === Méthodes par rôle ===
//    public List<Ticket> getTicketsForCurrentUser() {
//       // String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByUsername(username);
//        return ticketRepository.findByCreatedBy(user);
//    }
//
//    public List<Ticket> getTicketsForServiceChief() {
//        // Supposons que l'utilisateur a un département associé
//        User currentUser = getCurrentUser();
//        return ticketRepository.findByDepartmentAndStatus(
//                currentUser.getDepartment(),
//                Status.CREATED
//        );
//    }
//
//    public List<Ticket> getTicketsForDeptChief() {
//        User currentUser = getCurrentUser();
//        return ticketRepository.findByDepartmentAndStatus(
//                currentUser.getDepartment(),
//                Status.SERVICE_VALIDATED
//        );
//    }
//
//    public List<Ticket> getTicketsForSIAdmin() {
//        return ticketRepository.findByStatusIn(
//                Arrays.asList(Status.DEPT_VALIDATED, Status.SI_ASSIGNED)
//        );
//    }
//
//    // Méthode utilitaire pour récupérer l'utilisateur connecté
//    private User getCurrentUser() {
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        return userRepository.findByUsername(username);
//    }




}