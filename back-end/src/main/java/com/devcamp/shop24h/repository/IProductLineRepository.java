package com.devcamp.shop24h.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devcamp.shop24h.model.CProductLine;

public interface IProductLineRepository extends JpaRepository<CProductLine, Integer>{

}
