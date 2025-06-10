package com.example.helpdesk.entite;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Entity
@Table (name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @Column(name = "serial_number", nullable = false)
    private String serialNumber;

    @Column(name = "equipment_type", nullable = false)
    private String equipmentType;

    @Column(nullable = false)
    private String brand;

    @Column(name = "problem_description", nullable = false, length = 1000)
    private String problemDescription;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Date createdAt;


    @Column(name = "dateValidationService")
    private Date dateValidationService;

    @Column(name = "dateValidationBureau")
    private Date dateValidationBureau;

    @Column(name = "foundProblem")
    private String foundProblem;
    @Column(name = "appliedSolution")
    private String appliedSolution;


    @Column(name = "dateValidationDep")
    private Date dateValidationDep;


    @Column(name = "dateResoluSI")
    private Date dateResoluSI;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeDemande typeDemande;

    @ManyToOne
    @JoinColumn(name = "bureau_id", nullable = true)
    private Bureau bureau;
    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = true)
    private Service service;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getEquipmentType() {
        return equipmentType;
    }

    public void setEquipmentType(String equipmentType) {
        this.equipmentType = equipmentType;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getProblemDescription() {
        return problemDescription;
    }

    public void setProblemDescription(String problemDescription) {
        this.problemDescription = problemDescription;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

// Pas de setter pour createdAt car il est généré automatiquement

    public Date getUpdatedAt() {
        return updatedAt;
    }

// Pas besoin d’un setter pour updatedAt car il est mis à jour automatiquement

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }



    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    //
    public TypeDemande getTypeDemande() {
        return typeDemande;
    }

    public void setTypeDemande(TypeDemande typeDemande) {
        this.typeDemande = typeDemande;
    }
    //
    public Bureau getBureau() {
        return bureau;
    }

    public void setBureau(Bureau bureau) {
        this.bureau = bureau;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public Date getDateValidationService() {
        return dateValidationService;
    }

    public void setDateValidationService(Date dateValidationService) {
        this.dateValidationService = dateValidationService;
    }

    //
    public Date getDateValidationBureau() {
        return dateValidationBureau;
    }

    public void setDateValidationBureau(Date dateValidationService) {
        this.dateValidationBureau = dateValidationService;
    }
    //

    public Date getDateValidationDep() {
        return dateValidationDep;
    }

    public void setDateValidationDep(Date dateValidationDep) {
        this.dateValidationDep = dateValidationDep;
    }

    public Date getDateResoluSI() {
        return dateResoluSI;
    }

    public void setDateResoluSI(Date dateResoluSI) {
        this.dateResoluSI = dateResoluSI;
    }

    // Getters et setters
    public String getFoundProblem() {
        return foundProblem;
    }

    public void setFoundProblem(String foundProblem) {
        this.foundProblem = foundProblem;
    }

    public String getAppliedSolution() {
        return appliedSolution;
    }

    public void setAppliedSolution(String appliedSolution) {
        this.appliedSolution = appliedSolution;
    }


}
