package com.assignment.growth.controller;

import com.assignment.growth.converter.Converter;
import com.assignment.growth.dto.BuyStockDto;
import com.assignment.growth.dto.SellStockDto;
import com.assignment.growth.dto.TransactionDto;
import com.assignment.growth.entity.*;
import com.assignment.growth.repository.PortfolioRepository;
import com.assignment.growth.repository.StockRepository;
import com.assignment.growth.repository.TransactionRepository;
import com.assignment.growth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class TransactionController {

    private final UserRepository userRepository;
    private final StockRepository stockRepository;
    private final PortfolioRepository portfolioRepository;
    private final TransactionRepository transactionRepository;

    @PostMapping("/buy")
    @ResponseBody
    @Transactional
    public String buyStock(@RequestBody BuyStockDto buyStockDto, Principal principal){
        // If stock does not exist in database then save it
        // Otherwise reuse it
        Stock stock;
        if (stockRepository.findBySymbol(buyStockDto.getSymbol()) == null){
           stock = stockRepository.save(Stock.builder()
                            .symbol(buyStockDto.getSymbol())
                            .companyName(buyStockDto.getCompanyName())
                            .build());
        }
        else stock = stockRepository.findBySymbol(buyStockDto.getSymbol());

        // Getting logged in user from principle
        User user = userRepository.findByEmail(principal.getName());

        // Setting up portfolio
        Portfolio portfolio = Portfolio.builder()
                .stock(stock)
                .shares(buyStockDto.getQuantity())
                .avgTotalPrice(buyStockDto.getQuantity() * buyStockDto.getPrice())
                .user(user)
                .build();

        portfolioRepository.save(portfolio);

        // Saving the transaction
        Transaction transaction = Transaction.builder()
                .stock(stock)
                .type(TransactionType.BUY)
                .shares(buyStockDto.getQuantity())
                .localDate(LocalDate.now())
                .pricePerShare(buyStockDto.getPrice())
                .user(user)
                .build();

        transactionRepository.save(transaction);

        return "success";
    }

    @PostMapping("/sell")
    @ResponseBody
    @Transactional
    public String sellStock(@RequestBody SellStockDto sellStockDto, Principal principal){
        User user = userRepository.findByEmail(principal.getName());

        // Finding the stock that user wants to sell
        Portfolio portfolio = user.getPortfolios().stream().filter(portfolio1 -> portfolio1.getStock().getSymbol().equals(sellStockDto.getSymbol())).findFirst().get();

        portfolio.setShares(portfolio.getShares() - sellStockDto.getQuantity());
        portfolioRepository.save(portfolio);

        Transaction transaction = Transaction.builder()
                .stock(portfolio.getStock())
                .type(TransactionType.SELL)
                .shares(sellStockDto.getQuantity())
                .localDate(LocalDate.now())
                .pricePerShare(sellStockDto.getPrice())
                .user(user)
                .build();

        transactionRepository.save(transaction);

        return "success";
    }

    @GetMapping("/transaction")
    public String transaction(){
        return "transaction";
    }

    // return list of all transactions of logged-in user
    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionDto>> getTransactions(Principal principal){
        List<Transaction> transactions = transactionRepository.findByUser(userRepository.findByEmail(principal.getName()));
        List<TransactionDto> transactionDtos = Converter.TransactionToTransactionDtoConverter(transactions);

        return new ResponseEntity<>(transactionDtos, HttpStatus.OK);
    }
}
