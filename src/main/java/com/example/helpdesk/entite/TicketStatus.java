package com.example.helpdesk.entite;

public enum TicketStatus {
    SERVICE_VALIDATED, // Validé par le chef de service
    DEPT_VALIDATED,// Validé par le chef de département
    SI_DEPT_VALIDATED, // Validé par le chef de département
    SI_SERVICE,
    BUREAU_VALIDATED,
    EN_COURS,
    RESOLU,
    TRANS_SM
}