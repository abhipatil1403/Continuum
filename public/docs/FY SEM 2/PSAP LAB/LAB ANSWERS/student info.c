#include <stdio.h>

int main() {
    char name[50];
    int rollNo;
    float marks;

    printf("Enter student name: ");
    scanf("%s", name);

    printf("Enter roll number: ");
    scanf("%d", &rollNo);

    printf("Enter marks: ");
    scanf("%f", &marks);

    printf("\n--- Student Information ---\n");
    printf("Name     : %s\n", name);
    printf("Roll No. : %d\n", rollNo);
    printf("Marks    : %.2f\n", marks);

    return 0;
}
