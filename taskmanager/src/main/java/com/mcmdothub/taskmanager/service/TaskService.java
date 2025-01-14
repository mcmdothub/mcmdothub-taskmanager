package com.mcmdothub.taskmanager.service;

import com.mcmdothub.taskmanager.entity.Project;
import com.mcmdothub.taskmanager.entity.Task;
import com.mcmdothub.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    // this is the reference to the repository used to interact with the data layer
    private final TaskRepository taskRepository;

    // the value for that will be injected by the constructor
    // we annotate this constructor with "@Autowired" and this tells Spring to inject the repository bean into the project service when it is created
    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // we can now create some service methods that can be called by our controller
    // One service method "getAllTasks" that will return a list of tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Optional because that may come back as null
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public void deleteTaskById(Long id) {
        taskRepository.deleteById(id);
    }
}