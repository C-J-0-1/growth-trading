package com.assignment.growth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BuyStockDto {

    private String symbol;
    private String companyName;
    private int quantity;
    private float price;
}
