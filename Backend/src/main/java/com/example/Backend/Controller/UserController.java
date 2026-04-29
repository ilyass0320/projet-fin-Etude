package com.example.Backend.Controller;


import com.example.Backend.DTO.UserSignUpResquest;
import com.example.Backend.Entity.Client;
import com.example.Backend.Respository.UserRepository;
import com.example.Backend.Service.ClientManagementService;
import com.example.Backend.Service.ConfirmationEmail;
import com.example.Backend.Service.JwtService;
import com.example.Backend.Service.ServiceEmail;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/auth/user/")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private final ClientManagementService clientManagementService;
    private final ServiceEmail serviceEmail;
    private final ConfirmationEmail confirmationEmail;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;

    @PostMapping("/Signup")
    public ResponseEntity<UserSignUpResquest> Signup(@RequestBody UserSignUpResquest signUpRequest){
        return ResponseEntity.ok(clientManagementService.Signup(signUpRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<UserSignUpResquest> login(@RequestBody UserSignUpResquest loginRequest){
        return ResponseEntity.ok(clientManagementService.login(loginRequest));
    }
    @PostMapping("/oublierMotPass")
    public ResponseEntity<?> oublierMotpass(@Valid @RequestBody UserSignUpResquest request){

        Client client = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        String token = UUID.randomUUID().toString();
        client.setResetToken(token);
        userRepository.save(client);
        // ✅ CORRECTION ICI
        serviceEmail.sendPasswordResetEmail(client.getEmail(), token);
        return ResponseEntity.ok("Email envoyé");
    }

    @PostMapping("/renitialisationMotPass")
    public ResponseEntity<?> renitialMotPass(@RequestBody UserSignUpResquest request){
        System.out.println("Token reçu : " + request.getToken());
        System.out.println("Email reçu : " + request.getEmail());

        // Vérifier ce qui existe en base
        userRepository.findAll().forEach(u ->
                System.out.println("Client: " + u.getEmail() + " | resetToken: " + u.getResetToken())
        );
        Client client = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Token invalide"));
        client.setPassword(passwordEncoder.encode(request.getPassword()));
        client.setResetToken(null);
        userRepository.save(client);
        confirmationEmail.envoyerConfirmationMotDePasse(client.getEmail(), client.getPrenom());

        return ResponseEntity.ok("Mot de passe mis à jour");
    }

    @GetMapping("/profile")
    public ResponseEntity<Client> getProfile(Authentication authentication) {
        String email = authentication.getName();
        Client client = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return ResponseEntity.ok(client);
    }

}

