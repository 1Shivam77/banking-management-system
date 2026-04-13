package com.banking.atm.security;

import com.banking.atm.repository.AccountRepository;
import com.banking.atm.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtUtil jwtUtil, AccountRepository accountRepository, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtil.validateToken(token)) {
                String subject = jwtUtil.getCardNumberFromToken(token);

                // Try card-number lookup first (customer tokens)
                var accountOpt = accountRepository.findByCardNumber(subject);
                if (accountOpt.isPresent()) {
                    var account = accountOpt.get();
                    String roleName = account.getUser().getRole().name();
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    subject, null, Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(roleName)));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else {
                    // Fallback: email-based lookup (admin tokens)
                    userRepository.findByEmail(subject).ifPresent(user -> {
                        String roleName = user.getRole().name();
                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(
                                        subject, null, Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(roleName)));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    });
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
