package com.mcmdothub.taskmanager.security;

import com.mcmdothub.taskmanager.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// we need to annotate it with the annotation "@Component" which means the Spring will automatically detect the class
// and register it as a bean in the context making it available for dependency injection
// i want to apply this filter one time during each request response cycle
@Component
@RequiredArgsConstructor
// i want to be applied once per request
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    public final JwtService jwtService;
    final private UserDetailsService userDetailsService;

    // is going to take the request
    // and we're going to annotate that as "@NonNull"
    @Override
    protected void doFilterInternal(@NonNull  HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException
    {
        // the "authHeader" is in the header called "Authorization"
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // we want to check whether we want to return early if there's no authHeader
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // we are going to invoke the next chain in the filter because this one failed and will return early
            filterChain.doFilter(request, response);
            return;
        }

        // our jwt is going to be the "authHeader" taking away the first seven characters
        // that is because "Bearer " is seven characters and we just want the token
        jwt = authHeader.substring(7);      // substring = eliminate the first 7 characters

        // then we want to take the user email
        userEmail = jwtService.extractUsername(jwt);

        // if we have already authenticated this request at some point during this request response cycle
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            if(jwtService.isTokenValid(jwt, userDetails)) {
                // we'll create a username & password authentication token which we call "authToken"
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        // we pass in "userDetails", null for extra credentials, and roles
                        userDetails, null, userDetails.getAuthorities()
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // now we have an authentication token that we're going to store in our security context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
