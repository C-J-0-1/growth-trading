package com.assignment.growth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellStockDto {

    private String symbol;
    private int quantity;
    private float price;
}
