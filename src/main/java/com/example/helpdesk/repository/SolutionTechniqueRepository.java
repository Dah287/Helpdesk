package com.example.helpdesk.repository;

import com.example.helpdesk.entite.SolutionTechnique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolutionTechniqueRepository extends JpaRepository<SolutionTechnique, Long> {
    List<SolutionTechnique> findByActifTrueOrderByLibelleAsc();
    List<SolutionTechnique> findByLibelle(String libelle);
}