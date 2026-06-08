package com.ecomerce.ecomerceBacked.service;

import com.ecomerce.ecomerceBacked.model.Cart;
import com.ecomerce.ecomerceBacked.model.CartItem;
import com.ecomerce.ecomerceBacked.model.Product;
import com.ecomerce.ecomerceBacked.repository.CartItemRepository;
import com.ecomerce.ecomerceBacked.repository.CartRepository;
import com.ecomerce.ecomerceBacked.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private  final CartItemRepository cartItemRepository;
    private  final ProductRepository productRepository;
    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository) {

        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }
    public CartItem addToCart(Long cartId,Long productId,int quantity){
        Cart cart=cartRepository.findById(cartId).orElse(null);
        Product product=productRepository.findById(productId).orElse(null);
        CartItem cartItem= new CartItem();
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);

        return  cartItemRepository.save(cartItem);

    }
    public List<CartItem> getCartItems(){
        return cartItemRepository.findAll();
    }
    public  void  removeItem(Long id){
        cartItemRepository.deleteById(id);
    }


}
