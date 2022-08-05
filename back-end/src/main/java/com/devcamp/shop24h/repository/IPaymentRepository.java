package com.devcamp.shop24h.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devcamp.shop24h.model.CPayment;

public interface IPaymentRepository extends JpaRepository<CPayment, Integer>{

}
