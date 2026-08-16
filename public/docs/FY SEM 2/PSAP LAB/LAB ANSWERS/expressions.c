#include <stdio.h>

int main() {
    int a = 5, b = 3, c = 4, d = 2, e = 1;
    int S, X, Y, Z;

    S = a + b * c;
    X = a + b * c / d % 2;
    Y = d * 2 / a - b;
    Z = a + b * c - (d++) / e;
    printf("After d++, d = %d\n", d); // To show the increment effect

    // Reset values if needed
    a = 5, b = 3, c = 4, d = 2;
    Z = a % b + 5 * c / 3 * d;

    // Reset values again to avoid unexpected result for ^ operator
    a = 5, b = 3, c = 4, d = 2;
    Z = a ^ b + c % d - a - 3 * c;

    printf("S = %d\n", S);
    printf("X = %d\n", X);
    printf("Y = %d\n", Y);
    printf("Z = %d (after last expression)\n", Z);

    return 0;
}
