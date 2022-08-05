package com.devcamp.shop24h.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.devcamp.shop24h.model.COrder;
import com.devcamp.shop24h.model.COrderDetail;
import com.devcamp.shop24h.model.CProduct;
import com.devcamp.shop24h.repository.IOrderDetailRepository;
import com.devcamp.shop24h.repository.IOrderRepository;
import com.devcamp.shop24h.repository.IOrderTracking;
import com.devcamp.shop24h.repository.IProductRepository;

@CrossOrigin
@RestController
public class OrderDetailController {
	
	@Autowired
	IOrderDetailRepository orderDetailRepository;
	
	@Autowired
	IOrderRepository orderRepository;
	
	@Autowired
	IProductRepository productRepository;
	
	@GetMapping("/order-details")
	public List<COrderDetail> getAllOrder() {
		return orderDetailRepository.findAll();
	}
	
	@GetMapping("/order-detail")
	public ResponseEntity<Object> getOrderDetailByOrderId(@RequestParam("orderId") int orderId){
		try {
			return new ResponseEntity<>(orderDetailRepository.getOrderDetailByOrderId(orderId), HttpStatus.OK);
		}catch(Exception e) {
			return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.NOT_FOUND);
		}
	}
	
	
	@GetMapping("/order-detail/tracking")
	public ResponseEntity<Object> getOrderInfoByEmailAndOrderNumber(@RequestParam("orderNumber") String orderNumber, @RequestParam("customerEmail") String customerEmail)
	{
		try {
			ArrayList<IOrderTracking> response = orderDetailRepository.getOrderInfoByEmailAndOrderNumber(orderNumber, customerEmail);
			if (response.isEmpty()) {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}else {
				return new ResponseEntity<>(response, HttpStatus.OK);
			}	
		}catch(Exception e) {
			return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.NOT_FOUND);
		}
	}
	
	@PostMapping("/order-detail/create/{orderid}/product/{producid}")
	public ResponseEntity<Object> createOrderDetail(
			@PathVariable("orderid") int orderid,
			@PathVariable("producid") int producid,
			@RequestBody COrderDetail cOrderDetail){
		Optional<COrder> orderData = orderRepository.findById(orderid);
		Optional<CProduct> productData = productRepository.findById(producid);
		try {
			if(orderData.isPresent()) {
				COrderDetail newOrderDetail = new COrderDetail();
				newOrderDetail.setQuantityOrder(cOrderDetail.getQuantityOrder());
				newOrderDetail.setPriceEach(cOrderDetail.getPriceEach());
				
				COrder order = orderData.get();
				newOrderDetail.setOrder(order);
				
				CProduct product = productData.get();
				newOrderDetail.setProduct(product);
				COrderDetail createOrderDetail = orderDetailRepository.save(newOrderDetail);
				return new ResponseEntity<>(createOrderDetail, HttpStatus.CREATED);
			}else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		}catch(Exception e) {
			return ResponseEntity.unprocessableEntity().body("Fail to create order");
		}
		
	}
	
	@PutMapping("/order-detail/update/{orderDetailId}")
	public ResponseEntity<Object> updateOrderDetail(
			@PathVariable("orderDetailId") Integer orderDetailId,
			@RequestBody COrderDetail cOrderDetail){
		Optional<COrderDetail> orderDetailData = orderDetailRepository.findById(orderDetailId);
		try {
			if(orderDetailData.isPresent()) {
				COrderDetail editOrderDetail = orderDetailData.get();
				editOrderDetail.setQuantityOrder(cOrderDetail.getQuantityOrder());
				editOrderDetail.setPriceEach(cOrderDetail.getPriceEach());
				COrderDetail saveOrderDetail = orderDetailRepository.save(editOrderDetail);
				return new ResponseEntity<>(saveOrderDetail, HttpStatus.OK);
			}else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		}catch(Exception e) {
			return ResponseEntity.unprocessableEntity().body("Fail to update order detail");
		}
		
	}
	
	@DeleteMapping("/order-detail/delete/{orderDetailId}")
	public ResponseEntity<Object> deleteOrderDetail(@PathVariable("orderDetailId") int orderDetailId){
		try {
			orderDetailRepository.deleteById(orderDetailId);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}catch(Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
}
