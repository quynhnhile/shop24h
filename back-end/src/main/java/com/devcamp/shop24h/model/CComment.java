package com.devcamp.shop24h.model;

import java.util.Date;
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
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="comments")
public class CComment {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "comment_detail", length = 500)
	private String commentDetail;
	
	@ManyToOne
	@JoinColumn(name = "product_id")
	@JsonIgnore
	private CProduct product;
	
	@ManyToOne
	@JoinColumn(name = "customer_id")
	@JsonIgnore
	private CCustomer customer;
	
	@Column(name = "comment_name", length = 50)
	private String commentName;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "create_at")
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date createAt;
	
	@OneToMany(targetEntity = CReply.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "comment_id")
	private List<CReply> reply;
	
	@Column(name = "vote")
	private int vote;
	
	
	
	/**
	 * @return the commentName
	 */
	public String getCommentName() {
		return commentName;
	}

	/**
	 * @param commentName the commentName to set
	 */
	public void setCommentName(String commentName) {
		this.commentName = commentName;
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
	 * @return the commentDetail
	 */
	public String getCommentDetail() {
		return commentDetail;
	}

	/**
	 * @param commentDetail the commentDetail to set
	 */
	public void setCommentDetail(String commentDetail) {
		this.commentDetail = commentDetail;
	}

	/**
	 * @return the product
	 */
	public CProduct getProduct() {
		return product;
	}

	/**
	 * @param product the product to set
	 */
	public void setProduct(CProduct product) {
		this.product = product;
	}

	/**
	 * @return the customer
	 */
	public CCustomer getCustomer() {
		return customer;
	}

	/**
	 * @param customer the customer to set
	 */
	public void setCustomer(CCustomer customer) {
		this.customer = customer;
	}

	/**
	 * @return the createAt
	 */
	public Date getCreateAt() {
		return createAt;
	}

	/**
	 * @param createAt the createAt to set
	 */
	public void setCreateAt(Date createAt) {
		this.createAt = createAt;
	}

	/**
	 * @return the reply
	 */
	public List<CReply> getReply() {
		return reply;
	}

	/**
	 * @param reply the reply to set
	 */
	public void setReply(List<CReply> reply) {
		this.reply = reply;
	}

	/**
	 * @return the vote
	 */
	public int getVote() {
		return vote;
	}

	/**
	 * @param vote the vote to set
	 */
	public void setVote(int vote) {
		this.vote = vote;
	}

	

	/**
	 * @param id
	 * @param commentDetail
	 * @param product
	 * @param customer
	 * @param commentName
	 * @param createAt
	 * @param reply
	 * @param vote
	 */
	public CComment(int id, String commentDetail, CProduct product, CCustomer customer, String commentName,
			Date createAt, List<CReply> reply, int vote) {
		super();
		this.id = id;
		this.commentDetail = commentDetail;
		this.product = product;
		this.customer = customer;
		this.commentName = commentName;
		this.createAt = createAt;
		this.reply = reply;
		this.vote = vote;
	}

	/**
	 * 
	 */
	public CComment() {
		super();
	}
	
	
	
	
}
