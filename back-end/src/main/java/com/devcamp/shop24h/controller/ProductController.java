package com.devcamp.shop24h.controller;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devcamp.shop24h.model.CCustomer;
import com.devcamp.shop24h.model.CProduct;
import com.devcamp.shop24h.model.CProductLine;
import com.devcamp.shop24h.repository.ICommentRepository;
import com.devcamp.shop24h.repository.IFindProductByCommentId;
import com.devcamp.shop24h.repository.IOrderDetailRepository;
import com.devcamp.shop24h.repository.IProductLineRepository;
import com.devcamp.shop24h.repository.IProductRepository;

@CrossOrigin
@RestController
public class ProductController {
	@Autowired
	IProductRepository productRepository;
	
	@Autowired
	IProductLineRepository productLineRepository;
	
	@Autowired
	IOrderDetailRepository orderDetrailRepository;
	
	@Autowired
	ICommentRepository commentRepository;
	
	/*
	 * get all product
	 */
	@GetMapping("/products/all")
	public List<CProduct> getAllProduct() {
		return productRepository.findAll();
	}
	
	/*
	 * get all line
	 */
	@GetMapping("/productLine/all")
	public List<CProductLine> getAllProductLine(){
		return productLineRepository.findAll();
	}
	
	/*
	 * get top sell product
	 */
	@GetMapping("/topSellProduct")
	public ResponseEntity<Object> getTopSellProduct(){
		try {
			return new ResponseEntity<>(orderDetrailRepository.getTopSellProduct(), HttpStatus.OK);
		}catch(Exception e) {
			return new ResponseEntity<>(e.getCause().getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	/*
	 * get product line
	 * @Param product line Id
	 * return product line
	 */
	@GetMapping("/productLine")
	public Optional<CProductLine> getProductLineById(@RequestParam("id") int id){
		return productLineRepository.findById(id);
	}
	
	
	@GetMapping("/products")
	public ResponseEntity<Map<String, Object>> getAllPorduct(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "8") int size) {
		try {
			List<CProduct> vProducts = new ArrayList<CProduct>();
			Pageable paging = PageRequest.of(page, size);
			Page<CProduct> pageProduct;

			pageProduct = productRepository.findAll(paging);
			vProducts = pageProduct.getContent();
			Map<String, Object> response = new HashMap<>();
			response.put("products", vProducts);
			response.put("currentPage", pageProduct.getNumber());
			response.put("totalItems", pageProduct.getTotalElements());
			response.put("totalPages", pageProduct.getTotalPages());
			return new ResponseEntity<>(response, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	/*
	 * get product by product id
	 * @Param id
	 */
	@GetMapping("/product")
	public ResponseEntity<CProduct> getProductById(@RequestParam("id") Integer id) {
		Optional<CProduct> productData = productRepository.findById(id);
		if (productData.isPresent()) {
			return new ResponseEntity<>(productData.get(), HttpStatus.OK);
		}else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	/*
	 * filter product by name with pagination
	 * @Param name, page, size
	 * 
	 */
	@GetMapping("/products/find")
	public ResponseEntity<Map<String, Object>> getProuctByName(
			@RequestParam("name") String productName,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "8") int size
			){
		try {
			List<CProduct> vProducts = new ArrayList<CProduct>();
			Pageable paging = PageRequest.of(page, size);
			Page<CProduct> pageProduct;

			pageProduct = productRepository.findProductByProductName(productName, paging);
			vProducts = pageProduct.getContent();
			Map<String, Object> response = new HashMap<>();
			response.put("products", vProducts);
			response.put("currentPage", pageProduct.getNumber());
			response.put("totalItems", pageProduct.getTotalElements());
			response.put("totalPages", pageProduct.getTotalPages());
			return new ResponseEntity<>(response, HttpStatus.OK);
		}catch(Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	/*
	 * filter product by brand name or product line id with pagination
	 * @Param brandName, productLineId, page, size
	 */
	@GetMapping("/products/search")
	public ResponseEntity<Map<String, Object>> getProuctByBrandNameAnd_ProductLine(
			@RequestParam("brandName") String brandName,
			@RequestParam("productLineId") String productLineId,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "8") int size
			){
		try {
			List<CProduct> vProducts = new ArrayList<CProduct>();
			Pageable paging = PageRequest.of(page, size);
			Page<CProduct> pageProduct;

			pageProduct = productRepository.findProductByProductVender_AndProductLine(brandName, productLineId, paging);
			vProducts = pageProduct.getContent();
			Map<String, Object> response = new HashMap<>();
			response.put("products", vProducts);
			response.put("currentPage", pageProduct.getNumber());
			response.put("totalItems", pageProduct.getTotalElements());
			response.put("totalPages", pageProduct.getTotalPages());
			return new ResponseEntity<>(response, HttpStatus.OK);
		}catch(Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	/*
	 * find product by comment Id
	 * @Param commentId
	 */
	@GetMapping("/product/getByCommentId/{commentId}")
	public ResponseEntity<?> findProductByCommentId(@PathVariable("commentId") Integer commentId){
		try {
			return new ResponseEntity<>(commentRepository.findProductByCommentId(commentId), HttpStatus.OK);
		}catch(Exception e){
			return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.NOT_FOUND);
		}
	}
	
	/*
	 * create product
	 * @Param productLineId, CProduct
	 */
	@PostMapping("/product/create/{productLineId}")
	public ResponseEntity<Object> createProduct(@Valid @RequestBody CProduct cProduct, @PathVariable("productLineId") int productLineId) {
		Optional<CProductLine> productLineData = productLineRepository.findById(productLineId);
		try {
			if(productLineData.isPresent()) {
				CProduct newProduct = new CProduct();
				newProduct.setBuyPrice(cProduct.getBuyPrice());
				newProduct.setProductCode(cProduct.getProductCode());
				newProduct.setProductDescription(cProduct.getProductDescription());
				newProduct.setProductName(cProduct.getProductName());
				newProduct.setProductVendor(cProduct.getProductVendor());
				newProduct.setQuantityInStock(cProduct.getQuantityInStock());
				
				CProductLine productLine = productLineData.get();
				newProduct.setProductLine(productLine);
				CProduct createProduct = productRepository.save(newProduct);
				return new ResponseEntity<>(createProduct, HttpStatus.CREATED);
			}else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
			
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(e, HttpStatus.NOT_FOUND);
		}
	}
	
	/*
	 * update product by product id
	 * @Param productId
	 */
	@PutMapping("/product/update/{productId}")
	public ResponseEntity<Object> updateProduct(@PathVariable("productId") Integer id, @Valid @RequestBody CProduct cProduct) {
		Optional<CProduct> productData = productRepository.findById(id);
		if (productData.isPresent()) {
			CProduct newProduct = productData.get();
			newProduct.setBuyPrice(cProduct.getBuyPrice());
			newProduct.setProductCode(cProduct.getProductCode());
			newProduct.setProductDescription(cProduct.getProductDescription());
			newProduct.setProductName(cProduct.getProductName());
			newProduct.setProductVendor(cProduct.getProductVendor());
			newProduct.setQuantityInStock(cProduct.getQuantityInStock());

			CProduct savedProduct = productRepository.save(newProduct);
			return new ResponseEntity<>(savedProduct, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	/*
	 * delete product by product id
	 * @Param productId
	 */
	@DeleteMapping("/product/delete/{productId}")
	public ResponseEntity<Object> deleteProductById(@PathVariable("productId") Integer id) {
		try {
			productRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
}
