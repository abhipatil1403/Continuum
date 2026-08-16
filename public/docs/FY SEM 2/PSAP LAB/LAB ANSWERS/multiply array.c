#include <stdio.h>

// Function to multiply each element of the array by 2
void multiplyByTwo(int *arr, int n) {
    for (int i = 0; i < n; i++) {
        arr[i] *= 2;  // Multiply element by 2
    }
}

int main() {
    int arr[10], n;
    printf("Enter number of elements: ");
    scanf("%d", &n);

    printf("Enter elements: ");
    for (int i = 0; i < n; i++)
        scanf("%d", &arr[i]);

    multiplyByTwo(arr, n);  // Call function to double the elements

    printf("Modified array: ");
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);

    return 0;
}
