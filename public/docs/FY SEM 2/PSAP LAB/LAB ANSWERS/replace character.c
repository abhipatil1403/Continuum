#include <stdio.h>

// Function to replace character c1 with c2 in the string using pointers
void replaceChar(char *str, char c1, char c2) {
    while (*str != '\0') {
        if (*str == c1) {
            *str = c2;
        }
        str++;
    }
}

int main() {
    char str[100];
    char oldChar, newChar;

    printf("Enter a string: ");
    fgets(str, sizeof(str), stdin);

    printf("Enter character to replace: ");
    scanf(" %c", &oldChar);

    printf("Enter replacement character: ");
    scanf(" %c", &newChar);

    replaceChar(str, oldChar, newChar);

    printf("Modified string: %s", str);

    return 0;
}
