package com.example.Backend.Component;

import com.example.Backend.Service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    @Qualifier("customAdminDetailsService")
    private UserDetailsService adminDetailsService;

    @Autowired
    @Qualifier("customClientDetailsService")
    private UserDetailsService clientDetailsService;

    // ✅ Liste précise des endpoints publics
    private static final List<String> PUBLIC_PATHS = List.of(
            "/auth/user/login",
            "/auth/user/Signup",
            "/auth/user/oublierMotPass",
            "/auth/user/renitialisationMotPass",
            "/auth/admin/login",
            "/auth/admin/Signup"
    );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // ✅ Ignorer uniquement les endpoints publics précis
        if (PUBLIC_PATHS.contains(path)) {
            System.out.println("✅ Endpoint public détecté : " + path + " - Filtre JWT ignoré");
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String userEmail;

        // Vérifier si le header Authorization existe et commence par "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("⚠️ Pas de token JWT pour : " + path);
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extraire le token (enlever "Bearer ")
            jwtToken = authHeader.substring(7);

            // Extraire l'email du token
            userEmail = jwtService.extractUsername(jwtToken);

            System.out.println("🔑 Token JWT détecté pour : " + userEmail + " | path: " + path);

            // Si l'utilisateur n'est pas encore authentifié
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Charger les détails utilisateur
                UserDetails userDetails = loadUserDetails(userEmail, path, jwtToken);

                if (userDetails != null) {
                    // Valider le token
                    if (jwtService.isTokenValid(jwtToken, userDetails)) {
                        System.out.println("✅ Token valide pour : " + userEmail);

                        // Créer le contexte de sécurité
                        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();

                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        securityContext.setAuthentication(authToken);
                        SecurityContextHolder.setContext(securityContext);

                    } else {
                        System.err.println("❌ Token invalide pour : " + userEmail);
                    }
                } else {
                    System.err.println("❌ Utilisateur non trouvé : " + userEmail);
                }
            }

        } catch (Exception e) {
            System.err.println("❌ Erreur lors du traitement du token JWT : " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Charge les détails de l'utilisateur en fonction du type (Admin ou Client)
     */
    private UserDetails loadUserDetails(String userEmail, String path, String jwtToken) {
        try {
            if (path.startsWith("/admin/")) {
                System.out.println("👤 Chargement Admin pour : " + userEmail);
                return adminDetailsService.loadUserByUsername(userEmail);
            } else if (path.startsWith("/client/")) {
                System.out.println("👤 Chargement Client pour : " + userEmail);
                return clientDetailsService.loadUserByUsername(userEmail);
            }

            // Essayer Admin d'abord, puis Client
            try {
                System.out.println("👤 Tentative Admin pour : " + userEmail);
                return adminDetailsService.loadUserByUsername(userEmail);
            } catch (Exception e) {
                System.out.println("👤 Admin non trouvé, tentative Client pour : " + userEmail);
                return clientDetailsService.loadUserByUsername(userEmail);
            }

        } catch (Exception e) {
            System.err.println("❌ Erreur chargement utilisateur : " + e.getMessage());
            return null;
        }
    }
}