package com.example.Backend.Service;

import com.example.Backend.Entity.Categorie;
import com.example.Backend.Entity.Client;
import com.example.Backend.Entity.Produit;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationAjouterProduits {
    private final JavaMailSender mailSender;
    public void envoyerNotificationNouveauProduit(String emailDestinataire, Produit produit) {
        Client client = new Client();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(emailDestinataire);
        message.setSubject("Nouveau produit disponible pour vos");
        message.setText(
                "Bonjour "+client.getNom()+" "+client.getPrenom()+",\n\n" +
                        "Un nouveau produit vient d'être ajouté :\n\n" +
                        " Marque        : " + produit.getMarque()+ "\n" +
                        " Model         : " + produit.getModel()+ "\n" +
                        "Connectez-vous pour plus d' information !\n\n" +
                        "Cordialement,\n MOTO"
        );
        message.setFrom("ilyaachi03@gmail.com");
        mailSender.send(message);
    }
    // Envoyer à TOUS les utilisateurs
    public void envoyerNotificationATous(List<String> emails, Produit produit) {
        for (String email : emails) {
            try {
                envoyerNotificationNouveauProduit(email, produit);
                System.out.println("✅ Email envoyé à : " + email);
            } catch (Exception e) {
                System.err.println("❌ Échec envoi à : " + email + " - " + e.getMessage());
            }
        }
    }
}
