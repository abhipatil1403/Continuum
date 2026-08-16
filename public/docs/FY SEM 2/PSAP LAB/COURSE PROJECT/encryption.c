#include <stdio.h>
#include <string.h>
#include <ctype.h>

// Function prototypes
void caesarEncrypt(char *message, int key);
void caesarDecrypt(char *message, int key);
void xorEncrypt(char *message, char key);
void xorDecrypt(char *message, char key);
void printMenu();

int main() {
    char message[1000];
    int choice, key;
    char xorKey;
    
    while (1) {
        printMenu();
        printf("Enter your choice (1-5): ");
        scanf("%d", &choice);
        getchar(); // Clear input buffer
        
        switch (choice) {
            case 1: // Caesar Encryption
                printf("Enter message to encrypt: ");
                fgets(message, sizeof(message), stdin);
                message[strcspn(message, "\n")] = 0; // Remove newline
                
                printf("Enter key (1-25): ");
                scanf("%d", &key);
                getchar();
                
                caesarEncrypt(message, key);
                printf("Encrypted message: %s\n", message);
                break;
                
            case 2: // Caesar Decryption
                printf("Enter message to decrypt: ");
                fgets(message, sizeof(message), stdin);
                message[strcspn(message, "\n")] = 0;
                
                printf("Enter key (1-25): ");
                scanf("%d", &key);
                getchar();
                
                caesarDecrypt(message, key);
                printf("Decrypted message: %s\n", message);
                break;
                
            case 3: // XOR Encryption
                printf("Enter message to encrypt: ");
                fgets(message, sizeof(message), stdin);
                message[strcspn(message, "\n")] = 0;
                
                printf("Enter a single character key: ");
                xorKey = getchar();
                getchar();
                
                xorEncrypt(message, xorKey);
                printf("Encrypted message: %s\n", message);
                break;
                
            case 4: // XOR Decryption
                printf("Enter message to decrypt: ");
                fgets(message, sizeof(message), stdin);
                message[strcspn(message, "\n")] = 0;
                
                printf("Enter a single character key: ");
                xorKey = getchar();
                getchar();
                
                xorDecrypt(message, xorKey);
                printf("Decrypted message: %s\n", message);
                break;
                
            case 5: // Exit
                printf("Thank you for using the encryption program!\n");
                return 0;
                
            default:
                printf("Invalid choice! Please try again.\n");
        }
        printf("\n");
    }
    
    return 0;
}

void printMenu() {
    printf("\n=== Encryption Program ===\n");
    printf("1. Caesar Cipher Encryption\n");
    printf("2. Caesar Cipher Decryption\n");
    printf("3. XOR Cipher Encryption\n");
    printf("4. XOR Cipher Decryption\n");
    printf("5. Exit\n");
}

void caesarEncrypt(char *message, int key) {
    for (int i = 0; message[i] != '\0'; i++) {
        if (isalpha(message[i])) {
            char base = isupper(message[i]) ? 'A' : 'a';
            message[i] = base + (message[i] - base + key) % 26;
        }
    }
}

void caesarDecrypt(char *message, int key) {
    caesarEncrypt(message, 26 - (key % 26));
}

void xorEncrypt(char *message, char key) {
    for (int i = 0; message[i] != '\0'; i++) {
        message[i] = message[i] ^ key;
    }
}

void xorDecrypt(char *message, char key) {
    xorEncrypt(message, key); // XOR is symmetric, so encryption and decryption are the same
} 