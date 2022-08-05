package com.devcamp.shop24h.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="product_lines")
public class CProductLine {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "product_line", length = 50)
	private String productCode;
	
	@Column(name = "description", length = 2500)
	private String description;

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
	 * @return the productCode
	 */
	public String getProductCode() {
		return productCode;
	}

	/**
	 * @param productCode the productCode to set
	 */
	public void setProductCode(String productCode) {
		this.productCode = productCode;
	}

	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * @param description the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * @param id
	 * @param productCode
	 * @param description
	 */
	public CProductLine(int id, String productCode, String description) {
		super();
		this.id = id;
		this.productCode = productCode;
		this.description = description;
	}

	/**
	 * 
	 */
	public CProductLine() {
		super();
	}
	
	
}
