package com.assignment.growth.dto;

import com.assignment.growth.entity.TransactionType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class TransactionDto {

    private LocalDate date;
    private String stockName;
    private TransactionType transactionType;
    private int shares;
    private float price;
}
