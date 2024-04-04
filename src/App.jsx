import { useState } from 'react';
import './App.css';

const Node = ({ value, left, right }) => {
  return (
    <div>
      <span>{value}</span>
      {left && <div style={{ marginLeft: '20px' }}>{left}</div>}
      {right && <div style={{ marginLeft: '20px' }}>{right}</div>}
    </div>
  );
};

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [lexicalAnalyzer, setLexicalAnalyzer] = useState([]);
  const [tree, setTree] = useState(null);

  const handleButtonClick = (value) => {
    setExpression((prevExpression) => prevExpression + value);
  };

  const clear = () => {
    setExpression('');
    setResult('');
    setLexicalAnalyzer([]);
    setTree(null);
  };

  const calculate = () => {
    try {
      const tokens = expression.match(/\d+|[+\-*/]/g);
      setLexicalAnalyzer(tokens);
      const tree = buildExpressionTree(tokens);
      setTree(tree);
      let total = evaluateExpressionTree(tree);
      setResult(total);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const buildExpressionTree = (tokens) => {
    const stack = [];
    for (let token of tokens) {
      if (token.match(/\d+/)) {
        stack.push({ value: token });
      } else {
        const right = stack.pop();
        const left = stack.pop();
        stack.push({ value: token, left, right });
      }
    }
    return stack[0];
  };

  const evaluateExpressionTree = (node) => {
    if (!node.left && !node.right) {
      return parseFloat(node.value);
    }
    const leftValue = evaluateExpressionTree(node.left);
    const rightValue = evaluateExpressionTree(node.right);
    switch (node.value) {
      case '+':
        return leftValue + rightValue;
      case '-':
        return leftValue - rightValue;
      case '*':
        return leftValue * rightValue;
      case '/':
        if (rightValue === 0) {
          throw new Error('Cannot divide by zero');
        }
        return leftValue / rightValue;
      default:
        throw new Error('Invalid operator');
    }
  };

  const renderTree = (node) => {
    if (!node) return null;
    return (
      <Node
      value={node.value}
      left={node.left ? renderTree(node.left) : null}
      right={node.right ? renderTree(node.right) : null}
      />
    );
  };
  return (
    <>
      <table className='calculadora'>
        <tr>
          <td colSpan='4'>
            <input type='text' value={expression} readOnly />
          </td>
        </tr>
        <tr>
          <td>
            <button onClick={() => handleButtonClick('7')}>7</button>
          </td>
          <td>
            <button onClick={() => handleButtonClick('8')}>8</button>
          </td>
          <td>
            <button onClick={() => handleButtonClick('9')}>9</button>
          </td>
          <td>
            <button onClick={() => handleButtonClick('/')}>/</button>
          </td>
        </tr>
        <tr>
          <td>
            <button onClick={() => handleButtonClick('4')}>4</button>
          </td>
          <td>
            <button onClick={() => handleButtonClick('5')}>5</button>
          </td>
          <td>
            <button onClick={() => handleButtonClick('6')}>6</button>
          </td>
          <td>
            <button onClick={() => handleButtonClick('*')}>*</button>
          </td>
        </tr>
        <tr>
          <td>
            <button onClick={() => handleButtonClick('1')}>1</button>
          </td>
          <td>
            <button onClick={() => handleButtonClick('2')}>2</button>
          </td>
          <td>
            <button onClick={() => handleButtonClick('3')}>3</button>
          </td>
          <td>
            <button onClick={() => handleButtonClick('-')}>-</button>
          </td>
        </tr>
        <tr>
          <td>
            <button onClick={calculate}>=</button>
          </td>
          <td>
            <button onClick={clear}>C</button>
          </td>
          <td>
            <button onClick={() => handleButtonClick('0')}>0</button>
          </td>
          <td>
            <button onClick={() => handleButtonClick('+')}>+</button>
          </td>
        </tr>
      </table>
      <div>
        Result: {result}
        <br />
        Lexical Analyzer:
        <ul>
          {lexicalAnalyzer.map((token, index) => (
            <li key={index}>{token}</li>
          ))}
        </ul>
      </div>
      <div>
      Expression Tree:
      {renderTree(tree)}
      </div>
    </>
  );
};

export default Calculator;
