package com.assignment.growth.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum TransactionType {
    BUY("BUY"),
    SELL("SELL");

    public final String label;
}
