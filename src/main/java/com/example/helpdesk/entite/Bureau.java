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
@Table(name = "bureaux")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bureau {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;



//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "service_id", nullable = false)
//    private Service service;

    @OneToMany(mappedBy = "bureau", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Ticket> tickets = new ArrayList<>();

    // Getter and Setter for id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Getter and Setter for numero
    public String getBureau() {
        return name;
    }

    public void setBureau(String bureau) {
        this.name = bureau;
    }

    // Getter and Setter for localisation

    // Getter and Setter for service
//    public Service getService() {
//        return service;
//    }
//
//    public void setService(Service service) {
//        this.service = service;
//    }

    // Getter and Setter for tickets
    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }
}