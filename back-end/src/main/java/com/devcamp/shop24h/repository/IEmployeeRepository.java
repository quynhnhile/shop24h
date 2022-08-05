package com.devcamp.shop24h.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devcamp.shop24h.model.CEmployee;

public interface IEmployeeRepository extends JpaRepository<CEmployee, Integer>{

}
