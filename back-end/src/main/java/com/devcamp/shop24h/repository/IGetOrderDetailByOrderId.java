package com.devcamp.shop24h.repository;

import java.math.BigDecimal;

public interface IGetOrderDetailByOrderId {
	public int getId();
	public int getProduct_id();
	public String getProduct_code();
	public String getProduct_name();
	public int getPrice_each();
	public int getQuantity_order();
}
