package com.mcmdothub.taskmanager.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

// the annotation "@Service" will allow Spring to be able to find it
// and take responsibility for being able to make it available for injection in the other components in our application
@Service
public class JwtService {
    // we need a secret key to be at least 256-bit string
    private final String secretKey = "9f8974d2826991ccd165dfa0f940df5598704161b7a002a04fc471eca942e43d";

    // hard code the jwt expiration
    // 1000 milliseconds * 60 seconds * 60 minutes * 24 hours * 365 days => so will last for 1 day
    private final long jwtExpiration = 1000L * 60 * 60 * 24 * 365;

    // Get the Username
    // method that returns a String => we are going to extract the username from the token
    public String extractUsername(String token) {
        return extractClaim(token, Claims:: getSubject);
    }

    // Get a Single Claim
    // I want the ability to take some kind of generic and return that generic type to extract the claim
    // this will take a string of token and some function which is able to take all the claims and return that claim "claimResolver"
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        // we get all the claims using a method called "extractAllClaims" which would take the token
        final Claims claims = extractAllClaims(token);

        // we are going to use the "claimsResolver" and apply that to that list of claims
        return claimsResolver.apply(claims);
    }

    // Get All the Claims
    // create a private function "extractAllClaims" which will take the token and return "Claims"
    private Claims extractAllClaims(String token) {
        // return something from the Jwts library, set the signing key
        // that needs to take the key using a method called "getSigningKey"
        // once we got that we build our parser
        // once is build we will parse the claims and pass in the token,
        // and finally we will get the body
        return Jwts
                .parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        // we need to convert the string into a key
        // we are going to get an array of bytes called "keyBytes"
        // we use "Decoders" from decoders which comes with jsonwebtoken with this decoder "BASE64" and we pass in the "secretKey"
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);

        // return "Keys" from jsonwebtoken
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // what if someone wants to create the token without extra details so just with the user details?
    // we create an overload method
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    // we want the ability to generate a token
    // we create a Map of Strings to Objects and we'll call this "extraClaims"
    // and the default are what's concluded in the user details
    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        // I want to return a buildToken and to pass in the "extraClaims", "userDetails", when the JWT is going to expire "jwtExpiration"
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Add two helper methods to service just to finish off
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
