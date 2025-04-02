package com.example.helpdesk.repository;

import com.example.helpdesk.entite.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

}
