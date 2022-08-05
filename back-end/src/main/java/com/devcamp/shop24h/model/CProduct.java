package com.devcamp.shop24h.model;

import java.math.BigDecimal;
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
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import org.springframework.format.annotation.NumberFormat;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sun.istack.NotNull;

@Entity
@Table(name="products")
public class CProduct {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@NotEmpty(message = "Nhập mã sản phẩm")
	@Size(min = 2, message = "mã sản phẩm phải có 2 ký tự")
	@Column(name = "product_code")
	private String productCode;
	
	@Column(name = "product_name")
	private String productName;
	
	@Column(name = "product_description")
	private String productDescription;
	
	@ManyToOne
	//@NotEmpty(message = "Chọn loại sản phẩm")
	@JoinColumn(name = "product_line_id")
	@JsonIgnore
	private CProductLine productLine;
	
	@Column(name = "product_vendor")
	private String productVendor;
	
	@Column(name = "quantity_in_stock")
	private int quantityInStock;
	
	@Column(name = "buy_price")
	@Digits(integer=8, fraction=2)
	private BigDecimal buyPrice;
	
	@OneToMany(mappedBy = "product")
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
	 * @param id
	 * @param productCode
	 * @param productName
	 * @param productDescription
	 * @param productLine
	 * @param productVendor
	 * @param quantityInStock
	 * @param buyPrice
	 */
	public CProduct(int id,
			@NotEmpty(message = "Nhập mã sản phẩm") @Size(min = 2, message = "mã sản phẩm phải có 2 ký tự") String productCode,
			String productName, String productDescription,
			@NotEmpty(message = "Chọn loại sản phẩm") CProductLine productLine, String productVendor,
			int quantityInStock, @Digits(integer = 8, fraction = 2) BigDecimal buyPrice) {
		super();
		this.id = id;
		this.productCode = productCode;
		this.productName = productName;
		this.productDescription = productDescription;
		this.productLine = productLine;
		this.productVendor = productVendor;
		this.quantityInStock = quantityInStock;
		this.buyPrice = buyPrice;
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
	 * @return the productName
	 */
	public String getProductName() {
		return productName;
	}

	/**
	 * @param productName the productName to set
	 */
	public void setProductName(String productName) {
		this.productName = productName;
	}

	/**
	 * @return the productDescription
	 */
	public String getProductDescription() {
		return productDescription;
	}

	/**
	 * @param productDescription the productDescription to set
	 */
	public void setProductDescription(String productDescription) {
		this.productDescription = productDescription;
	}

	/**
	 * @return the productLine
	 */
	public CProductLine getProductLine() {
		return productLine;
	}

	/**
	 * @param productLine the productLine to set
	 */
	public void setProductLine(CProductLine productLine) {
		this.productLine = productLine;
	}

	/**
	 * @return the productVendor
	 */
	public String getProductVendor() {
		return productVendor;
	}

	/**
	 * @param productVendor the productVendor to set
	 */
	public void setProductVendor(String productVendor) {
		this.productVendor = productVendor;
	}

	/**
	 * @return the quantityInStock
	 */
	public int getQuantityInStock() {
		return quantityInStock;
	}

	/**
	 * @param quantityInStock the quantityInStock to set
	 */
	public void setQuantityInStock(int quantityInStock) {
		this.quantityInStock = quantityInStock;
	}

	/**
	 * @return the buyPrice
	 */
	public BigDecimal getBuyPrice() {
		return buyPrice;
	}

	/**
	 * @param buyPrice the buyPrice to set
	 */
	public void setBuyPrice(BigDecimal buyPrice) {
		this.buyPrice = buyPrice;
	}

	/**
	 * 
	 */
	public CProduct() {
		super();
	}

	
	
	
}
