package com.example.Backend.Controller;

import com.example.Backend.DTO.CategorieRequest;
import com.example.Backend.Entity.Categorie;
import com.example.Backend.Entity.Produit;
import com.example.Backend.Respository.CategorieRepository;
import com.example.Backend.Service.CategorieManagementService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static org.springframework.security.authorization.AuthorityAuthorizationManager.hasRole;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/auth/categorie/")
@AllArgsConstructor
public class CategorieController {

    private final CategorieManagementService categorieManagementService;
    private final CategorieRepository categorieRepository;

//    @PreAuthorize(value = "ADMIN")
    @PostMapping("/AjouterCateg")
    public ResponseEntity<CategorieRequest> Category(@ModelAttribute CategorieRequest request)throws Exception{
        return ResponseEntity.ok(categorieManagementService.addCategory(request, request.getImageIcon()));
    }


    @GetMapping("AllCategories")
    public ResponseEntity<CategorieRequest> allCate(){
        return ResponseEntity.ok(categorieManagementService.allCategories());
    }
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        Categorie categorie =categorieRepository.findById(id).orElseThrow();
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(categorie.getImageIconType()))
                .body(categorie.getImageIcon());
    }
}
