package com.devcamp.shop24h.controller;

import java.util.List;
import java.util.Optional;

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
import com.devcamp.shop24h.repository.IOrderRepository;

@CrossOrigin
@RestController
public class CustomerController {
	
	@Autowired
	ICustomerRepository customerRepository;
	
	@Autowired
	IOrderRepository orderRepository;
	
	
	@GetMapping("/customers")
	public List<CCustomer> getAllCustomer() {
		return customerRepository.findAll();
	}
	
	@CrossOrigin
	@GetMapping("/customer/details/{customerId}")
	public ResponseEntity<CCustomer> getCustomerById(@PathVariable("customerId") Integer id) {
		Optional<CCustomer> customerData = customerRepository.findById(id);
		if (customerData.isPresent()) {
			return new ResponseEntity<>(customerData.get(), HttpStatus.OK);
		}else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/customer/details")
	public ResponseEntity<CCustomer> getCustomerByPhone(@RequestParam("phoneNumber") String phoneNumber){
		try {
			CCustomer customer = customerRepository.findByPhoneNumber(phoneNumber);
			if(customer != null) {
				return new ResponseEntity<>(customer, HttpStatus.OK);
			}else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		}catch (Exception e){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		
	}
	
	@GetMapping("/customer/find")
	public ResponseEntity<CCustomer> getCustomerByEmail(@RequestParam("email") String email){
		try {
			CCustomer customer = customerRepository.findByEmail(email);
			if(customer != null) {
				return new ResponseEntity<>(customer, HttpStatus.OK);
			}else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		}catch (Exception e){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		
	}
	
	@GetMapping("/customer")
	public ResponseEntity<Object> getCustomerByOrderId(@RequestParam("orderId") int orderId){
		try {
			return new ResponseEntity<>(orderRepository.getCustomerByOrderId(orderId), HttpStatus.OK);
		}catch(Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/customer/count-total")
	public ResponseEntity<Object> countTotalCustomer(){
			try {
				Long countTotalCustomer = customerRepository.countTotalCustomer();
				return new ResponseEntity<>(countTotalCustomer, HttpStatus.OK);
			}catch(Exception e) {
				return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
			}
	}
	
	@GetMapping("/customer/sumtotal/{customerId}")
	public ResponseEntity<Object> sumTotalAmmountByCustomerId(@PathVariable("customerId") Integer customerId){
			try {
				Long sumTotalAmmountByCustomer = orderRepository.sumTotalAmmountByCustomerId(customerId);
				return new ResponseEntity<>(sumTotalAmmountByCustomer, HttpStatus.OK);
			}catch(Exception e) {
				return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
			}
	}
	
	@GetMapping("customer/{customerEmail}/product/{productId}")
	public ResponseEntity<?> checkCustomerBuyProduct(@PathVariable("customerEmail") String customerEmail,
			@PathVariable("productId") Integer productId){
		try {
			Integer checkCustomerBuyProduct = customerRepository.checkCustomerBuyProduct(customerEmail, productId);
			return new ResponseEntity<>(checkCustomerBuyProduct, HttpStatus.OK);
		}catch(Exception e) {
			return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.NOT_FOUND);
		}
	}
	
	@PostMapping("/customer/create")
	public ResponseEntity<Object> createCustomer(@RequestBody CCustomer cCustomer) {
		try {
			CCustomer newCustomer = new CCustomer();
			newCustomer.setFirstName(cCustomer.getFirstName());
			newCustomer.setAddress(cCustomer.getAddress());
			newCustomer.setCity(cCustomer.getCity());
			newCustomer.setEmail(cCustomer.getEmail());
			newCustomer.setCreditLimit(cCustomer.getCreditLimit());
			newCustomer.setLastName(cCustomer.getLastName());
			newCustomer.setOrders(cCustomer.getOrders());
			newCustomer.setPhoneNumber(cCustomer.getPhoneNumber());
			CCustomer createCustomer = customerRepository.save(newCustomer);
			return new ResponseEntity<>(createCustomer, HttpStatus.CREATED);
		} catch (Exception e) {
			System.out.println("+++++++++++++++++++++::::: "+e.getCause().getCause().getMessage());
			return ResponseEntity.unprocessableEntity().body("Failed to Create Customer: "+e.getCause().getCause().getMessage());
		}
	}
	
	@PutMapping("/customer/update/{customerId}")
	public ResponseEntity<Object> updateCustomer(@PathVariable("customerId") Integer id, @RequestBody CCustomer cCustomer) {
		Optional<CCustomer> customerData = customerRepository.findById(id);
		if (customerData.isPresent()) {
			CCustomer newCustomer = customerData.get();
			newCustomer.setFirstName(cCustomer.getFirstName());
			newCustomer.setAddress(cCustomer.getAddress());
			newCustomer.setCity(cCustomer.getCity());
			newCustomer.setEmail(cCustomer.getEmail());
			newCustomer.setCreditLimit(cCustomer.getCreditLimit());
			newCustomer.setLastName(cCustomer.getLastName());
			newCustomer.setPhoneNumber(cCustomer.getPhoneNumber());

			CCustomer savedCustomer = customerRepository.save(newCustomer);
			return new ResponseEntity<>(savedCustomer, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@DeleteMapping("/customer/delete/{customerId}")
	public ResponseEntity<Object> deleteCustomerById(@PathVariable("customerId") Integer id) {
		try {
			customerRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/customer/namelike/{fname}")
	public List<CCustomer> getCustomerByNameLike(@PathVariable("fname") String customerName){
		try {
			
			List<CCustomer> fcustomer = customerRepository.findCustomerByFirstNameDesc(customerName);
			//List<Customer> lcustomer = customerRepository.findCustomerByLastNameDesc(customerName);				
			if (fcustomer != null) {
				return fcustomer;
			}else {
				return null;
			}
		} catch (Exception e) {
			return null;
		}
	}
	
	
}
