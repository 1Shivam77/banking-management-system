package com.banking.atm.service;

import com.banking.atm.dto.*;
import com.banking.atm.model.Account;
import com.banking.atm.model.User;
import com.banking.atm.repository.AccountRepository;
import com.banking.atm.repository.UserRepository;
import com.banking.atm.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final SecureRandom random = new SecureRandom();

    public AuthService(UserRepository userRepository,
                       AccountRepository accountRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Create User
        User user = new User();
        user.setName(request.getName());
        user.setFathersName(request.getFathersName());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setGender(request.getGender());
        user.setEmail(request.getEmail());
        user.setMaritalStatus(request.getMaritalStatus());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setPinCode(request.getPinCode());
        user.setState(request.getState());
        user.setReligion(request.getReligion());
        user.setCategory(request.getCategory());
        user.setIncome(request.getIncome());
        user.setEducation(request.getEducation());
        user.setOccupation(request.getOccupation());
        user.setPan(request.getPan());
        user.setAadhaar(request.getAadhaar());
        user.setSeniorCitizen(request.getSeniorCitizen());

        // Generate unique 16-digit card number
        String cardNumber = generateUniqueCardNumber();

        // Generate 4-digit PIN
        String rawPin = String.format("%04d", random.nextInt(10000));

        // Create Account
        Account account = new Account();
        account.setAccountNumber(generateAccountNumber());
        account.setCardNumber(cardNumber);
        account.setPinHash(passwordEncoder.encode(rawPin));
        account.setBalance(BigDecimal.ZERO);
        account.setUser(user);
        account.setAccountType(request.getAccountType());
        account.setServicesAtm(request.getServicesAtm());
        account.setServicesMobileBanking(request.getServicesMobileBanking());

        userRepository.save(user);
        accountRepository.save(account);

        return new RegisterResponse(cardNumber, rawPin,
                "Account created successfully! Save your credentials securely.");
    }

    public LoginResponse login(LoginRequest request) {
        Account account = accountRepository.findByCardNumber(request.getCardNumber())
                .orElseThrow(() -> new IllegalArgumentException("Invalid card number or PIN"));

        if (!passwordEncoder.matches(request.getPin(), account.getPinHash())) {
            throw new IllegalArgumentException("Invalid card number or PIN");
        }

        String token = jwtUtil.generateToken(account.getCardNumber());
        return new LoginResponse(token, account.getCardNumber(), account.getUser().getName());
    }

    private String generateUniqueCardNumber() {
        String cardNumber;
        do {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 16; i++) {
                sb.append(random.nextInt(10));
            }
            cardNumber = sb.toString();
        } while (accountRepository.existsByCardNumber(cardNumber));
        return cardNumber;
    }

    private String generateAccountNumber() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
