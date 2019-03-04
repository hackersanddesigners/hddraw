#include "Keyboard.h"

char keys[] = {' ', 'a', 'b', 'c', 'd', 'e', 's', 'q', '1', '2', '3', '4', '5', '6'};
bool key_down[] = {false, false, false, false, false, false, false, false, false, false, false, false, false, false};
uint8_t arrows[] = { KEY_UP_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_RIGHT_ARROW };
bool arrow_down[] = {false, false, false, false};

void setup() { // initialize the buttons' inputs:
  for ( int i = 0; i <= sizeof( keys ); i++ ) {
    pinMode( i, INPUT_PULLUP );
  }
  // connect the arrow keys to the analog side. Assuming Leonardo here.
  for ( int i = A0; i <= A0 + sizeof( arrows ); i++ ) {
    pinMode( i, INPUT_PULLUP );
  }

  // Little delay before the keyboard code begins, to give a change to upload new firmware.
  delay(5000);
  Keyboard.begin();
}

void loop() {
  for ( int i = 0; i <= sizeof( keys ); i++ ) {
    if ( digitalRead( i ) == LOW ) {
      Keyboard.press( keys[ i ] );
      key_down[ i ] = true;
    } else {
      if ( key_down[ i ] == true ) {
        Keyboard.release( keys[ i ] );
        key_down[ i ] = false;
      }
    }
  }
  for ( uint8_t i = A0; i <= A0 + sizeof( arrows ); i++ ) {
    if ( digitalRead( i ) == LOW ) {
      Keyboard.press( arrows[ i - A0 ] );
      arrow_down[ i ] = true;
    } else {
      if ( arrow_down[ i ] == true ) {
        Keyboard.release( arrows[ i - A0 ] );
        arrow_down[ i ] = false;
      }
    }
  }
}
