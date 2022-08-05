package com.devcamp.shop24h.controller;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.devcamp.shop24h.model.CCustomer;
import com.devcamp.shop24h.model.COrder;
import com.devcamp.shop24h.model.COrderDetail;
import com.devcamp.shop24h.model.CPayment;
import com.devcamp.shop24h.model.CProduct;
import com.devcamp.shop24h.repository.ICustomerRepository;
import com.devcamp.shop24h.repository.IOrderRepository;
import com.devcamp.shop24h.repository.IPaymentRepository;

@CrossOrigin
@RestController
public class PaymentController {
	@Autowired
	IPaymentRepository paymentRepository;
	
	@Autowired
	IOrderRepository orderRepository;
	
	@GetMapping("/payment/all")
	public List<CPayment> getAllPayment() {
		return paymentRepository.findAll();
	}
	
	@PostMapping("/payment/create/{orderId}")
	public ResponseEntity<Object> createOrderDetail(
			@PathVariable("orderId") int orderId,
			@RequestBody CPayment cPayment){
		Optional<COrder> orderData = orderRepository.findById(orderId);
		try {
			if(orderData.isPresent()) {
				String randomString = createRandom_Alphanumeric();
				CPayment newPayment = new CPayment();
				newPayment.setAmmount(cPayment.getAmmount());
				newPayment.setCheckNumber(randomString);
				newPayment.setPaymentDate(cPayment.getPaymentDate());
				
				COrder order = orderData.get();
				newPayment.setOrder(order);

				CPayment createPayment = paymentRepository.save(newPayment);
				return new ResponseEntity<>(createPayment, HttpStatus.CREATED);
			}else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		}catch(Exception e) {
			return ResponseEntity.unprocessableEntity().body("Fail to create order");
		}
		
	}
	
	public String createRandom_Alphanumeric() {
	    int leftLimit = 48; // numeral '0'
	    int rightLimit = 122; // letter 'z'
	    int targetStringLength = 10;
	    Random random = new Random();

	    String generatedString = random.ints(leftLimit, rightLimit + 1)
	      .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
	      .limit(targetStringLength)
	      .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
	      .toString();
	    return generatedString;
	    
	}
}
