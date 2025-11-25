package com.microtech.smartshop.entity;

import com.microtech.smartshop.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank
    @Column(unique = true, nullable=false)
    private String username;

    @NotBlank
    @Column(nullable=false)
    private String password;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private UserRole role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Customer customer;

}