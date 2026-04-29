package com.example.Backend.Controller;

import com.example.Backend.DTO.AdminSignupRequest;
import com.example.Backend.DTO.UserSignUpResquest;
import com.example.Backend.Entity.Admin;
import com.example.Backend.Entity.PasswordResetToken;
import com.example.Backend.Respository.AdminRespository;
import com.example.Backend.Service.ClientManagementService;
import com.example.Backend.Service.AdminManagementService;
import com.example.Backend.Service.JwtService;
import com.example.Backend.Service.PasswordResetService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/auth/admin/")
public class AdminController {
    private final AdminManagementService adminManagementService;
    private final ClientManagementService clientManagementService;
    private final PasswordResetService passwordResetService;
    private final AdminRespository adminRespository;

    @PostMapping("/register")
    public ResponseEntity<AdminSignupRequest> register (@RequestBody AdminSignupRequest signupRequest){
        return ResponseEntity.ok(adminManagementService.register(signupRequest));
    }
    @PostMapping("/login")
    public ResponseEntity<AdminSignupRequest> Login(@RequestBody AdminSignupRequest loginRequest){
        return ResponseEntity.ok(adminManagementService.login(loginRequest));
    }

    @GetMapping("/allClients")
    public ResponseEntity<UserSignUpResquest> allClients(){
        return ResponseEntity.ok(clientManagementService.getAllClients());
    }

    @GetMapping("/profile")
    public ResponseEntity<Admin> getProfile(Authentication authentication) {
        String email = authentication.getName();
        Admin admin = adminRespository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin non trouvé"));
        return ResponseEntity.ok(admin);
    }

    // POST /api/auth/forgot-password
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> body) {
        passwordResetService.requestPasswordReset(body.get("email"));
        return ResponseEntity.ok("Email de réinitialisation envoyé !");
    }

    // POST /api/auth/reset-password
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> body) {
        passwordResetService.resetPassword(body.get("token"), body.get("password"));
        return ResponseEntity.ok("Mot de passe réinitialisé avec succès !");
    }
}
