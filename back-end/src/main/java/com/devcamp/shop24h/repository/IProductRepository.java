package com.devcamp.shop24h.repository;


import java.util.HashMap;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devcamp.shop24h.model.CProduct;

public interface IProductRepository extends JpaRepository<CProduct, Integer>{
	Page<CProduct> findAll(Pageable paging);
	
	@Query(value = "SELECT * FROM products  WHERE product_name LIKE %:name% ORDER BY product_name", nativeQuery = true)
	Page<CProduct> findProductByProductName(@Param("name") String name, Pageable paging);
	
	@Query(value="SELECT * FROM products WHERE CONCAT(product_name, ' ', product_vendor) LIKE %:string%", nativeQuery = true)
	Page<CProduct> findProductBySearchString(@Param("string") String stringSearch, Pageable paging);
	
	@Query(value = "SELECT * FROM products WHERE product_vendor LIKE %:brandName% AND product_line_id LIKE %:productLineId% ORDER BY product_name", nativeQuery = true)
	Page<CProduct> findProductByProductVender_AndProductLine(@Param("brandName") String brandName,@Param("productLineId") String productLineId, Pageable paging);
	
	
}
