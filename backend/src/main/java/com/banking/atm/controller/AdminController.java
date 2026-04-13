package com.banking.atm.controller;

import com.banking.atm.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*") // Match the security config pattern
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/users/{id}/freeze")
    public ResponseEntity<?> freezeAccount(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.freezeAccount(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/metrics")
    public ResponseEntity<?> getSystemMetrics() {
        return ResponseEntity.ok(adminService.getSystemMetrics());
    }

    @GetMapping("/2fa-status")
    public ResponseEntity<?> get2faStatus() {
        return ResponseEntity.ok(adminService.get2faStatus());
    }

    @PostMapping("/2fa-toggle")
    public ResponseEntity<?> toggle2fa(@RequestBody java.util.Map<String, Boolean> body) {
        boolean enabled = body.getOrDefault("enabled", true);
        return ResponseEntity.ok(adminService.toggle2fa(enabled));
    }
}
