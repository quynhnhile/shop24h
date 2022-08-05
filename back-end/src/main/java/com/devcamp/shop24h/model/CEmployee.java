package com.devcamp.shop24h.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="employees")
public class CEmployee {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "last_name", length = 50)
	private String lastName;
	
	@Column(name = "first_name", length = 50)
	private String firstName;
	
	@Column(name = "extension", length = 50)
	private String extension;
	
	@Column(name = "email", length = 50)
	private String email;
	
	@Column(name = "office_code")
	private int officeCode;
	
	@Column(name = "report_to")
	private int reportTo;
	
	@Column(name = "job_title", length = 50)
	private String jobTitle;

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
	 * @return the lastName
	 */
	public String getLastName() {
		return lastName;
	}

	/**
	 * @param lastName the lastName to set
	 */
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	/**
	 * @return the firstName
	 */
	public String getFirstName() {
		return firstName;
	}

	/**
	 * @param firstName the firstName to set
	 */
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	/**
	 * @return the extension
	 */
	public String getExtension() {
		return extension;
	}

	/**
	 * @param extension the extension to set
	 */
	public void setExtension(String extension) {
		this.extension = extension;
	}

	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * @param email the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * @return the officeCode
	 */
	public int getOfficeCode() {
		return officeCode;
	}

	/**
	 * @param officeCode the officeCode to set
	 */
	public void setOfficeCode(int officeCode) {
		this.officeCode = officeCode;
	}

	/**
	 * @return the reportTo
	 */
	public int getReportTo() {
		return reportTo;
	}

	/**
	 * @param reportTo the reportTo to set
	 */
	public void setReportTo(int reportTo) {
		this.reportTo = reportTo;
	}

	/**
	 * @return the jobTitle
	 */
	public String getJobTitle() {
		return jobTitle;
	}

	/**
	 * @param jobTitle the jobTitle to set
	 */
	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	/**
	 * @param id
	 * @param lastName
	 * @param firstName
	 * @param extension
	 * @param email
	 * @param officeCode
	 * @param reportTo
	 * @param jobTitle
	 */
	public CEmployee(int id, String lastName, String firstName, String extension, String email, int officeCode,
			int reportTo, String jobTitle) {
		super();
		this.id = id;
		this.lastName = lastName;
		this.firstName = firstName;
		this.extension = extension;
		this.email = email;
		this.officeCode = officeCode;
		this.reportTo = reportTo;
		this.jobTitle = jobTitle;
	}

	/**
	 * 
	 */
	public CEmployee() {
		super();
	}
	
	
}
