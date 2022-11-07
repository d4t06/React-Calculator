import { addDigit } from "./App";

function DigitButton({ digit, dispatch }) {
  return <button onClick={() => dispatch(addDigit(digit))}>{digit}</button>;
}
export default DigitButton;
