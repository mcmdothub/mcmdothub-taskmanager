package com.mcmdothub.taskmanager.controller;

import com.mcmdothub.taskmanager.entity.Project;
import com.mcmdothub.taskmanager.entity.Task;
import com.mcmdothub.taskmanager.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// Add annotations
// "@CrossOrigin" enables resource sharing or cores for the controller.
// It allows requests from the specified origin & allowedHeaders: "all" headers in the request
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*")
// "@RestController" indicates that HTTP request will be handled, and it will return data as JSON or XML
@RestController
// "@RequestMapping" means this is going to be available at "/api/projects"
@RequestMapping("/api/projects")
public class ProjectController {
    // create a private final field to store my project service
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        // we assign the project service to that particular field
        this.projectService = projectService;
    }

    // We can start with our Mapping
    // Because we annotated this as a REST controller
    // Java Spring is going to take responsibility for converting this to JSON
    @GetMapping
    public List<Project> getAllProjects() {
        // will get the list or project from my projectService
        return projectService.getAllProjects();
    }

    // I want this to be a full CRUD API so my other read functionality would be get an individual mapping
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Optional<Project> project = projectService.getProjectById(id);
        if (project.isPresent()) {
            return ResponseEntity.ok(project.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.saveProject(project);
    }

    // Is going to return a "ResponseEntity of type Project" and taking in the "id" and the project details
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable long id, @RequestBody Project projectDetails) {
        // will first get the project by it
        Optional<Project> project = projectService.getProjectById(id);
        if (project.isPresent()) {
            // we will update a project and set it to the initial project
            Project updatedProject = project.get();

            // then we'll work through field by field
            // we'll update the name, the description etc
            updatedProject.setName(projectDetails.getName());
            updatedProject.setDescription(projectDetails.getDescription());

            // for tasks will be different
            // first we clear all the tasks from the current project to ensure fresh association
            updatedProject.getTasks().clear();

            // then we will loop over each of the tasks that are available in the put body
            // and we'll use that addTask method that we created on our entity to add each individual task
            for (Task task : projectDetails.getTasks()) {
                updatedProject.addTask(task);
            }

            // finally we'll return our response OK and save the project
            return ResponseEntity.ok(projectService.saveProject(updatedProject));
        } else {
            // if the project was not found or optional we'll return a notFound
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
