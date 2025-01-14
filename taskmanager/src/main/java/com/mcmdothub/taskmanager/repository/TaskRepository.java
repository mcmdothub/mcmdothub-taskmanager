package com.mcmdothub.taskmanager.repository;

import com.mcmdothub.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

// our repository is going to extend the JpaRepository that takes as its first parameter the entity type
// and as its second the type of the entity's primary key
// in this way we have inherited the common database methods like Save, FindAll, FindById and Delete
// the Spring Jpa provides the ability to generate the queries based on the method names within the repository interface
public interface TaskRepository extends JpaRepository<Task, Long> {
}
