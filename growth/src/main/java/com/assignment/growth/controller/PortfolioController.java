package com.assignment.growth.controller;

import com.assignment.growth.converter.Converter;
import com.assignment.growth.dto.PortfolioDto;
import com.assignment.growth.entity.Portfolio;
import com.assignment.growth.repository.PortfolioRepository;
import com.assignment.growth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.security.Principal;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    @GetMapping("/portfolio")
    public String portfolio(){
        return "portfolio";
    }

    @GetMapping("/portfolios")
    @ResponseBody
    public ResponseEntity<List<PortfolioDto>> getPortfolio(Principal principal){
        List<Portfolio> portfolios = portfolioRepository.findByUser(userRepository.findByEmail(principal.getName()));
        List<PortfolioDto> portfolioDtos = Converter.PortfolioToPortfolioDtoConverter(portfolios);
        return new ResponseEntity<>(portfolioDtos, HttpStatus.OK);
    }
}
