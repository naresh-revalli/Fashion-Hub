package com.ecomerce.ecomerceBacked.repository;

import com.ecomerce.ecomerceBacked.model.Category;
import com.ecomerce.ecomerceBacked.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {

}
