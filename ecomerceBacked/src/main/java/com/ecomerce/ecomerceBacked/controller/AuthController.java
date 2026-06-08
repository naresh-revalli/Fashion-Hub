package com.ecomerce.ecomerceBacked.controller;

import com.ecomerce.ecomerceBacked.model.User;
import com.ecomerce.ecomerceBacked.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService){
        this.userService = userService;
    }

    // ✅ Register
    @PostMapping("/register")
    public User register(@RequestBody User user){
        return userService.registerUser(user);
    }

    // ✅ Login (ADD THIS)
    @PostMapping("/login")
    public String login(@RequestBody User user){
        return userService.login(user.getEmail(), user.getPassword());
    }
}