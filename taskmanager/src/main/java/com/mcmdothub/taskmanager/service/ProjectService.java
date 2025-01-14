package com.mcmdothub.taskmanager.service;

import com.mcmdothub.taskmanager.entity.Project;
import com.mcmdothub.taskmanager.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Spring provides an annotation called "@Service" and indicates to Spring that this is a service
// which means it will automatically be detected by Spring's component scanning and be managed by the Spring container
@Service
public class ProjectService {
    // this is the reference to the repository used to interact with the data layer
    private final ProjectRepository projectRepository;

    // the value for that will be injected by the constructor
    // we annotate this constructor with "@Autowired" and this tells Spring to inject the repository bean into the project service when it is created
    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // we can now create some service methods that can be called by our controller
    // One service method "getAllProjects" that will return a list of projects
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Optional because that may come back as null
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
