package com.devcamp.shop24h.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Digits;

import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sun.istack.NotNull;

@Entity
@Table(name="orders")
public class COrder {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "order_date")
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date orderDate;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "required_date")
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date requiredDate;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "shipped_date")
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date shippedDate;
	
	@NotNull
	@Column(name = "status", length = 50)
	private String status;
	
	@Column(name = "comments", length = 255)
	private String comments;
	
	@Column(name = "ammount")
	@Digits(integer=10, fraction=2)
	private BigDecimal ammount;
	
	@Column(name = "check_number", length = 50, unique = true)
	@NotNull
	private String checkNumber;
	
	@ManyToOne
	@JoinColumn(name = "customer_id")
	@JsonIgnore
	private CCustomer customer;
	
	@OneToMany(mappedBy = "order")
	private List<COrderDetail> orderDetails;
	

	/**
	 * @return the orderDetails
	 */
	public List<COrderDetail> getOrderDetails() {
		return orderDetails;
	}

	/**
	 * @param orderDetails the orderDetails to set
	 */
	public void setOrderDetails(List<COrderDetail> orderDetails) {
		this.orderDetails = orderDetails;
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
	 * @return the orderDate
	 */
	public Date getOrderDate() {
		return orderDate;
	}

	/**
	 * @param orderDate the orderDate to set
	 */
	public void setOrderDate(Date orderDate) {
		this.orderDate = orderDate;
	}

	/**
	 * @return the requiredDate
	 */
	public Date getRequiredDate() {
		return requiredDate;
	}

	/**
	 * @param requiredDate the requiredDate to set
	 */
	public void setRequiredDate(Date requiredDate) {
		this.requiredDate = requiredDate;
	}

	/**
	 * @return the shippedDate
	 */
	public Date getShippedDate() {
		return shippedDate;
	}

	/**
	 * @param shippedDate the shippedDate to set
	 */
	public void setShippedDate(Date shippedDate) {
		this.shippedDate = shippedDate;
	}

	/**
	 * @return the status
	 */
	public String getStatus() {
		return status;
	}

	/**
	 * @param status the status to set
	 */
	public void setStatus(String status) {
		this.status = status;
	}

	/**
	 * @return the comments
	 */
	public String getComments() {
		return comments;
	}

	/**
	 * @param comments the comments to set
	 */
	public void setComments(String comments) {
		this.comments = comments;
	}

	/**
	 * @return the customer
	 */
	public CCustomer getCustomer() {
		return customer;
	}

	/**
	 * @param customer the customer to set
	 */
	public void setCustomer(CCustomer customer) {
		this.customer = customer;
	}

	

	/**
	 * @return the ammount
	 */
	public BigDecimal getAmmount() {
		return ammount;
	}

	/**
	 * @param ammount the ammount to set
	 */
	public void setAmmount(BigDecimal ammount) {
		this.ammount = ammount;
	}

	/**
	 * @return the checkNumber
	 */
	public String getCheckNumber() {
		return checkNumber;
	}

	/**
	 * @param checkNumber the checkNumber to set
	 */
	public void setCheckNumber(String checkNumber) {
		this.checkNumber = checkNumber;
	}

	
	/**
	 * @param id
	 * @param orderDate
	 * @param requiredDate
	 * @param shippedDate
	 * @param status
	 * @param comments
	 * @param ammount
	 * @param checkNumber
	 * @param customer
	 */
	public COrder(int id, Date orderDate, Date requiredDate, Date shippedDate, String status, String comments,
			@Digits(integer = 8, fraction = 2) BigDecimal ammount, String checkNumber, CCustomer customer) {
		super();
		this.id = id;
		this.orderDate = orderDate;
		this.requiredDate = requiredDate;
		this.shippedDate = shippedDate;
		this.status = status;
		this.comments = comments;
		this.ammount = ammount;
		this.checkNumber = checkNumber;
		this.customer = customer;
	}

	/**
	 * 
	 */
	public COrder() {
		super();
	}
	
	
}
