package com.devcamp.shop24h.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="replies")
public class CReply {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "reply_detail", length = 500)
	private String replyDetail;
	
	@Column(name = "reply_name", length = 50)
	private String replyName;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "create_at")
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date createAt;
	
	@ManyToOne
	@JoinColumn(name = "comment_id")
	@JsonIgnore
	private CComment  comment;

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
	 * @return the replyDetail
	 */
	public String getReplyDetail() {
		return replyDetail;
	}

	/**
	 * @param replyDetail the replyDetail to set
	 */
	public void setReplyDetail(String replyDetail) {
		this.replyDetail = replyDetail;
	}

	

	/**
	 * @return the replyName
	 */
	public String getReplyName() {
		return replyName;
	}

	/**
	 * @param replyName the replyName to set
	 */
	public void setReplyName(String replyName) {
		this.replyName = replyName;
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
	 * @return the comment
	 */
	public CComment getComment() {
		return comment;
	}

	/**
	 * @param comment the comment to set
	 */
	public void setComment(CComment comment) {
		this.comment = comment;
	}

	

	/**
	 * @param id
	 * @param replyDetail
	 * @param replyName
	 * @param createAt
	 * @param comment
	 */
	public CReply(int id, String replyDetail, String replyName, Date createAt, CComment comment) {
		super();
		this.id = id;
		this.replyDetail = replyDetail;
		this.replyName = replyName;
		this.createAt = createAt;
		this.comment = comment;
	}

	/**
	 * 
	 */
	public CReply() {
		super();
	}

	
	
	
}
