package com.assignment.growth.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String symbol;
    private String companyName;

    @JsonManagedReference
    @OneToMany(mappedBy = "stock", cascade = CascadeType.ALL)
    private List<Portfolio> portfolios;

    @JsonManagedReference
    @OneToMany(mappedBy = "stock", cascade = CascadeType.ALL)
    private List<Transaction> transactions;
}
