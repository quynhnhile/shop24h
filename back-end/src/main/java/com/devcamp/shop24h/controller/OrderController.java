package com.devcamp.shop24h.controller;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Random;

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
import com.devcamp.shop24h.repository.ICustomerRepository;
import com.devcamp.shop24h.repository.IGetAmmountByDayRange;
import com.devcamp.shop24h.repository.IOrderRepository;

@CrossOrigin
@RestController
public class OrderController {
	@Autowired
	IOrderRepository orderRepository;
	
	@Autowired
	ICustomerRepository customerRepository;
	
	/*
	 * get all order
	 */
	@GetMapping("/orders")
	public List<COrder> getAllOrder() {
		return orderRepository.findAll();
	}
	
	/*
	 * Filter order by
	 * @Param status
	 * @Param orderNumber
	 * @Param customerID
	 * return List of Order
	 */
	@GetMapping("/order/filter")
	public ResponseEntity<List<COrder>> filterOrderByString(
			@RequestParam("status") String status,
			@RequestParam("orderNumber") String orderNumber,
			@RequestParam("customerId") String customerId){
		try {
			List<COrder> responseFilter = orderRepository.findOrderByString(status, orderNumber, customerId);
			return new ResponseEntity<>(responseFilter, HttpStatus.OK);
		}catch(Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	} 
	
	/*
	 * Get order data by range date to show chart
	 * @Param startDate
	 * @Param endDate
	 * 
	 */
	@GetMapping("/order/getAmmountByDateRange")
	public ResponseEntity<?> getAmmountByDayRange(
			@RequestParam("startDate") String startDate,
			@RequestParam("endDate") String endDate){
			try {
				ArrayList<IGetAmmountByDayRange> vRessult = orderRepository.getAmmountByDayDateRange(
						new SimpleDateFormat("yyyy-MM-dd").parse(startDate),
						new SimpleDateFormat("yyyy-MM-dd").parse(endDate));
				return new ResponseEntity<>(vRessult, HttpStatus.OK);
			}catch(Exception e) {
				return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
			}
	}
	
	/*
	 * Get order data ammount by date to show chart
	 */
	@GetMapping("/order/getAmmountByDay")
	public ResponseEntity<Object> getAmmountByDay(){
			try {
				return new ResponseEntity<>(orderRepository.getAmmountByDayDate(), HttpStatus.OK);
			}catch(Exception e) {
				return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
			}
	}
	
	/*
	 * Get order data by range date
	 * @Param startDate
	 * @Param endDate
	 * return List of Order
	 */
	@GetMapping("/order/getOrderByDateBetween")
	public ResponseEntity<List<COrder>> getOrderByDateBetween(
			@RequestParam("startDate") String startDate,
			@RequestParam("endDate") String endDate){
		try {
			List<COrder> vRessult = orderRepository.findAllByOrderDateBetween(
					new SimpleDateFormat("yyyy-MM-dd").parse(startDate),
					new SimpleDateFormat("yyyy-MM-dd").parse(endDate));
			return new ResponseEntity<>(vRessult, HttpStatus.OK);
		}catch(Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	
	/*
	 * count total order all time
	 * return total order
	 */
	@GetMapping("/order/count-total")
	public ResponseEntity<Object> countOrderTotal(){
			try {
				Long countOrderTotal = orderRepository.countTotalOrder();
				return new ResponseEntity<>(countOrderTotal, HttpStatus.OK);
			}catch(Exception e) {
				return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
			}
	}
	
	/*
	 * count total ammount of order all time
	 * return total ammount
	 */
	@GetMapping("/order/sum-total")
	public ResponseEntity<Object> sumTotalAmmount(){
			try {
				Long sumOrderTotal = orderRepository.sumTotalAmmount();
				return new ResponseEntity<>(sumOrderTotal, HttpStatus.OK);
			}catch(Exception e) {
				return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
			}
	}
	
	
	
	/*
	 * Create order by customer Id
	 * @Param customerId
	 * return order
	 */
	@PostMapping("/order/create/{id}")
	public ResponseEntity<Object> createOrder(@PathVariable("id") int id, @RequestBody COrder cOrder){
		Optional<CCustomer> customerData = customerRepository.findById(id);
		try {
			if(customerData.isPresent()) {
				String randomString = createRandom_Alphanumeric();
				COrder newOrder = new COrder();
				newOrder.setOrderDate(cOrder.getOrderDate());
				newOrder.setRequiredDate(cOrder.getRequiredDate());
				newOrder.setShippedDate(cOrder.getShippedDate());
				newOrder.setStatus(cOrder.getStatus());
				newOrder.setComments(cOrder.getComments());
				newOrder.setAmmount(cOrder.getAmmount());
				newOrder.setCheckNumber(randomString);
				
				CCustomer customer = customerData.get();
				newOrder.setCustomer(customer);
				COrder createOrder = orderRepository.save(newOrder);
				return new ResponseEntity<>(createOrder, HttpStatus.CREATED);
			}else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		}catch(Exception e) {
			return ResponseEntity.unprocessableEntity().body("Fail to create order");
		}
		
	}
	
	/*
	 * Update order by order Id
	 * @Param orderId
	 * return order
	 */
	@PutMapping("/order/update/{orderId}")
	public ResponseEntity<Object> updateOrder(
			@PathVariable("orderId") Integer orderId,
			@RequestBody COrder cOrder){
		try {
			Optional<COrder> orderData = orderRepository.findById(orderId);
			if(orderData.isPresent()) {
				COrder newOrder = orderData.get();
				newOrder.setAmmount(cOrder.getAmmount());
				newOrder.setCheckNumber(cOrder.getCheckNumber());
				newOrder.setComments(cOrder.getComments());
				newOrder.setOrderDate(cOrder.getOrderDate());
				newOrder.setRequiredDate(cOrder.getRequiredDate());
				newOrder.setShippedDate(cOrder.getShippedDate());
				newOrder.setStatus(cOrder.getStatus());
				
				COrder saveOrder = orderRepository.save(newOrder);
				return new ResponseEntity<>(saveOrder, HttpStatus.OK);
			}else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
			
		}catch(Exception e) {
			return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	/*
	 * Delete order by order Id
	 * @Param orderId
	 */
	@DeleteMapping("/order/delete/{orderId}")
	public ResponseEntity<Object> deleteOrder(@PathVariable("orderId") Integer orderId){
		try {
			orderRepository.deleteById(orderId);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}catch(Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	/*
	 * Generate Random String To add check_number field
	 * @Param orderId
	 */
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
