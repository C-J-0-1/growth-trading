package com.assignment.growth.controller;

import com.assignment.growth.converter.Converter;
import com.assignment.growth.dto.PortfolioDto;
import com.assignment.growth.entity.Portfolio;
import com.assignment.growth.entity.Stock;
import com.assignment.growth.entity.User;
import com.assignment.growth.repository.PortfolioRepository;
import com.assignment.growth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
class PortfolioControllerTest {

    @Mock
    UserRepository userRepository;
    @Mock
    Principal principal;
    @Mock
    Converter converter;
    @Mock
    PortfolioRepository portfolioRepository;
    @InjectMocks
    PortfolioController portfolioController;

    Stock stock = Stock.builder()
            .id(1)
            .symbol("AAPL")
            .companyName("APPLE INC.").build();
    User user = User.builder()
            .id(1)
            .firstName("Mike")
            .lastName("Tyson")
            .phone("6789543210")
            .email("mike@gmail.com")
            .password("test").build();
    List<Portfolio> portfolios = new ArrayList<>(Arrays.asList(
            new Portfolio(1, stock, 10, 20000, user)
    ));

    List<PortfolioDto> portfolioDtos = new ArrayList<>(Arrays.asList(
            PortfolioDto.builder()
                    .stockName("AAPL")
                    .price(2000)
                    .shares(10).build()
    ));

    @Test
    void testGetPortfolio(){
        when(userRepository.findByEmail("mike@gmail.com")).thenReturn(user);

        when(portfolioRepository.findByUser(user)).thenReturn(portfolios);

        mockStatic(Converter.class).when(() -> Converter.PortfolioToPortfolioDtoConverter(portfolios)).thenReturn(portfolioDtos);

        ResponseEntity<List<PortfolioDto>> response = portfolioController.getPortfolio(principal);

        assertEquals(response.getBody(), portfolioDtos);
    }
}
