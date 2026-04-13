package com.banking.atm;

import com.banking.atm.model.Account;
import com.banking.atm.model.Role;
import com.banking.atm.model.User;
import com.banking.atm.repository.AccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!accountRepository.existsByCardNumber("0000111122223333")) {
            User adminUser = new User();
            adminUser.setName("System Admin");
            adminUser.setEmail("admin@banking.com");
            adminUser.setRole(Role.ROLE_ADMIN);
            
            Account adminAccount = new Account();
            adminAccount.setAccountNumber("0000000000");
            adminAccount.setCardNumber("0000111122223333");
            adminAccount.setPinHash(passwordEncoder.encode("1234"));
            adminAccount.setBalance(new BigDecimal("1000000"));
            adminAccount.setUser(adminUser);
            adminAccount.setAccountType("Current");
            
            accountRepository.save(adminAccount);
        }
    }
}
