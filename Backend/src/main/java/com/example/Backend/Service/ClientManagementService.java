package com.example.Backend.Service;

import com.example.Backend.DTO.UserSignUpResquest;
import com.example.Backend.Entity.Client;
import com.example.Backend.Enums.Genre;
import com.example.Backend.Respository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientManagementService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final JwtService jwtService;

    // ✅ Injection simple sans @Qualifier
    @Autowired
    @Qualifier("authenticationManager")
    private AuthenticationManager authenticationManager;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserSignUpResquest Signup(UserSignUpResquest request){
        UserSignUpResquest response = new UserSignUpResquest();
        System.out.println("\n==========================================");
        System.out.println("   DÉBUT ENREGISTREMENT CLIENT");
        System.out.println("============================================");
        System.out.println("-  Email      : " + request.getEmail());
        System.out.println("-  Nom        : " + request.getNom());
        System.out.println("-  Prénom     : " + request.getPrenom());
        System.out.println("-  Adresse    : " + request.getAddress());
        System.out.println("-  Téléphone  : " + request.getTelephone());
        System.out.println("-  Genre      : " + request.getGenre());
        System.out.println("-  Password   : " + (request.getPassword() != null ? "[MASQUÉ]" : "NULL"));
        System.out.println("============================================\n");

        try {
            System.out.println("Verification si l'email existe deja...");
            if (userRepository.existsByEmail(request.getEmail())) {
                response.setError("Un compte avec cet email existe déjà");
                return response;
            }
            System.out.println("✅ Email disponible");
            System.out.println("Creation de l'objet Client...");
            Client client = new Client();

            client.setEmail(request.getEmail());
            client.setPrenom(request.getPrenom());
            client.setNom(request.getNom());
            client.setGenre(Genre.valueOf(request.getGenre()));
            client.setAddress(request.getAddress());
            client.setTelephone(request.getTelephone());

            // Normaliser le genre avant conversion
            if (request.getGenre() != null && !request.getGenre().isEmpty()){
                try {
                    Genre genreEnum = Genre.valueOf(request.getGenre().toUpperCase());
                    client.setGenre(genreEnum);
                    System.out.println("Genre défini : " + genreEnum);
                } catch (IllegalArgumentException e) {
                    System.err.println("Genre invalide : " + request.getGenre().toUpperCase());
                    System.err.println("Valeurs acceptées : "+java.util.Arrays.toString(Genre.values()).toUpperCase());
                }

            }
            System.out.println(" Encodage du mot de passe...");
            String encodePassword = passwordEncoder.encode(request.getPassword());
            client.setPassword(encodePassword);
            System.out.println(" Mot de passe encodé avec succès");

            System.out.println("\n=======================================");
            System.out.println("   État du client avant sauvegarde :  ");
            System.out.println("=======================================");
            System.out.println("  - Nom        : " + client.getNom());
            System.out.println("  - Prénom     : " + client.getPrenom());
            System.out.println("  - Email      : " + client.getEmail());
            System.out.println("  - Téléphone  : " + client.getTelephone());
            System.out.println("  - Adresse    : " + client.getAddress());
            System.out.println("  - Genre      : " + client.getGenre());
            System.out.println("   - Password   : " + (client.getPassword() != null ? "[ENCODÉ]" : "NULL"));
            System.out.println("=======================================");

            // Sauvegarde
            System.out.println("\n Tentative de sauvegarde dans la base de données...");
            Client savedClient = userRepository.save(client);
            System.out.println("\n CLIENT SAUVEGARDÉ AVEC SUCCÈS !");
            System.out.println(" ID généré  : " + savedClient.getId_client());
            System.out.println(" Email      : " + savedClient.getEmail());
            System.out.println(" Nom complet: " + savedClient.getPrenom() + " " + savedClient.getNom());

            // Générer les tokens
            System.out.println("\n Génération des tokens JWT...");
            String jwt = jwtService.generateToken(savedClient);
            String refreshToken = jwtService.generateRefreshToken(new HashMap<>(), savedClient);
            System.out.println("Tokens générés");

            response.setMessage("Client créé avec succès");
            response.setClient(savedClient);
            response.setToken(jwt);
            response.setRefresh(refreshToken);

            System.out.println("\n==========================================");
            System.out.println("    FIN ENREGISTREMENT (SUCCÈS)");
            System.out.println("==========================================\n");

        } catch (Exception e) {
            System.err.println("\n------ERREUR LORS DE L'ENREGISTREMENT---------");
            System.err.println("Type d'erreur : " + e.getClass().getName());
            System.err.println("Message       : " + e.getMessage());
            System.err.println("\n📚 Stack trace complet :");
            e.printStackTrace();
            System.err.println("-------------------------------------------------\n");
            response.setError("Erreur lors de la création du compte : " + e.getMessage());
        }
        return response;
    }

    public UserSignUpResquest login(UserSignUpResquest loginRequestS){
        UserSignUpResquest response = new UserSignUpResquest();
        System.out.println("\n==========================================");
        System.out.println(" TENTATIVE DE CONNEXION");
        System.out.println("=========================================");
        System.out.println(" Email: " + loginRequestS.getEmail());

        try {
            System.out.println(" Authentification en cours...");
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestS.getEmail(),
                            loginRequestS.getPassword()
                    )
            );
            System.out.println(" Authentification réussie");

            System.out.println(" Recherche du client dans la base...");
            Client client = userRepository.findByEmail(loginRequestS.getEmail()).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé") );
            System.out.println(" Client trouvé : " + client.getPrenom() + " " + client.getNom());

            System.out.println(" Génération des tokens...");
            String jwt = jwtService.generateToken(client);
            String refreshToken = jwtService.generateRefreshToken(new HashMap<>(), client);

            response.setToken(jwt);
            response.setRefresh(refreshToken);
            response.setMessage("Connexion réussie");
            response.setClient(client);
            System.out.println(" Connexion réussie !");
            System.out.println("========================================\n");

        } catch (Exception e) {
            System.err.println("\n--- ERREUR DE CONNEXION ----");
            System.err.println("Type : " + e.getClass().getName());
            System.err.println("Message : " + e.getMessage());
            e.printStackTrace();
            System.err.println("-------------------------------------\n");

            response.setError("Email ou mot de passe incorrect");
        }
        return response;
    }
    public UserSignUpResquest getAllClients() {
        UserSignUpResquest response = new UserSignUpResquest();
        List<Client> clients = userRepository.findAll();

        // Utiliser setListClients ou créer une méthode appropriée
        response.setListClients(clients); // Notez le "List"
        response.setMessage("Clients récupérés avec succès");

        return response;
    }
    public UserSignUpResquest getClient(String email){
        UserSignUpResquest response = new UserSignUpResquest();

        Client client = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));

        response.setClient(client);
        response.setMessage("Client récupéré avec succès");

        return response;
    }


    public UserSignUpResquest getClientById(Long id){
        UserSignUpResquest userRequest = new UserSignUpResquest();
        try {
            Client userid =userRepository.findById(id).orElseThrow(()->new RuntimeException("admin not found"));
            userRequest.setClient(userid);
            userRequest.setMessage("Client avec identifiant '"+userid+"'n'existe pas ");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return userRequest;
    }



}