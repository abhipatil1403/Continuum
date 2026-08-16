#include <stdio.h>

int main() {
    int n, i, j;

    printf("Enter the number of rows for half diamond: ");
    scanf("%d", &n);

    // Upper part of diamond
    for(i = 1; i <= n; i++) {
        // Print spaces
        for(j = i; j < n; j++) {
            printf(" ");
        }
        // Print stars
        for(j = 1; j <= (2*i - 1); j++) {
            printf("*");
        }
        printf("\n");
    }

    // Lower part of diamond
    for(i = n-1; i >= 1; i--) {
        // Print spaces
        for(j = n; j > i; j--) {
            printf(" ");
        }
        // Print stars
        for(j = 1; j <= (2*i - 1); j++) {
            printf("*");
        }
        printf("\n");
    }

    return 0;
}
