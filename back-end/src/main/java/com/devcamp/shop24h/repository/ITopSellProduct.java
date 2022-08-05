package com.devcamp.shop24h.repository;

public interface ITopSellProduct {
	public int getProduct_id();
	public String getProduct_code();
	public String getProduct_Name();
	public int getBuy_Price();
	public int getQtySum();
}
