#include <stdio.h>

// Function to compare two strings
// Returns 0 if equal, <0 if str1 < str2, >0 if str1 > str2
int stringCompare(char *str1, char *str2) {
    while (*str1 && (*str1 == *str2)) {
        str1++;
        str2++;
    }
    return (*str1 - *str2);
}

int main() {
    char str1[100], str2[100];

    printf("Enter first string: ");
    fgets(str1, sizeof(str1), stdin);

    printf("Enter second string: ");
    fgets(str2, sizeof(str2), stdin);

    // Remove newline characters if present
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

    int result = stringCompare(str1, str2);

    if (result == 0) {
        printf("Strings are equal.\n");
    } else if (result < 0) {
        printf("First string is smaller.\n");
    } else {
        printf("First string is greater.\n");
    }

    return 0;
}
