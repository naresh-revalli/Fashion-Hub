package com.ecomerce.ecomerceBacked.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private  int quantity;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name="product_id")
    private Product product;
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name="cart_id")
    private Cart cart;


}
