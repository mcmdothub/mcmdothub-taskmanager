package com.mcmdothub.taskmanager.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

// we need to annotate it with the annotation "@Data" => this automatically generates the getters & setters + other methods like "toString", the high scope method that we can compare to users
@Data
// the annotation "@Builder" simplifies object creation, especially when a class has many attributes providing a Fluent API for creating instances of the class
// ex: we can do "User.builder" and then we can pass in the first name and the other fields are there in this sort of fluent way
// ex: User user = User.builder().firstname(). etc
@Builder
// the annotation "@NoArgsConstructor" which is required by JPA and allows JPA to create an instance of our user without any fields filled in
// and then fill them in as it gets the data from the database
@NoArgsConstructor
// the annotation "@AllArgsConstructor" which allows all the fields as parameters to be set accordingly
// which is useful if you want to create an instance of the class with all the fields and the slice in one go
@AllArgsConstructor
// the annotation "@Entity" is the JPA annotation that marks the class as a JPA entity
// meaning I represent a table in our database
@Entity
// we want to set the Table name explicitly because the user table is a reserved keyword in SQL databases
@Table(name = "_user")
public class User implements UserDetails {
    @Id
    // is going to be a generated value, and we can have as generated method
    // here is the database responsible for setting the id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    // by default the Generation method is "AUTO"
    @GeneratedValue
    private Integer id;

    private String firstname;
    private String lastname;
    private String email;
    private String password;

    // the annotation "@Enumerated" means this is a enumerated value
    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // "SimpleGrantedAuthority" the simplest way that i can describe an authority and pass in the name of that "role.name()"
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
