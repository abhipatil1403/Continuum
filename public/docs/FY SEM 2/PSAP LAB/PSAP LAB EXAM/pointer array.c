#include <stdio.h>

void printElementsAndSquares(int *arr, int n) {
    printf("Array Elements and their Squares:\n");
    for(int i = 0; i < n; i++) {
        printf("Element: %d, Square: %d\n", *(arr + i), (*(arr + i)) * (*(arr + i)));
    }
}

int main() {
    int arr[5];
    
    printf("Enter 5 elements:\n");
    for(int i = 0; i < 5; i++) {
        scanf("%d", &arr[i]);
    }

    printElementsAndSquares(arr, 5);

    return 0;
}
