#include <stdio.h>

// Function to concatenate src string to dest string without using library functions
void stringConcat(char *dest, char *src) {
    // Move to the end of dest string
    while (*dest != '\0') {
        dest++;
    }
    // Copy src string to the end of dest string
    while (*src != '\0') {
        *dest = *src;
        dest++;
        src++;
    }
    *dest = '\0';  // Null terminate the concatenated string
}

int main() {
    char str1[100], str2[50];

    printf("Enter first string: ");
    fgets(str1, sizeof(str1), stdin);

    printf("Enter second string: ");
    fgets(str2, sizeof(str2), stdin);

    // Remove newline characters if any
    int i = 0;
    while (str1[i] != '\0') {
        if (str1[i] == '\n') str1[i] = '\0';
        i++;
    }
    i = 0;
    while (str2[i] != '\0') {
        if (str2[i] == '\n') str2[i] = '\0';
        i++;
    }

    stringConcat(str1, str2);

    printf("Concatenated string: %s\n", str1);

    return 0;
}
