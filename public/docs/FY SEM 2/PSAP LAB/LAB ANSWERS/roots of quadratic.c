#include <stdio.h>
#include <math.h>

int main() {
    float a, b, c, discriminant, root1, root2, realPart, imagPart;

    printf("Enter coefficients a, b and c: ");
    scanf("%f %f %f", &a, &b, &c);

    discriminant = b*b - 4*a*c;

    switch ((discriminant > 0) ? 1 : (discriminant == 0) ? 0 : -1) {
        case 1: // Two distinct real roots
            root1 = (-b + sqrt(discriminant)) / (2*a);
            root2 = (-b - sqrt(discriminant)) / (2*a);
            printf("Roots are real and different:\n");
            printf("Root1 = %.2f\nRoot2 = %.2f\n", root1, root2);
            break;
        case 0: // One real root
            root1 = -b / (2*a);
            printf("Roots are real and same:\n");
            printf("Root = %.2f\n", root1);
            break;
        case -1: // Complex roots
            realPart = -b / (2*a);
            imagPart = sqrt(-discriminant) / (2*a);
            printf("Roots are complex and different:\n");
            printf("Root1 = %.2f + %.2fi\n", realPart, imagPart);
            printf("Root2 = %.2f - %.2fi\n", realPart, imagPart);
            break;
    }

    return 0;
}
