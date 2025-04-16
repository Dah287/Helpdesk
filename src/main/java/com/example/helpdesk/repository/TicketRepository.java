package com.example.helpdesk.repository;

import com.example.helpdesk.entite.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository <Ticket , Long> {
    List<Ticket> findByBureauId(Long bureauId);
    List<Ticket> findByDepartmentId(Long departmentId);
    List<Ticket> findByServiceId(Long serviceId);
    List<Ticket> findByCreatedById(Long userId);
    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findByPriority(Priority priority);
    List<Ticket> findByCreatedBy(User createdBy);
    List<Ticket> findByDepartmentAndStatus(Department department, TicketStatus status);
    List<Ticket> findByStatusIn(List<TicketStatus> statuses);


    List<Ticket> findByDepartmentAndStatusOrCreatedBy(Department department, TicketStatus status,User user);



}
