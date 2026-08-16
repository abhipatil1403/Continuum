#include <stdio.h>

int stringLength(char str[]) {
    int length = 0;
    while(str[length] != '\0') {
        length++;
    }
    return length;
}

void stringCopy(char source[], char dest[]) {
    int i = 0;
    while(source[i] != '\0') {
        dest[i] = source[i];
        i++;
    }
    dest[i] = '\0';
}

void stringReverse(char str[]) {
    int len = stringLength(str);
    for(int i = len - 1; i >= 0; i--) {
        printf("%c", str[i]);
    }
    printf("\n");
}

int stringCompare(char s1[], char s2[]) {
    int i = 0;
    while(s1[i] != '\0' && s2[i] != '\0') {
        if(s1[i] != s2[i]) {
            return s1[i] - s2[i];
        }
        i++;
    }
    return s1[i] - s2[i];
}

void stringConcat(char s1[], char s2[], char result[]) {
    int i = 0, j = 0;
    while(s1[i] != '\0') {
        result[i] = s1[i];
        i++;
    }
    while(s2[j] != '\0') {
        result[i] = s2[j];
        i++; j++;
    }
    result[i] = '\0';
}

int main() {
    char str1[100], str2[100], copyStr[100], concatStr[200];
    
    printf("Enter first string: ");
    fgets(str1, sizeof(str1), stdin);
    // Remove newline if fgets adds it
    int len = stringLength(str1);
    if(str1[len-1] == '\n') str1[len-1] = '\0';

    // a. Print string length
    printf("Length of string: %d\n", stringLength(str1));

    // b. Print string in reverse order
    printf("Reverse of string: ");
    stringReverse(str1);

    // c. Copy string and print both
    stringCopy(str1, copyStr);
    printf("Original string: %s\nCopied string: %s\n", str1, copyStr);

    // d. Accept two strings and compare
    printf("Enter second string: ");
    fgets(str2, sizeof(str2), stdin);
    len = stringLength(str2);
    if(str2[len-1] == '\n') str2[len-1] = '\0';

    int cmp = stringCompare(str1, str2);
    if(cmp == 0) {
        printf("Strings are equal.\n");
    } else if(cmp > 0) {
        printf("First string is greater than second string.\n");
    } else {
        printf("First string is smaller than second string.\n");
    }

    // e. Concatenate two strings and print
    stringConcat(str1, str2, concatStr);
    printf("Concatenated string: %s\n", concatStr);

    return 0;
}
