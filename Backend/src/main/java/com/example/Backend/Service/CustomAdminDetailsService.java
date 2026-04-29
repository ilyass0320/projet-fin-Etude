package com.example.Backend.Service;

import com.example.Backend.Entity.Admin;
import com.example.Backend.Respository.AdminRespository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.NullMarked;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service("customAdminDetailsService")
@RequiredArgsConstructor
public class CustomAdminDetailsService implements UserDetailsService {
    @Autowired
    private AdminRespository adminRespository;

    @Override
    @NullMarked
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Admin admin = adminRespository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Admin non trouvé : " + email));

        return User.builder()
                .username(admin.getEmail())
                .password(admin.getPassword())
                .roles(admin.getRolesAdmin().name())
                .build();
    }


}
