package com.devcamp.shop24h.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Max;

import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sun.istack.NotNull;

@Entity
@Table(name="payments")
public class CPayment {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "order_id")
	@JsonIgnore
	private COrder order;
	
	@Column(name = "check_number", length = 50, unique = true)
	@NotNull
	private String checkNumber;
	
	@Column(name = "payment_date")
	@JsonFormat(pattern = "dd/MM/yyyy")
	private Date paymentDate;
	
	@Column(name = "ammount")
	@Digits(integer=8, fraction=2)
	private BigDecimal ammount;

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
	 * @return the paymentDate
	 */
	public Date getPaymentDate() {
		return paymentDate;
	}

	/**
	 * @param paymentDate the paymentDate to set
	 */
	public void setPaymentDate(Date paymentDate) {
		this.paymentDate = paymentDate;
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
	 * @return the order
	 */
	public COrder getOrder() {
		return order;
	}

	/**
	 * @param order the order to set
	 */
	public void setOrder(COrder order) {
		this.order = order;
	}

	/**
	 * @param id
	 * @param order
	 * @param checkNumber
	 * @param paymentDate
	 * @param ammount
	 */
	public CPayment(int id, COrder order, String checkNumber, Date paymentDate,
			@Digits(integer = 8, fraction = 2) BigDecimal ammount) {
		super();
		this.id = id;
		this.order = order;
		this.checkNumber = checkNumber;
		this.paymentDate = paymentDate;
		this.ammount = ammount;
	}

	/**
	 * 
	 */
	public CPayment() {
		super();
	}
	
	
}
