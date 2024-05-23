//
// Created by EUMV on 22/05/2024.
//

#ifndef SECURITY_H
#define SECURITY_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/**
 * @brief Encrypts a message using a simple Caesar cipher.
 *
 * @param msg The message to be encrypted.
 * @param key The encryption key.
 * @return char* The encrypted message. The caller is responsible for freeing the allocated memory.
 */
char* encrypt(const char *msg, int key){
    int size = strlen(msg);
    char *encrypted = (char*)malloc(size + 1);
    if (!encrypted) {
        perror("Failed to allocate memory for encryption");
        return NULL;
    }

    for(int i = 0; i < size; i++){
        encrypted[i] = (char)((unsigned char)msg[i] + key);
    }
    encrypted[size] = '\0'; // Null-terminate the string

    //printf("encoded: %s\n", encrypted);
    return encrypted;
}

/**
 * @brief Decrypts a message encrypted using a simple Caesar cipher.
 *
 * @param code The encrypted message.
 * @param key The encryption key used to encrypt the message.
 * @return char* The decrypted message. The caller is responsible for freeing the allocated memory.
 */
char* decrypt(const char *code, int key){
    int size = strlen(code);
    char *decrypted = (char*)malloc(size + 1);
    if (!decrypted) {
        perror("Failed to allocate memory for decryption");
        return NULL;
    }

    for(int i = 0; i < size; i++){
        decrypted[i] = (char)((unsigned char)code[i] - key);
    }
    decrypted[size] = '\0'; // Null-terminate the string

    //printf("decoded: %s\n", decrypted);
    return decrypted;
}

#endif
