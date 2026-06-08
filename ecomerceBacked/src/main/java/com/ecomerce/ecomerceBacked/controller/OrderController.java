package com.ecomerce.ecomerceBacked.controller;

import com.ecomerce.ecomerceBacked.model.Order;
import com.ecomerce.ecomerceBacked.service.OrderService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order placeOrder(@RequestBody Order order, Authentication auth) {
        String email = auth.getName();
        return orderService.placeOrder(order, email);
    }

    @GetMapping
    public List<Order> getOrders(Authentication auth) {
        String email = auth.getName();
        return orderService.getOrdersByUser(email);
    }
}
