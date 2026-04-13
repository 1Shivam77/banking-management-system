package com.banking.atm.service;

import com.banking.atm.model.Account;
import com.banking.atm.model.User;
import com.banking.atm.repository.AccountRepository;
import com.banking.atm.repository.TransactionRepository;
import com.banking.atm.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final OtpService otpService;

    public AdminService(UserRepository userRepository, AccountRepository accountRepository, 
                        TransactionRepository transactionRepository, OtpService otpService) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.otpService = otpService;
    }

    public Map<String, Object> get2faStatus() {
        return Map.of("enabled", otpService.isEnabled());
    }

    public Map<String, Object> toggle2fa(boolean enabled) {
        otpService.setEnabled(enabled);
        return Map.of("enabled", otpService.isEnabled(), "message", enabled ? "2FA has been enabled" : "2FA has been disabled");
    }

    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("name", user.getName());
            map.put("email", user.getEmail());
            map.put("isActive", user.getIsActive());
            map.put("role", user.getRole().name());
            
            accountRepository.findByUserId(user.getId()).ifPresent(account -> {
                map.put("cardNumber", account.getCardNumber());
                map.put("balance", account.getBalance());
            });
            
            return map;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> freezeAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        user.setIsActive(user.getIsActive() != null ? !user.getIsActive() : false);
        userRepository.save(user);

        return Map.of("message", "User account status updated", "isActive", user.getIsActive());
    }

    public Map<String, Object> getSystemMetrics() {
        long totalUsers = userRepository.count();
        long totalAccounts = accountRepository.count();
        long totalTransactions = transactionRepository.count();

        return Map.of(
            "totalUsers", totalUsers,
            "totalAccounts", totalAccounts,
            "totalTransactions", totalTransactions
        );
    }
}
