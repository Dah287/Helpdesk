package com.example.helpdesk.service;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.Style;
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
import java.io.*;
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

    @Autowired
    private BureauRepository bureauRepository;

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

            ticket.setDateValidationBureau(newStatus);
            return ticketRepository.save(ticket);
        } else {
            throw new Exception("Ticket not found");
        }
    }

    // update dateValidationService
    public Ticket updatedateValidationBureau(Long id, Date newStatus) throws Exception {
        Optional<Ticket> optionalTicket = ticketRepository.findById(id);

        if (optionalTicket.isPresent()) {
            Ticket ticket = optionalTicket.get();

            ticket.setDateValidationBureau(newStatus);
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

    // Méthodes spécifiques status et username
    public List<Ticket> getTicketsByStatus1(TicketStatus status,String username) {
        User user = userService.getUserByUsername(username);
        return ticketRepository.findByStatusAndCreatedBy(status,user);
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

    //Récupère les tickets pour"chef de bureau validation " un département et statut donnés
    public List<Ticket> getTicketsByDepartmentAndStatus_BV2(Long departmentId,Long bureauId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Département non trouvé"));

        com.example.helpdesk.entite.Bureau bureau = bureauRepository.findById(bureauId)
                .orElseThrow(() -> new RuntimeException("bureau non trouvé"));

//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User non trouvé"));
        return ticketRepository.findByDepartmentAndStatusOrBureau(department, TicketStatus.BUREAU_VALIDATED, bureau);
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




//    public byte[] generatePdfReport(Long ticketId) {
//        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow();
//        ByteArrayOutputStream out = new ByteArrayOutputStream();
//        PdfWriter writer = new PdfWriter(out);
//        PdfDocument pdfDoc = new PdfDocument(writer);
//        Document document = new Document(pdfDoc, PageSize.A4);
//        document.setMargins(20, 20, 20, 20);
//
//        try {
//            // Chargement de la police arabe
//            InputStream fontStream = getClass().getClassLoader().getResourceAsStream("fonts/Amiri-Regular.ttf");
//            PdfFont arabicFont = PdfFontFactory.createFont(IOUtils.toByteArray(fontStream), PdfEncodings.IDENTITY_H, true);
//
//            // --- En-tête avec Logos ---
//            Table headerTable = new Table(UnitValue.createPercentArray(new float[]{90, 10})).useAllAvailableWidth();
//
//
//            // Logo Génération Green (coin supérieur gauche) - Vous pouvez adapter la logique similaire si besoin
//            InputStream logoGreenStream = getClass().getClassLoader().getResourceAsStream("images/logo_left.png"); // Chemin vers votre image
//            if (logoGreenStream != null) {
//                ImageData logoGreenData = ImageDataFactory.create(IOUtils.toByteArray(logoGreenStream));
//                Image logoGreen = new Image(logoGreenData);
//                logoGreen.scaleToFit(70, 70);
//                Cell logoGreenCell = new Cell().add(logoGreen)
//                        .setBorder(Border.NO_BORDER)
//                        .setVerticalAlignment(VerticalAlignment.TOP)
//                        .setHorizontalAlignment(HorizontalAlignment.LEFT);
//                headerTable.addCell(logoGreenCell);
//            } else {
//                headerTable.addCell(new Cell().add(new Paragraph("")).setBorder(Border.NO_BORDER));
//            }
//
//
//            // Logo ORMVAD (coin supérieur droit)
//            InputStream logoOrmvadStream = getClass().getClassLoader().getResourceAsStream("images/logo_right.jpg"); // Chemin vers votre image
//            if (logoOrmvadStream != null) {
//                ImageData logoOrmvadData = ImageDataFactory.create(IOUtils.toByteArray(logoOrmvadStream));
//                Image logoOrmvad = new Image(logoOrmvadData);
//                logoOrmvad.scaleToFit(110, 110); // Ajustez la taille si nécessaire
//                Cell logoOrmvadCell = new Cell().add(logoOrmvad)
//                        .setBorder(Border.NO_BORDER)
//                        .setVerticalAlignment(VerticalAlignment.TOP)
//                        .setHorizontalAlignment(HorizontalAlignment.RIGHT);
//                headerTable.addCell(logoOrmvadCell);
//            } else {
//                headerTable.addCell(new Cell().add(new Paragraph("")).setBorder(Border.NO_BORDER)); // Cellule vide si le logo n'est pas trouvé
//            }
//
//
//            document.add(headerTable);
//
//
//            document.add(new Paragraph("OFFICE RÉGIONAL DE MISE EN VALEUR AGRICOLE DES DOUKKALA")
//                    .setTextAlignment(TextAlignment.CENTER).setFontSize(10));
//
//            document.add(new Paragraph("\n"));
//
//            // Récupération du type de demande
//            String typeDemande = String.valueOf(ticket.getTypeDemande());
//
//            // Titre conditionnel
//            if (typeDemande != null && typeDemande.equalsIgnoreCase("maintenance")) {
//                document.add(new Paragraph("RAPPORT DE RÉPARATION")
//                        .setTextAlignment(TextAlignment.CENTER)
//                        .setBold()
//                        .setFontSize(14)
//                        .setMarginBottom(10));
//            } else {
//                document.add(new Paragraph("RAPPORT D'INTERVENTION")
//                        .setTextAlignment(TextAlignment.CENTER)
//                        .setBold()
//                        .setFontSize(14)
//                        .setMarginBottom(10));
//            }
//
//            document.add(new Paragraph("\n"));
//
//            // === SECTION : Informations Générales ===
//            document.add(new Paragraph("Informations Générales").setBold().setFontSize(14).setUnderline().setMarginBottom(10));
//            document.add(new Paragraph("Numéro de ticket : " + ticket.getId()));
//
//            if (typeDemande != null && typeDemande.equalsIgnoreCase("maintenance")) {
//                document.add(new Paragraph("Marque : " + ticket.getBrand()));
//                document.add(new Paragraph("Type d'équipement : " + ticket.getEquipmentType()));
//                document.add(new Paragraph("Numéro de série : " + ticket.getSerialNumber()));
//            }
//
//            document.add(new Paragraph("Description du problème : " + ticket.getProblemDescription()));
//            document.add(new Paragraph("Type de demande : " + typeDemande));
//            document.add(new Paragraph("Priorité : " + ticket.getPriority()));
//
//            // === SECTION : Localisation ===
//            document.add(new Paragraph("Localisation").setBold().setFontSize(14).setUnderline().setMarginBottom(10));
//            document.add(new Paragraph("Bureau : " + ticket.getBureau().getBureau()));
//            document.add(new Paragraph("Service : " + ticket.getService().getName()));
//            document.add(new Paragraph("Département : " + ticket.getDepartment().getName()));
//
//            // === SECTION : Détails de Création ===
//            document.add(new Paragraph("Détails de Création").setBold().setFontSize(14).setUnderline().setMarginBottom(10));
//            document.add(new Paragraph("Créé par : " + ticket.getCreatedBy().getNom() + " " + ticket.getCreatedBy().getPrenom()));
//            document.add(new Paragraph("Date de création : " + ticket.getCreatedAt()));
//        //    document.add(new Paragraph("Dernière modification : " + ticket.getUpdatedAt()));bu
//
//            // === SECTION : Workflow de Validation ===
//            //document.add(new Paragraph("Workflow de Validation").setBold().setFontSize(14).setUnderline().setMarginBottom(10));
//            //document.add(new Paragraph("Chef de Service : Validé le " + ticket.getDateValidationService()));
//            //document.add(new Paragraph("Chef de Département : Validé le " + ticket.getDateValidationDep()));
//            //document.add(new Paragraph("Service Informatique : Résolu le " + ticket.getDateResoluSI()));
//
//            // === SECTION : Résolution ===
//            document.add(new Paragraph("Résolution").setBold().setFontSize(14).setUnderline().setMarginBottom(10));
//            document.add(new Paragraph("Problème trouvé : " + (ticket.getFoundProblem() != null ? ticket.getFoundProblem() : "Non renseigné")));
//            document.add(new Paragraph("Solution effectuée : " + (ticket.getAppliedSolution() != null ? ticket.getAppliedSolution() : "Non renseignée")));
//
//
//            // --- Signature et Date en bas à droite ---
//            Paragraph signature = new Paragraph("Signature : ...........................................");
//            Paragraph date = new Paragraph("Date : " + java.time.LocalDate.now());
//
//            // Créer une table pour aligner la signature et la date à droite
//            Table footerTable = new Table(UnitValue.createPercentArray(new float[]{50, 50})).useAllAvailableWidth();
//            footerTable.addCell(new Cell().setBorder(Border.NO_BORDER)); // Espace à gauche
//            Cell signatureDateCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT);
//            signatureDateCell.add(signature).add(new Paragraph("\n")).add(date);
//            footerTable.addCell(signatureDateCell);
//
//            document.add(footerTable);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        document.close();
//        return out.toByteArray();
//    }


    public byte[] generatePdfReport(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé : " + ticketId));

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc, PageSize.A4);
            document.setMargins(20, 20, 20, 20);

            // Génération du header
            generateHeader(document, ticket);

            // Génération de la table d'informations
            generateInformationTable(document, ticket);

            // Génération du footer
            generateFooter(document);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du rapport PDF", e);
        }
    }

    private void generateHeader(Document document, Ticket ticket) throws IOException  {
        // Table pour les logos
        Table headerTable = new Table(UnitValue.createPercentArray(new float[]{30, 40, 30}))
                .useAllAvailableWidth();

        // Logo gauche
        addLogoToHeader(headerTable, "images/logo_left.png", 70, 70, HorizontalAlignment.LEFT);

        // Titre central
        Cell titleCell = new Cell()
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.CENTER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);

        titleCell.add(new Paragraph("OFFICE RÉGIONAL DE MISE EN VALEUR AGRICOLE DES DOUKKALA")
                .setFontSize(12).setBold().setTextAlignment(TextAlignment.CENTER));

        String reportTitle = isMaintenanceTicket(ticket) ? "RAPPORT DE RÉPARATION" : "RAPPORT D'INTERVENTION";
        titleCell.add(new Paragraph(reportTitle)
                .setFontSize(16).setBold().setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10));

        headerTable.addCell(titleCell);

        // Logo droit
        addLogoToHeader(headerTable, "images/logo_right.jpg", 110, 110, HorizontalAlignment.RIGHT);

        document.add(headerTable);
        document.add(new Paragraph("\n"));
    }

    private void addLogoToHeader(Table table, String logoPath, int width, int height, HorizontalAlignment alignment) {
        try {
            InputStream logoStream = getClass().getClassLoader().getResourceAsStream(logoPath);
            if (logoStream != null) {
                ImageData logoData = ImageDataFactory.create(IOUtils.toByteArray(logoStream));
                Image logo = new Image(logoData).scaleToFit(width, height);

                Cell logoCell = new Cell()
                        .setBorder(Border.NO_BORDER)
                        .setVerticalAlignment(VerticalAlignment.TOP)
                        .setHorizontalAlignment(alignment);
                logoCell.add(logo);
                table.addCell(logoCell);
            } else {
                table.addCell(new Cell().setBorder(Border.NO_BORDER));
            }
        } catch (Exception e) {
            table.addCell(new Cell().setBorder(Border.NO_BORDER));
        }
    }

    private void generateInformationTable(Document document, Ticket ticket) {
        // Table principale avec 2 colonnes : Libellé et Valeur
        Table infoTable = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
                .useAllAvailableWidth()
                .setMarginBottom(20);

        // Style pour les headers de section
        Style  sectionHeaderStyle = new Style()
                .setBackgroundColor(ColorConstants .LIGHT_GRAY)
                .setBold()
                .setFontSize(12)
                .setPadding(8);

        // Style pour les labels
        Style labelStyle = new Style()
                .setBold()
                .setFontSize(10)
                .setPadding(5)
                .setBackgroundColor(ColorConstants.WHITE);

        // Style pour les valeurs
        Style valueStyle = new Style()
                .setFontSize(10)
                .setPadding(5);

        // === SECTION INFORMATIONS GÉNÉRALES ===
        addSectionHeader(infoTable, "INFORMATIONS GÉNÉRALES", sectionHeaderStyle);

        addInfoRow(infoTable, "Numéro de ticket", String.valueOf(ticket.getId()), labelStyle, valueStyle);
        addInfoRow(infoTable, "Type de demande", String.valueOf(ticket.getTypeDemande()), labelStyle, valueStyle);
        addInfoRow(infoTable, "Priorité", String.valueOf(ticket.getPriority()), labelStyle, valueStyle);
        addInfoRow(infoTable, "Statut", String.valueOf(ticket.getStatus()), labelStyle, valueStyle);
        addInfoRow(infoTable, "Description du problème",
                ticket.getProblemDescription() != null ? ticket.getProblemDescription() : "Non renseigné",
                labelStyle, valueStyle);

        // Informations spécifiques à la maintenance
        if (isMaintenanceTicket(ticket)) {
            addInfoRow(infoTable, "Marque",
                    ticket.getBrand() != null ? ticket.getBrand() : "Non renseigné",
                    labelStyle, valueStyle);
            addInfoRow(infoTable, "Type d'équipement",
                    ticket.getEquipmentType() != null ? ticket.getEquipmentType() : "Non renseigné",
                    labelStyle, valueStyle);
            addInfoRow(infoTable, "Numéro de série",
                    ticket.getSerialNumber() != null ? ticket.getSerialNumber() : "Non renseigné",
                    labelStyle, valueStyle);
        }

        // === SECTION LOCALISATION ===
        addSectionHeader(infoTable, "LOCALISATION", sectionHeaderStyle);

        addInfoRow(infoTable, "Bureau",
                ticket.getBureau() != null ? ticket.getBureau().getBureau() : "Non renseigné",
                labelStyle, valueStyle);
        addInfoRow(infoTable, "Service",
                ticket.getService() != null ? ticket.getService().getName() : "Non renseigné",
                labelStyle, valueStyle);
        addInfoRow(infoTable, "Département",
                ticket.getDepartment() != null ? ticket.getDepartment().getName() : "Non renseigné",
                labelStyle, valueStyle);

        // === SECTION CRÉATION ===
        addSectionHeader(infoTable, "DÉTAILS DE CRÉATION", sectionHeaderStyle);

        String createdBy = "Non renseigné";
        if (ticket.getCreatedBy() != null) {
            createdBy = ticket.getCreatedBy().getNom() + " " + ticket.getCreatedBy().getPrenom();
        }
        addInfoRow(infoTable, "Créé par", createdBy, labelStyle, valueStyle);
        addInfoRow(infoTable, "Date de création",
                ticket.getCreatedAt() != null ? ticket.getCreatedAt().toString() : "Non renseigné",
                labelStyle, valueStyle);

        // === SECTION RÉSOLUTION ===
        addSectionHeader(infoTable, "RÉSOLUTION", sectionHeaderStyle);

        addInfoRow(infoTable, "Problème trouvé",
                ticket.getFoundProblem() != null ? ticket.getFoundProblem() : "Non renseigné",
                labelStyle, valueStyle);
        addInfoRow(infoTable, "Solution effectuée",
                ticket.getAppliedSolution() != null ? ticket.getAppliedSolution() : "Non renseignée",
                labelStyle, valueStyle);
        addInfoRow(infoTable, "Date de résolution",
                ticket.getDateResoluSI() != null ? ticket.getDateResoluSI().toString() : "Non renseignée",
                labelStyle, valueStyle);

        // === SECTION DATES IMPORTANTES ===
        addSectionHeader(infoTable, "SUIVI TEMPOREL", sectionHeaderStyle);

        addInfoRow(infoTable, "Date de dernière modification",
                ticket.getUpdatedAt() != null ? ticket.getUpdatedAt().toString() : "Non renseigné",
                labelStyle, valueStyle);

        document.add(infoTable);
    }

    private void addSectionHeader(Table table, String sectionTitle, Style style) {
        Cell headerCell = new Cell(1, 2) // Span sur 2 colonnes
                .add(new Paragraph(sectionTitle))
                .addStyle(style)
                .setTextAlignment(TextAlignment.CENTER);
        table.addCell(headerCell); // ❗ Utiliser addCell et non addHeaderCell
    }


    private void addInfoRow(Table table, String label, String value, Style labelStyle, Style valueStyle) {
        Cell labelCell = new Cell()
                .add(new Paragraph(label))
                .addStyle(labelStyle);

        Cell valueCell = new Cell()
                .add(new Paragraph(value != null ? value : "Non renseigné"))
                .addStyle(valueStyle);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private void generateFooter(Document document) {
        // Espace avant le footer
        document.add(new Paragraph("\n\n"));

        // Table pour le footer
        Table footerTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                .useAllAvailableWidth();

        // Cellule vide à gauche
        footerTable.addCell(new Cell().setBorder(Border.NO_BORDER));

        // Cellule signature et date à droite
        Cell signatureCell = new Cell()
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.RIGHT);

        signatureCell.add(new Paragraph("Signature : ..........................................."));
        signatureCell.add(new Paragraph("\n"));
        signatureCell.add(new Paragraph("Date : " + java.time.LocalDate.now()));

        footerTable.addCell(signatureCell);
        document.add(footerTable);
    }

    private boolean isMaintenanceTicket(Ticket ticket) {
        return ticket.getTypeDemande() != null &&
                "maintenance".equalsIgnoreCase(String.valueOf(ticket.getTypeDemande()));
    }


}

