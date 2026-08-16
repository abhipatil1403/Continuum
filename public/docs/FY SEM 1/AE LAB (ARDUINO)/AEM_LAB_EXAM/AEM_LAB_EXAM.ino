#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

#define LED1 3
#define LED2 4
#define LED3 5
#define LDR A0

void setup() {
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  
  lcd.begin(16, 2);
  lcd.backlight();
  
  Serial.begin(9600);
}

void loop() {
  int lightValue = analogRead(LDR);

  
  Serial.print("LDR Value: ");
  Serial.println(lightValue);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Light Level: ");
  lcd.print(lightValue);

  
  digitalWrite(LED1, lightValue < 300);
  digitalWrite(LED2, lightValue >= 300 && lightValue < 700);
  digitalWrite(LED3, lightValue >= 700);

  lcd.setCursor(0, 1);
  if (lightValue < 300)
    lcd.print("Dark");
  else if (lightValue < 700)
    lcd.print("Medium");
  else
    lcd.print("Bright");

  delay(500);
}