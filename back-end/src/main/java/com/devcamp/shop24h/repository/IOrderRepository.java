package com.devcamp.shop24h.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.TemporalType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devcamp.shop24h.model.COrder;
import com.devcamp.shop24h.model.COrderDetail;

public interface IOrderRepository extends JpaRepository<COrder, Integer>{

	@Query(value = "SELECT c.id as customer_id, c.first_name, c.last_name, c.phone_number FROM orders od INNER JOIN customers c ON od.customer_id = c.id WHERE od.id LIKE :orderId", nativeQuery = true)
	ICustomerGetByOrderId getCustomerByOrderId(@Param(value = "orderId") int orderId);
	
	@Query(value = "SELECT * \r\n"
			+ "FROM orders o\r\n"
			+ "INNER JOIN customers c ON o.customer_id = c.id\r\n"
			+ "WHERE status LIKE %:status%\r\n"
			+ "AND check_number LIKE %:orderNumber%\r\n"
			+ "AND customer_id LIKE %:customerId%", nativeQuery = true)
	List<COrder> findOrderByString (@Param(value = "status") String status,
										@Param(value = "orderNumber") String orderNumber,
										@Param(value = "customerId") String customerId);
	
	@Query(value = "SELECT * \r\n"
			+ "FROM orders o\r\n"
			+ "WHERE order_date >= :startDate AND order_date <= :endDate"
			+ "GROUP BY order_date", nativeQuery = true)
	ArrayList<IGetAmmountByDayRange> getAmmountByDayDateRange(
			@Param(value = "startDate") Date startDate,
			@Param(value = "endDate") Date endDate);
	
	@Query(value = "SELECT order_date, SUM(ammount) as total_ammount\r\n"
			+ "FROM `orders`\r\n"
			+ "GROUP BY order_date ASC", nativeQuery = true)
	ArrayList<IGetAmmountByDay> getAmmountByDayDate();
	
	List<COrder> findAllByOrderDateBetween(Date startDate, Date endDate);
	
	@Query(value = "SELECT COUNT(check_number) FROM orders", nativeQuery = true)
	Long countTotalOrder();
	
	@Query(value = "SELECT SUM(ammount) FROM orders", nativeQuery = true)
	Long sumTotalAmmount();
	
	@Query(value = "SELECT SUM(ammount) FROM orders WHERE customer_id LIKE :customerId", nativeQuery = true)
	Long sumTotalAmmountByCustomerId(@Param(value = "customerId") Integer customerId);
	
	
}
