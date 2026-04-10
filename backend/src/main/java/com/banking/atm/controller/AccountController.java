package com.banking.atm.controller;

import com.banking.atm.dto.AmountRequest;
import com.banking.atm.dto.PinChangeRequest;
import com.banking.atm.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/balance")
    public ResponseEntity<?> getBalance(Authentication auth) {
        return ResponseEntity.ok(accountService.getBalance(auth.getName()));
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(Authentication auth, @Valid @RequestBody AmountRequest request) {
        try {
            return ResponseEntity.ok(accountService.deposit(auth.getName(), request.getAmount()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(Authentication auth, @Valid @RequestBody AmountRequest request) {
        try {
            return ResponseEntity.ok(accountService.withdraw(auth.getName(), request.getAmount()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/fast-cash")
    public ResponseEntity<?> fastCash(Authentication auth, @Valid @RequestBody AmountRequest request) {
        try {
            return ResponseEntity.ok(accountService.fastCash(auth.getName(), request.getAmount()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/pin-change")
    public ResponseEntity<?> changePin(Authentication auth, @Valid @RequestBody PinChangeRequest request) {
        try {
            return ResponseEntity.ok(accountService.changePin(auth.getName(), request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/statement")
    public ResponseEntity<?> getMiniStatement(Authentication auth) {
        return ResponseEntity.ok(accountService.getMiniStatement(auth.getName()));
    }
}
