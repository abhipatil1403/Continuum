#include <stdio.h>

int isPrime(int num) {
    if (num <= 1) return 0;
    for (int i = 2; i*i <= num; i++) {
        if (num % i == 0)
            return 0;
    }
    return 1;
}

int main() {
    int n, sum = 0;

    printf("Enter n: ");
    scanf("%d", &n);

    for (int i = 2; i <= n; i++) {
        if (isPrime(i))
            sum += i;
    }

    printf("Sum of prime numbers between 1 and %d is %d\n", n, sum);

    return 0;
}
