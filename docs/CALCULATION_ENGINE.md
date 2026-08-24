# Calculation Engine

The calculator uses an explicit tokenizer and recursive-descent parser. User input is parsed as data and is never executed as JavaScript, so expressions cannot become arbitrary code execution.

## Operator precedence

From highest to lowest:

1. Parentheses and function calls
2. Factorial (`!`)
3. Unary plus/minus
4. Exponentiation (`^`), right-associative
5. Multiplication/division (`×`, `÷`)
6. Addition/subtraction (`+`, `-`)

Example:

```text
2 + 3 × 4 = 14
2 × (3 + 4) = 14
2 ^ 3 ^ 2 = 512
```

## Scientific functions

Supported functions are `sin`, `cos`, `tan`, `sqrt`, `ln` and `log`. Function calls require parentheses, for example `sqrt(16)`.

Trigonometric functions support DEG and RAD modes. Results close to zero or an integer are normalized to avoid displaying floating-point artifacts such as `1.2246467991473532e-16` for `sin(180°)`.

Tangent values at undefined angles are rejected instead of displaying an enormous floating-point approximation.

## Validation

The parser rejects:

- Invalid decimal numbers
- Empty expressions
- Empty parentheses
- Missing closing parentheses
- Empty function arguments
- Invalid function syntax
- Division by zero
- Negative square roots
- Non-positive logarithm arguments
- Non-integer or out-of-range factorials
- Non-finite results
- Unexpected tokens or operators

## Percent behavior

Percent is treated as a percentage of the current operand.

```text
50%       = 0.5
200 + 10% = 220
200 - 10% = 180
200 × 10% = 20
```

This behavior is intentionally documented because percentage semantics differ between calculator products.

## Precision

JavaScript uses IEEE-754 floating-point arithmetic. The calculator normalizes final results to a practical 12 significant digits and removes negative zero. This keeps normal calculator output readable without pretending that binary floating-point arithmetic is exact for every mathematical value.

## Security boundary

The expression engine does not use `eval()`, `Function()`, or dynamic JavaScript execution. Tokenization only accepts the documented calculator grammar, and evaluation operates on parsed tokens.

## Regression coverage

`tests/calculator.test.js` covers product flows such as arithmetic, history, memory, keyboard input and UI state. `tests/parser.test.js` adds scientific-engine regression cases for precedence, trigonometric precision, percentage semantics, domain errors and malformed expressions.
