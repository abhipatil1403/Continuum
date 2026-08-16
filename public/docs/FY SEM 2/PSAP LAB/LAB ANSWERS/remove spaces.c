#include <stdio.h>

// Function to remove spaces from string using pointers
void removeSpaces(char *str) {
    char *read = str, *write = str;
    while (*read != '\0') {
        if (*read != ' ') {
            *write = *read;  // Copy non-space character
            write++;
        }
        read++;
    }
    *write = '\0';  // Null terminate the new string
}

int main() {
    char str[100];

    printf("Enter a string: ");
    fgets(str, sizeof(str), stdin);

    removeSpaces(str);

    printf("String after removing spaces: %s\n", str);

    return 0;
}
