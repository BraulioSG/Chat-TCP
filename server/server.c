#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <netdb.h>
#include <signal.h>
#include <unistd.h>
#include "security.h"
#define  DIRSIZE   2048      /* longitud maxima parametro entrada/salida */
#define  PUERTO    5000	     /* numero puerto arbitrario */

int                  sd, sd_actual;  /* descriptores de sockets */
int                  addrlen;        /* longitud direcciones */
struct sockaddr_in   sind, pin;      /* direcciones sockets cliente u servidor */


void aborta_handler(int sig){
   printf("....abortando el proceso servidor %d\n",sig);
   close(sd);  
   close(sd_actual); 
   exit(1);
}


int main(){
  
	char  dir[DIRSIZE];	     /* parametro entrada y salida */

   if(signal(SIGINT, aborta_handler) == SIG_ERR){
   	perror("Could not set signal handler");
      return 1;
   }

	if ((sd = socket(AF_INET, SOCK_STREAM, 0)) == -1) {
		perror("socket");
		exit(1);
	}

	sind.sin_family = AF_INET;
	sind.sin_addr.s_addr = INADDR_ANY;   /* INADDR_ANY=0x000000 = yo mismo */
	sind.sin_port = htons(PUERTO);       /*  convirtiendo a formato red */

	if (bind(sd, (struct sockaddr *)&sind, sizeof(sind)) == -1) {
		perror("bind");
		exit(1);
	}

	if (listen(sd, 5) == -1) {
		perror("listen");
		exit(1);
	}

	int max=4;
	pid_t child_pid;
	for(int i=0;i<max;i++){ //Maximun max client connections
		/* esperando que un cliente solicite un servicio */
		if ((sd_actual = accept(sd, (struct sockaddr *)&pin, 
			&addrlen)) == -1) {
			perror("accept");
			exit(1);
		}
		child_pid = fork();
		if(child_pid==0){
			//soy el hijo
			break;
		}else{
			//soy el padre
			close(sd_actual);
		}
	}
	if(child_pid==0){
			if (recv(sd_actual, dir, sizeof(dir), 0) == -1) {
				perror("recv");
				exit(1);
			}
			
			printf("rcvd: %s\n", dir);
			char* decoded = decrypt(dir, 1);
			 // Define the command to execute the Node.js script with the string argument
			char command[2048];
			sprintf(command, "node controller.js \"%s\"", decoded);
			printf("cmd: %s\n", command);

			// Open a pipe to capture the standard output of the command
			FILE *pipe = popen(command, "r");
			if (!pipe) {
				fprintf(stderr, "Error opening pipe.\n");
				return 1;
			}

			// Read the output of the command from the pipe
			char output[2048];
			if (!fgets(output, 2048, pipe)) {
				fprintf(stderr, "Error reading output from pipe.\n");
				pclose(pipe);
				return 1;
			}

			// Close the pipe
			pclose(pipe);

			// Print the output
			printf("Output of the command: %s\n", output);



			char* encoded = encrypt(output, 10);
		
			if ( send(sd_actual, encoded, strlen(encoded), 0) == -1) {
				perror("send");
				exit(1);
			}

			free(decoded);
			free(encoded);

		
			close(sd_actual);  
		   close(sd);
		   printf("Conexion cerrada\n");

	}else{
			//soy el padre
	   	close(sd);
	}
	return 0;
}
