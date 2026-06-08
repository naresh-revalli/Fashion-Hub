package com.ecomerce.ecomerceBacked.service;

import com.ecomerce.ecomerceBacked.model.Product;
import com.ecomerce.ecomerceBacked.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService  {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    //To get all products
    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }
    // create product
    public  Product createProduct(Product product){
        return productRepository.save(product);
    }//update products
    public Product updateProduct(Long id,Product product){
        product.setId(id);
        return productRepository.save(product);
    }
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
    //delete product
    public void deleteProduct(Long id){
        productRepository.deleteById(id);
    }

}
