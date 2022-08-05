package com.devcamp.shop24h.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devcamp.shop24h.model.CComment;
import com.devcamp.shop24h.model.CCustomer;
import com.devcamp.shop24h.model.COrderDetail;
import com.devcamp.shop24h.model.CProduct;
import com.devcamp.shop24h.repository.ICommentRepository;
import com.devcamp.shop24h.repository.ICustomerRepository;
import com.devcamp.shop24h.repository.IProductRepository;

@CrossOrigin
@RestController
public class CommentController {
	@Autowired
	ICommentRepository commentRepository;
	
	@Autowired
	IProductRepository productRepository;
	
	@Autowired
	ICustomerRepository customerRepository;
	
	/*
	 * get all comment
	 */
	@GetMapping("/comments")
	public List<CComment> getAllComment() {
			return commentRepository.findAllCCommentsDESC();
	}
	
	
	/*
	 * get comment by customer id
	 * @Param customerId
	 */
	@GetMapping("/comments/customer/{customerId}")
	public ResponseEntity<?> getCommentByCustomerId(@PathVariable(value="customerId") Integer customerId){
		try {
			return new ResponseEntity<>(commentRepository.findAllByCustomerId(customerId), HttpStatus.OK);
		}catch(Exception e) {
			return new ResponseEntity<>("Chưa có bình luận", HttpStatus.NOT_FOUND);
		}
	}
	
	/*
	 * get comment by product Id
	 * @Param productId
	 */
	@GetMapping("/comments/product/{productId}")
	public ResponseEntity<?> getCommentByProductId(@PathVariable(value="productId") Integer productId){
		try {
			return new ResponseEntity<>(commentRepository.findAllByProductId(productId), HttpStatus.OK);
		}catch(Exception e) {
			return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.NOT_FOUND);
		}
	}
	
	/*
	 * create comment with role ADMIN, CUSTOMER
	 * @Param productId, CComment
	 */
	@PostMapping("/comment/product/{productId}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
	public ResponseEntity<?> createComment(@PathVariable("productId") Integer productId, @RequestBody CComment cComment){
		try {
			Optional<CProduct> productFound = productRepository.findById(productId);
			Optional<CCustomer> customerFound = Optional.of(customerRepository.findByEmail(cComment.getCommentName()));
			if(productFound.isPresent() && customerFound.isPresent()) {
				CComment newComment = new CComment();
				newComment.setCommentName(cComment.getCommentName());
				newComment.setCommentDetail(cComment.getCommentDetail());
				newComment.setCreateAt(cComment.getCreateAt());
				newComment.setVote(cComment.getVote());
				newComment.setProduct(productFound.get());
				newComment.setCustomer(customerFound.get());
				
				CComment createComment = commentRepository.save(newComment);
				return new ResponseEntity<>(createComment, HttpStatus.OK);
			}else {
				return new ResponseEntity<>("Không tạo được comment", HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}catch(Exception e) {
			return new ResponseEntity<>("Không có quyền tạo comment", HttpStatus.BAD_REQUEST);
		}
	}
	
	/*
	 * Delete comment by comment Id
	 * @Param commentId
	 */
	@DeleteMapping("/comment/delete/{commentId}")
	public ResponseEntity<Object> deleteCommentById(@PathVariable("commentId") Integer commentId){
		try {
			commentRepository.deleteById(commentId);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}catch(Exception e) {
			return new ResponseEntity<>(e.getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
