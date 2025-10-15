package com.example.helpdesk.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    // Capture toutes les routes qui ne commencent pas par /api
    @RequestMapping(value = "/**/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/index.html";
    }
}
