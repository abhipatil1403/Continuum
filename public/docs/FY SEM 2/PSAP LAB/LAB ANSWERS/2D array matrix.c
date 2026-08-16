#include <stdio.h>

int main() {
    int rows, cols, i, j;
    
    printf("Enter number of rows: ");
    scanf("%d", &rows);
    printf("Enter number of columns: ");
    scanf("%d", &cols);
    
    int A[rows][cols], B[rows][cols], sum[rows][cols];
    
    // Read matrix A
    printf("Enter elements of matrix A:\n");
    for(i = 0; i < rows; i++) {
        for(j = 0; j < cols; j++) {
            scanf("%d", &A[i][j]);
        }
    }
    
    // Read matrix B
    printf("Enter elements of matrix B:\n");
    for(i = 0; i < rows; i++) {
        for(j = 0; j < cols; j++) {
            scanf("%d", &B[i][j]);
        }
    }
    
    // Addition of two matrices
    printf("Sum of matrices:\n");
    for(i = 0; i < rows; i++) {
        for(j = 0; j < cols; j++) {
            sum[i][j] = A[i][j] + B[i][j];
            printf("%d ", sum[i][j]);
        }
        printf("\n");
    }
    
    // Transpose of matrix A
    printf("Transpose of matrix A:\n");
    for(j = 0; j < cols; j++) {
        for(i = 0; i < rows; i++) {
            printf("%d ", A[i][j]);
        }
        printf("\n");
    }
    
    // Display diagonal elements of matrix A (assuming square matrix)
    if(rows == cols) {
        printf("Diagonal elements of matrix A:\n");
        for(i = 0; i < rows; i++) {
            printf("%d ", A[i][i]);
        }
        printf("\n");
        
        // Upper diagonal elements
        printf("Upper diagonal elements of matrix A:\n");
        for(i = 0; i < rows; i++) {
            for(j = 0; j < cols; j++) {
                if(j > i) {
                    printf("%d ", A[i][j]);
                }
            }
        }
        printf("\n");
        
        // Lower diagonal elements
        printf("Lower diagonal elements of matrix A:\n");
        for(i = 0; i < rows; i++) {
            for(j = 0; j < cols; j++) {
                if(i > j) {
                    printf("%d ", A[i][j]);
                }
            }
        }
        printf("\n");
    } else {
        printf("Diagonal, upper and lower diagonal elements require square matrix.\n");
    }
    
    return 0;
}
