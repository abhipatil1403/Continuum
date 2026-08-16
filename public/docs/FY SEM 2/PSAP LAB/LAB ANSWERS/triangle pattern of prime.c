#include <stdio.h>
#include <stdbool.h>

// Function to check if a number is prime
bool isPrime(int num) {
    if (num <= 1) return false;
    for (int i = 2; i*i <= num; i++) {
        if (num % i == 0)
            return false;
    }
    return true;
}

// Function to get next prime number after current
int nextPrime(int current) {
    int num = current + 1;
    while (!isPrime(num)) {
        num++;
    }
    return num;
}

int main() {
    int n;
    printf("Enter number of rows: ");
    scanf("%d", &n);

    int startPrime = 2;

    for (int i = 1; i <= n; i++) {
        int prime = startPrime;
        for (int j = 1; j <= i; j++) {
            printf("%d ", prime);
            prime = nextPrime(prime);
        }
        printf("\n");
        startPrime = nextPrime(startPrime);
    }

    return 0;
}
