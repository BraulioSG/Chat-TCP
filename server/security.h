#ifndef SECURITY_H
#define SECURITY_H

char* encrypt(char *msg, int key){
    int size = strlen(msg);
    char *encyrpted = (char*)malloc(size + 1);
    for(int i = 0; i < size; i++){
        char c = msg[i];
        int ascii = (int)c;
        

        encyrpted[i] = (char)((ascii + key) % 255);
    }

    printf("encoded: %s\n", encyrpted);
    return encyrpted;
}

char* decrypt(char *code, int key){
    int size = strlen(code);
    char *decrypted = (char*)malloc(size + 1);

    for(int i = 0; i < size; i++){
        char c = code[i];
        int ascii = (int)c;


        decrypted[i] = (char)((ascii - key) % 255);
    }

    printf("decoded: %s\n", decrypted);
    return decrypted;
}
#endif