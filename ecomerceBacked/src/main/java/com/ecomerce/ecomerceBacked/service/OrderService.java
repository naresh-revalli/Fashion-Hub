package com.ecomerce.ecomerceBacked.service;

import com.ecomerce.ecomerceBacked.model.Order;
import com.ecomerce.ecomerceBacked.model.OrderItem;
import com.ecomerce.ecomerceBacked.model.Product;
import com.ecomerce.ecomerceBacked.repository.OrderRepository;
import com.ecomerce.ecomerceBacked.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public Order placeOrder(Order order, String userEmail) {
        order.setUserEmail(userEmail);
        for (OrderItem item : order.getItems()) {
            item.setOrder(order);

            // Decrement product stock
            Product product = productRepository.findById(item.getProduct().getId()).orElse(null);
            if (product != null) {
                int updatedStock = product.getStock() - item.getQuantity();
                product.setStock(Math.max(updatedStock, 0));
                productRepository.save(product);
            }
        }
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser(String userEmail) {
        return orderRepository.findByUserEmail(userEmail);
    }
}
