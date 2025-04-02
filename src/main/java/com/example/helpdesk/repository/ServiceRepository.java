package com.example.helpdesk.repository;

import com.example.helpdesk.entite.Department;
import com.example.helpdesk.entite.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {

}
