package com.banking.atm.controller;

import com.banking.atm.dto.AmountRequest;
import com.banking.atm.dto.PinChangeRequest;
import com.banking.atm.dto.TransferRequest;
import com.banking.atm.service.AccountService;
import com.banking.atm.service.PdfService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final AccountService accountService;
    private final PdfService pdfService;

    public AccountController(AccountService accountService, PdfService pdfService) {
        this.accountService = accountService;
        this.pdfService = pdfService;
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

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(Authentication auth, @Valid @RequestBody TransferRequest request) {
        try {
            return ResponseEntity.ok(accountService.transfer(auth.getName(), request.getTargetCardNumber(), request.getAmount()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/statement")
    public ResponseEntity<?> getMiniStatement(Authentication auth) {
        return ResponseEntity.ok(accountService.getMiniStatement(auth.getName()));
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(Authentication auth) {
        return ResponseEntity.ok(accountService.getAnalytics(auth.getName()));
    }

    @GetMapping("/statement/download")
    public ResponseEntity<byte[]> downloadStatementPdf(Authentication auth) {
        Map<String, Object> statementData = accountService.getMiniStatement(auth.getName());
        byte[] pdfBytes = pdfService.generateStatement(statementData);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "account_statement.pdf");
        
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
