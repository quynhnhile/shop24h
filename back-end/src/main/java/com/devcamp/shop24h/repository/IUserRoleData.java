package com.devcamp.shop24h.repository;

import java.util.Date;

public interface IUserRoleData {
	public int getId();
	public String getUsername();
	public String getFirstname();
	public String getLastname();
	public Date getCreate_at();
	public String getRole_key();
	public String getRole_name();
}
