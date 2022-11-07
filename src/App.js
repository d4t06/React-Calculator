import classNames from "classnames/bind";
import { useEffect, useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from './OperationButton'
import styles from "./styles.css";

const cx = classNames.bind(styles);

const initState = {
  currentOperand: "",
  previousOperand: "",
  operate: ""
};

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE: "delete",
  DOT: "dot",
  CHOSE_OPERATION: "chose-operate",
  ELVALUATE: "evaluate"
};
export const addDigit = (payload) => {
  return {
    type: ACTIONS.ADD_DIGIT,
    payload
  };
};
const clearOperation = () => {
  return {
    type:  ACTIONS.CLEAR,
  }
}
export const choseOperation = (payload) => {
  return {
      type: ACTIONS.CHOSE_OPERATION,
      payload,
  }
}
const evaluate = (state) => {
  const pre = parseFloat(state.previousOperand)
  const cur = parseFloat(state.currentOperand)
  if (isNaN(pre) || isNaN(cur)) return '';
  let result = '';
  switch (state.operate) {
    case '+':
      result = pre + cur
      break;
   case '-':
      result = pre - cur
      break;
   case '/': 
      result = pre / cur;
      break;
   case '*':
      result = pre * cur
      break;
    default:
      break;
  }
  return result.toString()
}
const INTEGER_FORMATER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 1
})

const formatOperand = (operand) => {
  if (!operand) return
  operand = operand.toString()
  const [integer, decimal] = operand.split('.')
  if (!decimal) return INTEGER_FORMATER.format(integer)
  return `${INTEGER_FORMATER.format(integer)}.${decimal}`
}

export const reducer = (state, action) => {
  const {currentOperand, previousOperand, operate} = state
  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) 
      return {
        ...state,
        overwrite: false,
        currentOperand: action.payload
      } 
      if (currentOperand === '' && action.payload === '.') return state
      if (action.payload === '' && currentOperand === '') return state
      if (action.payload === '.' && currentOperand.includes('.')) return state
      return {
        ...state,
        currentOperand: `${currentOperand}${action.payload}`
      };
    
    
    case ACTIONS.CHOSE_OPERATION: 
    if (currentOperand === '' && previousOperand === '') return state
    if (previousOperand === '') 
    return {
      ...state,
      previousOperand: currentOperand,
      operate: action.payload,
      currentOperand: '',
    }
    if (currentOperand === '')
    return {
      ...state,
      operate: action.payload

    }
    return {
      ...state,
      previousOperand: evaluate(state),
      operate: action.payload,
      currentOperand: '',
    }
    
    case ACTIONS.ELVALUATE:
      if (currentOperand === '' || previousOperand === '' || operate === '') return state
      return {
        ...state,
        overwrite: true,
        previousOperand: '',
        operate: '',
        currentOperand: evaluate(state),
      }
      case ACTIONS.DELETE:
        if (state.overwrite) return{
          ...state,
          overwrite: true,
          currentOperand: ''
        }
        if (currentOperand === '') return state
        if (currentOperand.length === 1) return {
          ...state,
          currentOperand: ''
        }
        return {
          ...state,
          currentOperand: currentOperand.slice(0, -1)
        }
      case ACTIONS.CLEAR:
      return {
        previousOperand: '',
        operate: '',
        currentOperand: ''
      }
      default: 
    throw new Error('invalid action')
    
  }
};

function Content() {
  const [state, dispatch] = useReducer(reducer, initState);
  const {currentOperand, previousOperand, operate} = state

  useEffect(() => {
    const handler = (e) => {
      if (e.key === /^[0-9]$/) {
        console.log(e.key);
      }
    };
    document.addEventListener("keypress", handler);
  });
  return (
    <div className={cx("app")}>
      <div className={cx("output")}>
        <div className={cx("previous-operand")}>{formatOperand(previousOperand)}{operate}</div>
        <div className={cx("current-operand")}>{formatOperand(currentOperand)}</div>
      </div>
      <button className={cx("spantwo")} onClick={() => dispatch(clearOperation())}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE})}>DEL</button>
      <OperationButton operation={'/'} dispatch={dispatch}></OperationButton>

      <DigitButton digit={1} dispatch={dispatch}></DigitButton>
      <DigitButton digit={2} dispatch={dispatch}></DigitButton>
      <DigitButton digit={3} dispatch={dispatch}></DigitButton>
      <OperationButton operation={'*'} dispatch={dispatch}></OperationButton>
      <DigitButton digit={4} dispatch={dispatch}></DigitButton>
      <DigitButton digit={5} dispatch={dispatch}></DigitButton>
      <DigitButton digit={6} dispatch={dispatch}></DigitButton>
      <OperationButton operation={'+'} dispatch={dispatch}></OperationButton>
      <DigitButton digit={7} dispatch={dispatch}></DigitButton>
      <DigitButton digit={8} dispatch={dispatch}></DigitButton>
      <DigitButton digit={9} dispatch={dispatch}></DigitButton>
      <OperationButton operation={'-'} dispatch={dispatch}></OperationButton>
      <DigitButton digit={'.'} dispatch={dispatch}></DigitButton>
      <DigitButton digit={0} dispatch={dispatch}></DigitButton>
      <button className={cx("spantwo")} onClick={() => dispatch({type: ACTIONS.ELVALUATE})}>=</button>
    </div>
  );
}

export default Content;
