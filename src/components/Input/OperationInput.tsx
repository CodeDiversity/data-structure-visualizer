import { useState } from 'react';
import { useExecutionContext } from '../../state/ExecutionContext';
import {
  bstInsertGenerator,
  bstDeleteGenerator,
  bstSearchGenerator,
  bstInorderGenerator,
} from '../../algorithms/bst/generators';

/**
 * OperationInput component for triggering BST operations
 * Provides input field and operation buttons
 */
export default function OperationInput() {
  const { state, execute, bstRoot } = useExecutionContext();
  const [inputValue, setInputValue] = useState<string>('');
  const [validationMessage, setValidationMessage] = useState<string>('');

  const isPlaying = state === 'playing';

  const validateInput = (value: string): boolean => {
    if (value.trim() === '') {
      setValidationMessage('Please enter a number');
      return false;
    }

    const num = Number(value);
    if (isNaN(num)) {
      setValidationMessage('Please enter a valid number');
      return false;
    }

    if (!Number.isInteger(num)) {
      setValidationMessage('Please enter an integer');
      return false;
    }

    setValidationMessage('');
    return true;
  };

  const handleInsert = () => {
    if (!validateInput(inputValue)) return;

    const value = Number(inputValue);
    const generator = bstInsertGenerator(bstRoot, value);
    execute(generator);
    setInputValue('');
  };

  const handleDelete = () => {
    if (!validateInput(inputValue)) return;

    const value = Number(inputValue);
    const generator = bstDeleteGenerator(bstRoot, value);
    execute(generator);
    setInputValue('');
  };

  const handleSearch = () => {
    if (!validateInput(inputValue)) return;

    const value = Number(inputValue);
    const generator = bstSearchGenerator(bstRoot, value);
    execute(generator);
  };

  const handleTraverse = () => {
    const generator = bstInorderGenerator(bstRoot);
    execute(generator);
  };

  return (
    <div className="operation-input">
      <div className="input-row">
        <input
          type="number"
          className="value-input"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setValidationMessage('');
          }}
          placeholder="Enter value"
          disabled={isPlaying}
        />
      </div>

      {validationMessage && (
        <div className="validation-message">{validationMessage}</div>
      )}

      <div className="operation-buttons">
        <button
          className="operation-btn insert-btn"
          onClick={handleInsert}
          disabled={isPlaying}
        >
          Insert
        </button>

        <button
          className="operation-btn delete-btn"
          onClick={handleDelete}
          disabled={isPlaying}
        >
          Delete
        </button>

        <button
          className="operation-btn search-btn"
          onClick={handleSearch}
          disabled={isPlaying}
        >
          Search
        </button>

        <button
          className="operation-btn traverse-btn"
          onClick={handleTraverse}
          disabled={isPlaying}
        >
          Traverse
        </button>
      </div>

      <style>{`
        .operation-input {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background: #2a2a2a;
          border-radius: 8px;
        }

        .input-row {
          display: flex;
          gap: 8px;
        }

        .value-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #555;
          border-radius: 4px;
          background: #1e1e1e;
          color: #fff;
          font-size: 14px;
        }

        .value-input:focus {
          outline: none;
          border-color: #4caf50;
        }

        .value-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .value-input::placeholder {
          color: #666;
        }

        .validation-message {
          font-size: 12px;
          color: #f44336;
        }

        .operation-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .operation-btn {
          flex: 1;
          min-width: 80px;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s, opacity 0.2s;
        }

        .operation-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .insert-btn {
          background: #4caf50;
          color: white;
        }

        .insert-btn:hover:not(:disabled) {
          background: #45a049;
        }

        .delete-btn {
          background: #ff9800;
          color: white;
        }

        .delete-btn:hover:not(:disabled) {
          background: #f57c00;
        }

        .search-btn {
          background: #2196f3;
          color: white;
        }

        .search-btn:hover:not(:disabled) {
          background: #1976d2;
        }

        .traverse-btn {
          background: #9c27b0;
          color: white;
        }

        .traverse-btn:hover:not(:disabled) {
          background: #7b1fa2;
        }
      `}</style>
    </div>
  );
}