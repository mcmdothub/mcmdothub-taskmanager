package com.mcmdothub.taskmanager.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

// To make this "Task" an entity class we need to annotate it with the annotation "@Entity"
// After we annotate it you will see the symbol of the database (left of the public class Task) that is telling us this is a database table
@Entity
// we use lombok annotation for setters and getters and will generate Getter and Setter methods for all the fields in my Task class
@Getter
@Setter
// when JPA loads an entity from the database it uses a no argument constructor to create an instance
// and then populates the fields with data retrieved from the database
// my tasks are going to exist within projects
@NoArgsConstructor
public class Task {
    // I want my Task to have some fields
    // Persistent entity 'Task' should have primary key so we add the annotation for the id "@Id"
    @Id
    // we give it a generated value
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Boolean completed;
    private LocalDate dueDate;

    // fetch = FetchType.LAZY means the Project entity will be loaded lazily
    // meaning it will only be fetched from the database when it's explicitly accessed and not when the task entity is initially loaded
    // this can improve performance especially in scenarios where the parent entity is large and not always needed
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    @JsonBackReference
    private Project project;
}
