package com.devcamp.shop24h.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(name="customers")
public class CCustomer {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "last_name", length = 50)
	private String lastName;
	
	@Column(name = "first_name", length = 50)
	private String firstName;
	
	@Column(name = "phone_number", length = 50)
	private String phoneNumber;
	
	@Column(name = "address", length = 255)
	private String address;
	
	@Column(name = "city", length = 50)
	private String city;
	
	@Column(name = "email", length = 50, unique = true)
	@NotNull
	private String email;
	
	@Column(name = "credit_limit")
	private int creditLimit;
	
	@OneToMany(targetEntity = COrder.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "customer_id")
	private List<COrder> orders;
	
	

	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * @param email the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * @return the id
	 */
	public int getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(int id) {
		this.id = id;
	}

	/**
	 * @return the lastName
	 */
	public String getLastName() {
		return lastName;
	}

	/**
	 * @param lastName the lastName to set
	 */
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	/**
	 * @return the firstName
	 */
	public String getFirstName() {
		return firstName;
	}

	/**
	 * @param firstName the firstName to set
	 */
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	/**
	 * @return the phoneNumber
	 */
	public String getPhoneNumber() {
		return phoneNumber;
	}

	/**
	 * @param phoneNumber the phoneNumber to set
	 */
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	/**
	 * @return the address
	 */
	public String getAddress() {
		return address;
	}

	/**
	 * @param address the address to set
	 */
	public void setAddress(String address) {
		this.address = address;
	}

	/**
	 * @return the city
	 */
	public String getCity() {
		return city;
	}

	/**
	 * @param city the city to set
	 */
	public void setCity(String city) {
		this.city = city;
	}


	/**
	 * @return the creditLimit
	 */
	public int getCreditLimit() {
		return creditLimit;
	}

	/**
	 * @param creditLimit the creditLimit to set
	 */
	public void setCreditLimit(int creditLimit) {
		this.creditLimit = creditLimit;
	}

	/**
	 * @return the orders
	 */
	public List<COrder> getOrders() {
		return orders;
	}

	/**
	 * @param orders the orders to set
	 */
	public void setOrders(List<COrder> orders) {
		this.orders = orders;
	}





	/**
	 * @param id
	 * @param lastName
	 * @param firstName
	 * @param phoneNumber
	 * @param address
	 * @param city
	 * @param email
	 * @param creditLimit
	 * @param orders
	 */
	public CCustomer(int id, String lastName, String firstName, String phoneNumber, String address, String city,
			@NotNull String email, int creditLimit, List<COrder> orders) {
		super();
		this.id = id;
		this.lastName = lastName;
		this.firstName = firstName;
		this.phoneNumber = phoneNumber;
		this.address = address;
		this.city = city;
		this.email = email;
		this.creditLimit = creditLimit;
		this.orders = orders;
	}

	/**
	 * 
	 */
	public CCustomer() {
		super();
	}
	
	
}
