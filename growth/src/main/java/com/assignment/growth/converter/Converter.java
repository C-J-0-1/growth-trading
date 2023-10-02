package com.assignment.growth.converter;

import com.assignment.growth.dto.PortfolioDto;
import com.assignment.growth.dto.TransactionDto;
import com.assignment.growth.entity.Portfolio;
import com.assignment.growth.entity.Transaction;

import java.util.ArrayList;
import java.util.List;

public class Converter {

    public static List<PortfolioDto> PortfolioToPortfolioDtoConverter(List<Portfolio> portfolios){
        List<PortfolioDto> portfolioDtos = new ArrayList<>();

        portfolios.forEach(portfolio -> {
            PortfolioDto portfolioDto = PortfolioDto.builder()
                    .shares(portfolio.getShares())
                    .price(portfolio.getAvgTotalPrice())
                    .stockName(portfolio.getStock().getSymbol())
                    .build();
            portfolioDtos.add(portfolioDto);
        });

        return portfolioDtos;
    }

    public static List<TransactionDto> TransactionToTransactionDtoConverter(List<Transaction> transactions){
        List<TransactionDto> transactionDtos = new ArrayList<>();

        transactions.forEach(transaction -> {
            TransactionDto transactionDto = TransactionDto.builder()
                    .date(transaction.getLocalDate())
                    .transactionType(transaction.getType())
                    .shares(transaction.getShares())
                    .stockName(transaction.getStock().getSymbol())
                    .price(transaction.getPricePerShare())
                    .build();
            transactionDtos.add(transactionDto);
        });

        return transactionDtos;
    }
}
