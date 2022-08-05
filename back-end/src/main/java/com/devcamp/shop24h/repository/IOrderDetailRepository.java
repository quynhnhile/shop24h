package com.devcamp.shop24h.repository;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devcamp.shop24h.model.COrderDetail;
import com.devcamp.shop24h.repository.*;

public interface IOrderDetailRepository extends JpaRepository<COrderDetail, Integer>{
	
	@Query(value = "SELECT product_id, product_code, product_name, buy_price,sum(quantity_order) AS qtySum FROM order_details od INNER JOIN products p ON od.product_id = p.id GROUP BY product_id ORDER BY qtySum DESC LIMIT 4", nativeQuery = true)
	ArrayList<ITopSellProduct> getTopSellProduct();
	
	@Query(value = "SELECT od.id, product_id, product_code, product_name, price_each, quantity_order FROM order_details od INNER JOIN products p ON od.product_id = p.id WHERE order_id LIKE :orderId", nativeQuery = true)
	ArrayList<IGetOrderDetailByOrderId> getOrderDetailByOrderId(@Param(value = "orderId") int orderId);
	
	@Query(value = "SELECT o.check_number, p.id AS productId, p.product_code, p.product_name, p.buy_price, od.quantity_order, o.order_date, o.status, o.ammount\r\n"
			+ "FROM order_details od\r\n"
			+ "INNER JOIN orders o ON od.order_id = o.id\r\n"
			+ "INNER JOIN products p ON od.product_id = p.id\r\n"
			+ "INNER JOIN customers c ON o.customer_id = c.id\r\n"
			+ "WHERE o.check_number LIKE %:orderNumber% AND c.email LIKE %:customerEmail% ORDER BY o.order_date DESC", nativeQuery = true)
	ArrayList<IOrderTracking> getOrderInfoByEmailAndOrderNumber(@Param(value = "orderNumber") String orderNumber,@Param(value = "customerEmail") String customerEmail);
	
}
