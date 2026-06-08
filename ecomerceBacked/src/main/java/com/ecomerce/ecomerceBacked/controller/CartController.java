package com.ecomerce.ecomerceBacked.controller;



import com.ecomerce.ecomerceBacked.model.CartItem;
import com.ecomerce.ecomerceBacked.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public CartItem addToCart(@RequestParam Long cartId,
                              @RequestParam Long productId,
                              @RequestParam int quantity) {

        return cartService.addToCart(cartId,productId,quantity);
    }

    @GetMapping
    public List<CartItem> viewCart() {
        return cartService.getCartItems();
    }
//  cart item id we have to mention here
    //hell
    @DeleteMapping("/{id}")
    public void removeItem(@PathVariable Long id) {
        cartService.removeItem(id);
    }
}