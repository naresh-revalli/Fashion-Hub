package com.ecomerce.ecomerceBacked.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "name field is not empty")
    private String name;
    @NotBlank(message = "description field is not empty")
    private String description;
    @Positive(message = "price is greater than 0")
    private double price;
    @Min(value = 0,message = " stocks not negetive")
    private  int stock;
    @NotBlank(message = "Image URL cannot be empty")
    private  String imageUrl;
    //many products belong to one category
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name ="category_id")
    private Category category;
    //@ManyToOne → Each product belongs to one category.
    //@JoinColumn(name = "category_id") → Creates a foreign key in product table linking to category.


}
