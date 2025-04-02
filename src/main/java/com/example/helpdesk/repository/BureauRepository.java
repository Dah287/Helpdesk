package com.example.helpdesk.repository;

import com.example.helpdesk.entite.Bureau;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BureauRepository extends JpaRepository<Bureau, Long> {

}