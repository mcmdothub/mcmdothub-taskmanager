package com.mcmdothub.taskmanager.repository;

import com.mcmdothub.taskmanager.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
