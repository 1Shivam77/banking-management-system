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
import com.banking.atm.model.Role;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;
    private final SecureRandom random = new SecureRandom();

    public AuthService(UserRepository userRepository,
                       AccountRepository accountRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       OtpService otpService) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.otpService = otpService;
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

        if (account.getUser().getIsActive() != null && !account.getUser().getIsActive()) {
            throw new IllegalArgumentException("Account is frozen by Administrator");
        }

        // Generate OTP and require 2FA (if enabled by admin)
        if (otpService.isEnabled()) {
            otpService.generateOtp(account.getCardNumber());
            return new LoginResponse(true, "OTP generated and sent to console.");
        }

        // 2FA disabled — skip OTP, issue token directly
        String token = jwtUtil.generateToken(account.getCardNumber());
        String role = account.getUser().getRole().name();
        return new LoginResponse(token, account.getCardNumber(), account.getUser().getName(), role);
    }

    public LoginResponse verifyOtp(VerifyOtpRequest request) {
        if (!otpService.validateOtp(request.getCardNumber(), request.getOtp())) {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }

        Account account = accountRepository.findByCardNumber(request.getCardNumber())
                .orElseThrow(() -> new IllegalArgumentException("Invalid card number"));

        String token = jwtUtil.generateToken(account.getCardNumber());
        String role = account.getUser().getRole().name();
        return new LoginResponse(token, account.getCardNumber(), account.getUser().getName(), role);
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

    public LoginResponse adminLogin(AdminLoginRequest request) {
        User admin = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid admin credentials"));

        if (!admin.getRole().equals(Role.ROLE_ADMIN)) {
            throw new IllegalArgumentException("Unauthorized: Not an administrator");
        }

        if (!admin.getIsActive()) {
            throw new IllegalArgumentException("Account is frozen/inactive. Contact support.");
        }

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("Invalid admin credentials");
        }

        // Generate token for email instead of card number since admin might not have a card
        String token = jwtUtil.generateToken(admin.getEmail());
        
        return new LoginResponse(token, "ADMIN-N/A", admin.getName(), admin.getRole().name());
    }
}
