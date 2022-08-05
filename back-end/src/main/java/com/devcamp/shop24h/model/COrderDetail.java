package com.devcamp.shop24h.model;


import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.Digits;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="order_details")
public class COrderDetail {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "order_id")
	@JsonIgnore
	private COrder order;

	@ManyToOne
	@JoinColumn(name = "product_id")
	@JsonIgnore
	private CProduct product;
	

	@Column(name = "quantity_order")
	private int quantityOrder;
	
	@Column(name = "price_each")
	@Digits(integer=8, fraction=2)
	private BigDecimal priceEach;
	
	
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
	 * @return the product
	 */
	public CProduct getProduct() {
		return product;
	}

	/**
	 * @param product the product to set
	 */
	public void setProduct(CProduct product) {
		this.product = product;
	}

	/**
	 * @return the quantityOrder
	 */
	public int getQuantityOrder() {
		return quantityOrder;
	}

	/**
	 * @param quantityOrder the quantityOrder to set
	 */
	public void setQuantityOrder(int quantityOrder) {
		this.quantityOrder = quantityOrder;
	}

	/**
	 * @return the priceEach
	 */
	public BigDecimal getPriceEach() {
		return priceEach;
	}

	/**
	 * @param priceEach the priceEach to set
	 */
	public void setPriceEach(BigDecimal priceEach) {
		this.priceEach = priceEach;
	}

	/**
	 * @param id
	 * @param order
	 * @param product
	 * @param quantityOrder
	 * @param priceEach
	 */
	public COrderDetail(int id, COrder order, CProduct product, int quantityOrder,
			@Digits(integer = 8, fraction = 2) BigDecimal priceEach) {
		super();
		this.id = id;
		this.order = order;
		this.product = product;
		this.quantityOrder = quantityOrder;
		this.priceEach = priceEach;
	}

	/**
	 * 
	 */
	public COrderDetail() {
		super();
	}
	
	
}
