package com.devcamp.shop24h.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devcamp.shop24h.model.CReply;

public interface IReplyRepository extends JpaRepository<CReply, Integer>{
	
	@Query(value="SELECT * FROM replies WHERE comment_id LIKE :commentId", nativeQuery = true)
	List<CReply> getReplyByCommentId(@Param("commentId") Integer commentId);
}
