package com.devcamp.shop24h.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="offices")
public class COffice {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "city")
	private String city;

	@Column(name = "phone")
	private String phone;
	
	@Column(name = "address_line")
	private String address_line;
	
	@Column(name = "state")
	private String state;
	
	@Column(name = "country")
	private String country;
	
	@Column(name = "territory")
	private String territory;

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
	 * @return the city
	 */
	public String getCity() {
		return city;
	}

	/**
	 * @param city the city to set
	 */
	public void setCity(String city) {
		this.city = city;
	}

	/**
	 * @return the phone
	 */
	public String getPhone() {
		return phone;
	}

	/**
	 * @param phone the phone to set
	 */
	public void setPhone(String phone) {
		this.phone = phone;
	}

	/**
	 * @return the address_line
	 */
	public String getAddress_line() {
		return address_line;
	}

	/**
	 * @param address_line the address_line to set
	 */
	public void setAddress_line(String address_line) {
		this.address_line = address_line;
	}

	/**
	 * @return the state
	 */
	public String getState() {
		return state;
	}

	/**
	 * @param state the state to set
	 */
	public void setState(String state) {
		this.state = state;
	}

	/**
	 * @return the country
	 */
	public String getCountry() {
		return country;
	}

	/**
	 * @param country the country to set
	 */
	public void setCountry(String country) {
		this.country = country;
	}

	/**
	 * @return the territory
	 */
	public String getTerritory() {
		return territory;
	}

	/**
	 * @param territory the territory to set
	 */
	public void setTerritory(String territory) {
		this.territory = territory;
	}

	/**
	 * @param id
	 * @param city
	 * @param phone
	 * @param address_line
	 * @param state
	 * @param country
	 * @param territory
	 */
	public COffice(int id, String city, String phone, String address_line, String state, String country,
			String territory) {
		super();
		this.id = id;
		this.city = city;
		this.phone = phone;
		this.address_line = address_line;
		this.state = state;
		this.country = country;
		this.territory = territory;
	}

	/**
	 * 
	 */
	public COffice() {
		super();
	}
	
	
}
