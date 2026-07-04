package com.example.Backend.Service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceEmail {
    private  JavaMailSender mailSender;
    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetLink = "http://localhost:5173/renitialiser-Mot-Pass?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Réinitialisation de votre mot de passe");
        message.setText(
                "Bonjour,\n\n" +
                        "Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :\n\n" +
                        resetLink + "\n\n" +
                        "Ce lien expire dans 1 heure.\n\n" +
                        "Si vous n'avez pas demandé cette réinitialisation, ignorez cet email."
        );
        message.setFrom("ilyaachi03@gmail.com");
        mailSender.send(message);
    }
}
