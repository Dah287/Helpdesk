package com.example.helpdesk.service;


import com.example.helpdesk.entite.SolutionTechnique;
import com.example.helpdesk.repository.SolutionTechniqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SolutionTechniqueService {

    @Autowired
    private SolutionTechniqueRepository repository;

    /**
     * Récupère la liste de tous les libellés actifs (triés par ordre alphabétique)
     */
    public List<String> findAllActiveLabels() {
        return repository.findByActifTrueOrderByLibelleAsc()
                .stream()
                .map(SolutionTechnique::getLibelle)
                .collect(Collectors.toList());
    }

    /**
     * Sauvegarde une nouvelle solution technique (ignore les doublons via base de données)
     */
    public void save(String libelle) {
        repository.save(new SolutionTechnique(libelle));
    }

    /**
     * Désactive une solution par son libellé (soft delete)
     */
    public void deactivateByLibelle(String libelle) {
        List<SolutionTechnique> solutions = repository.findByLibelle(libelle);
        if (solutions.isEmpty()) {
            throw new RuntimeException("Solution non trouvée : " + libelle);
        }
        // Si plusieurs (improbable à cause de UNIQUE), on désactive toutes
        for (SolutionTechnique s : solutions) {
            s.setActif(false);
            repository.save(s);
        }
    }

    /**
     * (Optionnel) Réactive une solution désactivée
     */
    public void reactivateByLibelle(String libelle) {
        List<SolutionTechnique> solutions = repository.findByLibelle(libelle);
        for (SolutionTechnique s : solutions) {
            s.setActif(true);
            repository.save(s);
        }
    }

    /**
     * Récupère toutes les solutions (actives + inactives) – utile pour l’admin
     */
    public List<SolutionTechnique> findAll() {
        return repository.findAll();
    }
}