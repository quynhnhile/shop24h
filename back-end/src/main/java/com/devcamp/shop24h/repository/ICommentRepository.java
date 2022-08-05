package com.devcamp.shop24h.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devcamp.shop24h.model.CComment;

public interface ICommentRepository extends JpaRepository<CComment, Integer>{
	
	List<CComment> findAllByCustomerId(Integer customerId);
	
	@Query(value="SELECT * FROM comments WHERE product_id LIKE :productId ORDER BY id DESC", nativeQuery = true)
	List<CComment> findAllByProductId(@Param(value="productId")Integer productId);
	
	@Query(value="SELECT * FROM comments ORDER BY create_at DESC", nativeQuery = true)
	List<CComment> findAllCCommentsDESC();
	
	@Query(value="SELECT p.id, p.product_code, p.product_name, p.quantity_in_stock\r\n"
			+ "FROM comments cm\r\n"
			+ "INNER JOIN products p ON cm.product_id = p.id\r\n"
			+ "WHERE cm.id LIKE :commentId", nativeQuery = true)
	IFindProductByCommentId findProductByCommentId(@Param(value="commentId")Integer commentId);

}
