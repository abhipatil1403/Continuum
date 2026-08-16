#include <stdio.h>

// Function to find length of string
int stringLength(char s[]) {
    int i = 0;
    while (s[i] != '\0') {
        i++;
    }
    return i;
}

// Function to print string in reverse order
void printReverse(char s[]) {
    int len = stringLength(s);
    for (int i = len - 1; i >= 0; i--) {
        printf("%c", s[i]);
    }
    printf("\n");
}

// Function to copy string s into s1
void stringCopy(char s[], char s1[]) {
    int i = 0;
    while (s[i] != '\0') {
        s1[i] = s[i];
        i++;
    }
    s1[i] = '\0';
}

// Function to concatenate s2 to s
void stringConcat(char s[], char s2[]) {
    int i = 0, j = 0;
    while (s[i] != '\0') {
        i++;
    }
    while (s2[j] != '\0') {
        s[i] = s2[j];
        i++;
        j++;
    }
    s[i] = '\0';
}

int main() {
    char s[100], s1[100], s2[100];

    printf("Enter string s: ");
    fgets(s, sizeof(s), stdin);
    // Remove newline from s
    int len = stringLength(s);
    if (s[len - 1] == '\n') s[len - 1] = '\0';

    printf("Length of s: %d\n", stringLength(s));

    printf("Reverse of s: ");
    printReverse(s);

    stringCopy(s, s1);
    printf("Copied string s1: %s\n", s1);

    printf("Enter string s2: ");
    fgets(s2, sizeof(s2), stdin);
    len = stringLength(s2);
    if (s2[len - 1] == '\n') s2[len - 1] = '\0';

    stringConcat(s, s2);
    printf("Concatenated string: %s\n", s);

    return 0;
}
