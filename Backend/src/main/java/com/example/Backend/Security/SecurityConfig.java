package com.example.Backend.Security;

import com.example.Backend.Component.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/user/profile").authenticated()
                        .requestMatchers("/auth/admin/profile").authenticated()
                        .requestMatchers("/auth/admin/profile").hasRole("ADMIN")
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/client/**").hasRole("CLIENT")
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    @Primary // ✅ @Primary sur le @Bean, pas sur une variable locale
    public AuthenticationManager authenticationManager(
            @Qualifier("customAdminDetailsService") UserDetailsService adminDetailsService,
            @Qualifier("customClientDetailsService") UserDetailsService clientDetailsService
    ) {
        // Provider CLIENT en premier
        DaoAuthenticationProvider clientProvider = new DaoAuthenticationProvider(clientDetailsService);
        clientProvider.setPasswordEncoder(passwordEncoder());

        // Provider ADMIN en second
        DaoAuthenticationProvider adminProvider = new DaoAuthenticationProvider(adminDetailsService);
        adminProvider.setPasswordEncoder(passwordEncoder());

        // ✅ clientProvider en premier — il sera essayé avant adminProvider
        return new ProviderManager(Arrays.asList(clientProvider, adminProvider));
    }
}