package com.assignment.growth.controller;

import com.assignment.growth.dto.LoginDto;
import com.assignment.growth.dto.SignupDto;
import com.assignment.growth.entity.User;
import com.assignment.growth.repository.UserRepository;
import com.assignment.growth.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
public class LoginController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @GetMapping(value = "/dashboard")
    public String dashboard(){
        return "dashboard";
    }

    @GetMapping(value = "/signup")
    public String signup(){
        return "signup";
    }

    @PostMapping(value = "/signup")
    public String signup(@ModelAttribute SignupDto signupDto){
        User user = User.builder()
                .firstName(signupDto.getFirstName())
                .lastName(signupDto.getLastName())
                .email(signupDto.getEmail())
                .password(passwordEncoder.encode(signupDto.getPassword()))
                .phone(signupDto.getPhone())
                .build();
        userRepository.save(user);
        return "redirect:/login";
    }

    @GetMapping(value = "/login")
    public String login(){
        return "login";
    }

    @PostMapping(value = "/login")
    public String login(@ModelAttribute LoginDto loginDto, HttpServletResponse response){
        // Authenticate the user
        // on failure redirect to login page (page refresh)
        try{
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
            );
        } catch (Exception e){
            return "redirect:/login";
        }

        // Setting up the cookie with token
        Cookie cookie = new Cookie("token", jwtUtil.generateToken(loginDto.getUsername()));
        cookie.setPath("/");
        response.addCookie(cookie);
        return "redirect:/dashboard";
    }
}
