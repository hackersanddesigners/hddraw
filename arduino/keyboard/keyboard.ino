/**
 * Arduino Leonardo keyboard emulation for the toyhacking presentation in OpenLabs Dublin
 * Will only work with Leonardo (or other 32u4 or SAMD based boards)
 *
 * The digital pins will send keystrokes as defined in the keys[] array below
 * The analog pins will send arrow keys.
 *
 * By: heerko van der Kooij - heerko@hackersanddesigners.nl
 */

#include "Keyboard.h"

// Array of keys that can be pressed. The index in the array corresponds to an Arduino _digital_ pin
char keys[] = { ' ', 'a', 'b', 'c', 'd', 'e', 's', 'q', '1', '2', '3', '4', '5', '6' };
// Array of arrow keys that can be pressed. The index in the array corresponds to an Arduino _analog_ pin
uint8_t arrows[] = { KEY_UP_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_RIGHT_ARROW };
// Array to store the pressed state of each key.
bool key_down[] = { false, false, false, false, false, false, false, false, false, false, false, false, false, false };
bool arrow_down[] = { false, false, false, false };

void setup() { // initialize the buttons' inputs:
  for ( uint8_t i = 0; i <= sizeof( keys ); i++ ) {
    pinMode( i, INPUT_PULLUP );
  }
  // Connect the arrow keys to the analog side. Assuming Leonardo here.
  for ( uint8_t i = A0; i <= A0 + sizeof( arrows ); i++ ) {
    pinMode( i, INPUT_PULLUP );
  }

  // Little delay before the keyboard code begins, to give a change to upload new firmware.
  delay(5000);
  Keyboard.begin();
}

void loop() {
  // iterate over the digital pins, send corresponding key press if LOW.
  for ( uint8_t i = 0; i <= sizeof( keys ); i++ ) {
    if ( digitalRead( i ) == LOW ) {
      Keyboard.press( keys[ i ] );
      key_down[ i ] = true;
    } else {
      // only release if the key is pressed. This prevents stuttering.
      if ( key_down[ i ] == true ) {
        Keyboard.release( keys[ i ] );
        key_down[ i ] = false;
      }
    }
  }
  // iterate over the analog pins, send corresponding arrow key press if LOW.
  for ( uint8_t i = A0; i <= A0 + sizeof( arrows ); i++ ) {
    if ( digitalRead( i ) == LOW ) {
      Keyboard.press( arrows[ i - A0 ] );
      arrow_down[ i ] = true;
    } else {
      // only release if the key is pressed. This prevents stuttering.
      if ( arrow_down[ i ] == true ) {
        Keyboard.release( arrows[ i - A0 ] );
        arrow_down[ i ] = false;
      }
    }
  }
}
