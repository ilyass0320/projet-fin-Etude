package com.example.Backend.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notiification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String message; //contenu du message
    private String email; //email du clients
    private boolean luClient=false ; //pour savoir si client est vu ou non
    private boolean luAdmin=false ; //pour savoir si admin est vu ou non
    private LocalDateTime dateTime = LocalDateTime.now();

}
