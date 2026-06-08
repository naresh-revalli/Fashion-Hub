package com.ecomerce.ecomerceBacked.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDTO {
    private Long id;
    private Double totalPrice;
    private String status;
}
