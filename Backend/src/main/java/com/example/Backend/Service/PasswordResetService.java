package com.example.Backend.Service;

import com.example.Backend.Entity.Client;
import com.example.Backend.Entity.PasswordResetToken;
import com.example.Backend.Respository.PasswordResetTokenRepository;
import com.example.Backend.Respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class PasswordResetService {
    @Autowired
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final ServiceEmail serviceEmail;
    private final PasswordEncoder passwordEncoder;
    public void requestPasswordReset(String email) {
        Client client =userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email introuvable"));

        // Générer un token unique
        String token = UUID.randomUUID().toString();
        // Sauvegarder le token avec expiration 1h
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setClient(client);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        passwordResetTokenRepository.save(resetToken);

        // Envoyer l'email
        serviceEmail.sendPasswordResetEmail(email, token);
    }


    // Étape 2 : Réinitialiser le mot de passe
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token invalide"));

        if (resetToken.isExpired()) {
            throw new RuntimeException("Token expiré");
        }

        Client client = resetToken.getClient();
        client.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(client);

        // Supprimer le token après utilisation
        passwordResetTokenRepository.delete(resetToken);
    }
}
