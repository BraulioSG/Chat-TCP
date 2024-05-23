#include <stdio.h>
#include <stdlib.h>
#include "security.h"

int main() {
    char message[] = "Hello, World!";
    int key = 3;

    // Encrypt the message
    char *encrypted_message = encrypt(message, key);
    if (encrypted_message == NULL) {
        fprintf(stderr, "Encryption failed\n");
        return EXIT_FAILURE;
    }
    printf("Encrypted message: %s\n", encrypted_message);

    // Decrypt the message
    char *decrypted_message = decrypt(encrypted_message, key);
    if (decrypted_message == NULL) {
        fprintf(stderr, "Decryption failed\n");
        free(encrypted_message);
        return EXIT_FAILURE;
    }
    printf("Decrypted message: %s\n", decrypted_message);

    // Free allocated memory
    free(encrypted_message);
    free(decrypted_message);

    return EXIT_SUCCESS;
}
