#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <netdb.h>
#include <signal.h>
#include <unistd.h>
#include "security.h"

#define DIRSIZE 2048     /* Longitud máxima del parámetro de entrada/salida */
#define PUERTO 5000      /* Número de puerto arbitrario */

int sd, sd_actual;      
int addrlen;            
struct sockaddr_in sind, pin; 

void aborta_handler(int sig) {
    printf("....abortando el proceso servidor %d\n", sig);
    close(sd);
    close(sd_actual);
    exit(1);
}

int main() {
    char dir[DIRSIZE]; /* Parámetro de entrada y salida */

    if (signal(SIGINT, aborta_handler) == SIG_ERR) {
        perror("Could not set signal handler");
        return 1;
    }

    if ((sd = socket(AF_INET, SOCK_STREAM, 0)) == -1) {
        perror("socket");
        exit(1);
    }

    sind.sin_family = AF_INET;
    sind.sin_addr.s_addr = INADDR_ANY; /* INADDR_ANY=0x000000 = yo mismo */
    sind.sin_port = htons(PUERTO);     /* Convirtiendo a formato red */

    if (bind(sd, (struct sockaddr *)&sind, sizeof(sind)) == -1) {
        perror("bind");
        exit(1);
    }

    if (listen(sd, 5) == -1) {
        perror("listen");
        exit(1);
    }

    int max = 4;
    pid_t child_pid;
    for (int i = 0; i < max; i++) { /* Máximo max conexiones de cliente */
        /* Esperando que un cliente solicite un servicio */
        addrlen = sizeof(pin);
        if ((sd_actual = accept(sd, (struct sockaddr *)&pin, &addrlen)) == -1) {
            perror("accept");
            exit(1);
        }
        child_pid = fork();
        if (child_pid == 0) {
            /* Soy el hijo */
            break;
        } else {
            /* Soy el padre */
            close(sd_actual);
        }
    }

    if (child_pid == 0) {
        if (recv(sd_actual, dir, sizeof(dir), 0) == -1) {
            perror("recv");
            exit(1);
        }

        printf("rcvd: %s\n", dir);
        char *decoded = decrypt(dir, 1);
        if (!decoded) {
            fprintf(stderr, "Decryption failed\n");
            close(sd_actual);
            exit(1);
        }

        /* Define el comando para ejecutar el script de Node.js con el argumento de cadena */
        char command[DIRSIZE];
        sprintf(command, "node controller.js \"%s\"", decoded);
        printf("cmd: %s\n", command);

        /* Abre una tubería para capturar la salida estándar del comando */
        FILE *pipe = popen(command, "r");
        if (!pipe) {
            fprintf(stderr, "Error opening pipe.\n");
            free(decoded);
            close(sd_actual);
            return 1;
        }

        /* Lee la salida del comando de la tubería */
        char output[DIRSIZE];
        if (!fgets(output, sizeof(output), pipe)) {
            fprintf(stderr, "Error reading output from pipe.\n");
            pclose(pipe);
            free(decoded);
            close(sd_actual);
            return 1;
        }

        /* Cierra la tubería */
        pclose(pipe);

        /* Imprime la salida */
        printf("Output of the command: %s\n", output);

        char *encoded = encrypt(output, 10);
        if (!encoded) {
            fprintf(stderr, "Encryption failed\n");
            free(decoded);
            close(sd_actual);
            exit(1);
        }

        if (send(sd_actual, encoded, strlen(encoded), 0) == -1) {
            perror("send");
            free(decoded);
            free(encoded);
            close(sd_actual);
            exit(1);
        }

        free(decoded);
        free(encoded);

        close(sd_actual);
        close(sd);
        printf("Conexion cerrada\n");

    } else {
        /* Soy el padre */
        close(sd);
    }
    return 0;
}
