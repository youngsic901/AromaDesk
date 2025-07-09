package com.example.aromadesk.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public String health() {
        return "Backend server is running!";
    }
} 