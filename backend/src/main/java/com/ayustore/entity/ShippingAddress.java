package com.ayustore.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingAddress {

    private String firstName;
    private String lastName;
    private String address;
    private String city;
    private String zipCode;
    private String country;
}
