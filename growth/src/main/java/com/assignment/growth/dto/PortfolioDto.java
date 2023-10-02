package com.assignment.growth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PortfolioDto {

    private String stockName;
    private int shares;
    private float price;
}
