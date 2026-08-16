#include <stdio.h>

int main() {
    int n, key, found = 0, pos = -1;

    printf("Enter number of elements: ");
    scanf("%d", &n);

    int arr[n];

    // Read array elements
    printf("Enter %d elements:\n", n);
    for(int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    printf("Enter element to search: ");
    scanf("%d", &key);

    // Linear search
    for(int i = 0; i < n; i++) {
        if(arr[i] == key) {
            found = 1;
            pos = i;
            break;
        }
    }

    if(found)
        printf("Element found at index: %d\n", pos);
    else
        printf("Element not found in the array.\n");

    return 0;
}
