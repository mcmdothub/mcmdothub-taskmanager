package com.mcmdothub.taskmanager.repository;

import com.mcmdothub.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// our repository is going to extend the JpaRepository that takes as its first parameter the entity type
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
}
