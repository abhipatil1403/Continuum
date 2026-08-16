#include <stdio.h>

int main() {
    int maths, physics, chemistry, total;

    printf("Enter marks in Maths, Physics and Chemistry: ");
    scanf("%d %d %d", &maths, &physics, &chemistry);

    total = maths + physics + chemistry;

    if (maths >= 65 && physics >= 55 && chemistry >= 50 && 
        (total >= 190 || (maths + physics) >= 140)) {
        printf("Eligible for admission\n");
    } else {
        printf("Not eligible for admission\n");
    }

    return 0;
}
