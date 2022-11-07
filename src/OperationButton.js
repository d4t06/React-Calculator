import { choseOperation } from "./App";

function OperationButton({ operation, dispatch }) {
  return <button onClick={() => dispatch(choseOperation(operation))}>{operation}</button>;
}
export default OperationButton;
