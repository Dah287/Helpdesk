package com.example.helpdesk.entite;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "services")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "department_id", nullable = false)
//    private Department department;
//
//    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Bureau> bureaux = new ArrayList<>();
@JsonIgnore
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List <Ticket> tickets = new ArrayList<>() ;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

//    public Department getDepartment() {
//        return department;
//    }
//
//    public void setDepartment(Department department) {
//        this.department = department;
//    }
//
//    public List<Bureau> getBureaux() {
//        return bureaux;
//    }
//
//    public void setBureaux(List<Bureau> bureaux) {
//        this.bureaux = bureaux;
//    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }

//    // Méthodes pour ajouter et supprimer un bureau
//    public void addBureau(Bureau bureau) {
//        bureaux.add(bureau);
//        bureau.setService(this);
//    }
//
//    public void removeBureau(Bureau bureau) {
//        bureaux.remove(bureau);
//        bureau.setService(null);
//    }

    // Méthodes pour ajouter et supprimer un ticket
    public void addTicket(Ticket ticket) {
        tickets.add(ticket);
        ticket.setService(this);
    }

    public void removeTicket(Ticket ticket) {
        tickets.remove(ticket);
        ticket.setService(null);
    }

}
