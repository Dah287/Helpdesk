package com.example.helpdesk.service;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.property.*;
import org.apache.commons.io.IOUtils;

import com.example.helpdesk.entite.*;
import com.example.helpdesk.exception.TicketNotFoundException;
import com.example.helpdesk.repository.*;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

//
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

//
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;


//

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.layout.element.Image;


import com.itextpdf.kernel.pdf.*;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.layout.property.TextAlignment;
import java.io.ByteArrayOutputStream;
@Service
@Transactional
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ServiceRepository serviceRepository;

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

    // update dateValidationService
    public Ticket updatedateValidationService(Long id, Date newStatus) throws Exception {
        Optional<Ticket> optionalTicket = ticketRepository.findById(id);

        if (optionalTicket.isPresent()) {
            Ticket ticket = optionalTicket.get();

            ticket.setDateValidationService(newStatus);
            return ticketRepository.save(ticket);
        } else {
            throw new Exception("Ticket not found");
        }
    }

    // update dateValidationDep
    public Ticket updatedateValidationDep(Long id, Date newStatus) throws Exception {
        Optional<Ticket> optionalTicket = ticketRepository.findById(id);

        if (optionalTicket.isPresent()) {
            Ticket ticket = optionalTicket.get();

            ticket.setDateValidationDep(newStatus);
            return ticketRepository.save(ticket);
        } else {
            throw new Exception("Ticket not found");
        }
    }

    // update dateValidationDep
    public Ticket updatedateValidationSI(Long id, Date newStatus) throws Exception {
        Optional<Ticket> optionalTicket = ticketRepository.findById(id);

        if (optionalTicket.isPresent()) {
            Ticket ticket = optionalTicket.get();

            ticket.setDateResoluSI(newStatus);
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
    public List<Ticket> getTicketsByDepartmentAndStatus_SV2(Long departmentId,Long serviceId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Département non trouvé"));

        com.example.helpdesk.entite.Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service non trouvé"));

//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User non trouvé"));
        return ticketRepository.findByDepartmentAndStatusOrService(department, TicketStatus.SERVICE_VALIDATED,service);
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
    public List<Ticket> getTicketsByDepartmentAndStatus_DV2(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Département non trouvé"));


        return ticketRepository.findByDepartmentAndStatusOrDepartment(department, TicketStatus.DEPT_VALIDATED,department);
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
                TicketStatus.RESOLU,
                TicketStatus.TRANS_SM
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




    public byte[] generatePdfReport(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc, PageSize.A4);
        document.setMargins(20, 20, 20, 20);

        try {
            // Chargement de la police arabe
            InputStream fontStream = getClass().getClassLoader().getResourceAsStream("fonts/Amiri-Regular.ttf");
            PdfFont arabicFont = PdfFontFactory.createFont(IOUtils.toByteArray(fontStream), PdfEncodings.IDENTITY_H, true);

            // --- En-tête avec Logos ---
            Table headerTable = new Table(UnitValue.createPercentArray(new float[]{90, 10})).useAllAvailableWidth();


            // Logo Génération Green (coin supérieur gauche) - Vous pouvez adapter la logique similaire si besoin
            InputStream logoGreenStream = getClass().getClassLoader().getResourceAsStream("images/logo_left.png"); // Chemin vers votre image
            if (logoGreenStream != null) {
                ImageData logoGreenData = ImageDataFactory.create(IOUtils.toByteArray(logoGreenStream));
                Image logoGreen = new Image(logoGreenData);
                logoGreen.scaleToFit(70, 70);
                Cell logoGreenCell = new Cell().add(logoGreen)
                        .setBorder(Border.NO_BORDER)
                        .setVerticalAlignment(VerticalAlignment.TOP)
                        .setHorizontalAlignment(HorizontalAlignment.LEFT);
                headerTable.addCell(logoGreenCell);
            } else {
                headerTable.addCell(new Cell().add(new Paragraph("")).setBorder(Border.NO_BORDER));
            }


            // Logo ORMVAD (coin supérieur droit)
            InputStream logoOrmvadStream = getClass().getClassLoader().getResourceAsStream("images/logo_right.jpg"); // Chemin vers votre image
            if (logoOrmvadStream != null) {
                ImageData logoOrmvadData = ImageDataFactory.create(IOUtils.toByteArray(logoOrmvadStream));
                Image logoOrmvad = new Image(logoOrmvadData);
                logoOrmvad.scaleToFit(110, 110); // Ajustez la taille si nécessaire
                Cell logoOrmvadCell = new Cell().add(logoOrmvad)
                        .setBorder(Border.NO_BORDER)
                        .setVerticalAlignment(VerticalAlignment.TOP)
                        .setHorizontalAlignment(HorizontalAlignment.RIGHT);
                headerTable.addCell(logoOrmvadCell);
            } else {
                headerTable.addCell(new Cell().add(new Paragraph("")).setBorder(Border.NO_BORDER)); // Cellule vide si le logo n'est pas trouvé
            }


            document.add(headerTable);


            document.add(new Paragraph("OFFICE RÉGIONAL DE MISE EN VALEUR AGRICOLE DES DOUKKALA")
                    .setTextAlignment(TextAlignment.CENTER).setFontSize(10));

            document.add(new Paragraph("\n"));

            // Récupération du type de demande
            String typeDemande = String.valueOf(ticket.getTypeDemande());

            // Titre conditionnel
            if (typeDemande != null && typeDemande.equalsIgnoreCase("maintenance")) {
                document.add(new Paragraph("RAPPORT DE RÉPARATION")
                        .setTextAlignment(TextAlignment.CENTER)
                        .setBold()
                        .setFontSize(14)
                        .setMarginBottom(10));
            } else {
                document.add(new Paragraph("RAPPORT D'INTERVENTION")
                        .setTextAlignment(TextAlignment.CENTER)
                        .setBold()
                        .setFontSize(14)
                        .setMarginBottom(10));
            }

            document.add(new Paragraph("\n"));

            // === SECTION : Informations Générales ===
            document.add(new Paragraph("Informations Générales").setBold().setFontSize(14).setUnderline().setMarginBottom(10));
            document.add(new Paragraph("Numéro de ticket : " + ticket.getId()));

            if (typeDemande != null && typeDemande.equalsIgnoreCase("maintenance")) {
                document.add(new Paragraph("Marque : " + ticket.getBrand()));
                document.add(new Paragraph("Type d'équipement : " + ticket.getEquipmentType()));
                document.add(new Paragraph("Numéro de série : " + ticket.getSerialNumber()));
            }

            document.add(new Paragraph("Description du problème : " + ticket.getProblemDescription()));
            document.add(new Paragraph("Type de demande : " + typeDemande));
            document.add(new Paragraph("Priorité : " + ticket.getPriority()));

            // === SECTION : Localisation ===
            document.add(new Paragraph("\nLocalisation").setBold().setFontSize(14).setUnderline().setMarginBottom(10));
            document.add(new Paragraph("Bureau : " + ticket.getBureau().getBureau()));
            document.add(new Paragraph("Service : " + ticket.getService().getName()));
            document.add(new Paragraph("Département : " + ticket.getDepartment().getName()));

            // === SECTION : Détails de Création ===
            document.add(new Paragraph("\nDétails de Création").setBold().setFontSize(14).setUnderline().setMarginBottom(10));
            document.add(new Paragraph("Créé par : " + ticket.getCreatedBy().getUsername()));
            document.add(new Paragraph("Date de création : " + ticket.getCreatedAt()));
            document.add(new Paragraph("Dernière modification : " + ticket.getUpdatedAt()));

            // === SECTION : Workflow de Validation ===
            document.add(new Paragraph("\nWorkflow de Validation").setBold().setFontSize(14).setUnderline().setMarginBottom(10));
            document.add(new Paragraph("Chef de Service : Validé le " + ticket.getDateValidationService()));
            document.add(new Paragraph("Chef de Département : Validé le " + ticket.getDateValidationDep()));
            document.add(new Paragraph("Service Informatique : Résolu le " + ticket.getDateResoluSI()));

            // === SECTION : Résolution ===
            document.add(new Paragraph("\nRésolution").setBold().setFontSize(14).setUnderline().setMarginBottom(10));
            document.add(new Paragraph("Problème trouvé : " + (ticket.getFoundProblem() != null ? ticket.getFoundProblem() : "Non renseigné")));
            document.add(new Paragraph("Solution effectuée : " + (ticket.getAppliedSolution() != null ? ticket.getAppliedSolution() : "Non renseignée")));

        } catch (Exception e) {
            e.printStackTrace();
        }

        document.close();
        return out.toByteArray();
    }
}