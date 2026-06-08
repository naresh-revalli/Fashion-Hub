package com.ecomerce.ecomerceBacked.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDTO {
    private Long id;
    private String name;
    private Double price;
    private String description;
    private Integer stock;
    private String imageUrl;
}
