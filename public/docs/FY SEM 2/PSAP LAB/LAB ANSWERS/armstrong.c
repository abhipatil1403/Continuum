#include <stdio.h>
int countDigits(int num) {
    int count = 0;
    while(num != 0) {
        count++;
        num /= 10;
    }
    return count;
}
int power(int base, int exp) {
    int result = 1;
    for(int i = 1; i <= exp; i++) {
        result *= base;
    }
    return result;
}
int isArmstrong(int num) {
    int original = num;
    int sum = 0;
    int digits = countDigits(num);

    while(num != 0) {
        int digit = num % 10;
        sum += power(digit, digits);
        num /= 10;
    }

    return (sum == original);
}
int main() {
    int number;
    printf("Enter a number: ");
    scanf("%d", &number);

    if(isArmstrong(number)) {
        printf("%d is an Armstrong number.\n", number);
    } else {
        printf("%d is not an Armstrong number.\n", number);
    }

    return 0;
}
