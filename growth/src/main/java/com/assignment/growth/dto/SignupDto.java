package com.assignment.growth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class SignupDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
}
