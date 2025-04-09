package com.example.helpdesk.entite;

public enum Statuss {
    CREATED,           // Créé par l'utilisateur
    SERVICE_VALIDATED, // Validé par le chef de service
    DEPT_VALIDATED,// Validé par le chef de département
    SI_DEPT_VALIDATED, // Validé par le chef de département
    SI_SERVICE,       // Assigné au département SI
    RESOLVED,          // Résolu par l'admin SI
    REJECTED           // Rejeté à n'importe quelle étape
}
