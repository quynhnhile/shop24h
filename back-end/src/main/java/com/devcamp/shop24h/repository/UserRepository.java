package com.devcamp.shop24h.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devcamp.shop24h.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    
    @Transactional
	@Modifying
    @Query(value="INSERT INTO t_user_role(user_id, role_id) VALUES (:userId,:roleId)", nativeQuery = true)
    void setRoleUser(@Param("userId") Long userId, @Param("roleId") Long roleId);
    
    @Query(value="SELECT u.id, u.username, u.firstname, u.lastname, u.created_at, r.role_key, r.role_name\r\n"
    		+ "FROM t_user_role ur \r\n"
    		+ "INNER JOIN t_user u ON ur.user_id = u.id \r\n"
    		+ "INNER JOIN t_role r ON ur.role_id = r.id", nativeQuery = true)
    IUserRoleData listUserRoleData();
    
    @Transactional
    @Modifying
    @Query(value="UPDATE t_user_role SET role_id = :roleId WHERE user_id = :userId", nativeQuery = true)
    void updateRoleUser(@Param("userId") Long userId, @Param("roleId") Long roleId);
}
