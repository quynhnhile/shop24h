package com.devcamp.shop24h.repository;

import java.math.BigDecimal;
import java.util.Date;

public interface IOrderTracking {
	public String getCheck_number();
	public int getProductId();
	public String getProduct_code();
	public String getProduct_name();
	public int getBuy_price();
	public int getQuantity_order();
	public Date getOrder_date();
	public String getStatus();
	public BigDecimal getAmmount();
}
