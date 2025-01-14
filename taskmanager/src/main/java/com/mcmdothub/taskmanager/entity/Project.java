package com.mcmdothub.taskmanager.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    // each project is going to have a list of tasks associated with it called tasks
    // is going to be OneToMany relationship mapped by the project
    // cascade = CascadeType.ALL mean that any changes made to tasks inside of this project will cascade to the task entity as well
    // orphanRemoval = true meaning any tasks that don't have a project will be removed
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Task> tasks;

    // we'll give this entity the power to be able to add and remove tasks
    // we will have an addTask method that will add a task to the database
    // and then set its project to this current project that is being used
    public void addTask(Task task) {
        tasks.add(task);
        task.setProject(this);
    }

    // we will have an removeTask method that will remove the task in the database
    // and set the project to null
    public void removeTask(Task task) {
        tasks.remove(task);
        task.setProject(null);
    }
}
