package com.example.Backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ConfirmationEmail {
    @Autowired
    private JavaMailSender mailSender;

    public void envoyerConfirmationMotDePasse(String email, String prenom) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Mot de passe modifié avec succès");
        message.setText(
                "Bonjour " + prenom + ",\n\n" +
                        "Votre mot de passe a été réinitialisé avec succès.\n\n" +
                        "Si vous n'êtes pas à l'origine de cette modification, " +
                        "contactez-nous immédiatement.\n\n" +
                        "Cordialement,\nL'équipe support"
        );
        
        message.setFrom("ilyaachi03@gmail.com");
        mailSender.send(message);
    }
}
