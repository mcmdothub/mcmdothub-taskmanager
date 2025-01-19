package com.mcmdothub.taskmanager.config;

import com.mcmdothub.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

// we need to annotate it with the annotation "@Configuration"
// means anything inside of this class will be instantiated to my application at startup
@Configuration
// we need to annotate it with the annotation "@RequiredArgsConstructor"
// will make sure that it has the correct arguments for the repository to be instantiated
@RequiredArgsConstructor
public class ApplicationConfig {
    private final UserRepository repository;

    // in order for this to be instantiated as a service I need to annotate it with "@Bean"

    // Create a UserDetailsService
    // the interface of this comes from Spring Security
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> repository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
