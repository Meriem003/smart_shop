package com.microtech.smartshop.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI smartShopOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartShop API")
                        .description("API REST pour la gestion commerciale B2B de MicroTech Maroc")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("MicroTech Maroc")
                                .email("contact@microtech.ma")));
    }
}
