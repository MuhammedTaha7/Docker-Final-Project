//package com.example.login.exceptions;
//
//public class AuthinticationException extends RuntimeException {
//
//
//}

package com.example.backend.common.exceptions;

public class AuthenticationException extends RuntimeException {
    public AuthenticationException(String message) {
        super(message);
    }
}
